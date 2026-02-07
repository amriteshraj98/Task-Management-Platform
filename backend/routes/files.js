const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Attachment = require('../models/Attachment');
const Task = require('../models/Task');
const { protect } = require('../middleware/authMiddleware');

// Set up storage engine
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Check file type
function checkFileType(file, cb) {
    // Allowed ext
    const filetypes = /jpeg|jpg|png|gif|pdf|doc|docx|txt|zip/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Images, Documents and Archives Only!');
    }
}

// Init Upload
const upload = multer({
    storage: storage,
    limits: { fileSize: 10000000 }, // 10MB limit
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
});

// @desc    Upload file to task
// @route   POST /api/files/:taskId
// @access  Private
router.post('/:taskId', protect, upload.array('files', 5), async (req, res) => {
    try {
        const task = await Task.findById(req.params.taskId);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        
        // Optional: Check if user is assigned or owner. 
        // For now, allow any authenticated user to upload to a task they can see?
        // Let's restrict to owner or generic protection. Assuming if they can see task (which currently only owner can in Task routes), they can upload.
        // Wait, Task routes `get /` filtered by `user: req.user.id`. So tasks are private to user.
        if (task.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'No files uploaded' });
        }

        const attachments = [];

        for (const file of req.files) {
            const attachment = await Attachment.create({
                filename: file.filename,
                originalName: file.originalname,
                path: file.path,
                task: req.params.taskId,
                user: req.user.id
            });
            attachments.push(attachment);
        }

        res.status(201).json(attachments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get files for a task
// @route   GET /api/files/task/:taskId
// @access  Private
router.get('/task/:taskId', protect, async (req, res) => {
    try {
        const task = await Task.findById(req.params.taskId);
        
        if (!task) {
           return res.status(404).json({ message: 'Task not found' });
        }

        if (task.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const attachments = await Attachment.find({ task: req.params.taskId });
        res.status(200).json(attachments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Download file
// @route   GET /api/files/download/:id
// @access  Private
router.get('/download/:id', protect, async (req, res) => {
    try {
        const attachment = await Attachment.findById(req.params.id);

        if (!attachment) {
            return res.status(404).json({ message: 'File not found' });
        }
        
        // Verify owner of the task this file belongs to
        // Or owner of the file (which is same)
        if (attachment.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const filePath = path.join(__dirname, '..', '..', attachment.path); // path stored is relative from root usually or relative to backend?
        // Multer stores 'uploads\filename'. 
        // Since server.js is in backend/, and uploads/ is in backend/, 
        // path.join(__dirname, '..', attachment.path) should work if attachment.path is 'uploads\\file'.
        // Let's verify paths.
        // If I run node server.js from backend/, cwd is backend/.
        // dest is './uploads/'.
        // file.path will be 'uploads\filename' (windows).
        // __dirname is .../backend/routes
        // So .. is .../backend
        // So path.join(..., 'uploads\filename') is correct.

        // However, let's allow express to handle download
        res.download(attachment.path, attachment.originalName); 
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Delete file
// @route   DELETE /api/files/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
    try {
        const attachment = await Attachment.findById(req.params.id);

        if (!attachment) {
            return res.status(404).json({ message: 'File not found' });
        }

        if (attachment.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        // Remove from FS
        fs.unlink(attachment.path, async (err) => {
            if (err) {
                console.error(err);
                // Still delete from DB? Maybe not if FS failed?
                // Usually we delete from DB anyway or handle error. 
                // Let's return error but not delete from DB to keep consistency? 
                // Or force delete. 
                return res.status(500).json({ message: 'Error deleting file from filesystem' });
            }
            
            // Delete from DB
            await Attachment.findByIdAndDelete(req.params.id);
            res.status(200).json({ message: 'File removed' });
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;

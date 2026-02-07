const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
const Task = require('../models/Task');
const { protect } = require('../middleware/authMiddleware');

// @desc    Get comments for a task
// @route   GET /api/comments/:taskId
// @access  Private
router.get('/:taskId', protect, async (req, res) => {
    try {
        const task = await Task.findById(req.params.taskId);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Check task access permissions if needed (assuming if you can see task you can see comments)
        if (task.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const comments = await Comment.find({ task: req.params.taskId }).populate('user', 'username email');
        res.status(200).json(comments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Add comment to a task
// @route   POST /api/comments/:taskId
// @access  Private
router.post('/:taskId', protect, async (req, res) => {
    try {
        const { content } = req.body;
        const task = await Task.findById(req.params.taskId);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        if (task.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const comment = await Comment.create({
            content,
            task: req.params.taskId,
            user: req.user.id
        });

        // Return populated comment
        const populatedComment = await Comment.findById(comment._id).populate('user', 'username email');

        res.status(201).json(populatedComment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Delete comment
// @route   DELETE /api/comments/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);

        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        if (comment.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await Comment.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Comment removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;

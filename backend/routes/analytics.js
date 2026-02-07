const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const { protect } = require('../middleware/authMiddleware');

// @desc    Get task statistics
// @route   GET /api/analytics
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        // Match tasks where user is either creator OR assignee
        const accessQuery = {
            $or: [
                { user: req.user._id },
                { assigned_to: { $in: [req.user.username] } }
            ]
        };

        // Counts by status
        const statusStats = await Task.aggregate([
            { $match: accessQuery },
            { $group: { _id: '$status', count: { $sum: 1 } } }
        ]);

        // Counts by priority
        const priorityStats = await Task.aggregate([
            { $match: accessQuery },
            { $group: { _id: '$priority', count: { $sum: 1 } } }
        ]);

        // Total tasks
        const totalTasks = await Task.countDocuments({
            $or: [
                { user: req.user.id },
                { assigned_to: { $in: [req.user.username] } }
            ]
        });
        
        // Completed tasks
        const completedTasks = await Task.countDocuments({
            $and: [
                {
                    $or: [
                        { user: req.user.id },
                        { assigned_to: { $in: [req.user.username] } }
                    ]
                },
                { status: 'completed' }
            ]
        });

        res.status(200).json({
            statusStats,
            priorityStats,
            totalTasks,
            completedTasks,
            completionRate: totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;

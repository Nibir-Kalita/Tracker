const express = require('express');
const mongoose = require('mongoose');
const Task = require('../models/Task');
const auth = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(auth);

// GET /api/tasks — get all tasks for the user (optionally filter by date range)
router.get('/', async (req, res) => {
  try {
    const { startDate, endDate, completed } = req.query;
    const query = { user: req.userId };

    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    if (completed !== undefined) {
      query.completed = completed === 'true';
    }

    const tasks = await Task.find(query).sort({ date: 1, priority: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST /api/tasks — create a new task
router.post('/', async (req, res) => {
  try {
    const { title, description, date, priority } = req.body;

    if (!title || !date) {
      return res.status(400).json({ message: 'Title and date are required' });
    }

    const task = new Task({
      user: req.userId,
      title,
      description: description || '',
      date: new Date(date),
      priority: priority || 'medium'
    });

    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// PUT /api/tasks/:id — update a task
router.put('/:id', async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.userId });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const { title, description, date, completed, priority } = req.body;

    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (date !== undefined) task.date = new Date(date);
    if (completed !== undefined) task.completed = completed;
    if (priority !== undefined) task.priority = priority;

    await task.save();
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// DELETE /api/tasks/:id — delete a task
router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.userId });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json({ message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET /api/tasks/progress/stats — get progress statistics
router.get('/progress/stats', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const query = { user: req.userId };

    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const totalTasks = await Task.countDocuments(query);
    const completedTasks = await Task.countDocuments({ ...query, completed: true });
    const pendingTasks = totalTasks - completedTasks;

    const userObjectId = new mongoose.Types.ObjectId(req.userId);

    // Get daily breakdown for the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const dailyStats = await Task.aggregate([
      {
        $match: {
          user: userObjectId,
          date: { $gte: sevenDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$date' }
          },
          total: { $sum: 1 },
          completed: {
            $sum: { $cond: ['$completed', 1, 0] }
          }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Priority breakdown
    const priorityStats = await Task.aggregate([
      { $match: { user: userObjectId } },
      {
        $group: {
          _id: '$priority',
          total: { $sum: 1 },
          completed: {
            $sum: { $cond: ['$completed', 1, 0] }
          }
        }
      }
    ]);

    res.json({
      totalTasks,
      completedTasks,
      pendingTasks,
      completionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
      dailyStats,
      priorityStats
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;

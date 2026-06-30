const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const authMiddleware = require('../middleware/authMiddleware');

// Apply auth middleware to ALL task routes — no unauthenticated access
router.use(authMiddleware);

// GET /api/tasks — Fetch only the logged-in user's tasks
router.get('/', async (req, res) => {
  try {
    const { status, priority, search } = req.query;

    // Always filter by the authenticated user's ID
    const filter = { userId: req.userId };

    if (status && status !== 'all') filter.status = status;
    if (priority && priority !== 'all') filter.priority = priority;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const tasks = await Task.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, count: tasks.length, data: tasks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/tasks — Create a new task for the logged-in user
router.post('/', async (req, res) => {
  try {
    const { title, description, status, priority, dueDate } = req.body;

    if (!title || title.trim() === '') {
      return res.status(400).json({ success: false, message: 'Title is required' });
    }

    // Attach the userId from the verified JWT token
    const task = new Task({ userId: req.userId, title, description, status, priority, dueDate });
    const savedTask = await task.save();
    res.status(201).json({ success: true, data: savedTask });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT /api/tasks/:id — Update a task (only if it belongs to the user)
router.put('/:id', async (req, res) => {
  try {
    const { title, description, status, priority, dueDate } = req.body;

    // userId filter ensures users can't edit other users' tasks
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { title, description, status, priority, dueDate },
      { new: true, runValidators: true }
    );

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found.' });
    }

    res.json({ success: true, data: task });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, message: 'Invalid task ID' });
    }
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE /api/tasks/:id — Delete a task (only if it belongs to the user)
router.delete('/:id', async (req, res) => {
  try {
    // userId filter ensures users can't delete other users' tasks
    const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.userId });

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found.' });
    }

    res.json({ success: true, message: 'Task deleted successfully', data: task });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, message: 'Invalid task ID' });
    }
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;

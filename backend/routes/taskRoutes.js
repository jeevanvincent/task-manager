const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

// GET all tasks with search and filtering
router.get('/', async (req, res) => {
  try {
    const { status, priority, search } = req.query;
    let query = {};
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (search) query.title = { $regex: search, $options: 'i' };

    const tasks = await Task.find(query).sort({ createdAt: -1 });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST a new task
router.post('/', async (req, res) => {
  try {
    const { title, description, status, priority } = req.body;
    if (!title) return res.status(400).json({ message: 'Title is required' });
    const newTask = await Task.create({ title, description, status, priority });
    res.status(201).json(newTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT (Update) a task
router.put('/:id', async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!updatedTask) return res.status(404).json({ message: 'Task not found' });
    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE a task
router.delete('/:id', async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);
    if (!deletedTask) return res.status(404).json({ message: 'Task not found' });
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
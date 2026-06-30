const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const auth = require('../middleware/auth'); // 🔐 Import your authentication middleware

// 1. GET tasks belonging ONLY to the logged-in user
router.get('/', auth, async (req, res) => {
  try {
    const { status, priority, search } = req.query;
    
    // Always restrict the database query to the logged-in user's ID
    let query = { owner: req.user }; 
    
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (search) query.title = { $regex: search, $options: 'i' };

    const tasks = await Task.find(query).sort({ createdAt: -1 });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 2. POST a new task stamped with the user's ID
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, status, priority } = req.body;
    if (!title) return res.status(400).json({ message: 'Title is required' });
    
    // Automatically assign the user ID (req.user) as the owner field
    const newTask = await Task.create({ 
      title, 
      description, 
      status, 
      priority,
      owner: req.user 
    });
    
    res.status(201).json(newTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// 3. PUT (Update) a task only if it belongs to the logged-in user
router.put('/:id', auth, async (req, res) => {
  try {
    // Ensure the task exists and matches the owner ID before updating
    const updatedTask = await Task.findOneAndUpdate(
      { _id: req.params.id, owner: req.user }, 
      req.body, 
      {
        new: true,
        runValidators: true
      }
    );
    
    if (!updatedTask) return res.status(404).json({ message: 'Task not found or unauthorized' });
    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// 4. DELETE a task only if it belongs to the logged-in user
router.delete('/:id', auth, async (req, res) => {
  try {
    // Ensure the task matches both the document ID and the owner ID before deleting
    const deletedTask = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user });
    
    if (!deletedTask) return res.status(404).json({ message: 'Task not found or unauthorized' });
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
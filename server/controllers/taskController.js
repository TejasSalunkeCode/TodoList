const { validationResult } = require('express-validator');
const TaskModel = require('../models/taskModel');

const ITEMS_PER_PAGE = 10;

// GET /api/tasks
const getTasks = async (req, res) => {
  const { search = '', status = 'all', page = 1 } = req.query;
  const limit = ITEMS_PER_PAGE;
  const pageNum = Math.max(1, parseInt(page, 10));

  try {
    const { tasks, total } = await TaskModel.findAllByUser({
      userId: req.user.id,
      search: search.trim(),
      status,
      page: pageNum,
      limit,
    });

    res.json({
      tasks,
      pagination: {
        total,
        page: pageNum,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error('GetTasks error:', err.message);
    res.status(500).json({ message: 'Failed to fetch tasks.' });
  }
};

// POST /api/tasks
const createTask = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { title, description, status, due_date } = req.body;

  try {
    const task = await TaskModel.create({
      userId: req.user.id,
      title,
      description,
      status,
      due_date,
    });
    res.status(201).json({ message: 'Task created.', task });
  } catch (err) {
    console.error('CreateTask error:', err.message);
    res.status(500).json({ message: 'Failed to create task.' });
  }
};

// PUT /api/tasks/:id
const updateTask = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id } = req.params;
  const { title, description, status, due_date } = req.body;

  try {
    const task = await TaskModel.update(id, req.user.id, { title, description, status, due_date });
    if (!task) {
      return res.status(404).json({ message: 'Task not found or not authorized.' });
    }
    res.json({ message: 'Task updated.', task });
  } catch (err) {
    console.error('UpdateTask error:', err.message);
    res.status(500).json({ message: 'Failed to update task.' });
  }
};

// PATCH /api/tasks/:id/toggle
const toggleTask = async (req, res) => {
  const { id } = req.params;
  try {
    const task = await TaskModel.toggleStatus(id, req.user.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found or not authorized.' });
    }
    res.json({ message: 'Task status toggled.', task });
  } catch (err) {
    console.error('ToggleTask error:', err.message);
    res.status(500).json({ message: 'Failed to toggle task.' });
  }
};

// DELETE /api/tasks/:id
const deleteTask = async (req, res) => {
  const { id } = req.params;
  try {
    const task = await TaskModel.delete(id, req.user.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found or not authorized.' });
    }
    res.json({ message: 'Task deleted.' });
  } catch (err) {
    console.error('DeleteTask error:', err.message);
    res.status(500).json({ message: 'Failed to delete task.' });
  }
};

module.exports = { getTasks, createTask, updateTask, toggleTask, deleteTask };

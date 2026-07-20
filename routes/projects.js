const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const { protect } = require('../middleware/auth');

// Apply auth middleware to all routes
router.use(protect);

// ===========================
// GET /api/projects - Get all projects
// ===========================
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find({ userId: req.user.id }).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: projects.length,
      data: projects,
    });
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ===========================
// GET /api/projects/:id - Get single project
// ===========================
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    // Check ownership
    if (project.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized',
      });
    }

    res.json({
      success: true,
      data: project,
    });
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ===========================
// POST /api/projects - Create project
// ===========================
router.post('/', async (req, res) => {
  try {
    const { client, name, contact, status, tags, total, paidAmount, paymentStatus, currency, notes } = req.body;

    // Validation
    if (!client || !name) {
      return res.status(400).json({
        success: false,
        message: 'Client and project name required',
      });
    }

    // Create project
    const project = new Project({
  userId: req.user.id,
  client,
  name,
  contact: contact || '',
  status: status || 'active',
  tags: tags || [],
  total: total || 0,
  paidAmount: paidAmount || 0,
  paymentStatus: paymentStatus || 'pending',
  currency: currency || 'PKR',
  notes: notes || '',
});

    await project.save();

    res.status(201).json({
      success: true,
      message: 'Project created successfully!',
      data: project,
    });
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ===========================
// PUT /api/projects/:id - Update project
// ===========================
router.put('/:id', async (req, res) => {
  try {
    let project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    // Check ownership
    if (project.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized',
      });
    }

    // Update fields
    const { client, name, contact, status, tags, total, paidAmount, paymentStatus, currency, notes } = req.body;

    if (client) project.client = client;
    if (name) project.name = name;
    if (contact) project.contact = contact;
    if (status) project.status = status;
    if (tags) project.tags = tags;
    if (total !== undefined) project.total = total;
    if (paidAmount !== undefined) project.paidAmount = paidAmount;
    if (paymentStatus) project.paymentStatus = paymentStatus;
if (currency) project.currency = currency;   
if (notes) project.notes = notes;

    await project.save();

    res.json({
      success: true,
      message: 'Project updated successfully!',
      data: project,
    });
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ===========================
// DELETE /api/projects/:id - Delete project
// ===========================
router.delete('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    // Check ownership
    if (project.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized',
      });
    }

    await Project.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Project deleted successfully!',
    });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ===========================
// POST /api/projects/:id/tasks - Add task
// ===========================
router.post('/:id/tasks', async (req, res) => {
  try {
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Task title required',
      });
    }

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    if (project.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized',
      });
    }

    // Add task
    const task = {
      id: Date.now().toString(),
      title,
      done: false,
      createdAt: new Date(),
    };

    project.tasks.push(task);
    await project.save();

    res.status(201).json({
      success: true,
      message: 'Task added successfully!',
      data: project,
    });
  } catch (error) {
    console.error('Add task error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ===========================
// PUT /api/projects/:projectId/tasks/:taskId - Update task
// ===========================
router.put('/:projectId/tasks/:taskId', async (req, res) => {
  try {
    const { done } = req.body;

    const project = await Project.findById(req.params.projectId);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    if (project.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized',
      });
    }

    // Find and update task
    const task = project.tasks.find(t => t.id === req.params.taskId);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    task.done = done;
    await project.save();

    res.json({
      success: true,
      message: 'Task updated successfully!',
      data: project,
    });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ===========================
// DELETE /api/projects/:projectId/tasks/:taskId - Delete task
// ===========================
router.delete('/:projectId/tasks/:taskId', async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    if (project.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized',
      });
    }

    // Remove task
    project.tasks = project.tasks.filter(t => t.id !== req.params.taskId);
    await project.save();

    res.json({
      success: true,
      message: 'Task deleted successfully!',
      data: project,
    });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
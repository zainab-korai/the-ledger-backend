const express = require('express');
const router = express.Router();
const Invoice = require('../models/Invoice');
const Project = require('../models/Project');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// Apply auth middleware
router.use(protect);

// ===========================
// GET /api/invoices - Get all invoices
// ===========================
router.get('/', async (req, res) => {
  try {
    const invoices = await Invoice.find({ userId: req.user.id }).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: invoices.length,
      data: invoices,
    });
  } catch (error) {
    console.error('Get invoices error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ===========================
// GET /api/invoices/:id - Get single invoice
// ===========================
router.get('/:id', async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found',
      });
    }

    if (invoice.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized',
      });
    }

    res.json({
      success: true,
      data: invoice,
    });
  } catch (error) {
    console.error('Get invoice error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ===========================
// POST /api/invoices - Create invoice
// ===========================
router.post('/', async (req, res) => {
  try {
    const { projectId } = req.body;

    if (!projectId) {
      return res.status(400).json({
        success: false,
        message: 'Project ID required',
      });
    }

    // Get project
    const project = await Project.findById(projectId);

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

    // Get user for bank details
    const user = await User.findById(req.user.id);

    // Generate invoice number
    const invoiceNumber = `INV-${Date.now()}`;

    // Calculate amount due
    const amountDue = project.total - project.paidAmount;

    // Create invoice
    const invoice = new Invoice({
      userId: req.user.id,
      projectId: projectId,
      invoiceNumber,
      clientName: project.client,
      clientEmail: '', // Will need to add email to project model later
      clientPhone: project.contact,
      projectName: project.name,
      amount: project.total,
      amountReceived: project.paidAmount,
      amountDue: amountDue,
      bankDetails: user.bankDetails,
      status: 'draft',
    });

    await invoice.save();

    res.status(201).json({
      success: true,
      message: 'Invoice created successfully!',
      data: invoice,
    });
  } catch (error) {
    console.error('Create invoice error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ===========================
// PUT /api/invoices/:id - Update invoice status
// ===========================
router.put('/:id', async (req, res) => {
  try {
    let invoice = await Invoice.findById(req.params.id);

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found',
      });
    }

    if (invoice.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized',
      });
    }

    const { status } = req.body;

    if (status) {
      invoice.status = status;
    }

    await invoice.save();

    res.json({
      success: true,
      message: 'Invoice updated successfully!',
      data: invoice,
    });
  } catch (error) {
    console.error('Update invoice error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ===========================
// DELETE /api/invoices/:id - Delete invoice
// ===========================
router.delete('/:id', async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found',
      });
    }

    if (invoice.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized',
      });
    }

    await Invoice.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Invoice deleted successfully!',
    });
  } catch (error) {
    console.error('Delete invoice error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
const mongoose = require('mongoose');

const InvoiceSchema = new mongoose.Schema(
  {
    // User reference
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // Project reference
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },

    // Invoice Details
    invoiceNumber: {
      type: String,
      unique: true,
      required: true,
    },

    invoiceDate: {
      type: Date,
      default: Date.now,
    },

    // Client Info (snapshot at time of invoice)
    clientName: {
      type: String,
      required: true,
    },

    clientEmail: {
  type: String,
  default: '', 
},

    clientPhone: {
      type: String,
      default: '',
    },

    // Project Info (snapshot)
    projectName: {
      type: String,
      required: true,
    },

    // Amount Details
    amount: {
      type: Number,
      required: true,
    },

    amountReceived: {
      type: Number,
      default: 0,
    },

    amountDue: {
      type: Number,
      required: true,
    },

    // Bank Details (from user profile)
    bankDetails: {
      bank: String,
      accountNumber: String,
      accountHolder: String,
    },

    // PDF URL (if stored)
    pdfUrl: {
      type: String,
      default: '',
    },

    // Status
    status: {
      type: String,
      enum: ['draft', 'sent', 'paid'],
      default: 'draft',
    },

    // Timestamps
    createdAt: {
      type: Date,
      default: Date.now,
    },

    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Invoice', InvoiceSchema);
const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema(
  {
    // User reference (who owns this project)
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // Basic Info
    client: {
      type: String,
      required: [true, 'Client name required'],
    },
    name: {
      type: String,
      required: [true, 'Project name required'],
    },
    contact: {
      type: String,
      default: '',
    },

    // Status
    status: {
      type: String,
      enum: ['active', 'paused', 'completed'],
      default: 'active',
    },

    // Tech Stack (tags)
    tags: [{
      type: String,
      default: []
    }],

    currency: {
  type: String,
  enum: ['PKR', 'USD', 'AED', 'INR'],
  default: 'PKR',
},
total: {
  type: Number,
  default: 0,
},
    paidAmount: {
      type: Number,
      default: 0,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'partial', 'paid'],
      default: 'pending',
    },

    // Tasks
    tasks: [{
      id: String,
      title: String,
      done: Boolean,
      createdAt: {
        type: Date,
        default: Date.now,
      }
    }],

    // Notes
    notes: {
      type: String,
      default: '',
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

module.exports = mongoose.model('Project', ProjectSchema);
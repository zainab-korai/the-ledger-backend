const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');

const UserSchema = new mongoose.Schema(
  {
    // Basic Info
    email: {
      type: String,
      required: [true, 'Email required'],
      unique: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Valid email required'],
    },
    password: {
      type: String,
      required: [true, 'Password required'],
      minlength: 6,
      select: false, // Don't return password by default
    },
    name: {
      type: String,
      required: [true, 'Name required'],
    },
    phone: {
      type: String,
      default: '',
    },
    businessName: {
      type: String,
      default: 'My Business',
    },
    
    // Bank Details
    bankDetails: {
      bank: { type: String, default: 'JS Bank' },
      accountNumber: { type: String, default: '' },
      accountName: { type: String, default: '' },
    },
    
    // Theme (Colors)
    theme: {
      primary: { type: String, default: '#FF006E' }, // Magenta
      secondary: { type: String, default: '#00F5FF' }, // Cyan
      accent: { type: String, default: '#10B981' }, // Emerald
    },
    
    // Avatar
    avatar: {
      gender: { type: String, enum: ['male', 'female'], default: 'male' },
      emoji: { type: String, default: '👨‍💼' },
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

// Hash password before saving
UserSchema.pre('save', async function () {
  // Only hash if password is new or modified
  if (!this.isModified('password')) {
    return;
  }

  const salt = await bcryptjs.genSalt(10);
  this.password = await bcryptjs.hash(this.password, salt);
});

// Method to compare passwords
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcryptjs.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Task title is required'],
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500,
    default: ''
  },
  date: {
    type: Date,
    required: [true, 'Task date is required']
  },
  completed: {
    type: Boolean,
    default: false
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  }
}, { timestamps: true });

// Index for efficient queries by user and date
taskSchema.index({ user: 1, date: 1 });
taskSchema.index({ user: 1, completed: 1 });

module.exports = mongoose.model('Task', taskSchema);

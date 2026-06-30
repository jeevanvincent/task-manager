const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }, // 👈 Added the missing comma right here!
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
      maxlength: [50, 'Title cannot exceed 50 characters']
    },
    description: {
      type: String,
      trim: true
    },
    status: {
      type: String,
      enum: ['Todo', 'In Progress', 'Done'],
      default: 'Todo'
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Task', taskSchema);
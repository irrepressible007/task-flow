/**
 * Task.js — Mongoose Model
 *
 * Defines the shape of a task document stored in MongoDB.
 * Mongoose automatically adds `createdAt` and `updatedAt` timestamps
 * when `{ timestamps: true }` is passed as the second argument.
 */

const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    // Title is required — validated here and again by express-validator in the route
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,                         // removes leading/trailing whitespace
      maxlength: [255, 'Title cannot exceed 255 characters'],
    },

    // Description is optional — defaults to empty string if not provided
    description: {
      type: String,
      trim: true,
      default: '',
    },

    // Status can only be 'pending' or 'completed'; defaults to 'pending'
    status: {
      type: String,
      enum: ['pending', 'completed'],
      default: 'pending',
    },

    // Priority is a bonus feature — sorts tasks by importance
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },

    // Due date is optional — used to highlight overdue tasks in the UI
    dueDate: {
      type: Date,
      default: null,
    },
  },
  {
    // Automatically manages `createdAt` and `updatedAt` fields
    timestamps: true,
  }
);

// ── Indexes ──────────────────────────────────────────────────────────────────
// Compound index on the fields most used for filtering and sorting.
// Eliminates full collection scans when filtering by status or sorting by priority.
taskSchema.index({ status: 1, priority: 1, createdAt: -1 });

module.exports = mongoose.model('Task', taskSchema);

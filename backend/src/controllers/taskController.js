/**
 * taskController.js — Request Handlers / Business Logic
 *
 * Each exported function handles one API endpoint.
 * Uses asyncHandler to eliminate try/catch boilerplate.
 * Uses mongoose.isValidObjectId() to return 404 (not 500) on malformed IDs.
 *
 * Response shape is consistent across ALL endpoints:
 *   Success: { data: <task | task[]> }
 *   Error:   { message: "..." }
 *
 * getAllTasks uses Task.find() (not aggregate) so all endpoints return
 * Mongoose documents with the same shape — _id, id, createdAt, updatedAt etc.
 */

const mongoose             = require('mongoose');
const { validationResult } = require('express-validator');
const asyncHandler         = require('../middleware/asyncHandler');
const Task                 = require('../models/Task');

// Priority sort order: high (1) → medium (2) → low (3)
const PRIORITY_ORDER = { high: 1, medium: 2, low: 3 };

// ─────────────────────────────────────────────────────────────────────────────
// Helper: validate a MongoDB ObjectId — returns 404 early if malformed.
// Prevents Mongoose CastError (which would otherwise surface as 500).
// ─────────────────────────────────────────────────────────────────────────────
const validateId = (id, res) => {
  if (!mongoose.isValidObjectId(id)) {
    res.status(404).json({ message: 'Task not found' });
    return false;
  }
  return true;
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/tasks
// Returns all tasks sorted by priority (high first), then newest first.
// Uses Task.find() (not aggregate) so the response shape matches all
// other endpoints — Mongoose documents with consistent field set.
// Application-layer priority sort is appropriate for a personal task
// manager where task counts stay manageable (< 10k).
// ─────────────────────────────────────────────────────────────────────────────
const getAllTasks = asyncHandler(async (req, res) => {
  // Fetch all tasks, newest first as secondary order
  const tasks = await Task.find().sort({ createdAt: -1 });

  // Sort by priority in application layer.
  // MongoDB does not natively support custom enum ordering without aggregation.
  // Using find() keeps response shape consistent with all other endpoints.
  tasks.sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]);

  res.status(200).json({ data: tasks });
});

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/tasks
// Creates a new task. Returns 201 on success, 400 if validation fails.
// ─────────────────────────────────────────────────────────────────────────────
const createTask = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }

  const { title, description, status, priority, dueDate } = req.body;
  const task = await Task.create({ title, description, status, priority, dueDate });

  res.status(201).json({ data: task });
});

// ─────────────────────────────────────────────────────────────────────────────
// PUT /api/tasks/:id
// Updates one or more fields of an existing task.
// Returns 200 on success, 400 on validation error, 404 if not found.
// ─────────────────────────────────────────────────────────────────────────────
const updateTask = asyncHandler(async (req, res) => {
  if (!validateId(req.params.id, res)) return;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }

  const { title, description, status, priority, dueDate } = req.body;

  // Build update object with only fields that were actually sent
  const updates = {};
  if (title       !== undefined) updates.title       = title;
  if (description !== undefined) updates.description = description;
  if (status      !== undefined) updates.status      = status;
  if (priority    !== undefined) updates.priority    = priority;
  if (dueDate     !== undefined) updates.dueDate     = dueDate;

  const task = await Task.findByIdAndUpdate(
    req.params.id,
    updates,
    { new: true, runValidators: true }
  );

  if (!task) return res.status(404).json({ message: 'Task not found' });

  res.status(200).json({ data: task });
});

// ─────────────────────────────────────────────────────────────────────────────
// PATCH /api/tasks/:id/toggle
// Flips status: pending → completed, completed → pending.
// ─────────────────────────────────────────────────────────────────────────────
const toggleTask = asyncHandler(async (req, res) => {
  if (!validateId(req.params.id, res)) return;

  const task = await Task.findById(req.params.id);
  if (!task) return res.status(404).json({ message: 'Task not found' });

  task.status = task.status === 'pending' ? 'completed' : 'pending';
  await task.save(); // .save() triggers updatedAt via Mongoose timestamps

  res.status(200).json({ data: task });
});

// ─────────────────────────────────────────────────────────────────────────────
// DELETE /api/tasks/:id
// Permanently removes a task. Returns 200 on success, 404 if not found.
// ─────────────────────────────────────────────────────────────────────────────
const deleteTask = asyncHandler(async (req, res) => {
  if (!validateId(req.params.id, res)) return;

  const task = await Task.findByIdAndDelete(req.params.id);
  if (!task) return res.status(404).json({ message: 'Task not found' });

  res.status(200).json({ message: 'Task deleted successfully' });
});

module.exports = { getAllTasks, createTask, updateTask, toggleTask, deleteTask };

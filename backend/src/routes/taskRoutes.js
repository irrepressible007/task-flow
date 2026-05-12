/**
 * taskRoutes.js — API Route Definitions
 *
 * Maps HTTP method + path to controller functions.
 * Validation middleware (express-validator) runs BEFORE the controller,
 * so the controller can safely assume inputs are structurally valid.
 *
 * Route summary:
 *   GET    /api/tasks              → getAllTasks
 *   POST   /api/tasks              → createTask
 *   PUT    /api/tasks/:id          → updateTask
 *   PATCH  /api/tasks/:id/toggle   → toggleTask
 *   DELETE /api/tasks/:id          → deleteTask
 */

const express        = require('express');
const { body }       = require('express-validator');
const taskController = require('../controllers/taskController');

const router = express.Router();

// ─────────────────────────────────────────────
// Validation rule sets (reusable middleware arrays)
// ─────────────────────────────────────────────

/**
 * Rules applied when CREATING a task.
 * Title is required; all other fields are optional.
 */
const createRules = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ max: 255 }).withMessage('Title cannot exceed 255 characters'),

  body('description')
    .optional()
    .trim(),

  body('status')
    .optional()
    .isIn(['pending', 'completed']).withMessage('Status must be "pending" or "completed"'),

  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high']).withMessage('Priority must be "low", "medium", or "high"'),

  body('dueDate')
    .optional({ nullable: true })
    .isISO8601().withMessage('dueDate must be a valid date'),
];

/**
 * Rules applied when UPDATING a task.
 * All fields are optional here — a PATCH-style partial update is allowed via PUT.
 */
const updateRules = [
  body('title')
    .optional()
    .trim()
    .notEmpty().withMessage('Title cannot be empty')
    .isLength({ max: 255 }).withMessage('Title cannot exceed 255 characters'),

  body('status')
    .optional()
    .isIn(['pending', 'completed']).withMessage('Status must be "pending" or "completed"'),

  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high']).withMessage('Priority must be "low", "medium", or "high"'),

  body('dueDate')
    .optional({ nullable: true })
    .isISO8601().withMessage('dueDate must be a valid date'),
];

// ─────────────────────────────────────────────
// Route definitions
// ─────────────────────────────────────────────

// GET /api/tasks — return all tasks
router.get('/', taskController.getAllTasks);

// POST /api/tasks — create a new task
router.post('/', createRules, taskController.createTask);

// PUT /api/tasks/:id — update an existing task's fields
router.put('/:id', updateRules, taskController.updateTask);

// PATCH /api/tasks/:id/toggle — flip status between pending and completed
router.patch('/:id/toggle', taskController.toggleTask);

// DELETE /api/tasks/:id — permanently remove a task
router.delete('/:id', taskController.deleteTask);

module.exports = router;

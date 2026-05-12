/**
 * TaskItem.jsx — Single Task Row
 *
 * Displays one task with all its details and action buttons.
 * Visual distinctions:
 *  - Completed tasks: strikethrough title + muted color
 *  - Overdue tasks: red "Overdue" badge when dueDate is past and status is pending
 *  - Priority: color-coded badge (red/yellow/green)
 *
 * Props:
 *   task     {object}   — the task document from the backend
 *   onToggle {function} — called with task._id to toggle status
 *   onEdit   {function} — called with the task object to open the edit modal
 *   onDelete {function} — called with task._id to trigger delete confirmation
 */

import React from 'react';
import PropTypes from 'prop-types';
import { formatDate, isOverdue } from '../utils/helpers';

/** Maps priority value to a CSS modifier class */
const PRIORITY_CLASS = {
  high:   'priority--high',
  medium: 'priority--medium',
  low:    'priority--low',
};

function TaskItem({ task, onToggle, onEdit, onDelete }) {
  const overdue = task.status === 'pending' && isOverdue(task.dueDate);

  return (
    <div className={`task-item ${task.status === 'completed' ? 'task-item--completed' : ''}`}>

      {/* ── Left: Checkbox ── */}
      <label className="task-checkbox-label" title={task.status === 'pending' ? 'Mark complete' : 'Mark pending'}>
        <input
          type="checkbox"
          className="task-checkbox"
          checked={task.status === 'completed'}
          onChange={() => onToggle(task._id)}
          aria-label={`Mark "${task.title}" as ${task.status === 'pending' ? 'completed' : 'pending'}`}
        />
        <span className="task-checkbox-custom" />
      </label>

      {/* ── Centre: Task Info ── */}
      <div className="task-info">
        <h3 className="task-title">{task.title}</h3>

        {task.description && (
          <p className="task-description">{task.description}</p>
        )}

        <div className="task-meta">
          {/* Status badge */}
          <span className={`badge badge--${task.status}`}>
            {task.status === 'completed' ? '✓ Completed' : '● Pending'}
          </span>

          {/* Priority badge */}
          <span className={`badge ${PRIORITY_CLASS[task.priority]}`}>
            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
          </span>

          {/* Overdue badge */}
          {overdue && <span className="badge badge--overdue">⚠ Overdue</span>}

          {/* Due date */}
          {task.dueDate && (
            <span className={`task-date ${overdue ? 'task-date--overdue' : ''}`}>
              Due: {formatDate(task.dueDate)}
            </span>
          )}

          {/* Creation date */}
          <span className="task-date task-date--created">
            Created: {formatDate(task.createdAt)}
          </span>
        </div>
      </div>

      {/* ── Right: Action Buttons ── */}
      <div className="task-actions">
        <button
          className="btn-icon btn-icon--edit"
          onClick={() => onEdit(task)}
          aria-label={`Edit task: ${task.title}`}
          title="Edit"
        >
          ✎
        </button>
        <button
          className="btn-icon btn-icon--delete"
          onClick={() => onDelete(task._id)}
          aria-label={`Delete task: ${task.title}`}
          title="Delete"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

TaskItem.propTypes = {
  task: PropTypes.shape({
    _id:         PropTypes.string.isRequired,
    title:       PropTypes.string.isRequired,
    description: PropTypes.string,
    status:      PropTypes.oneOf(['pending', 'completed']).isRequired,
    priority:    PropTypes.oneOf(['low', 'medium', 'high']).isRequired,
    dueDate:     PropTypes.string,
    createdAt:   PropTypes.string.isRequired,
  }).isRequired,
  onToggle: PropTypes.func.isRequired,
  onEdit:   PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default TaskItem;

/**
 * TaskList.jsx — Task List Container
 *
 * Receives the already-filtered tasks array from App.jsx and renders
 * a TaskItem for each one. Shows an empty-state message when no tasks match.
 *
 * Props:
 *   tasks    {array}    — filtered array of task objects
 *   onToggle {function} — passed down to TaskItem
 *   onEdit   {function} — passed down to TaskItem
 *   onDelete {function} — passed down to TaskItem
 */

import React from 'react';
import PropTypes from 'prop-types';
import TaskItem from './TaskItem';

function TaskList({ tasks, onToggle, onEdit, onDelete }) {
  // ── Empty state ────────────────────────────────────────────────────────────
  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state__icon">📋</div>
        <p className="empty-state__title">No tasks found</p>
        <p className="empty-state__subtitle">
          Try a different filter, or add a new task above.
        </p>
      </div>
    );
  }

  // ── Populated list ─────────────────────────────────────────────────────────
  return (
    <ul className="task-list" aria-label="Task list">
      {tasks.map((task) => (
        <li key={task._id} className="task-list__item">
          <TaskItem
            task={task}
            onToggle={onToggle}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </li>
      ))}
    </ul>
  );
}

TaskList.propTypes = {
  tasks:    PropTypes.arrayOf(PropTypes.object).isRequired,
  onToggle: PropTypes.func.isRequired,
  onEdit:   PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default TaskList;

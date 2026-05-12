/**
 * TaskForm.jsx — Add / Edit Task Form
 *
 * Used for BOTH creating a new task and editing an existing one.
 * When `initialData` is provided, the form pre-fills with existing values (edit mode).
 * When `initialData` is null/undefined, the form starts empty (add mode).
 *
 * Props:
 *   initialData {object|null} — existing task data for edit mode (optional)
 *   onSubmit    {function}    — called with form data object on valid submission
 *   onCancel    {function}    — called when user clicks Cancel (optional, edit mode)
 */

import React, { useState, useEffect } from 'react';

function TaskForm({ initialData = null, onSubmit, onCancel }) {
  // ── Form field state ──────────────────────────────────────────────────────
  const [title,       setTitle]       = useState('');
  const [description, setDescription] = useState('');
  const [priority,    setPriority]    = useState('medium');
  const [dueDate,     setDueDate]     = useState('');
  const [titleError,  setTitleError]  = useState(''); // inline validation message
  const [submitting,  setSubmitting]  = useState(false);

  // ── Pre-fill fields when editing an existing task ─────────────────────────
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setDescription(initialData.description || '');
      setPriority(initialData.priority || 'medium');
      // Convert ISO date string to YYYY-MM-DD for the date input
      setDueDate(
        initialData.dueDate
          ? new Date(initialData.dueDate).toISOString().split('T')[0]
          : ''
      );
    }
  }, [initialData]);

  // ── Handle form submission ────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Frontend validation: title must not be blank
    if (!title.trim()) {
      setTitleError('Title is required. Please enter a task title.');
      return;
    }

    setTitleError('');
    setSubmitting(true);

    // Build the payload — only include dueDate if the user entered one
    const taskData = {
      title:       title.trim(),
      description: description.trim(),
      priority,
      ...(dueDate ? { dueDate } : { dueDate: null }),
    };

    await onSubmit(taskData);
    setSubmitting(false);

    // Reset form fields only if this is "add" mode (not edit)
    if (!initialData) {
      setTitle('');
      setDescription('');
      setPriority('medium');
      setDueDate('');
    }
  };

  const isEditing = Boolean(initialData);

  return (
    <form className="task-form" onSubmit={handleSubmit} noValidate>

      {/* ── Title ── */}
      <div className="form-group">
        <label htmlFor="task-title" className="form-label">
          Title <span className="required-star">*</span>
        </label>
        <input
          id="task-title"
          type="text"
          className={`form-input ${titleError ? 'form-input--error' : ''}`}
          placeholder="What needs to be done?"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            // Clear error as soon as the user starts typing
            if (titleError) setTitleError('');
          }}
          maxLength={255}
          autoFocus={!isEditing}
        />
        {/* Inline validation error message */}
        {titleError && (
          <p className="form-error" role="alert">{titleError}</p>
        )}
      </div>

      {/* ── Description ── */}
      <div className="form-group">
        <label htmlFor="task-description" className="form-label">
          Description <span className="optional-tag">(optional)</span>
        </label>
        <textarea
          id="task-description"
          className="form-input form-textarea"
          placeholder="Add more details..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />
      </div>

      {/* ── Priority + Due Date (side by side on wider screens) ── */}
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="task-priority" className="form-label">Priority</label>
          <select
            id="task-priority"
            className="form-input form-select"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="high">🔴 High</option>
            <option value="medium">🟡 Medium</option>
            <option value="low">🟢 Low</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="task-due-date" className="form-label">
            Due Date <span className="optional-tag">(optional)</span>
          </label>
          <input
            id="task-due-date"
            type="date"
            className="form-input"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>
      </div>

      {/* ── Action Buttons ── */}
      <div className="form-actions">
        {onCancel && (
          <button type="button" className="btn btn-ghost" onClick={onCancel}>
            Cancel
          </button>
        )}
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? 'Saving...' : isEditing ? 'Save Changes' : 'Add Task'}
        </button>
      </div>
    </form>
  );
}

export default TaskForm;

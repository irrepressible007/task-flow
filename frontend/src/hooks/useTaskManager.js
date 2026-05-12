/**
 * useTaskManager.js — Custom Hook for Task State & Operations
 *
 * Extracts all task-related state and async handlers out of App.jsx
 * so that App.jsx focuses solely on rendering (its only job).
 *
 * Returns:
 *   tasks          — full task list from the backend
 *   loading        — true while the initial fetch is in progress
 *   toast          — { message, type } | null
 *   editingTask    — task object being edited, or null
 *   confirmDelete  — task._id pending deletion, or null
 *   showAddForm    — boolean controlling the add-task panel
 *   filteredTasks  — tasks after applying filter + search
 *   stats          — { total, pending, completed }
 *   handlers       — all CRUD and UI event handlers
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import * as taskService from '../services/taskService';

/**
 * @param {string} filter      - 'all' | 'pending' | 'completed'
 * @param {string} searchQuery - keyword to match against task titles
 */
export function useTaskManager(filter, searchQuery) {
  const [tasks,         setTasks]         = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [toast,         setToast]         = useState(null);
  const [editingTask,   setEditingTask]   = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [showAddForm,   setShowAddForm]   = useState(false);

  // ── Toast helper ──────────────────────────────────────────────────────────
  /** Show a toast message for 3 seconds then auto-dismiss */
  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  // ── Fetch ─────────────────────────────────────────────────────────────────
  const fetchTasks = useCallback(async () => {
    try {
      const res = await taskService.getAllTasks();
      setTasks(res.data.data);
    } catch {
      showToast('Could not load tasks. Is the backend running?', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  // ── CRUD Handlers ─────────────────────────────────────────────────────────

  /** Add a new task — prepend to list so it appears at the top */
  const handleAddTask = useCallback(async (taskData) => {
    try {
      const res = await taskService.createTask(taskData);
      setTasks((prev) => [res.data.data, ...prev]);
      setShowAddForm(false);
      showToast('Task created!');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to create task.', 'error');
    }
  }, [showToast]);

  /** Save edits — replace the old version in local state */
  const handleUpdateTask = useCallback(async (id, taskData) => {
    try {
      const res = await taskService.updateTask(id, taskData);
      setTasks((prev) => prev.map((t) => (t._id === id ? res.data.data : t)));
      setEditingTask(null);
      showToast('Task updated!');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update task.', 'error');
    }
  }, [showToast]);

  /** Toggle pending ↔ completed */
  const handleToggleTask = useCallback(async (id) => {
    try {
      const res = await taskService.toggleTask(id);
      setTasks((prev) => prev.map((t) => (t._id === id ? res.data.data : t)));
    } catch {
      showToast('Failed to update status.', 'error');
    }
  }, [showToast]);

  /** Open the confirm-delete modal */
  const handleDeleteRequest = useCallback((id) => setConfirmDelete(id), []);

  /** Confirmed delete — remove from DB and local state */
  const handleDeleteConfirm = useCallback(async () => {
    try {
      await taskService.deleteTask(confirmDelete);
      setTasks((prev) => prev.filter((t) => t._id !== confirmDelete));
      showToast('Task deleted.');
    } catch {
      showToast('Failed to delete task.', 'error');
    } finally {
      setConfirmDelete(null);
    }
  }, [confirmDelete, showToast]);

  // ── Derived Data ──────────────────────────────────────────────────────────

  /** Filtered + searched task list — recomputed only when dependencies change */
  const filteredTasks = useMemo(() =>
    tasks
      .filter((t) => filter === 'all' || t.status === filter)
      .filter((t) => t.title.toLowerCase().includes(searchQuery.toLowerCase())),
    [tasks, filter, searchQuery]
  );

  /** Stats for the summary cards */
  const stats = useMemo(() => ({
    total:     tasks.length,
    pending:   tasks.filter((t) => t.status === 'pending').length,
    completed: tasks.filter((t) => t.status === 'completed').length,
  }), [tasks]);

  return {
    // State
    loading,
    toast,
    editingTask,
    confirmDelete,
    showAddForm,
    filteredTasks,
    stats,
    // Handlers
    setShowAddForm,
    setEditingTask,
    setConfirmDelete,
    handleAddTask,
    handleUpdateTask,
    handleToggleTask,
    handleDeleteRequest,
    handleDeleteConfirm,
  };
}

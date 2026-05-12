/**
 * App.jsx — Root Component (Presentation Layer Only)
 *
 * All state management and data-fetching logic lives in useTaskManager().
 * This component's only job is to render the UI and wire up event handlers.
 */

import React, { useState } from 'react';
import { useTaskManager }  from './hooks/useTaskManager';
import ErrorBoundary       from './components/ErrorBoundary';
import TaskForm            from './components/TaskForm';
import TaskList            from './components/TaskList';
import FilterBar           from './components/FilterBar';
import StatsCard           from './components/StatsCard';
import SearchBar           from './components/SearchBar';
import Toast               from './components/Toast';
import ConfirmModal        from './components/ConfirmModal';

function App() {
  // UI-only state stays in App — filter and search drive the hook's derived data
  const [filter,      setFilter]      = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // All task state + handlers come from the custom hook
  const {
    loading,
    toast,
    editingTask,
    confirmDelete,
    showAddForm,
    filteredTasks,
    stats,
    setShowAddForm,
    setEditingTask,
    setConfirmDelete,
    handleAddTask,
    handleUpdateTask,
    handleToggleTask,
    handleDeleteRequest,
    handleDeleteConfirm,
  } = useTaskManager(filter, searchQuery);

  return (
    <div className="app-container">

      {/* ── Header ── */}
      <header className="app-header">
        <div className="header-content">
          <div className="logo">
            <span className="logo-icon">✓</span>
            <h1>Task<span className="logo-accent">Flow</span></h1>
          </div>
          <p className="header-tagline">Stay organised. Stay productive.</p>
        </div>
      </header>

      <main className="main-content">

        {/* ── Stats summary ── */}
        <StatsCard stats={stats} />

        {/* ── Controls: search + filter + add button ── */}
        <div className="controls-bar">
          <SearchBar query={searchQuery} onChange={setSearchQuery} />
          <FilterBar filter={filter} onFilterChange={setFilter} />
          <button
            id="toggle-add-form"
            className={`btn ${showAddForm ? 'btn-ghost' : 'btn-primary'}`}
            onClick={() => setShowAddForm((v) => !v)}
          >
            {showAddForm ? '✕ Cancel' : '+ Add Task'}
          </button>
        </div>

        {/* ── Add Task panel ── */}
        {showAddForm && (
          <div className="form-panel">
            <h2 className="form-panel__title">New Task</h2>
            <TaskForm onSubmit={handleAddTask} />
          </div>
        )}

        {/* ── Task list or loading spinner ── */}
        {loading ? (
          <div className="loading-state">
            <div className="spinner" />
            <p>Loading tasks...</p>
          </div>
        ) : (
          <TaskList
            tasks={filteredTasks}
            onToggle={handleToggleTask}
            onEdit={setEditingTask}
            onDelete={handleDeleteRequest}
          />
        )}
      </main>

      {/* ── Edit Task Modal ── */}
      {editingTask && (
        <div className="modal-overlay" onClick={() => setEditingTask(null)}>
          <div
            className="modal-box"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-modal-title"
          >
            <div className="modal-header">
              <h2 id="edit-modal-title">Edit Task</h2>
              <button
                className="modal-close"
                onClick={() => setEditingTask(null)}
                aria-label="Close edit modal"
              >
                ✕
              </button>
            </div>
            <TaskForm
              initialData={editingTask}
              onSubmit={(data) => handleUpdateTask(editingTask._id, data)}
              onCancel={() => setEditingTask(null)}
            />
          </div>
        </div>
      )}

      {/* ── Delete Confirmation Modal ── */}
      {confirmDelete && (
        <ConfirmModal
          message="This task will be permanently deleted and cannot be recovered."
          onConfirm={handleDeleteConfirm}
          onCancel={() => setConfirmDelete(null)}
        />
      )}

      {/* ── Toast Notification ── */}
      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
}

// Wrap with ErrorBoundary so any render crash shows a friendly message
// instead of a blank white screen
function AppWithBoundary() {
  return (
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  );
}

export default AppWithBoundary;

/**
 * taskService.js — API Service Layer
 *
 * All HTTP communication with the backend lives here.
 * Components never use axios directly — they call these functions.
 * This makes it easy to change the base URL or add auth headers in one place.
 *
 * Base URL is read from the Vite environment variable VITE_API_URL.
 * Set this in frontend/.env (copy from .env.example).
 */

import axios from 'axios';

// Create a reusable axios instance with the backend base URL
// Determine the API base URL. 
// In production on Vercel, we use the relative path '/_/backend/api' defined in vercel.json.
// In local development, we default to localhost:5000.
const getBaseURL = () => {
  if (import.meta.env.VITE_API_URL) return `${import.meta.env.VITE_API_URL}/api`;
  if (window.location.hostname === 'localhost') return 'http://localhost:5000/api';
  return '/_/backend/api';
};

const api = axios.create({
  baseURL: getBaseURL(),

  headers: {
    'Content-Type': 'application/json',
  },
});

/** Fetch all tasks from the database */
export const getAllTasks = () => api.get('/tasks');

/** Create a new task. taskData = { title, description?, status?, priority?, dueDate? } */
export const createTask = (taskData) => api.post('/tasks', taskData);

/** Update an existing task by its MongoDB _id */
export const updateTask = (id, taskData) => api.put(`/tasks/${id}`, taskData);

/** Toggle the status of a task between "pending" and "completed" */
export const toggleTask = (id) => api.patch(`/tasks/${id}/toggle`);

/** Permanently delete a task by its MongoDB _id */
export const deleteTask = (id) => api.delete(`/tasks/${id}`);

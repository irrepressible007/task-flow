/**
 * app.js — Express Application Setup
 *
 * Configures and exports the Express app.
 * Exported separately from server.js so tests can import the app
 * without binding to a port.
 *
 * Middleware stack (in order):
 *  1. helmet  — sets security-related HTTP response headers
 *  2. morgan  — logs HTTP requests to the console
 *  3. cors    — allows the React frontend on a different port to call this API
 *  4. express.json — parses JSON request bodies
 *  5. routes  — /api/tasks
 *  6. 404 handler
 *  7. global error handler
 */

const express = require('express');
const cors    = require('cors');
const helmet  = require('helmet');
const morgan  = require('morgan');

const taskRoutes = require('./routes/taskRoutes');

const app = express();

// ── Security: Adds headers like X-Frame-Options, X-Content-Type-Options, etc.
app.use(helmet());

// ── Logging: Logs "GET /api/tasks 200 12ms" style lines in development
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// ── CORS: Allow requests from the React dev server (and the deployed frontend)
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  })
);

// ── Body parsing: Parse JSON payloads on incoming requests
app.use(express.json());

// ── Routes: All task endpoints live under /api/tasks
app.use('/api/tasks', taskRoutes);

// ── Health check: Simple endpoint to verify the server is alive
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// ── 404 handler: Catches any request that didn't match a route above
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// ── Global error handler: Catches errors passed via next(err) in controllers
// Must have 4 parameters for Express to recognise it as an error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error' });
});

module.exports = app;

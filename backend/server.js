/**
 * server.js — Entry Point
 *
 * Responsibilities:
 *  1. Load environment variables from .env
 *  2. Connect to MongoDB
 *  3. Start the HTTP server on the configured PORT
 *
 * Express app setup lives in src/app.js, keeping this file minimal
 * and making the app importable in tests without starting a server.
 */

const dotenv = require('dotenv');
dotenv.config(); // Must be first — loads .env before any other module reads process.env

const mongoose = require('mongoose');
const app = require('./src/app');

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌  MONGODB_URI is not set. Check your .env file.');
  process.exit(1);
}

// Connect to MongoDB, then start the server only after a successful connection
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('✅  Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`🚀  Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌  MongoDB connection error:', err.message);
    process.exit(1);
  });

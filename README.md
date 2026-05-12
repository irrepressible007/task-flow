# 📋 Task-Flow MERN Application

A robust, full-stack task management application built with the MERN stack (MongoDB, Express, React, Node.js). This project demonstrates modern web development practices including custom hooks, error boundaries, and optimized database queries.

## 🚀 Quick Start (Local Development)

### 1. Prerequisites
- Node.js (v16+)
- MongoDB Atlas account (or local MongoDB)

### 2. Setup Backend
Open a **new terminal window**:
```bash
cd backend
npm install
cp .env.example .env
# Edit .env and add your MONGODB_URI
npm run dev
```

### 3. Setup Frontend
Open a **second terminal window**:
```bash
cd frontend
npm install
cp .env.example .env
# Edit .env if your backend port differs from 5000
npm run dev
```
The app will be running at `http://localhost:5173`.

---

## 🛠️ Features
- **CRUD Operations**: Create, Read, Update, Delete tasks.
- **Status Toggle**: Quickly mark tasks as Pending or Completed.
- **Priority & Due Dates**: Sort tasks by importance and track deadlines.
- **Search & Filter**: Live keyword search and status-based filtering.
- **Real-time Feedback**: Toast notifications and confirmation modals.
- **Robust Architecture**: Custom React hooks, Error Boundaries, and MongoDB indexing.

---

## ☁️ Deployment (Vercel)

This project is configured for **Vercel Experimental Services** (Monorepo).

### Steps:
1. Connect your GitHub repository to Vercel.
2. Vercel will detect the `vercel.json` in the root.
3. **Configure Environment Variables** in the Vercel Dashboard:

**For the Backend Service:**
- `MONGODB_URI`: Your MongoDB Atlas connection string.
- `CLIENT_URL`: Your Vercel deployment URL (e.g., `https://task-flow.vercel.app`).
- `NODE_ENV`: `production`.

**For the Frontend Service:**
- `VITE_API_URL`: Your Vercel URL + backend prefix (e.g., `https://task-flow.vercel.app/_/backend/api`).

---

## 🔍 Troubleshooting

### MongoDB Connection Issues
- **IP Whitelist**: Ensure your current IP (or `0.0.0.0/0` for production) is whitelisted in MongoDB Atlas under **Network Access**.
- **Credentials**: Double-check your username and password in the `MONGODB_URI`. Special characters must be URL-encoded.
- **Database Name**: Ensure the database name in the URI is correct (the part after `/` and before `?`).

### Backend 404s
- If deploying to Vercel, remember that the backend is mounted at `/_/backend/api`. Ensure your `VITE_API_URL` reflects this.

---

## 🧪 Testing
Run backend unit tests:
```bash
cd backend
npm test
```

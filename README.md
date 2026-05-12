# TaskFlow — Personal Task Manager

A full-stack task management web application built with the **MERN stack** (MongoDB, Express, React, Node.js).

> Built as a junior full-stack developer assignment. All required features plus bonuses are implemented.

---

## Live Demo

> 🔗 _Add your deployed URL here after deploying to Render/Railway_

---

## Tech Stack

| Layer    | Technology                          |
|----------|-------------------------------------|
| Frontend | React 18 (Vite), plain CSS          |
| Backend  | Node.js, Express 4                  |
| Database | MongoDB (Mongoose ODM)              |
| Testing  | Jest + Supertest + mongodb-memory-server |
| Security | Helmet, CORS, express-validator     |
| Logging  | Morgan                              |

---

## Features

### Required
- ✅ View all tasks with title, status, priority, and creation date
- ✅ Add a task (title required, description optional)
- ✅ Mark task complete / incomplete (single click toggle)
- ✅ Delete a task with confirmation modal
- ✅ Edit a task via modal form
- ✅ Input validation — frontend error message + backend 400 response
- ✅ Persistent storage in MongoDB

### Bonus
- ✅ Filter bar — All / Pending / Completed
- ✅ Task statistics summary (Total / Pending / Completed counts)
- ✅ Live keyword search
- ✅ Priority field (Low / Medium / High) with colour-coded badges
- ✅ Due date field with overdue highlight
- ✅ Toast notifications (no browser alert/confirm)
- ✅ Backend unit tests (Jest + in-memory MongoDB)
- ✅ Security headers via Helmet
- ✅ HTTP request logging via Morgan
- ✅ Mobile responsive UI

---

## Prerequisites

Make sure the following are installed before starting:

- [Node.js](https://nodejs.org/) **v18 or higher** (`node -v` to check)
- [npm](https://www.npmjs.com/) v9+ (comes with Node.js)
- [MongoDB](https://www.mongodb.com/) — either:
  - **Local**: MongoDB Community Server running on `localhost:27017`, OR
  - **Atlas**: A free MongoDB Atlas cluster (recommended for deployment)

---

## Local Setup — Step by Step

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/task-flow.git
cd task-flow
```

---

### 2. Backend Setup

```bash
cd backend
npm install
```

Create your environment file by copying the example:

```bash
cp .env.example .env
```

Open `backend/.env` and set your MongoDB URI:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/taskflow
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

> **Using MongoDB Atlas?** Replace `MONGODB_URI` with your Atlas connection string:
> `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/taskflow`

Start the backend development server:

```bash
npm run dev
```

You should see:
```
✅  Connected to MongoDB
🚀  Server running on http://localhost:5000
```

---

### 3. Frontend Setup

Open a **new terminal window**, then:

```bash
cd frontend
npm install
```

Create your environment file:

```bash
cp .env.example .env
```

The default `.env` points to the local backend:

```env
VITE_API_URL=http://localhost:5000
```

Start the frontend development server:

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

### 4. Database Initialisation

No manual seeding is required. MongoDB will automatically create the `taskflow` database and `tasks` collection the first time you add a task through the UI.

If you want to pre-populate the database with sample tasks, run:

```bash
cd backend
node scripts/seed.js
```

> Note: The seed script is optional. The app is fully functional without it.

---

## Running Tests

```bash
cd backend
npm test
```

Tests use an **in-memory MongoDB** instance (no real database required). The test suite covers:
- `POST /api/tasks` — missing title → 400, valid task → 201
- `GET /api/tasks` — empty list → 200, populated list → 200

---

## API Reference

Base URL: `http://localhost:5000/api`

| Method | Endpoint              | Description                         | Success | Error       |
|--------|-----------------------|-------------------------------------|---------|-------------|
| GET    | `/tasks`              | Return all tasks                    | 200     | 500         |
| POST   | `/tasks`              | Create a new task                   | 201     | 400, 500    |
| PUT    | `/tasks/:id`          | Update task fields                  | 200     | 400, 404, 500 |
| PATCH  | `/tasks/:id/toggle`   | Toggle pending ↔ completed          | 200     | 404, 500    |
| DELETE | `/tasks/:id`          | Delete a task                       | 200     | 404, 500    |

**Request body for POST/PUT:**
```json
{
  "title": "string (required for POST)",
  "description": "string (optional)",
  "status": "pending | completed",
  "priority": "low | medium | high",
  "dueDate": "ISO 8601 date (optional)"
}
```

**All responses use JSON:**
```json
{ "data": { ... } }       // success with data
{ "message": "..." }      // error or delete success
```

---

## Project Structure

```
task-flow/
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   │   └── taskRoutes.js       # Route definitions + validation rules
│   │   ├── controllers/
│   │   │   └── taskController.js   # Business logic for each endpoint
│   │   ├── models/
│   │   │   └── Task.js             # Mongoose schema
│   │   └── app.js                  # Express setup (middleware, routes)
│   ├── tests/
│   │   └── task.test.js            # Jest unit tests
│   ├── server.js                   # Entry point
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── TaskForm.jsx        # Add / Edit form
│   │   │   ├── TaskList.jsx        # List container
│   │   │   ├── TaskItem.jsx        # Single task row
│   │   │   ├── FilterBar.jsx       # Status filter tabs
│   │   │   ├── StatsCard.jsx       # Summary statistics
│   │   │   ├── SearchBar.jsx       # Live search input
│   │   │   ├── Toast.jsx           # Notification toasts
│   │   │   └── ConfirmModal.jsx    # Delete confirmation
│   │   ├── services/
│   │   │   └── taskService.js      # All axios API calls
│   │   ├── App.jsx                 # Root component + state
│   │   ├── App.css                 # Global styles
│   │   └── main.jsx                # Vite entry point
│   ├── index.html
│   ├── vite.config.js
│   ├── .env.example
│   └── package.json
│
└── README.md
```

---

## Deployment

### Backend → Render

1. Push code to GitHub
2. Create a new **Web Service** on [Render](https://render.com)
3. Set **Root Directory** to `backend`
4. Set **Build Command**: `npm install`
5. Set **Start Command**: `npm start`
6. Add environment variables in Render's dashboard (copy from `.env.example`)
7. Set `MONGODB_URI` to your Atlas connection string
8. Set `CLIENT_URL` to your deployed frontend URL

### Frontend → Render (Static Site)

1. Create a new **Static Site** on Render
2. Set **Root Directory** to `frontend`
3. Set **Build Command**: `npm install && npm run build`
4. Set **Publish Directory**: `dist`
5. Add environment variable: `VITE_API_URL=https://your-backend.onrender.com`

---

## Environment Variables

### Backend (`backend/.env`)

| Variable      | Description                              | Example                          |
|---------------|------------------------------------------|----------------------------------|
| `PORT`        | Port the Express server listens on       | `5000`                           |
| `MONGODB_URI` | MongoDB connection string                | `mongodb://localhost:27017/taskflow` |
| `CLIENT_URL`  | Frontend origin for CORS                 | `http://localhost:5173`          |
| `NODE_ENV`    | Environment (`development`/`production`) | `development`                    |

### Frontend (`frontend/.env`)

| Variable       | Description                    | Example                    |
|----------------|--------------------------------|----------------------------|
| `VITE_API_URL` | Base URL of the Express backend | `http://localhost:5000`   |

---

## AI Assistance

This project was developed with assistance from an AI coding assistant (Antigravity / Claude). The overall architecture, all business logic, validation rules, component structure, and CSS design system were designed and reviewed by the developer. The AI was used to accelerate code generation — all code has been understood and is explainable.

---

## Author

**[Your Name]**  
Junior Full-Stack Developer Assignment — TaskFlow

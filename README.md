# Task-Flow — Full-Stack Task Management Application

A full-stack task management application built with the MERN stack (MongoDB, Express, React, Node.js). The project demonstrates RESTful API design, persistent data storage, input validation, and a component-based React frontend.

## Live Deployment

| Service  | URL                                          |
|----------|----------------------------------------------|
| Frontend | https://task-flow-dun-psi.vercel.app         |
| Backend  | https://task-flow-9a7v.onrender.com          |

---

## Technology Stack

| Layer      | Technology                                      |
|------------|-------------------------------------------------|
| Frontend   | React 18, Vite, Vanilla CSS                     |
| Backend    | Node.js, Express 4, express-validator           |
| Database   | MongoDB Atlas, Mongoose ODM                     |
| Security   | Helmet, CORS, dotenv                            |
| Testing    | Jest, Supertest, mongodb-memory-server          |
| Deployment | Vercel (frontend), Render (backend)             |

---

## Local Development Setup

### Prerequisites
- Node.js v16 or higher
- A MongoDB Atlas account (or a local MongoDB instance)
- Git

### Step 1 — Clone the Repository

```bash
git clone https://github.com/irrepressible007/task-flow.git
cd task-flow
```

### Step 2 — Configure and Start the Backend

Open a terminal window and run:

```bash
cd backend
npm install
cp .env.example .env
```

Edit `backend/.env` and fill in your values:

```
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/taskflow
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

Then start the development server:

```bash
npm run dev
```

The API will be available at `http://localhost:5000`.

### Step 3 — Configure and Start the Frontend

Open a **second** terminal window and run:

```bash
cd frontend
npm install
cp .env.example .env
```

Edit `frontend/.env`:

```
VITE_API_URL=http://localhost:5000/api
```

Then start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

---

## API Reference

All endpoints are prefixed with `/api`. Responses use JSON throughout.

| Method | Endpoint               | Description                          | Body                                    |
|--------|------------------------|--------------------------------------|-----------------------------------------|
| GET    | /api/tasks             | Return all tasks                     | None                                    |
| POST   | /api/tasks             | Create a new task                    | `{ title, description? }`              |
| PUT    | /api/tasks/:id         | Update an existing task              | `{ title?, description?, status? }`    |
| PATCH  | /api/tasks/:id/toggle  | Toggle status between pending/completed | None                               |
| DELETE | /api/tasks/:id         | Delete a task                        | None                                    |

---

## Database Schema

Collection: `tasks`

| Field       | Type     | Notes                              |
|-------------|----------|------------------------------------|
| _id         | ObjectId | Auto-generated primary key         |
| title       | String   | Required, max 255 characters       |
| description | String   | Optional                           |
| status      | String   | `pending` or `completed`           |
| priority    | String   | `low`, `medium`, or `high`         |
| dueDate     | Date     | Optional                           |
| createdAt   | Date     | Auto-managed by Mongoose           |
| updatedAt   | Date     | Auto-managed by Mongoose           |

---

## Running Tests

```bash
cd backend
npm test
```

Six unit tests cover task creation (POST) and retrieval (GET) using an in-memory MongoDB instance. No external database connection is required to run the tests.

---

## Production Deployment

### Backend (Render)

| Setting         | Value            |
|-----------------|------------------|
| Root Directory  | `backend`        |
| Build Command   | `npm install`    |
| Start Command   | `node server.js` |
| Runtime         | Node             |

Environment variables to set on Render:

| Key          | Value                          |
|--------------|--------------------------------|
| MONGODB_URI  | Your Atlas connection string   |
| CLIENT_URL   | Your Vercel frontend URL       |
| NODE_ENV     | `production`                   |

### Frontend (Vercel)

Environment variables to set on Vercel:

| Key           | Value                                    |
|---------------|------------------------------------------|
| VITE_API_URL  | `https://task-flow-9a7v.onrender.com/api` |

After adding variables, trigger a redeployment for changes to take effect.

---

## Troubleshooting

**MongoDB connection refused**
Ensure your IP address (or `0.0.0.0/0` for production) is whitelisted under Network Access in MongoDB Atlas.

**CORS errors in the browser**
Verify that `CLIENT_URL` on Render is set to the exact origin of your frontend, including the protocol and without a trailing slash.

**Render cold starts**
The free tier on Render spins down after 15 minutes of inactivity. The first request after idle may take up to 30 seconds to respond. This is expected behaviour for the free plan.

**Two terminal windows required**
The backend and frontend are separate processes. You must run `npm run dev` in two separate terminal windows — one inside `backend/` and one inside `frontend/`.

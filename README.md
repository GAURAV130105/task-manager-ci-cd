# 📋 TaskFlow — Task Manager CI/CD Project

A full-stack task management application built with **Node.js**, **Express**, **MongoDB**, and **React (Vite)**.  
This is **Phase 1** of a complete CI/CD learning project that will grow through Docker, AWS, and Jenkins.

---

## 🗂 Project Structure

```
task-manager-ci-cd/
├── backend/                  # Node.js + Express + MongoDB REST API
│   ├── models/
│   │   └── Task.js           # Mongoose schema
│   ├── routes/
│   │   └── taskRoutes.js     # CRUD endpoints
│   ├── .env                  # Environment variables (PORT, MONGODB_URI)
│   ├── server.js             # Express app entry point
│   └── package.json
├── frontend/                 # React (Vite) + Axios UI
│   ├── src/
│   │   ├── components/
│   │   │   ├── TaskForm.jsx  # Add task form
│   │   │   ├── TaskCard.jsx  # Individual task card
│   │   │   ├── FilterBar.jsx # Search + filter controls
│   │   │   ├── StatsBar.jsx  # Stats + progress bar
│   │   │   └── EditModal.jsx # Edit task modal
│   │   ├── App.jsx           # Main app + CRUD logic
│   │   └── App.css           # Clean light theme styles
│   └── index.html
└── README.md
```

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js 18+
- MongoDB running locally on port 27017

### 1. Start the Backend
```bash
cd backend
npm install
npm run dev         # Runs on http://localhost:5000
```

### 2. Start the Frontend
```bash
cd frontend
npm install
npm run dev         # Runs on http://localhost:5173
```

---

## 🔌 API Endpoints

| Method   | Endpoint           | Description              |
|----------|--------------------|--------------------------|
| `GET`    | `/api/tasks`       | Fetch all tasks          |
| `POST`   | `/api/tasks`       | Create a new task        |
| `PUT`    | `/api/tasks/:id`   | Update an existing task  |
| `DELETE` | `/api/tasks/:id`   | Delete a task            |

### Query Parameters (GET /api/tasks)
| Param      | Values                              |
|------------|-------------------------------------|
| `status`   | `pending`, `in-progress`, `completed` |
| `priority` | `low`, `medium`, `high`             |
| `search`   | Any string (searches title + desc)  |

---

## ✅ Features

- ➕ Add tasks with title, description, priority, status, and due date
- 📋 View all tasks in a responsive card grid
- ✏️ Edit tasks via a modal
- 🗑 Delete tasks with confirmation
- ✅ Toggle task completion with a checkbox
- 🔍 Live search + filter by status and priority
- 📊 Stats bar with task counts and progress bar
- ⚠️ Overdue task detection

---

## 🗺 Roadmap

- [x] **Phase 1** — Application (Node.js + React) ← *You are here*
- [ ] **Phase 2** — Git & GitHub workflow
- [ ] **Phase 3** — Docker + Docker Compose
- [ ] **Phase 4** — AWS EC2 + Nginx
- [ ] **Phase 5** — Jenkins CI/CD pipeline
- [ ] **Phase 6** — Prometheus + Grafana monitoring

---

## 📦 Tech Stack

| Layer     | Technology                         |
|-----------|------------------------------------|
| Frontend  | React 19, Vite, Axios, Vanilla CSS |
| Backend   | Node.js, Express.js                |
| Database  | MongoDB, Mongoose                  |
| Dev Tools | Nodemon                            |

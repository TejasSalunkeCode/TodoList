# Todoo — PERN Stack Task Manager

A full-stack To-Do List application built with **PostgreSQL, Express.js, React.js, Node.js**, featuring JWT authentication, dark mode, search/filter, pagination, and due dates.

---

## 📁 Project Structure

```
Todoo/
├── server/          # Express.js backend (MVC)
├── client/          # React.js frontend (Vite)
└── database/
    └── schema.sql   # PostgreSQL schema
```

---

## ⚙️ Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [PostgreSQL](https://www.postgresql.org/) v14+

---

## 🗄️ Database Setup

### 1. Create the database

```bash
psql -U postgres
CREATE DATABASE todoo;
\q
```

### 2. Run the schema

```bash
psql -U postgres -d todoo -f database/schema.sql
```

---

## 🔧 Backend Setup

### 1. Go to the server directory

```bash
cd server
```

### 2. Configure environment variables

Edit `server/.env` and update the values:

```env
PORT=5000
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/todoo
JWT_SECRET=change_this_to_a_strong_random_secret
JWT_EXPIRES_IN=7d
```

### 3. Install dependencies

```bash
npm install
```

### 4. Start the server

```bash
npm run dev    # development (nodemon)
npm start      # production
```

The API will be available at: **http://localhost:5000**

---

## 💻 Frontend Setup

### 1. Go to the client directory

```bash
cd client
```

### 2. Configure environment variables

Edit `client/.env`:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### 3. Install dependencies

```bash
npm install
```

### 4. Start the frontend

```bash
npm run dev
```

The app will be available at: **http://localhost:5173**

---

## 🚀 API Reference

### Authentication

| Method | Endpoint              | Description         | Auth Required |
|--------|-----------------------|---------------------|---------------|
| POST   | `/api/auth/register`  | Register new user   | No            |
| POST   | `/api/auth/login`     | Login               | No            |
| GET    | `/api/auth/me`        | Get current user    | Yes           |

### Tasks

| Method | Endpoint                | Description         | Auth Required |
|--------|-------------------------|---------------------|---------------|
| GET    | `/api/tasks`            | Get all user tasks  | Yes           |
| POST   | `/api/tasks`            | Create a task       | Yes           |
| PUT    | `/api/tasks/:id`        | Update a task       | Yes           |
| PATCH  | `/api/tasks/:id/toggle` | Toggle status       | Yes           |
| DELETE | `/api/tasks/:id`        | Delete a task       | Yes           |

#### GET /api/tasks — Query Parameters

| Param    | Type   | Default | Description                          |
|----------|--------|---------|--------------------------------------|
| `search` | string | `''`    | Search in title and description      |
| `status` | string | `all`   | Filter: `all`, `pending`, `completed`|
| `page`   | number | `1`     | Page number (10 tasks per page)      |

---

## ✨ Features

- ✅ User registration & login with JWT
- ✅ bcrypt password hashing
- ✅ Protected API routes
- ✅ Create, Read, Update, Delete tasks
- ✅ Toggle task complete/pending
- ✅ Search tasks by title/description
- ✅ Filter by status (all/pending/completed)
- ✅ Due dates with overdue indicators
- ✅ Pagination (10 tasks/page)
- ✅ Statistics dashboard (total/pending/completed)
- ✅ Dark mode with persistence
- ✅ Responsive mobile-friendly UI
- ✅ Input validation & error handling

---

## 🗃️ Database Schema

```sql
-- Users
CREATE TABLE users (
  id         SERIAL PRIMARY KEY,
  name       VARCHAR(100) NOT NULL,
  email      VARCHAR(150) UNIQUE NOT NULL,
  password   TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tasks
CREATE TABLE tasks (
  id          SERIAL PRIMARY KEY,
  user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title       VARCHAR(255) NOT NULL,
  description TEXT,
  status      VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending','completed')),
  due_date    DATE,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🛠️ Tech Stack

| Layer      | Technology                     |
|------------|--------------------------------|
| Frontend   | React 18 + Vite, React Router  |
| HTTP       | Axios                          |
| Backend    | Node.js + Express.js           |
| Database   | PostgreSQL (pg driver)         |
| Auth       | JWT + bcryptjs                 |
| Validation | express-validator              |
| Styling    | Vanilla CSS (custom design)    |

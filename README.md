# Trakkr — Job Application Tracker

A full-stack job application tracker built with **React**, **Node/Express**, and **PostgreSQL**.

Track every application, log interview stages, and visualize your job search with an analytics dashboard.

---

## Features

- **Add / Edit / Delete** job applications with company, role, status, salary, location, notes
- **Interview Stage Tracking** — log phone screens, technicals, onsites with dates, interviewers, and outcomes
- **Analytics Dashboard** — status breakdown pie chart, monthly application volume, weekday activity heatmap
- **Filter & Search** — filter by status, search by company or role
- **Detail Panel** — click any application to see full details + interview timeline side-by-side
- **Auto-status updates** — adding an interview stage automatically updates the application status

## Getting Started

### Link to Application which is deployed: https://application-tracker-hthx-d9q01r5ld-arshas-projects-c8cef163.vercel.app/

### Prerequisites

- Node.js 18+
- PostgreSQL 14+

### 1. Clone & install

```bash
git clone <your-repo-url>
cd job-tracker

# Install backend deps
cd backend && npm install

# Install frontend deps
cd ../frontend && npm install
```

### 2. Set up the database

```sql
-- In psql:
CREATE DATABASE job_tracker;
```

### 3. Configure environment variables

```bash
# backend/.env
cp backend/.env.example backend/.env
# Edit DATABASE_URL, PORT, CLIENT_URL

# frontend/.env
cp frontend/.env.example frontend/.env
```

**backend/.env:**
```
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/job_tracker
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

### 4. Run the app

```bash
# Terminal 1 — Backend
cd backend
npm run dev

# Terminal 2 — Frontend
cd frontend
npm start
```

Open [http://localhost:3000](http://localhost:3000) 

The database tables are **auto-created** on first server start.

---

## API Reference

### Applications

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/applications` | List all (supports `?status=`, `?search=`, `?sort=`, `?order=`) |
| GET | `/api/applications/analytics` | Aggregated stats |
| GET | `/api/applications/:id` | Single app with interviews |
| POST | `/api/applications` | Create |
| PUT | `/api/applications/:id` | Update |
| DELETE | `/api/applications/:id` | Delete |

### Interviews

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/applications/:id/interviews` | List interviews for an app |
| POST | `/api/applications/:id/interviews` | Create interview |
| PUT | `/api/interviews/:id` | Update interview |
| DELETE | `/api/interviews/:id` | Delete interview |




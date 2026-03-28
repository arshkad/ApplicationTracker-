# Trakkr — Job Application Tracker

A full-stack job application tracker built with **React**, **Node/Express**, and **PostgreSQL**.

Track every application, log interview stages, and visualize your job search with an analytics dashboard.

---

## ✨ Features

- **Add / Edit / Delete** job applications with company, role, status, salary, location, notes
- **Interview Stage Tracking** — log phone screens, technicals, onsites with dates, interviewers, and outcomes
- **Analytics Dashboard** — status breakdown pie chart, monthly application volume, weekday activity heatmap
- **Filter & Search** — filter by status, search by company or role
- **Detail Panel** — click any application to see full details + interview timeline side-by-side
- **Auto-status updates** — adding an interview stage automatically updates the application status

---

## 🗂 Project Structure

```
job-tracker/
├── backend/
│   ├── controllers/
│   │   ├── applications.js   # CRUD + analytics queries
│   │   └── interviews.js     # Interview CRUD
│   ├── db/
│   │   └── index.js          # PostgreSQL pool + schema init
│   ├── routes/
│   │   └── index.js          # All API routes
│   ├── server.js             # Express entry point
│   ├── .env.example
│   └── package.json
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   ├── ApplicationModal.js   # Add/edit application form
    │   │   ├── InterviewModal.js     # Add/edit interview form
    │   │   ├── Sidebar.js            # Navigation
    │   │   └── StatusBadge.js        # Badge + status helpers
    │   ├── pages/
    │   │   ├── Dashboard.js     # Stats overview + recent activity
    │   │   ├── Applications.js  # Table + detail panel
    │   │   └── Analytics.js     # Charts (Recharts)
    │   ├── utils/
    │   │   └── api.js           # Axios API service layer
    │   ├── App.js
    │   ├── index.js
    │   └── index.css            # Full design system
    └── package.json
```

---

## 🚀 Getting Started

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

Open [http://localhost:3000](http://localhost:3000) 🎉

The database tables are **auto-created** on first server start.

---

## 🌐 API Reference

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

---

## 🚢 Deployment

### Deploy Backend (Railway / Render)

1. Push to GitHub
2. Connect repo to [Railway](https://railway.app) or [Render](https://render.com)
3. Add `DATABASE_URL` environment variable (provision a PostgreSQL addon)
4. Set `NODE_ENV=production`
5. Deploy — the DB schema auto-initializes on start

### Deploy Frontend (Vercel / Netlify)

1. Set `REACT_APP_API_URL=https://your-backend-url.railway.app`
2. Update `package.json` proxy or use the env var in api.js
3. `npm run build` → deploy the `build/` folder

---

## 🛠 Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18, React Router v6, Recharts, Axios |
| Backend | Node.js, Express 4, pg (node-postgres) |
| Database | PostgreSQL 14+ |
| Fonts | DM Serif Display, DM Sans, DM Mono |
| Deployment | Railway/Render (backend) + Vercel/Netlify (frontend) |

---

## 💡 Ideas to Extend This Project

- **Auth** — add JWT authentication with bcrypt (great interview talking point)
- **Email reminders** — follow-up nudges via SendGrid/Resend
- **Resume upload** — attach PDF resumes to applications (S3/Cloudflare R2)
- **AI resume match** — score your resume against job descriptions using Claude API
- **Chrome Extension** — one-click "Add to Trakkr" from any job board
- **Export to CSV** — download your data for spreadsheet analysis

---

## 📄 License

MIT

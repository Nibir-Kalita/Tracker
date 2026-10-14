# 📋 Student Tracker — Minimal MERN Mobile App

A clean, minimalist student productivity app built with the **MERN** stack (MongoDB, Express, React, Node.js). Designed mobile-first as an installable **PWA** with 24/7 cloud readiness.

---

## ✨ Features

- **🔐 Simple Student Authentication**: Register and log in using just your name and password (with bcrypt encryption and persistent JWT tokens).
- **📅 Monthly Calendar**: Visual date picker with colored indicators showing scheduled tasks, priority levels, and completed items.
- **✅ Minimalist Task Management**:
  - Add tasks with title, optional details, date, and priority (`🔴 high`, `🟡 medium`, `🟢 low`).
  - Single-tap completion toggle with smooth strikethrough animations.
  - Hover / swipe to delete tasks.
- **📊 Progress Dashboard**:
  - Circular completion percentage ring.
  - Quick count badges (Total, Completed, Pending).
  - 7-day weekly activity bar breakdown.
  - Priority-based completion breakdown.
- **📱 Mobile PWA Ready**: Installable on Android & iOS home screens as a fullscreen mobile app.
- **☁️ 24/7 Cloud Architecture**: Production-ready for free hosting on MongoDB Atlas and Render / Railway / Docker.

---

## 🛠️ Project Structure

```
Tracker/
├── client/                 # React frontend (Vite)
│   ├── public/
│   │   ├── manifest.json   # PWA manifest
│   │   ├── icon-192.svg    # Mobile app icon
│   │   └── sw.js           # PWA service worker
│   ├── src/
│   │   ├── components/     # Auth, Calendar, TaskList, Progress, Dashboard
│   │   ├── context/        # AuthContext (state & tokens)
│   │   ├── api.js          # Axios API service with auth interceptor
│   │   ├── App.jsx
│   │   ├── index.css       # Clean dark-mode design system
│   │   └── main.jsx
│   └── vite.config.js      # Dev proxy config
├── server/                 # Express + MongoDB backend
│   ├── models/             # User and Task Mongoose schemas
│   ├── routes/             # /api/auth and /api/tasks endpoints
│   ├── middleware/         # JWT authentication middleware
│   └── server.js           # Express app & static file server
├── Dockerfile              # Production multi-stage Docker container
├── docker-compose.yml      # 1-command local or VPS stack (App + Mongo)
├── DEPLOYMENT_GUIDE.md     # Step-by-step 24/7 cloud deployment guide
└── package.json            # Root runner scripts
```

---

## 🚀 Quick Start (Local Development)

### Google sign-in setup

The current mobile target is the installable PWA. Google sign-in uses Google Identity Services in the browser; the API verifies the ID token and creates or finds the MongoDB user before returning the app's JWT.

1. In Google Cloud Console, configure the OAuth consent screen and create an OAuth client ID with application type **Web application**.
2. Add `http://localhost:5173` and your deployed HTTPS app origin to **Authorized JavaScript origins**. For phone testing, use the deployed HTTPS origin; Google sign-in is not available from an arbitrary local network HTTP address.
3. Copy `client/.env.example` to `client/.env` and set `VITE_GOOGLE_CLIENT_ID` to that client ID.
4. Copy `server/.env.example` to `server/.env` and set `GOOGLE_CLIENT_ID` to the same ID, along with your MongoDB URI and a private random `JWT_SECRET`.
5. Restart/rebuild the Vite client after changing its environment file. Keep OAuth client IDs and API secrets in deployment environment settings; never add `.env` files to git.

Google users are stored in MongoDB with their verified email and Google subject ID. Existing accounts with that email are linked on first Google sign-in; their tasks stay attached to the same user record. Password login and registration continue to work.

For a native Android/iOS app (rather than this PWA), use the platform Google Sign-In SDK and send its ID token to the same `/api/auth/google` endpoint. Configure the corresponding Android/iOS OAuth clients and update the server to accept those client IDs as valid audiences.

### 1. Start MongoDB (via Docker)
```bash
docker run -d --name student-tracker-mongo -p 27017:27017 -v mongo_data:/data/db mongo:latest
```

### 2. Start the Backend API
```bash
cd server
npm install
npm run dev
```
Server starts on `http://localhost:5000`.

### 3. Start the Frontend
```bash
cd client
npm install
npm run dev -- --host
```
Open `http://localhost:5173` in your browser.

---

## 📱 Running on Your Phone & 24/7 Cloud Setup

Check the detailed step-by-step guide in [DEPLOYMENT_GUIDE.md](file:///home/nibir/Documents/tracker/Tracker/DEPLOYMENT_GUIDE.md) to:
1. Run it on your mobile device right away over local Wi-Fi.
2. Set up **MongoDB Atlas** (Free 24/7 cloud database).
3. Host on **Render** (Free 24/7 web service).

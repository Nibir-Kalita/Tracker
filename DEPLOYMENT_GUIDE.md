# 🚀 24/7 Deployment & Mobile App Guide

This guide explains how to keep your **Student Tracker** server and database running **24/7** for free, and how to install and run it on your mobile phone.

---

## 📱 1. How to Run on Mobile as an App

The app is built as a **Progressive Web App (PWA)** with responsive mobile styling, touch optimization, and an offline service worker.

### Testing on your phone right now (Local Wi-Fi):
1. Make sure your phone and laptop are on the same Wi-Fi network.
2. Find your laptop's local IP (e.g. `192.168.1.8`).
3. On your phone's browser (Chrome or Safari), open:
   ```
   http://YOUR_LOCAL_IP:5000
   ```
   *(e.g., `http://192.168.1.8:5000`)*
4. **Install as a mobile app**:
   - **Android (Chrome)**: Tap the 3 dots menu `⋮` ➔ Tap **"Install app"** or **"Add to Home Screen"**.
   - **iPhone (Safari)**: Tap the Share button `⎋` ➔ Tap **"Add to Home Screen"**.
5. The **Tracker** icon will appear on your phone's home screen. When opened, it runs fullscreen without browser address bars just like a native app!

---

## ☁️ 2. Free 24/7 Database (MongoDB Atlas)

To have your database running 24/7 in the cloud (so your laptop doesn't need to stay on):

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) and create a free account.
2. Click **Create a Deployment** ➔ Select **M0 (Free)**.
3. Under **Security Quickstart**:
   - Create a database user (e.g. username `student`, password `YourPassword123`).
   - Under **IP Access List**, select **Allow Access from Anywhere** (`0.0.0.0/0`).
4. Click **Connect** ➔ Choose **Drivers** ➔ Copy your connection string:
   ```
   mongodb+srv://student:<password>@cluster0.xxxxx.mongodb.net/student-tracker?retryWrites=true&w=majority
   ```
5. Paste this connection string as your `MONGODB_URI` in your `.env` or deployment settings.

---

## 🌐 3. Free 24/7 Server Hosting (Render / Railway)

You can host the entire MERN app on [Render](https://render.com) (or Railway / Koyeb) completely free:

### Option A: Deploy on Render (Recommended)
1. Push your code to your GitHub repository:
   ```bash
   git add .
   git commit -m "Complete MERN student tracker"
   git push origin main
   ```
2. Go to [Render Dashboard](https://dashboard.render.com/) and click **New +** ➔ **Web Service**.
3. Connect your GitHub repository (`Tracker`).
4. Set the following settings:
   - **Environment**: `Node`
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`
5. Under **Environment Variables**, add:
   - `MONGODB_URI`: *Your MongoDB Atlas connection string from Step 2*
   - `JWT_SECRET`: *A secure random string*
   - `NODE_ENV`: `production`
6. Click **Deploy Web Service**.
7. Render will provide a free public HTTPS URL (e.g., `https://student-tracker-xxxx.onrender.com`).
8. Open that HTTPS URL on your phone and tap **Add to Home Screen** — you now have your 24/7 mobile app!

---

## 🐳 4. Alternative: 24/7 VPS Hosting with Docker

If you have a Linux VPS (DigitalOcean, AWS, Linode, etc.):
```bash
git clone https://github.com/Nibir-Kalita/Tracker.git
cd Tracker
docker compose up -d --build
```
Both MongoDB and the Node/React application will run in isolated containers with `restart: always`, keeping them running 24/7.

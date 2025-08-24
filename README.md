# CrisisLink
# 🌐 CrisisLink

**CrisisLink** is a real‑time emergency coordination platform that connects citizens, volunteers, and administrators to speed up rescue and resource delivery during crises.

> Frontend: **React + Vite + Tailwind + MUI + Leaflet + Socket.IO client**
> Backend: **Node.js + Express + MongoDB (Mongoose) + JWT + Socket.IO**

---

## ✨ Core Features

* 📡 **SOS alerts** with geolocation (GeoJSON) and live status: *Pending → In Progress → Resolved*.
* 🗺️ **Map view (Leaflet)** for locating incidents & volunteers in real time.
* 🔔 **Live updates** via **Socket.IO** (volunteer location updates, SOS accepted notifications).
* 👤 **Authentication** (register/login/logout), JWT in cookie/headers, password hashing with bcrypt.
* 🔐 **Role‑based access**: `user`, `volunteer`, `admin`.
* 📊 **Admin dashboard**: user counts, SOS stats (7‑day metrics).
* 📱 **PWA‑ready** frontend (Vite PWA plugin) with manifest and auto‑update.
* 🧰 Developer experience: ESLint, modular API wrapper, contexts for Auth/Socket.

---

## 🧱 Project Structure

```
CrisisLink/
├─ frontend/                     # React app (Vite)
│  ├─ src/
│  │  ├─ pages/
│  │  │  ├─ Home.jsx, About.jsx
│  │  │  ├─ auth/               # Login, Signup
│  │  │  └─ dashboard/
│  │  │     ├─ UserDashboard.jsx, VolunteerDashboard.jsx, AdminDashboard.jsx
│  │  │     ├─ user/            # UserHome, ...
│  │  │     ├─ volunteer/       # NearbySOS, MapView, ...
│  │  │     └─ admin/           # AdminOverview, UserManagement, SOSManagement
│  │  ├─ components/
│  │  │  ├─ Layout, Navbar, Footer, DashboardLayout, ProtectedRoute
│  │  │  ├─ emergency/          # SOSButton, LocationTracker, EmergencyContacts
│  │  │  └─ admin/              # StatsCards, SOSChart, UserManagement
│  │  ├─ context/               # AuthContext, SocketContext
│  │  ├─ lib/                   # axios instance, API wrappers, socket utils
│  │  └─ services/              # (api.js for legacy calls)
│  ├─ vite.config.js            # PWA config, chunk analyzer
│  └─ tailwind.config.js
│
└─ backend/                      # Node/Express server
   ├─ server.js                  # Express + Socket.IO entrypoint
   └─ src/
      ├─ config/db.js            # Mongo connection
      ├─ middleware/             # auth.js, roles.js
      ├─ models/                 # User.js, SOS.js (2dsphere index)
      └─ routes/                 # authRoutes.js, sosRoutes.js, adminRoutes.js, testRoutes.js
```

> **Note:** `backend/package.json` currently points to `src/server.js`. The real entry file is `backend/server.js`. Update the scripts (below) if needed.

---

## ⚙️ Prerequisites

* **Node.js ≥ 18** and **npm** (or pnpm/yarn)
* **MongoDB** (Atlas or local) – a connection string

---

## 🔐 Environment Variables

Create **two** `.env` files – **one in `/backend`** and **one in `/frontend`**.

### `/backend/.env`

```env
# Server
PORT=5000
CLIENT_ORIGIN=http://localhost:5173

# Database
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>/<db>?retryWrites=true&w=majority

# Auth
JWT_SECRET=<generate_a_long_random_secret>
JWT_EXPIRES_IN=7d
```

### `/frontend/.env`

```env
# API base
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000

# App metadata (optional)
VITE_APP_VERSION=1.0.0
VITE_APP_NAME=CrisisLink
```

> 🔒 **Security tip:** Never commit real secrets. If a `.env` was committed at any point, rotate those credentials immediately and add `.env` to `.gitignore`.

---

## 🖥️ Run Locally (Dev)

Open **two** terminals from the project root.

### 1) Backend

```bash
cd backend
npm install
# If the existing script errors with src/server.js missing, use the fixed scripts below
npm run dev      # uses nodemon
# OR
node server.js   # direct start
```

**Fix backend scripts (recommended):** edit `backend/package.json` →

```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

### 2) Frontend

```bash
cd frontend
npm install
npm run dev
```

Visit: **[http://localhost:5173](http://localhost:5173)**

---

## 🧭 API Overview

Base URL: `http://localhost:5000/api`

### Auth (`/auth`)

| Method | Path        | Body                               | Notes                                              |           |                         |
| -----: | ----------- | ---------------------------------- | -------------------------------------------------- | --------- | ----------------------- |
|   POST | `/register` | `{ name, email, password, role? }` | `role` ∈ \`user                                    | volunteer | admin`(defaults`user\`) |
|   POST | `/login`    | `{ email, password }`              | returns `{ user, token }` and sets httpOnly cookie |           |                         |
|   POST | `/logout`   | —                                  | clears cookie                                      |           |                         |
|    GET | `/me`       | — (auth)                           | current user profile                               |           |                         |

### SOS (`/sos`)

| Method | Path          | Body / Query                                      | Roles                |                |      |
| -----: | ------------- | ------------------------------------------------- | -------------------- | -------------- | ---- |
|   POST | `/`           | `{ type?, description?, location: { lat, lng } }` | user                 |                |      |
|    GET | `/my`         | —                                                 | user/volunteer/admin |                |      |
|    GET | `/nearby`     | `?lat=…&lng=…&radiusKm=…`                         | volunteer            |                |      |
|   POST | `/:id/accept` | —                                                 | volunteer            |                |      |
|  PATCH | `/:id/status` | \`{ status: "Pending"                             | "In Progress"        | "Resolved" }\` | auth |
|    GET | `/:id`        | —                                                 | auth                 |                |      |

### Admin (`/admin`)

| Method | Path                | Notes                            |
| -----: | ------------------- | -------------------------------- |
|    GET | `/stats`            | counts + last 7‑day metrics      |
|    GET | `/users`            | list users (filter/status ready) |
|    GET | `/sos`              | list all SOS                     |
|  PATCH | `/users/:id/status` | activate/deactivate user         |
| DELETE | `/users/:id`        | remove user                      |
|  PATCH | `/sos/:id/status`   | update SOS status                |

> Extra: `GET /api/test/ping` (health), `GET /api/test/protected` (JWT required).

---

## 🛰️ Socket.IO Events

**Client → Server**

* `register_user` → `{ userId, role, name }`
* `location_update` → `{ userId, coords: { lat, lng } }`
* `sos_accepted` → `{ sosId }` (volunteer accepts)

**Server → Client**

* `registration_success` → ack after auth
* `volunteer_location_updated` → `{ userId, coords }`
* `sos_accepted` / `sos_accepted_by_volunteer` → notify relevant users
* `volunteer_disconnected`

> The server authenticates socket connections with the same **JWT** (`Authorization`/cookie) and rejects missing/invalid tokens.

---

## 🗄️ Data Models (Mongoose)

**User**

```ts
{
  name: String!,
  email: String! (unique, lowercase),
  password: String! (bcrypt hashed),
  role: 'user' | 'volunteer' | 'admin',
  phone?: String,
  location?: { lat?: Number, lng?: Number },
  isActive: Boolean,
  timestamps: true
}
```

**SOS**

```ts
{
  user: ObjectId<User>!,
  type: String,               // e.g., Medical / Accident / Fire / Harassment / Other
  description?: String,
  status: 'Pending' | 'In Progress' | 'Resolved',
  volunteer?: ObjectId<User>,
  location: {                 // GeoJSON Point
    type: 'Point',
    coordinates: [lng, lat]
  },
  timestamps: true
}
// Index
sosSchema.index({ location: '2dsphere' })
```

---

## 🧩 Frontend Notes

* **Routing:** `react-router-dom@7` with protected routes.
* **State/Context:** `AuthContext` for auth lifecycle, `SocketContext` for live updates.
* **UI:** MUI components + Tailwind utility classes; charts via `chart.js` + `react-chartjs-2`.
* **Map:** `react-leaflet` (remember its CSS import is present in `MapComponent`).
* **Notifications:** `react-hot-toast` / `react-toastify`.
* **PWA:** configured in `vite.config.js` with manifest, icons and auto‑update.

---

## 🧪 Quick Test (cURL)

```bash
# Health check
curl http://localhost:5000/api/test/ping

# Register (user)
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"secret"}'

# Login (grab token from response)
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"secret"}'
```

---

## 🚀 Production Build

**Frontend**

```bash
cd frontend
npm run build       # outputs dist/
npm run preview     # optional local preview
```

Serve `dist/` behind your API server or from a static host (Netlify, Vercel, S3, …). Update `VITE_API_URL` & `VITE_SOCKET_URL` to your production URLs.

**Backend**

* Ensure environment variables are set on the server.
* Use a process manager (PM2, Docker, systemd) to run `node server.js`.
* Configure HTTPS and CORS `CLIENT_ORIGIN` correctly.

---

## 🧯 Troubleshooting

* **`src/server.js` not found:** update backend scripts to target `server.js` at root of `/backend`.
* **CORS errors:** set `CLIENT_ORIGIN` in backend `.env` to your frontend URL.
* **Socket not connecting:** confirm `VITE_SOCKET_URL` matches your backend host/port and JWT is present.
* **Leaflet markers missing:** ensure the default marker images are reachable (already handled in `MapComponent`).
* **Mongo Geo queries:** ensure the `SOS` collection has the `2dsphere` index (created by the model on startup).

---

## 🤝 Contributing

1. Fork the repo & create a feature branch: `git checkout -b feature/awesome`
2. Commit with conventional messages: `feat: add volunteer heatmap`
3. Push & open a Pull Request.

---

## 📜 License

This project is licensed under the **ISC License** (see `backend/package.json`). You may switch to MIT if preferred.

---

## 🙌 Acknowledgments

* React, Vite, Tailwind CSS, MUI
* Leaflet & React‑Leaflet
* Socket.IO
* Express, Mongoose

> *Built to help communities respond faster when it matters most.*


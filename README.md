# AI-Based Smart Complaint Management System
### MERN Stack | AIML ESE Examination Project

---

## 📁 Project Structure

```
Aifsd_Ese/
├── backend/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── complaintController.js
│   │   └── aiController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   └── Complaint.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── complaintRoutes.js
│   │   └── aiRoutes.js
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   └── server.js
└── frontend/
    ├── public/
    │   └── _redirects        ← Render SPA fix
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   └── ProtectedRoute.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── pages/
    │   │   ├── Home.jsx
    │   │   ├── Login.jsx
    │   │   ├── Signup.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── ComplaintForm.jsx
    │   │   ├── ComplaintList.jsx
    │   │   └── ComplaintDetail.jsx
    │   ├── services/
    │   │   └── api.js
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── .env.example
    ├── .gitignore
    ├── index.html
    ├── package.json
    └── vite.config.js
```

---

## ⚙️ Local Setup

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/complaint-management.git
cd complaint-management
```

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI, JWT secret, and OpenRouter API key
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env
# Edit .env: VITE_API_URL=http://localhost:5000/api
npm run dev
```

Open: http://localhost:5173

---

## 🌐 Environment Variables

### Backend `.env`
```
MONGO_URI=mongodb+srv://<user>:<pass>@cluster0.xxxxx.mongodb.net/complaint_db
JWT_SECRET=your_super_secret_jwt_key
OPENROUTER_API_KEY=sk-or-v1-your-key-here
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### Frontend `.env`
```
VITE_API_URL=http://localhost:5000/api
```

---

## 📡 API Reference

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user (protected) |

### Complaints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/complaints` | Get all complaints |
| POST | `/api/complaints` | Create complaint (protected) |
| GET | `/api/complaints/:id` | Get single complaint |
| PUT | `/api/complaints/:id` | Update complaint (protected) |
| DELETE | `/api/complaints/:id` | Delete complaint (protected) |
| GET | `/api/complaints/search?location=xyz` | Search by location |

### AI
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/ai/analyze` | Analyze complaint with AI (protected) |

---

## 🚀 Render Deployment

### Backend (Web Service)
| Setting | Value |
|---------|-------|
| Root Directory | `backend` |
| Build Command | `npm install` |
| Start Command | `node server.js` |

**Environment Variables on Render:**
- `MONGO_URI` — your Atlas connection string
- `JWT_SECRET` — random secret key
- `OPENROUTER_API_KEY` — your OpenRouter key
- `NODE_ENV` — `production`
- `FRONTEND_URL` — your frontend Render URL

### Frontend (Static Site)
| Setting | Value |
|---------|-------|
| Root Directory | `frontend` |
| Build Command | `npm install && chmod +x node_modules/.bin/vite && npm run build` |
| Publish Directory | `dist` |

**Environment Variables on Render:**
- `VITE_API_URL` — your backend Render URL + `/api`

---

## 📮 Postman Testing

### Signup
```json
POST /api/auth/signup
{
  "name": "Admin User",
  "email": "admin@test.com",
  "password": "admin123",
  "role": "admin"
}
```

### Login
```json
POST /api/auth/login
{
  "email": "admin@test.com",
  "password": "admin123"
}
```

### Create Complaint (Bearer Token required)
```json
POST /api/complaints
Authorization: Bearer <token>
{
  "name": "Rahul Sharma",
  "email": "rahul@test.com",
  "title": "Water Supply Issue",
  "description": "No water supply for 3 days in our area. We have complained multiple times.",
  "category": "Water Supply",
  "location": "Sector 15, Noida",
  "status": "Pending"
}
```

### AI Analysis (Bearer Token required)
```json
POST /api/ai/analyze
Authorization: Bearer <token>
{
  "title": "No Electricity for 2 days",
  "description": "Complete power outage since yesterday evening. Hospital nearby is affected.",
  "category": "Electricity",
  "location": "Karol Bagh, Delhi"
}
```

---

## 🤖 AI Features

The AI system (with or without API key) provides:
- **Priority Detection**: High / Medium / Low
- **Department Recommendation**: Routes to correct government department
- **Complaint Summary**: 2-3 sentence professional summary
- **Auto Response**: Ready-to-send response to citizen

**Fallback Mode** (no API key needed): Rule-based logic that works offline.

---

## 📸 Screenshots Checklist
- [ ] Home / Landing Page
- [ ] Signup Page
- [ ] Login Page
- [ ] Dashboard (with stats)
- [ ] Complaint Registration Form
- [ ] AI Analysis Result on Form
- [ ] Complaint List Page (with filters)
- [ ] Complaint Detail Page
- [ ] Status Update on Detail Page
- [ ] MongoDB Atlas — complaint_db collection
- [ ] MongoDB Atlas — users collection
- [ ] Render Backend — Web Service deployed
- [ ] Render Frontend — Static Site deployed
- [ ] Postman — Signup request/response
- [ ] Postman — Login request/response
- [ ] Postman — Create Complaint
- [ ] Postman — AI Analyze

---

## 🔧 GitHub Push Commands
```bash
git init
git add .
git commit -m "Initial commit: AI Smart Complaint Management System"
git branch -M main
git remote add origin https://github.com/your-username/your-repo.git
git push -u origin main
```

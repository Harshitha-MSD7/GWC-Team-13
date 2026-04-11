# Hobby Tracker

A full stack web application for logging and tracking creative hobby sessions — baking, crochet, and pottery.

Built as part of the **Girls Who Code** program by a team of student developers, each owning a distinct layer of the stack.

---

## Features

- Create, view, edit, and delete hobby entries
- Filter entries by hobby type
- Stats per hobby type with animated count-up
- Persistent storage — data saves across server restarts
- Cinematic dark UI with Three.js background, GSAP scroll animations, and 3D card tilt
- Fully deployed and accessible from any browser

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Python, FastAPI |
| Database | SQLite |
| Frontend | HTML, CSS, Vanilla JavaScript |
| 3D / Animation | Three.js, GSAP + ScrollTrigger |
| Deployment | Render (backend), GitHub Pages (frontend) |

---

## Live Demo

- **Website:** https://harshitha-msd7.github.io/GWC-Team-13/
- **API:** https://gwc-team-13.onrender.com
- **API Docs:** https://gwc-team-13.onrender.com/docs

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/hobbies` | Create a new hobby entry |
| `GET` | `/hobbies` | Get all entries (filter: `?hobby_type=`) |
| `GET` | `/hobbies/{id}` | Get a single entry by ID |
| `PUT` | `/hobbies/{id}` | Update an entry by ID |
| `DELETE` | `/hobbies/{id}` | Delete an entry by ID |

**Data shape:**
```json
{
  "id": 1,
  "hobby_type": "baking",
  "title": "Chocolate chip cookies",
  "date": "2026-03-25",
  "completed": true,
  "duration": 45,
  "notes": "Tried a new recipe"
}
```

Valid `hobby_type` values: `baking`, `crochet`, `pottery`

---

## Run Locally

**1. Clone the repo**
```bash
git clone https://github.com/Harshitha-MSD7/GWC-Team-13.git
cd GWC-Team-13
```

**2. Install dependencies**
```bash
pip install fastapi uvicorn
```

**3. Start the backend**
```bash
uvicorn main:app --reload
```

**4. Open the frontend**

Open `frontend/index.html` directly in your browser, or visit the live site above.

**5. API docs**
```
http://127.0.0.1:8000/docs
```

---

## Team

| Name | Role |
|---|---|
| Harshitha Sathees Kumar | Backend Developer |
| Dafini | API Integration |
| Sammi & Laken | Frontend Developers |
| Madeleine Haddad | Mentor |

---

## About

Built as part of the **Girls Who Code** program — an initiative dedicated to closing the gender gap in tech. Each team member owned a specific layer of the application, simulating a real-world development workflow.

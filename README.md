# 🎨 Hobby Tracker

A full stack web application built to help users log and track their creative hobby sessions — including baking, crochet, and pottery.

Built as part of the **Girls Who Code** program by a team of four student developers, each owning a distinct layer of the stack.

---

## ✨ Features

- Create, view, edit, and delete hobby entries
- Filter entries by hobby type (Baking, Crochet, Pottery)
- Track total time spent and sessions completed
- Persistent storage — data saves across server restarts
- Clean, responsive UI with a soft claymorphism design
- Fully deployed and accessible from any browser

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Backend | Python, FastAPI |
| Database | SQLite |
| Frontend | HTML, CSS, JavaScript |
| Deployment | Render (backend), Netlify (frontend) |

---

## 🚀 Live Demo

- **Website:** https://curious-beignet-bd287f.netlify.app
- **API Docs:** https://gwc-team-13.onrender.com/docs

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/hobbies` | Create a new hobby entry |
| `GET` | `/hobbies` | Get all entries (filter: `?hobby_type=`) |
| `GET` | `/hobbies/{id}` | Get a single entry by ID |
| `PUT` | `/hobbies/{id}` | Update an entry by ID |
| `DELETE` | `/hobbies/{id}` | Delete an entry by ID |

---

## 💻 Run Locally

**1. Clone the repo**
```bash
git clone https://github.com/Harshitha-MSD7/GWC-Team-13.git
cd GWC-Team-13
```

**2. Install dependencies**
```bash
pip install fastapi uvicorn
```

**3. Start the server**
```bash
uvicorn main:app --reload
```

**4. Open the docs**
```
http://127.0.0.1:8000/docs
```

---

## 👩‍💻 Team

| Name | Role |
|---|---|
| Harshitha Sathees Kumar | Backend Developer |
| Dafini | API Integration |
| Sammi & Laken | Frontend Developers |

---

## 🌱 About

This project was built as part of the **Girls Who Code** program — an initiative dedicated to closing the gender gap in tech. Each team member took ownership of a specific layer of the application, simulating a real-world development workflow with clear separation of responsibilities.

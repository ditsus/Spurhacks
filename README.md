# Housely 🏠  
*A community-powered platform for finding (and keeping) the perfect home.*

[Live site](https://www.housesnear.us)

---

## SpurHacks 2025

---

## Why we built it
Rising rents, bidding wars, and misleading listings make the house-hunt stressful for millions of students.  
Our own searches often ended in frustration: stale data, duplicate posts, scams. We wanted a single map where *real* people could flag what’s available (and what isn’t) in real time.

---

## How it works

1. **Post** — People sublet/list their property, add photos and details (price, beds, contact). 
2. **Find** — Students look for housing and is able to:
   * pair with other similar students
2. **Rank** — Our algorithm weighs:
   * transit
   * quietness
   * and most importantly: your preferences!

---

## The goal
Empower communities to share honest, timely housing info—so moving house feels exciting, not exhausting.

---

## Tech we used

| Layer             | Stack / Service               |
|-------------------|--------------------------------|
| **Frontend**      | React 18 + Vite (SWC), TailwindCSS |
| **Backend API**   | Node 18, Express 5 |
| **Database**      | MongoDB Atlas |
| **APIs**          | Google Maps, Gemini, Zillow |
| **Deployment**    | Vercel |
| **CI**            | GitHub Actions |

---

## 🛠️ Running locally

> **Prereqs**  
> Node 18+ • pnpm (or npm / yarn)

```bash
git clone https://github.com/victorhlsu/Spurhacks.git
cd Spurhacks

# env vars
cp .env.example .env      # fill in MONGO_URI etc.

pnpm install              # or npm i
pnpm dev                  # Vite on :8080, API on :3000
```

Navigate to http://localhost:8080
The Vite dev server proxies /api/** to http://localhost:3000.

---
## ```.env``` keys
```txt
MongoDB (API-key password)
MONGO_URL=YOUR_KEY
GEMINI_KEY=YOUR_KEY

PORT=5000          # Express in dev
VITE_PORT=8080     # Front-end dev port
```

---
## Deployment

```bash
pnpm build          # vite → dist/
vercel              # interactive deploy
```

<div align="center">

  <h1>🚀 Shortly</h1>
  
  <p>
    <strong>High-Performance URL Shortener & Analytics Platform</strong>
  </p>

  <p>
    <a href="https://your-frontend-link.vercel.app">View Demo</a> •
    <a href="#-getting-started">Getting Started</a> •
    <a href="#-architecture">Architecture</a>
  </p>

  <p>
    <img src="https://img.shields.io/badge/Frontend-React%20%2B%20Vite-blue?style=flat-square&logo=react" alt="React" />
    <img src="https://img.shields.io/badge/Backend-Node.js%20%2B%20Fastify-green?style=flat-square&logo=node.js" alt="Fastify" />
    <img src="https://img.shields.io/badge/Database-PostgreSQL-336791?style=flat-square&logo=postgresql" alt="PostgreSQL" />
    <img src="https://img.shields.io/badge/Cache-Redis-DC382D?style=flat-square&logo=redis" alt="Redis" />
    <img src="https://img.shields.io/badge/ORM-Prisma-2D3748?style=flat-square&logo=prisma" alt="Prisma" />
    <img src="https://img.shields.io/badge/Status-Production-success?style=flat-square" alt="Status" />
  </p>
</div>

---

## 📖 Overview

**Shortly** is a full-stack, scalable URL shortening service designed with performance and analytics in mind. Unlike basic shorteners, Shortly decouples the critical path (redirection) from data processing (analytics), ensuring sub-millisecond redirect latency while still capturing rich data like geolocation, device type, and browser stats.

Built to handle high concurrency, it leverages **Redis** for caching hot links and **BullMQ** for asynchronous background processing.

## ✨ Key Features

- **⚡ Blazing Fast Redirects:** Uses Redis caching to serve links instantly, bypassing the database for frequent requests.
- **📊 Deep Analytics:** Visual dashboards showing Clicks over Time, Top Browsers, Device Breakdown, and Geolocation.
- **🛡️ Asynchronous Processing:** Analytics data is processed via a background worker queue, ensuring user experience is never blocked by database writes.
- **📱 Responsive Design:** A "Dynamic Island" style UI that adapts fluidly from mobile to desktop.
- **🔍 Smart Search:** Lookup stats by pasting the full URL or just the short code.

---

## 🏗️ Architecture

The system follows a **Controller-Service-Repository** pattern to ensure separation of concerns and testability.



### Data Flow
1.  **Write Path (Shortening):** Client → API → Validator → DB (Create) → Redis (Cache) → Client.
2.  **Read Path (Redirect):** Client → API → **Redis Cache (Hit?)** → Redirect.
    *(If Miss: DB → Cache → Redirect)*.
3.  **Analytics Path (Async):** After Redirect → Push Job to **Redis Queue** → **Worker** picks job → Resolves GeoIP/UA → Bulk Write to DB.

---

## 🛠️ Tech Stack

### **Frontend**
| Tech | Purpose |
| :--- | :--- |
| **React + Vite** | High-performance SPA with instant HMR. |
| **Tailwind CSS** | Utility-first styling for the "Glassmorphism" UI. |
| **Recharts** | Data visualization for analytics dashboards. |
| **Lucide React** | Consistent, lightweight icon set. |

### **Backend**
| Tech | Purpose |
| :--- | :--- |
| **Node.js (Fastify)** | Selected over Express for 20% lower overhead and schema-based serialization. |
| **PostgreSQL** | Relational integrity for linking URLs to millions of Analytics logs. |
| **Prisma** | Type-safe ORM for database interactions. |
| **Redis** | Caching layer and Message Broker for queues. |
| **BullMQ** | Robust background job processing for analytics. |
| **Zod** | Runtime schema validation for API inputs. |

---

## 🚀 Getting Started

Follow these steps to set up the project locally.

### Prerequisites
- Node.js (v18+)
- PostgreSQL (Local or Docker)
- Redis (Local or Docker)

### 1. Clone the Repository
```bash
git clone https://github.com/hrithikksham/shorttheURL.git
cd shorttheURL

```

### 2. Backend Setup

```bash
cd backend
npm install

# Create .env file
cp .env.example .env

# Run Database Migrations
npx prisma migrate dev --name init

# Start Development Server
npm run dev

```

**Required `.env` variables:**

```env
DATABASE_URL="postgresql://user:password@localhost:5432/shortly"
REDIS_URL="redis://localhost:6379"
PORT=3000
BASE_URL="http://localhost:3000"

```

### 3. Frontend Setup

```bash
cd ../client
npm install

# Start Frontend
npm run dev

```

**Required `.env` variables (`client/.env`):**

```env
VITE_API_URL="http://localhost:3000"

```

---

## 🧠 Engineering Decisions

### **Why Fastify over Express?**

Fastify provides significantly better throughput (requests/sec) due to its optimized `fast-json-stringify` serialization. For a redirect service where latency is the primary KPI, every millisecond of overhead counts.

### **Why Asynchronous Analytics?**

Writing to the database is an I/O heavy operation. If we wrote to the `Analytics` table *during* the redirect request, the user would wait an extra 50-200ms (depending on DB load). By offloading this to a Redis Queue, the redirect API responds immediately, and the "heavy lifting" (GeoIP lookup, parsing User Agent) happens in the background.

---

## 📈 Future Roadmap

* [ ] **Rate Limiting:** Implement Token Bucket algorithm in Redis to prevent abuse.
* [ ] **User Accounts:** Auth0 integration for user-specific dashboards.
* [ ] **Custom Expiry:** Allow users to set TTL for temporary links.
* [ ] **QR Codes:** Auto-generate QR codes for every short link.

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

---

<div align="center">
<p>
Built with ❤️ by <a href="https://www.google.com/search?q=https://github.com/hrithikksham">Hrithik</a>
</p>
</div>

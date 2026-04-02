<div align="center">

# 📊 Zorvyn Finance Management System

**A secure, robust backend for modern financial tracking and dashboard analytics.**

[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white)](https://jwt.io/)

</div>

<br />

Welcome to the backend repository of the **Zorvyn Finance Management System (FMS)**. This API serves as the core engine for processing user transactions, tracking income and expenses, and generating real-time analytics. 

It is designed to showcase an enterprise-ready architecture featuring **Role-Based Access Control (RBAC)**, **Dual Authentication**, and **Native MongoDB Aggregations**.

---

## 🎯 Key Features at a Glance

| Feature | Description |
| ------- | ----------- |
| 🛡️ **Dual Authentication** | Supports both **JWT tokens** and **Secure Session Cookies** for maximum cross-platform flexibility. |
| 👥 **Role-Based Access (RBAC)** | Granular permissions restricting endpoints based on specific roles (`Admin`, `Analyst`, `Viewer`). |
| 💸 **Transaction Engine** | Full CRUD capabilities with built-in validation and **soft-deletion** to maintain audit trails. |
| 📈 **Real-time Analytics** | High-performance MongoDB aggregation pipelines calculate dynamic net balances, category breakdowns, and monthly trends. |

---

## 🚀 Getting Started

Provide recruiters and reviewers with a seamless local testing experience.

### 1. Prerequisites
- **Node.js** (v16+)
- **MongoDB** (Local or Atlas URI)

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/your-username/zorvyn-backend.git
cd zorvyn-backend

# Install dependencies
npm install
```

### 3. Environment Setup
Create a `.env` file in the root directory:
```env
PORT=3000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/zorvyn_fms
SESSION_SECRET=your_super_secret_session_key
JWT_SECRET=your_super_secret_jwt_key
```

### 4. Run the API
```bash
npm run dev
# Server will start on http://localhost:3000
```

---

## 📡 API Architecture & Endpoints

All routes are prefixed with `/fms/api/v1` and use a clean **Service-Controller** architecture.

<details>
<summary><b>🔐 Authentication Routes</b></summary>

- `POST /auth/register` - Create user 
- `POST /auth/login` - Authenticate & establish session/token
- `POST /auth/logout` - Destroy session and clear cookies

</details>

<details>
<summary><b>💵 Transaction Routes</b></summary>

*Note: Modifying records requires the `Admin` role.*
- `POST /transactions` - Create transaction
- `GET /transactions` - Fetch all (Supports pagination & filtering)
- `GET /transactions/:id` - Fetch singular transaction
- `PATCH /transactions/:id` - Update transaction
- `DELETE /transactions/:id` - Soft delete

</details>

<details>
<summary><b>📊 Dashboard & Analytics Routes</b></summary>

*Note: High-level analytics require `Admin` or `Analyst` roles.*
- `GET /dashboard/summary` - Net balance, total income/expense
- `GET /dashboard/recent` - Top 5 most recent transactions
- `GET /dashboard/by-category` - Spending breakdown per category
- `GET /dashboard/trends` - Monthly income vs expense groupings

</details>

---

## 🔍 Why This Code Stand Out (For Reviewers)

If you are an engineer or recruiter reviewing this codebase, please note the following architectural decisions:

1. **Decoupled Architecture:** Business logic is entirely separated into a `services` layer, keeping the `controllers` clean, focused strictly on HTTP transport, and highly testable.
2. **Data Preservation (Soft Deletes):** Standard deletions permanently destroy financial records. By utilizing `Mongoose pre-hooks`, deleted transactions are safely hidden from the client view but preserved in the database for auditing and analytical accuracy.
3. **Optimized Aggregations:** Instead of heavy in-memory JavaScript map/reduce operations, complex dashboard math (like monthly trend plotting) is offloaded natively to MongoDB (`$match`, `$group`, `$sum`), demonstrating scalability and speed.

---

## 🔭 Future Implementations

- [ ] **Rate Limiting:** Integrate `express-rate-limit` against brute-force attacks.
- [ ] **Data Exporting:** CSV / PDF automated generation for financial reports.
- [ ] **Automated Testing:** Implement Integration testing via Jest & Supertest.
- [ ] **Caching Layer:** Redis integration for frequent dashboard analytics requests.

<div align="center">
  <i>Built with ❤️ for modern finance management.</i>
</div>

# 🏘️ Real Estate Property Management App (MERN + Microservices)

## 📌 Project Description

This project aims to build a full-featured **Real Estate Property Management System** using the **MERN stack (MongoDB, Express.js, React, Node.js)** with a **microservices architecture**. The application is optimized for **low-latency request-response cycles**, **responsive UI** across devices (Web, Tablet, App), and **RESTful APIs**. 

The system will handle tenants, property managers/agents, and property owners. It includes modules for user onboarding, unit allocation, complaint tracking, post-dated cheque management, and future payment integration.

---

## 🚀 Core Features & Problem Scope

1. **User Authentication**: Login via email or social platforms.
2. **Property Dashboard**:
   - View available and upcoming vacant units.
   - View allocated properties with tenant info.
   - Upload payment status.
3. **Resource Dashboard**:
   - View and track tenant complaints.
4. **Tenant Allocation**:
   - Send verification emails to tenants.
   - Upload/view rental contracts.
5. **Post-Dated Cheque Management**:
   - Auto-generate sequential cheque numbers.
   - Manual corrections by agent/owner.
6. **Complaint Handling**:
   - Raise and track complaints.
   - Notification system for tenants and agents.
   - Maintain resource inventory for resolving complaints.
7. **Company Unit Management**:
   - Manage units on behalf of companies.
   - Let company admins allocate employees.
8. **Security**:
   - Secure password and account management.
9. **Payments (Future)**:
   - Ad-hoc and recurring payments via card (planned).

---

## 🧩 Identified Microservices

1. **Auth Service** – Handles login, signup, OAuth, password security.
2. **User Service** – Manages tenant, agent, owner, and company profiles.
3. **Property Service** – Inventory of units, availability, and allocation.
4. **Contract Service** – Upload and manage contract files and durations.
5. **Payment Service** – Upload check info, auto-generate cheque numbers.
6. **Complaint Service** – Raise, update, notify, and close complaints.
7. **Notification Service** – Email/SMS/push notifications.
8. **Company Service** – Company-admin unit management.

---

## 🧱 Database & Models

- **Database**: [MongoDB Atlas](https://www.mongodb.com/atlas) (cloud-hosted, scalable NoSQL DB).
- **Key Models**:
  - `User` (tenant/agent/owner/company)
  - `Property`
  - `Contract`
  - `Complaint`
  - `Cheque`
  - `Notification`
  - `CompanyUnit`

---

## 🎨 Frontend (React)

- Built using **React with optimized component structure**.
- Responsive design with fast loading times.
- Lazy loading and code splitting to improve performance.
- Dashboard screens for:
  - Agents
  - Tenants
  - Company Admins

---

## 🧪 Development Setup

### ✅ 1. Prerequisites

- **Install [Docker Desktop](https://www.docker.com/products/docker-desktop/)**
  - Available for Windows, macOS, and Linux
  - After installation, ensure Docker Desktop is **running** and `docker compose` is available

You can verify installation by running:

```bash
docker --version
docker compose version

```bash
# Clone this repository
git clone https://github.com/haribabugitwork/RealEstate.git

# Navigate to the project directory
cd RealEstate

# Build and run the microservices
docker compose up --build -d


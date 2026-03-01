RZV Backend API

A production-ready backend system built using Node.js, Express, MongoDB, and Redis, implementing authentication, authorization, caching, financial transactions, audit logging, referral & reward systems, automated testing, CI/CD, Dockerization, and structured logging.

🔴 Live API: (/api/health)
https://rzv-backend.onrender.com/api/health

⸻

🚀 Core Features

🔐 Authentication & Authorization
	•	JWT Authentication (Access + Refresh)
	•	Refresh Token Rotation
	•	Token Revocation
	•	Email Verification Flow
	•	Password Reset Flow
	•	Role-Based Access Control (RBAC)
	•	Soft Delete User Lifecycle
	•	Real-time Account Status Validation (DB-verified on every request)
	•	Separate Login Endpoints (Web vs Mobile security flows)
	•	CORS Hardened for secure cross-origin access

⸻

⚡ Performance & Caching
	•	Redis Integration
	•	Cache-Aside Pattern
	•	TTL-based caching
	•	Event-Driven Cache Invalidation
	•	Redis Retry Connection Strategy
	•	Redis-backed Rate Limiting
	•	Graceful Degradation (App runs even if Redis fails)

⸻

🔄 Data Consistency
	•	MongoDB Transactions
	•	Atomic Wallet Updates
	•	ACID compliance for financial flows
	•	Event-based cache consistency

⸻

📊 Business Systems
	•	Referral System
	•	Reward System
	•	Wallet & Transaction Management
	•	Admin Dashboard APIs
	•	Audit Logging System

⸻

🧱 Architecture

Layered Architecture:

Controller → Service → Repository → Database

Patterns Used:
	•	Modular Monolith Architecture
	•	Middleware Pattern
	•	Repository Pattern
	•	Adapter Pattern (Cache abstraction)
	•	Cache-Aside Strategy
	•	Event-Driven Design
	•	Centralized Error Handling
	•	Soft Delete Pattern
	•	Structured Logging (Pino)

⸻

🧩 Resilience & Production Safety

MongoDB Runtime Monitoring
	•	Connection error listener
	•	Disconnection listener
	•	Reconnection listener
	•	Fail-fast startup strategy

Process Crash Protection

Handles:
	•	Unhandled Promise Rejections
	•	Uncaught Exceptions

Prevents silent production crashes.

Redis Resilience
	•	Automatic retry strategy
	•	Graceful fallback if Redis unavailable
	•	Business logic never depends on cache

⸻

📁 Project Structure

(Keep your existing structure section here — unchanged)

⸻

🧪 Testing Strategy

1️⃣ Integration Testing (Jest + Supertest)

Located in:

tests/

Covers:
	•	Auth Register
	•	Auth Login
	•	Email Verification
	•	Token validation flows
	•	CORS protected flows

Uses:
	•	Dedicated MongoDB Test Database
	•	Environment-based config (.env.test locally)
	•	Real MongoDB Atlas DB in CI

Run locally:

npm test

2️⃣ Postman Collections Included

Located in:

/postman

Includes:
	•	Full API Collection
	•	Environment File

Features:
	•	Automated token handling
	•	Smoke test suite
	•	Admin tests
	•	Audit tests
	•	Reward tests
	•	Destructive flows separated

⸻

🐳 Docker Support

Application is fully Dockerized.

Uses:
	•	Node 20 base image
	•	Production dependency install (npm ci --omit=dev)
	•	Optimized layer caching
	•	EXPOSE 3000

Build image:

docker build -t rzv-backend .

Run container:

docker run -p 3000:3000 --env-file .env rzv-backend

Enables cross-machine reproducibility.

⸻

🔄 CI Pipeline (GitHub Actions)

CI runs on:
	•	Push to main
	•	Pull Requests to main

Pipeline:
	•	Uses Node 20
	•	Installs dependencies via npm ci
	•	Injects MongoDB test URI via GitHub Secrets
	•	Runs Jest integration tests
	•	Fails build on any test failure

CI must pass before production deployment (Render supports deploy after CI).

⸻

🚀 Deployment

Deployed on:

Render (Docker-based deployment)

Live URL:

https://rzv-backend.onrender.com

Features:
	•	Auto-deploy on commit
	•	Production environment variables configured securely
	•	NODE_ENV=production
	•	Health endpoint monitoring

⸻

📘 Swagger Documentation

swagger.yaml

After running locally:

http://localhost:3000/api-docs

⸻

⚙️ Local Setup

1️⃣ Clone repository

git clone <repo-url>
cd rzv_backend

2️⃣ Install dependencies

npm install

3️⃣ Create .env file

PORT=3000
MONGO_URI=your_mongo_uri
MONGO_TEST_URI=your_test_uri
JWT_SECRET=your_secret
JWT_EXPIRES_IN=15m
REDIS_URL=redis://localhost:6379

4️⃣ Start server

npm run dev

🔐 Security Design

Password Security
	•	bcrypt hashing
	•	Pre-save model hooks
	•	Plain passwords never stored

JWT Strategy
	•	Short-lived Access Tokens
	•	Refresh Token Rotation
	•	Token Revocation
	•	DB validation on every protected request

Account Protection
	•	Soft delete via isActive flag
	•	JWT rejected if user inactive

Rate Limiting
	•	Redis-backed
	•	Protects against brute force
	•	Gracefully degrades if Redis down

⸻

🧠 Engineering Highlights
	•	Production-grade structured logging
	•	Crash-safe startup handling
	•	Retry-aware Redis design
	•	Mongo runtime monitoring
	•	Dockerized reproducible builds
	•	CI-backed deployment flow
	•	Modular monolith architecture
	•	Financial transaction safety via Mongo transactions

⸻

🔮 Future Enhancements
	•	Horizontal scaling via load balancer
	•	Log aggregation (ELK / Grafana)
	•	Metrics monitoring (Prometheus)
	•	Microservices extraction
	•	Kubernetes deployment

⸻

🎯 Summary

This backend is engineered with:
	•	Production resilience
	•	Fault tolerance
	•	Security-first design
	•	Clean architecture
	•	CI/CD automation
	•	Containerized deployment

Built as a portfolio-grade system demonstrating real-world backend engineering principles.
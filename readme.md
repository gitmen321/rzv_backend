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
	•	Web Login:
		-	Returns Access Token only
		-	Refresh token stored in HTTP-only secure cookie
		-	Refresh token rotation enabled
	•	Mobile/App Login:
		-	Returns both Access Token and Refresh Token
		-	Designed for mobile clients without cookie support
	•	Refresh Token Flow:
		-	If refresh token comes from cookies → rotate token & return new access token only
		-	If refresh token comes from request body → return new access + refresh token
		-	Token reuse detection implemented
		-	Server-side validation on every refresh
	•	Access Token expiry: 15 minutes (configurable)
	•	Refresh Token expiry: 7 days (configurable)
	•	Refresh tokens stored hashed in database
	•	Token reuse detection for compromised token protection
	•	CORS Hardened for secure cross-origin access

⸻

📨 Email & Demo Mode Handling
	•	Nodemailer-based email system implemented
	•	Email verification & password reset flows architected
	•	Email sending decoupled from MongoDB transactions
	•	Email sending wrapped in isolated try/catch (non-blocking)
	•	Production Demo Mode:
		-	Email sending temporarily disabled in live deployment
		-	Reason: Render free-tier network restrictions prevent reliable external SMTP connections
		-	Core logic remains fully implemented
		-	Raw verification/reset tokens returned in demo mode for frontend testing
	•	Architecture designed to easily switch to SendGrid / Resend / SES for production-grade SMTP

⸻

⚡ Performance & Caching
	•	Redis Integration
	•	Redis used for:
		-	Rate limiting (IP-based)
		-	Cache-Aside data caching
		-	Token blacklist support
	•	Cache-Aside Pattern
	•	TTL enforced for cache consistency
	•	Event-Driven Cache Invalidation
	•	Redis Retry Connection Strategy
	•	Redis-backed Rate Limiting
	•	Graceful Degradation (App runs even if Redis fails)
	•	Stateless backend design (horizontal scaling ready)

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
	•	Non-blocking Email Strategy:
		-	Email sending executed after DB commit
		-	Failure does NOT rollback user creation
		-	Prevents long HTTP response blocking
		-	Production-safe design
	•	Environment-based configuration (.env.development, .env.test, .env.production)
	•	Input validation middleware layer before controllers
	•	Swagger OpenAPI documentation manually defined via swagger.yaml
	•	Structured logs in JSON format (Pino) for production aggregation
	•	Stateless service design (scales behind load balancer)

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
	•	Application designed as stateless container
	•	Compatible with horizontal scaling (multiple instances)
	•	Health endpoint supports liveness checks

⚠️ Demo Environment Notes (Render Free Tier)
	•	Free instance may spin down on inactivity
	•	Initial requests may take 30–50 seconds
	•	SMTP email sending disabled in live demo due to cloud network restrictions
	•	All email flows fully functional in local environment
	•	Demo mode exposes tokens in response for testing frontend integration

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
	•	HTTP-only refresh token cookies (web flow)
	•	Token rotation + reuse detection
	•	DB-backed token validation
	•	Account status validated on every protected request
	•	Centralized production-safe error handler
	•	Environment-based error exposure

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
	•	Message Queue integration (BullMQ / Kafka) for background jobs
	•	Dedicated Email Service provider (SendGrid / SES)
	•	AI/RAG microservice integration (FastAPI-based service)
	•	API Gateway layer for microservice transition
	•	Distributed rate limiting for scaled instances

⸻

🧪 Demo Mode Behavior (For Recruiters)

In live demo:
	•	Registration returns verification token (instead of sending email)
	•	Forgot password returns reset token (instead of email link)
	•	Email verification endpoint still validates token logic
	•	Password reset flow fully functional
	•	Auth token rotation fully operational

This ensures:
	•	Backend logic can be tested without SMTP dependency
	•	Business logic remains production-grade
	•	No core security compromise

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
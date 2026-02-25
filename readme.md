RZV Backend API

A production-oriented backend system built using Node.js, Express, MongoDB, and Redis, implementing authentication, authorization, caching, transactions, audit logging, referral and reward systems, and automated testing.

⸻

🚀 Core Features

🔐 Authentication & Authorization
	•	JWT Authentication
	•	Refresh Token Rotation
	•	Token Revocation
	•	Email Verification Flow
	•	Password Reset Flow
	•	Role-Based Access Control (RBAC)
	•	Soft Delete User Lifecycle
	•	Real-time Account Status Validation (DB-verified on every request)

⸻

⚡ Performance & Caching
	•	Redis Integration
	•	Cache-Aside Pattern
	•	TTL-based caching strategy
	•	Event-Driven Cache Invalidation
	•	Graceful Degradation (App runs even if Redis is down)
	•	Redis-backed Rate Limiting

⸻

🔄 Data Consistency
	•	MongoDB Transactions
	•	Atomic Wallet Updates
	•	ACID Compliance for financial operations
	•	Event-based cache consistency

⸻

📊 Business Systems
	•	Referral System
	•	Reward System
	•	Admin Dashboard APIs
	•	Audit Logging System
	•	Wallet & Transaction Management

⸻

🧱 Architecture

Layered Architecture:

Controller → Service → Repository → Database

Patterns used:
	•	Modular Monolith Architecture
	•	Middleware Pattern
	•	Adapter Pattern (Cache abstraction)
	•	Cache-Aside Strategy
	•	Event-Driven Design (Cache Invalidation)
	•	Centralized Error Handling
	•	Soft Delete Pattern
	•	Repository Pattern

📁 Project Structure

src/
 ├── admin/
 │     ├── admin.controller.js
 │     ├── admin.routes.js
 │     └── admin.services.js
 │
 ├── audit/
 │     ├── audit.controller.js
 │     ├── audit.repository.js
 │     ├── audit.routes.js
 │     └── audit.services.js
 │
 ├── auth/
 │     ├── auth.controller.js
 │     ├── auth.routes.js
 │     ├── auth.services.js
 │     └── eventBus.js
 │
 ├── reward/
 │     ├── reward.controller.js
 │     ├── reward.routes.js
 │     └── reward.services.js
 │
 ├── users/
 │     ├── user.controller.js
 │     ├── user.routes.js
 │     └── user.services.js
 │
 ├── repositories/
 │     ├── authRepository.js
 │     ├── refreshTokenRepository.js
 │     ├── tokenTransactionRepository.js
 │     ├── userRepository.js
 │     └── walletRepository.js
 │
 ├── models/
 │     ├── user.js
 │     ├── audit.js
 │     ├── refreshToken.js
 │     ├── tokenTransaction.js
 │     └── wallet.js
 │
 ├── infrastructure/
 │     └── cache/
 │           ├── cache.listener.js
 │           └── cache.service.js
 │
 ├── middlewares/
 │     ├── auth.middleware.js
 │     ├── role.middleware.js
 │     ├── errorHandler.js
 │     ├── logger.js
 │     └── rateLimiter.js
 │
 ├── config/
 │     ├── db.js
 │     ├── redis.js
 │     └── jest.config.js
 │
 ├── constants/
 │     ├── auth.constants.js
 │     └── reward.constants.js
 │
 ├── utils/
 │     ├── cacheInvalidation.js
 │     ├── generateReferral.js
 │     ├── sendEmail.js
 │     └── token.js
 │
 ├── scripts/
 │     └── createAdmin.js
 │
 └── app.js

server.js
swagger.yaml
postman/
tests/

🧪 Testing

1️⃣ Jest + Supertest (Integration Tests)

Located in:

tests/

Covers:
	•	Auth Register
	•	Auth Login
	•	Email Verification

Run tests:

npm test

2️⃣ Postman Smoke Tests

Collection included in:

/postman

Folders include:
	•	Auth Smoke Tests
	•	User Smoke Tests
	•	Admin Smoke Tests
	•	Audit Smoke Tests
	•	Reward Smoke Tests
	•	Secondary Flows (manual/destructive APIs)

Smoke Tests are:
	•	Idempotent
	•	Safe to run multiple times
	•	Fully automated
	•	No manual token copy required

Secondary Flows contain:
	•	State-mutating endpoints
	•	Destructive APIs
	•	Not part of automated smoke runs

⸻

📘 Swagger Documentation

swagger.yaml

After starting server:

Visit:
http://localhost:3000/api-docs

Provides interactive API documentation.

⸻

⚙️ Setup Instructions (Manual Mode)

1️⃣ Clone Repository

git clone <repo-url>
cd rzv_backend

2️⃣ Install Dependencies

npm install

3️⃣ Create Environment File

Create .env in root:

PORT=3000
MONGO_URI=your_mongo_uri
MONGO_TEST_URI=your_test_mongo_uri
JWT_SECRET=your_secret
JWT_REFRESH_SECRET=your_refresh_secret
JWT_EXPIRES_IN=15m
REDIS_URL=redis://localhost:6379
Etc

4️⃣ Start Redis (Optional)

If Redis is running:
	•	Caching enabled
	•	Rate limiting enabled

If Redis is down:
	•	App continues running
	•	No caching
	•	No rate limiting

This ensures fault tolerance.

⸻

5️⃣ Create Admin User (Seed Script)

node src/scripts/createAdmin.js

node src/scripts/createAdmin.js

This creates an admin user required for Admin Smoke Tests.

6️⃣ Start Server

npm run dev

🛡 🔐 Security Implementation Details

Password Security
	•	Passwords are hashed using bcrypt before storage
	•	Hashing occurs at model level (pre-save hook)
	•	Plain passwords are never stored in database

⸻

JWT Strategy
	•	Short-lived Access Tokens
	•	Refresh Token Rotation
	•	Refresh Tokens stored in database
	•	Token Revocation on logout
	•	DB verification on every protected request

Access tokens are used only for identity.
Authorization and account status are always validated from the database.

On every authenticated request, user identity is verified via JWT and authorization data (role, account status) is fetched fresh from the database to prevent stale privilege usage.

⸻

Account Protection
	•	Soft Delete Pattern (isActive flag)
	•	Inactive users cannot:
	•	Log in
	•	Access protected routes
	•	Even valid JWTs are rejected if user is inactive

⸻

Rate Limiting
	•	Redis-backed rate limiter
	•	Protects against brute force & abuse
	•	Gracefully degrades if Redis is unavailable

⸻

⚡ Cache Strategy
	•	Cache-Aside Pattern
	•	Event-Driven Invalidation
	•	TTL-based expiration
	•	Redis abstraction via cache service
	•	Application survives Redis failure (Graceful Degradation)

⸻

🔄 Resilience Strategy

System is designed to:
	•	Run with Redis
	•	Run without Redis
	•	Never lose business data if cache fails
	•	Maintain ACID consistency via MongoDB transactions

⸻

🧠 Engineering Highlights
	•	Modular Monolith Design
	•	Event-Driven Cache Invalidation
	•	Atomic Financial Updates
	•	Fault-Tolerant Cache Layer
	•	Centralized Error Handling
	•	Structured Logging Middleware
	•	Clean Repository Abstraction
	•	Production-ready Testing Strategy

⸻

🔮 Upcoming Improvements
	•	Dockerization (Mongo + Redis + App containers)
	•	GitHub Actions CI Pipeline
	•	Containerized Infrastructure
	•	Production Deployment
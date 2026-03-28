<p align="center">
  <h1 align="center">RZV Backend API</h1>
  <p align="center">
    A production-grade backend system built with <strong>Node.js</strong>, <strong>Express 5</strong>, <strong>MongoDB</strong>, and <strong>Redis</strong> — engineered with layered architecture, financial-grade data consistency, and enterprise security patterns.
  </p>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-20-339933?logo=nodedotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/Express-5.x-000000?logo=express&logoColor=white" />
  <img src="https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/Redis-Upstash-DC382D?logo=redis&logoColor=white" />
  <img src="https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker&logoColor=white" />
  <img src="https://img.shields.io/badge/CI-GitHub_Actions-2088FF?logo=githubactions&logoColor=white" />
  <img src="https://img.shields.io/badge/Swagger-OpenAPI_3.0-85EA2D?logo=swagger&logoColor=black" />
</p>

---

🔴 **Live API:** [https://rzv-backend.onrender.com/api/health](https://rzv-backend.onrender.com/api/health)  
📘 **Swagger Docs :** [https://rzv-backend.onrender.com/api-docs](https://rzv-backend.onrender.com/api-docs/)

---

## Table of Contents

- [Architecture Overview](#-architecture-overview)
- [Project Structure](#-project-structure)
- [Tech Stack](#-tech-stack)
- [API Reference — Auth](#-api-reference--authentication-endpoints)
- [API Reference — User](#-api-reference--user-endpoints)
- [API Reference — Admin](#-api-reference--admin-endpoints)
- [API Reference — Reward](#-api-reference--reward-endpoints)
- [API Reference — Audit](#-api-reference--audit-log-endpoints)
- [Security Design](#-security-design)
- [Performance & Caching](#-performance--caching)
- [Data Consistency & Transactions](#-data-consistency--transactions)
- [Business Systems](#-business-systems)
- [Resilience & Production Safety](#-resilience--production-safety)
- [Email & Demo Mode](#-email--demo-mode)
- [Testing Strategy](#-testing-strategy)
- [CI/CD Pipeline](#-cicd-pipeline)
- [Docker Support](#-docker-support)
- [Deployment](#-deployment)
- [Local Setup](#-local-setup)
- [Engineering Highlights](#-engineering-highlights)
- [Future Enhancements](#-future-enhancements)

---

## 🧱 Architecture Overview

```
                    ┌──────────────────────────────────────────────────┐
                    │                   CLIENT                         │
                    │          (Web / Mobile / Postman)                │
                    └──────────────────┬───────────────────────────────┘
                                       │
                    ┌──────────────────▼───────────────────────────────┐
                    │              EXPRESS 5 SERVER                     │
                    │  ┌─────────────────────────────────────────────┐ │
                    │  │           MIDDLEWARE PIPELINE                │ │
                    │  │  pino-http → cookieParser → CORS → logger  │ │
                    │  │  → express.json → rateLimit → auth → RBAC  │ │
                    │  │  → inputValidation → cacheMiddleware        │ │
                    │  └─────────────────────────────────────────────┘ │
                    │                                                   │
                    │  ┌─────────────┐  ┌───────────┐  ┌───────────┐  │
                    │  │    Routes   │→ │Controllers│→ │ Services  │  │
                    │  └─────────────┘  └───────────┘  └─────┬─────┘  │
                    │                                        │         │
                    │                              ┌─────────▼───────┐ │
                    │                              │  Repositories   │ │
                    │                              └─────────┬───────┘ │
                    │                                        │         │
                    │  ┌──────────────────────────────────────┘        │
                    │  │  Centralized Error Handler                    │
                    └──┼───────────────────────────────────────────────┘
                       │
          ┌────────────┼─────────────────┐
          ▼            ▼                 ▼
   ┌──────────┐  ┌──────────┐    ┌────────────┐
   │ MongoDB  │  │  Redis   │    │  EventBus  │
   │  Atlas   │  │ Upstash  │    │  (Node.js) │
   └──────────┘  └──────────┘    └────────────┘
```

### Layered Architecture

```
Controller → Service → Repository → Database (MongoDB)
```

| Layer | Responsibility |
|---|---|
| **Routes** | HTTP method binding, middleware chaining, rate limit config |
| **Middleware** | Auth, RBAC, validation, rate limiting, caching, logging |
| **Controllers** | Request/response handling, HTTP status codes, cookie management |
| **Services** | Business logic, MongoDB transactions, orchestration |
| **Repositories** | Database queries, aggregation pipelines, data access abstraction |
| **Models** | Mongoose schemas, pre-save hooks, indexes, instance methods |
| **Infrastructure** | Event bus, cache listeners, cache invalidation service |

### Design Patterns Used

| Pattern | Implementation |
|---|---|
| **Modular Monolith** | Feature-based directory structure (auth/, admin/, users/, reward/, audit/) |
| **Repository Pattern** | 5 repository classes abstracting all MongoDB interactions |
| **Middleware Pattern** | 9 middleware modules in pipeline (auth, RBAC, validation, cache, rate limit, error handler) |
| **Cache-Aside Strategy** | Redis cache with TTL, `X-Cache` headers (HIT/MISS), dynamic key builders |
| **Event-Driven Design** | `EventBus` (Node.js EventEmitter) emits `WALLET_UPDATED` → triggers cache invalidation |
| **Adapter Pattern** | Cache abstraction decoupled from business logic via middleware |
| **Soft Delete Pattern** | `isActive` flag-based user lifecycle, no hard deletes |
| **Centralized Error Handling** | Single error handler mapping 20+ error codes to HTTP status codes |
| **Non-blocking Email Strategy** | Email sent after DB commit via isolated try/catch, failures don't rollback |
| **Dependency Injection** | Services receive repository instances through constructor injection |

---

## 📁 Project Structure

```
rzv_backend/
├── server.js                          # Entry point — DB connect, Redis connect, SIGTERM, crash handlers
├── src/
│   ├── app.js                         # Express app — middleware pipeline, route mounting, Swagger
│   │
│   ├── auth/                          # 🔐 Authentication Module
│   │   ├── auth.routes.js             # 9 auth endpoints with per-route rate limiting
│   │   ├── auth.controller.js         # Web/mobile login, register, logout, token refresh
│   │   └── auth.service.js            # JWT issuance, bcrypt, refresh rotation, email verify, password reset
│   │
│   ├── admin/                         # 👑 Admin Module
│   │   ├── admin.routes.js            # 9 admin endpoints (RBAC-protected, cached, rate-limited)
│   │   ├── admin.controller.js        # Dashboard stats, user management, wallet adjustments
│   │   └── admin.service.js           # Admin business logic, MongoDB transactions, audit logging
│   │
│   ├── users/                         # 👤 User Module
│   │   ├── user.routes.js             # 6 user endpoints
│   │   ├── user.controller.js         # Profile, wallet, transactions, referral details
│   │   └── user.service.js            # User CRUD, field-level update filtering (lodash _.pick)
│   │
│   ├── reward/                        # 🎁 Reward Module
│   │   ├── reward.routes.js           # Daily reward endpoint
│   │   ├── reward.controller.js       # Claim daily reward
│   │   └── reward.service.js          # Daily login, referral, referred rewards (all transactional)
│   │
│   ├── audit/                         # 📋 Audit Module
│   │   ├── audit.routes.js            # Audit log retrieval (admin-only)
│   │   ├── audit.controller.js        # Get logs, recent activities
│   │   ├── audit.service.js           # Query filtering with pagination
│   │   ├── audit.helper.js            # Non-blocking audit log creator (isolated try/catch)
│   │   └── audit.repository.js        # Paginated queries with populate, lean()
│   │
│   ├── middlewares/                   # 🛡️ Middleware Layer (9 modules)
│   │   ├── auth.middleware.js         # JWT verification + real-time DB user status check
│   │   ├── authorizeRole.js           # Role-based access control (RBAC)
│   │   ├── rateLimit.middleware.js     # Redis-backed rate limiting with graceful degradation
│   │   ├── cache.middleware.js         # Cache-Aside with X-Cache headers, dynamic key builders
│   │   ├── errorHandler.js            # Centralized error handler (20+ error codes mapped)
│   │   ├── user_middleware.js          # 11 validation functions (email, password, token, date, etc.)
│   │   ├── admin.middleware.js         # Admin-specific validations (ObjectId, status, wallet, date range)
│   │   ├── login_middleware.js         # Login credential validation
│   │   └── logger.js                  # Request method/URL logging via pino
│   │
│   ├── models/                        # 📊 Mongoose Models (5 schemas)
│   │   ├── User.js                    # User schema with pre-save bcrypt, referral code gen, email verify method
│   │   ├── Wallet.js                  # Wallet schema (1:1 with User, min:0 balance constraint)
│   │   ├── TokenTransaction.js        # Transaction ledger (CREDIT/DEBIT, compound index)
│   │   ├── RefreshToken.js            # Refresh tokens (indexed on token, user, expiresAt)
│   │   └── Audit.js                   # Immutable audit logs (pre-hook blocks update/delete)
│   │
│   ├── repositories/                  # 💾 Data Access Layer (5 repositories)
│   │   ├── user.repositories.js       # User CRUD, search, count, soft delete
│   │   ├── wallet.repository.js       # Atomic credit/debit with $inc, aggregate total balance
│   │   ├── tokenTransaction.repository.js  # Aggregation pipelines, $lookup, date range queries
│   │   ├── refreshToken.repository.js # Token CRUD, revoke single/all tokens per user
│   │   └── auth.repository.js         # Role-scoped email+password lookup
│   │
│   ├── config/                        # ⚙️ Configuration
│   │   ├── db.js                      # MongoDB connection with runtime error/disconnect/reconnect listeners
│   │   ├── redis.js                   # Redis client with exponential backoff retry (max 5 retries)
│   │   └── jest.config.js             # Test configuration
│   │
│   ├── core/                          # 🔧 Core Infrastructure
│   │   └── eventBus.js                # Application-wide event emitter (EventEmitter)
│   │
│   ├── infrastructure/                # 🏗️ Infrastructure Layer
│   │   └── cache/
│   │       ├── cache.listener.js      # Listens to WALLET_UPDATED → triggers invalidation
│   │       └── cache.service.js       # Invalidates dashboard stats + wallet cache keys
│   │
│   ├── utils/                         # 🔨 Utilities
│   │   ├── token.js                   # JWT access token + crypto refresh token generation
│   │   ├── sendEmail.js               # Nodemailer transporter (Gmail SMTP)
│   │   ├── cacheInvalidation.js       # Safe Redis key/pattern deletion with readiness check
│   │   ├── generate.referral.js       # Name-prefix + random number referral codes
│   │   └── structured-logger.js       # Pino logger (pretty in dev, JSON in production)
│   │
│   ├── constants/                     # 📌 Constants
│   │   ├── auth.constants.js          # ROLE enum, AUTH_ERRORS map
│   │   └── reward.constants.js        # REWARD_AMOUNTS (10/20/50), REWARD_REASON enums
│   │
│   └── scripts/                       # 📜 Utility Scripts
│       └── createAdmin.js             # One-time admin seeding script
│
├── tests/                             # 🧪 Integration Tests
│   ├── auth.register.test.js          # Registration flow test
│   ├── auth.login.test.js             # Login success/failure tests
│   ├── auth.verifyEmail.test.js       # Email verification + invalid token tests
│   └── setup.js                       # Test setup/teardown
│
├── postman/                           # 📬 Postman Collection
│   ├── RZV Backend API Tests.postman_collection.json
│   └── RZV Backend Test.postman_environment.json
│
├── swagger.yaml                       # OpenAPI 3.0 specification (37KB, manually authored)
├── Dockerfile                         # Multi-stage Node 20 Alpine production image
├── .github/workflows/ci.yaml          # GitHub Actions CI pipeline
├── .env / .env.test                   # Environment configs
└── package.json                       # Dependencies & scripts
```

---

## 🛠 Tech Stack

| Category | Technology |
|---|---|
| **Runtime** | Node.js 20 |
| **Framework** | Express 5.x |
| **Database** | MongoDB Atlas (Mongoose 9) |
| **Cache / Rate Limiting** | Redis (Upstash) |
| **Authentication** | JWT (jsonwebtoken) + Crypto refresh tokens |
| **Password Hashing** | bcrypt (salt rounds: 10) |
| **Logging** | Pino + pino-http + pino-pretty |
| **Email** | Nodemailer (Gmail SMTP) |
| **API Docs** | Swagger UI Express + YAML (OpenAPI 3.0) |
| **Testing** | Jest 30 + Supertest |
| **CI/CD** | GitHub Actions |
| **Containerization** | Docker (Node 20 Alpine) |
| **Hosting** | Render (Docker-based) |
| **Utilities** | lodash (_.pick), ms, cookie-parser, cors |

---

## 🔐 API Reference — Authentication Endpoints

All auth endpoints are rate-limited with configurable windows via environment variables.

| Method | Endpoint | Rate Limit | Auth | Description |
|--------|----------|-----------|------|-------------|
| `POST` | `/api/login-web` | ✅ Configurable | ❌ | Admin web login — returns access token, sets refresh token in HTTP-only secure cookie |
| `POST` | `/api/login-mobile` | ✅ Configurable | ❌ | User mobile login — returns both access token and refresh token in response body |
| `POST` | `/api/register` | ✅ Configurable | ❌ | Register new user with name, email, password, optional referral code. Creates wallet via MongoDB transaction |
| `GET` | `/api/verify-email/:token` | 5/min | ❌ | Verify email via SHA-256 hashed token. Awards referral rewards atomically upon verification |
| `POST` | `/api/resend-verification` | 3/min | ❌ | Resend email verification token |
| `POST` | `/api/refresh-token` | 5/min | ❌ | Rotate refresh token. Cookie-based → returns access token only. Body-based → returns both tokens |
| `POST` | `/api/logout` | — | ✅ Bearer | Revoke all refresh tokens for the authenticated user. Logs admin logout to audit |
| `POST` | `/api/forgot-password` | ✅ Configurable | ❌ | Generate password reset token (SHA-256 hashed), send reset email |
| `POST` | `/api/reset-password/:token` | — | ❌ | Reset password using token. Revokes all existing refresh tokens on password change |

### Authentication Flow Details

```
                    REGISTRATION FLOW
┌────────┐  POST /register  ┌──────────────────────────────────────┐
│ Client │ ──────────────→  │  Validate → Check Referral Code     │
└────────┘                  │  → Check Duplicate Email             │
                            │  → [MongoDB Transaction START]       │
                            │    → Create User (password hashed)   │
                            │    → Create Wallet (balance: 0)      │
                            │    → Save referredBy if applicable   │
                            │    → Generate email verify token     │
                            │  → [MongoDB Transaction COMMIT]      │
                            │  → Send verification email (async)   │
                            └──────────────────────────────────────┘

                    REFRESH TOKEN ROTATION
┌────────┐  POST /refresh   ┌──────────────────────────────────────┐
│ Client │ ──────────────→  │  Find token (not revoked, not expired)│
└────────┘                  │  → Check user exists & isActive       │
                            │  → DETECT REUSE → revoke ALL tokens  │
                            │  → Revoke current token               │
                            │  → Generate new refresh token         │
                            │  → Issue new access token             │
                            │  → Cookie? return access only         │
                            │  → Body? return access + refresh      │
                            └──────────────────────────────────────┘
```

**Input Validation Middleware (per-endpoint):**
- Registration: `isValid` → `validateEmail` → `passwordConfirmation` (min 8 chars, confirmation match)
- Login: `isLoginvalid` (email + password required)
- Verify Email: `tokenVerifyValidation` (token length ≥ 20)
- Reset Password: `resetPasswordValidation` (token check, newPassword + confirmPassword match, min 8 chars)
- Forgot Password: `forgotPasswordValidation` (email format regex)
- Refresh Token: `refreshTokenValidation` (checks cookie OR body)

---

## 👤 API Reference — User Endpoints

All user endpoints require Bearer token authentication. The auth middleware performs a **real-time DB lookup** to verify the user exists and is active on every single request.

| Method | Endpoint | Rate Limit | Description |
|--------|----------|-----------|-------------|
| `GET` | `/api/user/me` | ✅ Configurable | Get current user's profile (name, email, role, createdAt) |
| `GET` | `/api/user/wallet` | — | Get wallet balance and last updated timestamp |
| `GET` | `/api/user/transactions` | — | Get paginated transaction history with optional date range filter |
| `GET` | `/api/user/referral` | — | Get referral reward summary (total amount + count via aggregation) |
| `PUT` | `/api/user/update` | — | Update profile fields. **Only `name` and `age` are allowed** — email and password are stripped from input, fields filtered via `lodash _.pick()` |
| `DELETE` | `/api/user/delete` | — | Soft-delete account (sets `isActive: false`), revokes all refresh tokens |

**Transaction Query Features:**
- Pagination: `?page=1&limit=10`
- Date range filter: `?start=2025-01-01&end=2025-12-31`
- UTC-normalized date boundaries (start-of-day to end-of-day)
- Validation middleware ensures both `start` and `end` are present if either is provided

---

## 👑 API Reference — Admin Endpoints

All admin endpoints require `Bearer` auth + `admin` role (enforced by `isAuthenticated` + `authorizeRole(ROLE.ADMIN)` middleware chain). Every endpoint is rate-limited.

| Method | Endpoint | Cached | Description |
|--------|----------|--------|-------------|
| `GET` | `/api/admin/me` | ❌ | Get current admin's profile |
| `GET` | `/api/admin/dashboard/stats` | ✅ 60s | Aggregated dashboard: total/active/inactive users, new users today, total wallet balance, today's transaction summary (CREDIT/DEBIT with counts). **Uses `Promise.all` for 5 parallel DB queries** |
| `GET` | `/api/admin/users` | ❌ | List all users with **search** (regex on name), **sort** (any field + asc/desc), **pagination** (page, limit, totalPages, hasNextPage, hasPrevPage) |
| `GET` | `/api/admin/users/by-name/:name` | ❌ | Find user by exact name |
| `GET` | `/api/admin/users/:id` | ❌ | Get detailed user profile by ObjectId |
| `GET` | `/api/admin/users/:id/wallet` | ❌ | Get user's wallet balance + paginated transaction history |
| `PATCH` | `/api/admin/users/:id/status` | ❌ | Activate/deactivate user (with self-action prevention). **Creates audit log** with old/new value |
| `PATCH` | `/api/admin/users/:id/wallet` | ❌ | Credit/debit user wallet. **MongoDB transaction** for atomicity. Emits `WALLET_UPDATED` event for cache invalidation. **Creates audit log** |
| `GET` | `/api/admin/wallet/summary` | ✅ 60s | Transaction summary by date (CREDIT/DEBIT totals + net amount). Dynamic cache key per date |
| `GET` | `/api/admin/wallet/summary/range` | ✅ 60s | Paginated transactions in date range with `$lookup` to join user profiles. Dynamic cache key per date range + pagination |

### Admin Wallet Adjustment Flow
```
PATCH /admin/users/:id/wallet
  │
  ├─ Validate: ObjectId format, amount > 0, type ∈ [CREDIT, DEBIT], reason required
  ├─ Verify: User exists, admin ≠ target user (self-action blocked)
  │
  ├─ [MongoDB Transaction START]
  │    ├─ CREDIT: Wallet.findOneAndUpdate({ $inc: { balance: +amount } })
  │    └─ DEBIT:  Wallet.findOneAndUpdate({ balance: { $gte: amount }, $inc: { balance: -amount } })
  │    └─ Create TokenTransaction record (type, amount, reason, source: 'admin')
  ├─ [MongoDB Transaction COMMIT]
  │
  ├─ EventBus.emit("WALLET_UPDATED") → Cache Invalidation
  │    ├─ Delete: CACHE:admin:dashboard:stats
  │    └─ Delete pattern: CACHE:admin:wallet:*
  │
  └─ Create Audit Log (adminId, action, targetedUserId, oldBalance, newBalance)
```

### Admin Input Validations
- `validateObjectId`: MongoDB ObjectId format validation
- `validStatusUpdate`: `isActive` must be boolean
- `validAdjustBalance`: `amount > 0`, `type ∈ [CREDIT, DEBIT]`, `reason` required
- `validWalletSummaryByDate`: Date presence + format validation
- `validateRange`: Both `start` and `end` required, valid dates, `start < end`

---

## 🎁 API Reference — Reward Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/reward/daily-reward` | ✅ Bearer | Claim daily login reward — **10 tokens**, once per UTC day |

### Reward System Details

All reward operations are wrapped in **MongoDB transactions** with proper session management:

| Reward Type | Amount | Trigger | Implementation |
|-------------|--------|---------|----------------|
| **Daily Login** | 10 tokens | User claims `POST /reward/daily-reward` | Checks duplicate via `findTodayReward()` (UTC day boundary), atomic wallet increment + transaction record |
| **Referral Reward** | 50 tokens | Referred user verifies email | Credited to the **referrer's** wallet during email verification transaction |
| **Referred Reward** | 20 tokens | Referred user verifies email | Credited to the **referred user's** wallet during email verification transaction |

**Key Design Decisions:**
- Referral rewards are **only granted upon email verification** (prevents gaming with fake accounts)
- `referralRewardClaimed` flag prevents double-claiming
- Reward services support **external sessions** — they join the caller's MongoDB transaction rather than creating their own, ensuring atomicity across the entire verification flow

---

## 📋 API Reference — Audit Log Endpoints

Both endpoints require `admin` role.

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/audit-logs` | Paginated audit logs with filters: `action`, `adminId`, `targetedUserId`. Populates admin and target user details (email, role) |
| `GET` | `/api/recent/audit` | Last 10 activities for the current admin |

### Audit Events Tracked

| Action | Trigger | Data Recorded |
|--------|---------|---------------|
| `ADMIN_LOGIN` | Admin logs in via web | adminId, ipAddress, userAgent |
| `ADMIN_LOGOUT` | Admin logs out | adminId, ipAddress, userAgent |
| `USER_STATUS_UPDATE` | Admin activates/deactivates user | adminId, targetedUserId, oldValue, newValue |
| `WALLET_BALANCE_ADJUST` | Admin credits/debits wallet | adminId, targetedUserId, oldBalance, newBalance |

**Audit Log Immutability:**  
The `Audit` model has Mongoose pre-hooks on `updateOne`, `findOneAndUpdate`, and `deleteOne` that **throw errors**, making audit logs write-once/append-only. No log can ever be modified or deleted through the application.

**Non-blocking Design:**  
Audit log creation is wrapped in an isolated `try/catch` via `audit.helper.js` — if audit logging fails, it logs the error but **does not affect the primary business operation**.

---

## 🔒 Security Design

### Authentication & Token Security

```
┌─────────────────────────────────────────────────────────────┐
│                    TOKEN ARCHITECTURE                         │
├──────────────────────┬──────────────────────────────────────┤
│ Access Token         │ JWT (HS256), 15min TTL (configurable) │
│                      │ Payload: id, email, role              │
├──────────────────────┼──────────────────────────────────────┤
│ Refresh Token        │ crypto.randomBytes(40).toString('hex')│
│                      │ 7-day TTL, stored in DB               │
├──────────────────────┼──────────────────────────────────────┤
│ Email Verify Token   │ crypto.randomBytes(32), SHA-256 hash  │
│                      │ stored in DB, 15min TTL               │
├──────────────────────┼──────────────────────────────────────┤
│ Password Reset Token │ crypto.randomBytes(32), SHA-256 hash  │
│                      │ stored in DB, 15min TTL               │
└──────────────────────┴──────────────────────────────────────┘
```

| Security Feature | Implementation |
|---|---|
| **Password Hashing** | bcrypt with salt rounds 10, via Mongoose `pre('save')` hook. Passwords **never stored in plain text**, `select: false` in schema prevents accidental exposure |
| **Refresh Token Rotation** | Old token revoked immediately upon use, new token issued. Every refresh generates a fresh token pair |
| **Token Reuse Detection** | If a revoked token is presented, **all tokens for that user are revoked** — treats it as a compromised token scenario |
| **HTTP-Only Cookies** | Web login stores refresh token in `httpOnly`, `secure`, `sameSite` cookie — inaccessible to JavaScript |
| **Real-time DB Validation** | Auth middleware makes a **database call on every protected request** to verify user exists and `isActive === true`. Deactivated users are rejected immediately |
| **Role-Based Access Control** | `authorizeRole()` middleware accepts spread `...allowedRoles`, checks `req.user.role` against allowed roles |
| **Account Lifecycle** | Soft delete via `isActive` flag. JWT rejected if user is inactive. Deletion revokes all refresh tokens |
| **Password Reset Invalidation** | Password reset **revokes all existing refresh tokens**, forcing re-authentication |
| **Input Validation Layer** | 20+ validation functions across 3 middleware files, executed **before** any controller logic |
| **Error Information Exposure** | Production mode returns sanitized error messages. Stack traces only in development. Unknown errors return generic "Internal Server Error" |
| **Field-Level Update Protection** | User profile updates explicitly strip `email` and `password` from input, only `name` and `age` are allowed via `lodash _.pick()` |
| **Admin Self-Action Prevention** | Admins cannot deactivate their own account or adjust their own wallet balance |
| **Trust Proxy** | `app.set('trust proxy', true)` for accurate IP extraction behind reverse proxies |
| **CORS Configuration** | Configured with `credentials: true` for cross-origin cookie support |

### Rate Limiting

| Endpoint Group | Strategy | Degradation |
|---|---|---|
| Login (web/mobile) | Configurable window + max via env vars | Bypasses if Redis unavailable |
| Registration | Configurable per env | Bypasses if Redis unavailable |
| Forgot Password | Configurable per env | Bypasses if Redis unavailable |
| Refresh Token | 5 requests / 60 seconds | Bypasses if Redis unavailable |
| Email Verification | 5 requests / 60 seconds | Bypasses if Redis unavailable |
| Resend Verification | 3 requests / 60 seconds | Bypasses if Redis unavailable |
| Admin Endpoints | 50 requests / 60 seconds | Bypasses if Redis unavailable |
| User Profile | Configurable per env | Bypasses if Redis unavailable |

**Rate Limit Implementation:**
- Redis `INCR` + `EXPIRE` for sliding window
- Key format: `{prefix}:{userId || IP}` (user-id for authenticated, IP for anonymous)
- Returns `429 Too Many Requests` with descriptive message
- **Graceful degradation**: If Redis is down, rate limiting is bypassed (business logic continues)
- Rate limiting disabled in `test` environment for integration testing

---

## ⚡ Performance & Caching

### Redis Cache-Aside Pattern

```
         Request
            │
    ┌───────▼────────┐
    │ Cache Middleware│
    │                │
    │  Redis.get(key)│
    │       │        │
    │  ┌────▼────┐   │
    │  │ CACHED? │   │
    │  └────┬────┘   │
    │   YES │  NO    │
    │   │   │        │
    │   │   ▼        │
    │   │  Controller│──→ res.json(data)
    │   │  + Service │       │
    │   │            │  Redis.setEx(key, TTL, data)
    │   │            │  X-Cache: MISS
    │   ▼            │
    │  Return cached │
    │  X-Cache: HIT  │
    └────────────────┘
```

| Feature | Detail |
|---|---|
| **Cache-Aside Pattern** | Check cache first → serve if hit → fetch from DB + populate cache on miss |
| **X-Cache Headers** | `X-Cache: HIT` or `X-Cache: MISS` on every cached response for observability |
| **Dynamic Cache Keys** | Keys built from request params: `CACHE:admin:wallet:summary:{date}`, `CACHE:admin:wallet:range:{start}:{end}:{page}:{limit}` |
| **TTL Enforcement** | 60-second TTL on all cached endpoints |
| **Event-Driven Invalidation** | `WALLET_UPDATED` event triggers deletion of `CACHE:admin:dashboard:stats` + `CACHE:admin:wallet:*` pattern |
| **Graceful Degradation** | All cache operations check `redisClient.isReady` before proceeding. If Redis is down, requests pass through to DB |
| **Only Successful Caching** | Cache middleware only stores data for 2xx responses |
| **Stateless Design** | No server-side session state — horizontally scalable behind any load balancer |

### Cached Endpoints

| Endpoint | Cache Key Pattern | TTL |
|---|---|---|
| `GET /admin/dashboard/stats` | `CACHE:admin:dashboard:stats` | 60s |
| `GET /admin/wallet/summary` | `CACHE:admin:wallet:summary:{date}` | 60s |
| `GET /admin/wallet/summary/range` | `CACHE:admin:wallet:range:{start}:{end}:{page}:{limit}` | 60s |

---

## 🔄 Data Consistency & Transactions

MongoDB transactions are used in **every financial and multi-document operation** to ensure ACID compliance:

| Operation | Transaction Scope | Documents Involved |
|---|---|---|
| **User Registration** | User creation + Wallet creation + Referral linkage + Email verify token | User, Wallet |
| **Email Verification** | Verify user + Award referral reward to referrer + Award referred reward to user | User, Wallet (×2), TokenTransaction (×2) |
| **Daily Login Reward** | Check duplicate reward today + Increment wallet + Create transaction | Wallet, TokenTransaction |
| **Admin Wallet Adjust** | Credit/debit wallet + Create transaction record | Wallet, TokenTransaction |
| **Referral Reward** | Increment referrer's wallet + Create transaction | Wallet, TokenTransaction |

**Transaction Safety Patterns:**
- `session.startTransaction()` → operations → `session.commitTransaction()`
- On error: `session.abortTransaction()` (with `inTransaction()` check to avoid double-abort)
- `session.endSession()` in `finally` block — guaranteed cleanup
- Debit operations use `{ balance: { $gte: amount } }` filter — prevents negative balances at the database level
- Reward services support **external session injection** for cross-service transaction participation

---

## 💼 Business Systems

### Wallet System
- **1:1 relationship** with User (unique constraint on `user` field)
- Balance has `min: 0` constraint in schema — negative balances prevented at model level
- Atomic operations via MongoDB `$inc` operator — no read-modify-write race conditions
- Debit uses `findOneAndUpdate` with balance check in query filter — if balance insufficient, returns `null`
- Admin can credit/debit any user's wallet with mandatory reason
- Aggregate pipeline computes total platform balance for dashboard

### Transaction Ledger
- Every wallet change creates a `TokenTransaction` record (CREDIT or DEBIT)
- Source field tracks origin: `system`, `admin`, or `reward`
- Compound index on `{user, reason, createdAt}` (unique) prevents duplicate reward claims
- Aggregation pipelines for daily summaries, date range reports, and `$lookup` joins with users

### Referral System
- Auto-generated referral codes: `{NAME_PREFIX}{4_RANDOM_DIGITS}` (e.g., `JOHN4829`)
- Collision detection: loops until unique code found
- Optional referral code during registration
- Rewards distributed atomically upon email verification (not registration)
- `referralRewardClaimed` flag prevents double-claiming

---

## 🧩 Resilience & Production Safety

### MongoDB Runtime Monitoring
```javascript
mongoose.connection.on("error", ...)       // Logs runtime connection errors
mongoose.connection.on("Disconnected", ...) // Starts 15-second reconnection timer
mongoose.connection.on("reconnected", ...)  // Clears reconnection timer
```
If MongoDB doesn't reconnect within 15 seconds → `process.exit(1)` for container restart.

### Process Crash Protection
```javascript
process.on("uncaughtException", ...)    // Logs via pino.fatal → process.exit(1)
process.on("unhandledRejection", ...)   // Logs via pino.fatal → process.exit(1)
process.on("SIGTERM", ...)              // Graceful shutdown — closes HTTP server
```

### Redis Resilience
| Feature | Detail |
|---|---|
| **Retry Strategy** | Exponential backoff: `min(retries * 1000ms, 5000ms)`, max 5 retries |
| **Graceful Fallback** | All Redis operations check `isReady` flag before executing. If Redis is down: rate limiting bypassed, cache skipped, no errors thrown |
| **Error Logging** | Redis errors logged as warnings (not fatal) — application continues |
| **Business Logic Independence** | No business logic depends on Redis. It's purely a performance and security layer |

### Structured Logging (Pino)
| Environment | Format | Level |
|---|---|---|
| Development | Pretty-printed with colors (`pino-pretty`) | `debug` |
| Production | JSON format (ready for ELK/Grafana ingestion) | `info` |

- HTTP request logging via `pino-http` middleware
- Route hit logging via custom logger middleware
- All errors logged with stack traces via structured logger
- `pino.fatal` used for process-level crashes

### Error Handling Architecture

The centralized error handler maps **20+ application-specific error codes** to appropriate HTTP status codes:

| HTTP Status | Error Codes |
|---|---|
| `400` | `USER_NOT_EXISTED`, `EMAIL_NOT_VERIFIED_RESENT`, `WALLET_NOT_EXISTED`, `REFERRAL_CODE_IS_NOT_VALID`, `NOT_POSSIBLE`, `TOKEN_REUSE_DETECTED`, `LOGOUT_FAILED` |
| `401` | `INVALID_CREDENTIALS`, `INVALID_REFRESH_TOKEN` |
| `403` | `INACTIVE_USER`, `USER_NOT_EXISTED_OR_VERIFIED`, `ACCOUNT_DISABLED` |
| `404` | `USER_NOT_FOUND`, `USER_NAME_NOT_FOUND` |
| `409` | `EMAIL_ALREADY_VERIFIED`, `CURRENT_STATUS_IS_SAME`, `INSUFFICIENT_BALANCE`, `EMAIL_ALREADY_REGISTERED`, `ALREADY_REWARDED_TODAY` |
| `503` | `DB_ERROR`, `MongooseError`, `MongoError` |

**Production mode:** Unknown errors return `"Internal server Error"` (no stack trace leakage).

---

## 📨 Email & Demo Mode

### Email System Architecture
- **Provider:** Nodemailer with Gmail SMTP
- **Non-blocking design:** Email sending is executed **after** database transaction commits. Failures are caught in isolated `try/catch` and logged — they **never** cause user-facing errors or transaction rollbacks
- **Easily swappable:** Architecture designed as a simple `sendEmail()` utility — can be replaced with SendGrid, AWS SES, or Resend by changing a single file

### Demo Mode (For Recruiters & Testing)

When `EMAIL_ENABLED !== "true"` (live deployment on Render free tier):

| Feature | Behavior |
|---|---|
| **Registration** | Returns `verifyToken` in response body (instead of sending email). **Auto-verifies the user** for immediate testing |
| **Forgot Password** | Returns `resetToken` in response body (instead of email link) |
| **Resend Verification** | Returns raw token in response |
| **Token Exposure** | Controlled by `EXPOSE_VERIFY_TOKEN` env variable |

> **Why Demo Mode?** Render's free tier has network restrictions that prevent reliable SMTP connections. Demo mode ensures the complete backend logic can be tested without SMTP dependency while maintaining production-grade code quality. No security compromise — this is a controlled testing feature.

---

## 🧪 Testing Strategy

### Integration Tests (Jest 30 + Supertest)

Tests run against a **real MongoDB Atlas test database** with environment isolation:

```
tests/
├── auth.register.test.js    # User registration flow (201 Created)
├── auth.login.test.js       # Login success, wrong password (401), user not found (403)
├── auth.verifyEmail.test.js  # Invalid token format (400), expired token checks
└── setup.js                  # Test lifecycle configuration
```

**Test Infrastructure:**
- `NODE_ENV=test` via `cross-env` — disables Redis connection, bypasses rate limiting
- Dedicated `MONGO_TEST_URI` — isolated test database
- `jest --runInBand` — serial execution for database consistency
- Each test file manages its own `beforeAll`/`afterAll` cleanup (deletes test users)

### Postman Collections

Located in `/postman/`:

| File | Contents |
|---|---|
| `RZV Backend API Tests.postman_collection.json` | **42KB** comprehensive collection covering all endpoints |
| `RZV Backend Test.postman_environment.json` | Environment variables for local/staging/production |

**Collection Features:**
- Automated token handling (login → capture token → use in subsequent requests)
- Organized test folders: Auth, Admin, User, Wallet, Audit, Rewards
- Smoke test suite for quick health checks
- Destructive operations isolated in separate folders

### Run Tests

```bash
# Run all integration tests
npm test

# Run with verbose output
npx jest --verbose --runInBand
```

---

## 🔄 CI/CD Pipeline

### GitHub Actions (`ci.yaml`)

```yaml
Trigger: Push to main / Pull Request to main
Runner:  ubuntu-latest
Node:    20 (with npm cache)
```

| Step | Detail |
|---|---|
| **Checkout** | `actions/checkout@v4` |
| **Node Setup** | `actions/setup-node@v4` with npm caching |
| **Install** | `npm ci` (clean install from lockfile) |
| **Secrets Injected** | `MONGO_TEST_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `EMAIL_HOST`, `EMAIL_USER`, `EMAIL_PASS` — all via GitHub Secrets |
| **Test** | `npm test` — must pass before merge/deploy |

CI must pass before production deployment. Render supports deploy-after-CI gating.

---

## 🐳 Docker Support

```dockerfile
FROM node:20-alpine        # Lightweight base image
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev      # Production deps only (no devDependencies)
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]
```

**Docker Design Choices:**
- `node:20-alpine` — minimal attack surface, small image size
- `npm ci --omit=dev` — deterministic, production-only install
- Layer caching optimized — `package*.json` copied before source for better cache hits
- No `nodemon` in production — runs `node server.js` directly

```bash
# Build image
docker build -t rzv-backend .

# Run container
docker run -p 3000:3000 --env-file .env rzv-backend
```

---

## 🚀 Deployment

| Component | Provider |
|---|---|
| **Backend** | Render (Docker-based deployment) |
| **Database** | MongoDB Atlas |
| **Cache** | Upstash Redis |

**Live URL:** [https://rzv-backend.onrender.com](https://rzv-backend.onrender.com)

**Deployment Features:**
- Auto-deploy on commit to `main`
- `NODE_ENV=production` with all secrets configured in Render dashboard
- Health endpoint monitoring: `GET /api/health` returns `{ message, timestamp }`
- Stateless container design — compatible with horizontal scaling
- SIGTERM handler for graceful shutdowns during redeployment

### ⚠️ Demo Environment Notes (Render Free Tier)
- Free instance spins down after inactivity (~50s cold start)
- SMTP email disabled due to cloud network restrictions
- Demo mode returns tokens in response bodies for frontend testing
- All email flows fully functional in local environment

---

## ⚙️ Local Setup

### Prerequisites
- Node.js 20+
- MongoDB (local or Atlas)
- Redis (local or Upstash)

### Steps

```bash
# 1. Clone repository
git clone <repo-url>
cd rzv_backend

# 2. Install dependencies
npm install

# 3. Create .env file
PORT=3000
NODE_ENV=development
MONGO_URI=your_mongo_uri
MONGO_TEST_URI=your_test_uri
JWT_SECRET=your_secret
JWT_EXPIRES_IN=15m
REDIS_URL=redis://localhost:6379
FRONTEND_URL=http://localhost:5173
EMAIL_ENABLED=true
EMAIL_USER=your_email
EMAIL_PASS=your_app_password
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your_admin_password
COOKIE_SAMESITE=lax
EXPOSE_VERIFY_TOKEN=false

# Rate limit configs
LOGIN_RATE_WINDOW=60
LOGIN_RATE_MAX=5
REGISTER_RATE_WINDOW=60
REGISTER_RATE_MAX=3
FORGOT_PASS_RATE_WINDOW=60
FORGOT_PASS_RATE_MAX=3
USER_RATE_WINDOW=60
USER_RATE_RATE=30
ADMIN_RATE_WINDOW=60
ADMIN_RATE_RATE=50

# 4. Seed admin user (one-time)
node src/scripts/createAdmin.js

# 5. Start development server (with hot-reload)
npm run dev

# 6. Access
# API:     http://localhost:3000/api/health
# Swagger: http://localhost:3000/api-docs
```

---

## 🧠 Engineering Highlights

| Highlight | Detail |
|---|---|
| **Financial-grade transactions** | Every wallet mutation wrapped in MongoDB sessions with proper abort/commit/cleanup |
| **Event-driven cache invalidation** | Custom EventBus emits domain events, infrastructure layer listens and invalidates relevant cache keys |
| **Real-time account enforcement** | Auth middleware queries DB on every request — deactivated users are locked out immediately, not after token expiry |
| **Token reuse detection** | Revoked refresh token reuse triggers full account token revocation (compromised token protection) |
| **Immutable audit trail** | Mongoose pre-hooks physically prevent audit log modification/deletion at the ORM level |
| **Graceful degradation** | Redis failure doesn't crash the app — rate limiting and caching are bypassed transparently |
| **Constructor-based DI** | Services receive repositories via constructor injection — enables testability and loose coupling |
| **Atomic balance operations** | Wallet debits use MongoDB query-level `$gte` check — prevents negative balances without application-level locks |
| **Platform-aware auth** | Separate web (cookie) and mobile (body) login flows with different token delivery mechanisms |
| **20+ error code mapping** | Centralized error handler with environment-aware response sanitization |
| **Non-blocking side effects** | Email and audit logging failures are isolated — they never affect the primary user operation |
| **External session support** | Reward services accept external MongoDB sessions, joining caller's transaction for cross-service atomicity |
| **37KB OpenAPI spec** | Manually authored Swagger YAML documenting every endpoint, schema, and error response |

---

## 🔮 Future Enhancements

- [ ] Horizontal scaling via load balancer with sticky sessions
- [ ] Log aggregation pipeline (ELK Stack / Grafana Loki)
- [ ] Metrics & monitoring (Prometheus + Grafana)
- [ ] Microservices extraction (auth, wallet, notifications)
- [ ] Kubernetes deployment with Helm charts
- [ ] Message queue integration (BullMQ / Kafka) for background jobs
- [ ] Production email service migration (SendGrid / AWS SES)
- [ ] AI/RAG microservice integration (FastAPI-based)
- [ ] API Gateway layer for microservice transition
- [ ] Distributed rate limiting for multi-instance deployments
- [ ] WebSocket support for real-time dashboard updates
- [ ] Refresh token family tracking for enhanced reuse detection

---

<p align="center">
  Built as a portfolio-grade system demonstrating real-world backend engineering principles.<br/>
  <strong>Production resilience • Financial-grade consistency • Security-first design • Clean architecture</strong>
</p>

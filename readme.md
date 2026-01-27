🧑‍💻 Users API Documentation

Base URL:
/api/users

1️⃣ Create User

POST /api/users

Create a new user.

Request Body
{
  "name": "Raaz",
  "age": 23
}

Response (201)
{
  "_id": "objectId",
  "name": "Raaz",
  "age": 23,
  "createdAt": "ISODate",
  "updatedAt": "ISODate"
}

Validations

Required fields must be provided

Invalid input → 400 Bad Request

2️⃣ Get All Users (Pagination + Sorting + Search)

GET /api/users

Query Params
Param	Default	Description
page	1	Page number
limit	10	Items per page
sortBy	createdAt	Field to sort by
order	desc	asc or desc
search	—	Partial match on name
Example
/api/users?page=1&limit=10&sortBy=name&order=asc

Response (200)
{
  "data": [
    {
      "_id": "objectId",
      "name": "Sherin",
      "age": 16
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "totalUsers": 4,
    "totalPages": 1,
    "hasNextPage": false,
    "hasPrevPage": false
  }
}

Features

Pagination using MongoDB skip & limit

Dynamic sorting

Regex-based search

Metadata in response

3️⃣ Get User by ID

GET /api/users/:id

Fetch a single user.

Response (200)
{
  "_id": "objectId",
  "name": "Raaz",
  "age": 23
}

Errors

Invalid ID → 400 Bad Request

User not found → 404 Not Found

4️⃣ Update User

PUT /api/users/:id

Update an existing user.

Request Body
{
  "name": "Raaz Updated",
  "age": 24
}

Response (200)
{
  "_id": "objectId",
  "name": "Raaz Updated",
  "age": 24,
  "updatedAt": "ISODate"
}

Errors

Invalid data → 400 Bad Request

User not found → 404 Not Found

5️⃣ Delete User (Soft Delete)

DELETE /api/users/:id

Marks the user as inactive instead of removing permanently.

Response (200)
{
  "message": "User deleted successfully"
}

Errors

User not found → 404 Not Found

🔐 Authentication (JWT)
Login Flow

User logs in using email & password

On success:

A JWT access token is generated

Token contains:

id

email

role

Token has an expiration (JWT_EXPIRES_IN)

Token Usage

Send the token in request headers:

Authorization: Bearer <token>

🛡️ Authentication Middleware
isAuthenticated

Responsibilities:

Verifies JWT token

Extracts user ID

Fetches fresh user data from DB

Blocks access if:

Token is invalid or expired

User does not exist

User is inactive (isActive === false)

Attaches full user object to req.user

This prevents access using stale or compromised tokens.

🧑‍⚖️ Authorization (Role-Based Access Control)
authorizeRole(role)

Ensures the user has the required role

Example:

authorizeRole('admin')


Used for admin-only routes:

Get all users

Update users

Delete users

👤 User Status Management (Soft Delete)

Users are not permanently removed

Deleting a user sets:

isActive = false

Benefits

Prevents accidental data loss

Maintains audit history

Blocks login for inactive users

Allows controlled email reuse

🔄 User Lifecycle Rules

Only isActive === true users can:

Log in

Access protected routes

Inactive users:

Cannot log in

Cannot access APIs

Are blocked even if a JWT exists

🧱 Security Design Decisions

JWT is used only for identity

Authorization & account status are always verified from DB

Prevents privilege abuse using old tokens

Ensures real-time access control

🧩 Middleware Summary
Middleware	Responsibility
isAuthenticated	Token + DB user validation
authorizeRole	Role-based access control
Validation MW	Request validation
🧪 API Protection Summary

Public Routes

Login

Create user

Protected Routes

Get profile

Get users

Update user

Delete user

Admin-Only Routes

Get all users

Update users

Delete users

🧠 Architecture & Learnings

Layered architecture:

Controller → Service → Repository → Database


Implemented pagination with skip & limit

Built dynamic sorting

Fixed query param mismatch between controller & service

Learned proper error classification:

Client errors → 400

Server errors → 500

Centralized error handling for consistency


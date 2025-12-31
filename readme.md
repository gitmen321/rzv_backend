Users API Documentation

Base URL:

/api/users

1️⃣ Create User
POST /api/users

Description:
Create a new user.

Request Body:

{
  "name": "Raaz",
  "age": 23
}


Response (201):

{
  "_id": "objectId",
  "name": "Raaz",
  "age": 23,
  "createdAt": "ISODate",
  "updatedAt": "ISODate"
}


Validations:

Required fields must be provided

Invalid input returns 400 Bad Request

2️⃣ Get All Users (Pagination + Sorting)
GET /api/users

Query Params:

page (default: 1)

limit (default: 10)

sortBy (default: createdAt)

order (asc | desc, default: desc)

Features:

Pagination using skip & limit

Dynamic sorting

Metadata response

Example Request:

/api/users?page=1&limit=10&sortBy=name&order=asc


Response (200):

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

3️⃣ Get User by ID
GET /api/users/:id

Description:
Fetch a single user by ID.

Response (200):

{
  "_id": "objectId",
  "name": "Raaz",
  "age": 23
}


Errors:

404 Not Found if user does not exist

400 Bad Request for invalid ID

4️⃣ Update User
PUT /api/users/:id

Description:
Update an existing user.

Request Body:

{
  "name": "Raaz Updated",
  "age": 24
}


Response (200):

{
  "_id": "objectId",
  "name": "Raaz Updated",
  "age": 24,
  "updatedAt": "ISODate"
}


Errors:

400 Bad Request for invalid data

404 Not Found if user does not exist

5️⃣ Delete User
DELETE /api/users/:id

Description:
Delete a user by ID.

Response (200):

{
  "message": "User deleted successfully"
}


Errors:

404 Not Found if user does not exist

⚙️ Error Handling

Centralized error handler

Proper HTTP status codes

Client errors → 400

Server errors → 500

🧠 Notes / Learnings

Implemented layered architecture:

Controller

Service

Repository

Pagination using MongoDB skip & limit

Sorting with dynamic fields

Debugged query param mismatch between controller & service

Learned proper error classification
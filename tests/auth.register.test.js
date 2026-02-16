require("dotenv").config({ path: ".env.test" });
const request = require('supertest');
const app = require('../src/app');
const mongoose = require('mongoose');
const connectDB = require('../src/config/db');

beforeAll(async () => {
    await connectDB();
});

// afterEach(async () => {
//     if (mongoose.connection.readyState === 1) {
//         await mongoose.connection.db.collection("users").deleteMany({});
//     }
// });

afterAll(async () => {
    await mongoose.connection.close();
});

describe("Auth Module - Register", () => {
    it("should regiter a new user successfully", async () => {

        const res = await request(app)
            .post("/api/register")
            .send({
                name: "Test User",
                email: "testuser@gmail.com",
                password: "Password123",
                confirmPassword: "Password123"
            });
        expect(res.statusCode).toBe(201);

        expect(res.body).toHaveProperty("message");
    });
});
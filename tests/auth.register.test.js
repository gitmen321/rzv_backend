
if (process.env.NODE_ENV !== "production"){
require("dotenv").config({ path: ".env.test" });
}

const request = require('supertest');
const app = require('../src/app');
const mongoose = require('mongoose');
const connectDB = require('../src/config/db');

const User = require("../src/models/User");
const testEmail = "testeduser@gmail.com";

beforeAll(async () => {
    await connectDB();
});


afterAll(async () => {
    await User.deleteOne({ email: testEmail });

    await mongoose.connection.close();
});

describe("Auth Module - Register", () => {
    it("should register a new user successfully", async () => {

        const res = await request(app)
            .post("/api/register")
            .send({
                name: "New Test User",
                email: testEmail,
                password: "Password123",
                confirmPassword: "Password123"
            });
        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty("message");
    });
});
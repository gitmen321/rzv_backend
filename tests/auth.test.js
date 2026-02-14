const request = require('supertest');
const app = require('../src/app');

describe("Auth Module - Register", () => {
    it("should regiter a new user successfully", async () => {

        const res = await request(app)
            .post("/api/auth/register")
            .send({
                name: "Test User",
                email: "testuser@gmail.com",
                password: "Password123"
            });
        expect(res.statusCode).toBe(201);

        expect(res.body).toHaveProperty("message");
    });
});
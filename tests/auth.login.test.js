require("dotenv").config({ path: ".env.test" });
const request = require('supertest');
const app = require('../src/app');
const mongoose = require('mongoose');
const connectDB = require('../src/config/db');


describe("Auth Module - Login", () => {


    beforeAll(async () => {
        await connectDB();
    });



    afterAll(async () => {
        await mongoose.connection.close();
    });

    it("should login successfully with correct credentials", async () => {

        const res = await request(app)
            .post("/api/login")
            .send({
                email: "testuser@gmail.com",
                password: "Password123",
            });
        expect(res.statusCode).toBe(200);

        expect(res.body).toHaveProperty("user");
        expect(res.body.user).toHaveProperty("accessToken");
        expect(res.body.user).toHaveProperty("refreshToken");

        expect(res.body).toHaveProperty("message", "login successful");
    });

    //2 wrong password
    it("should fail login if password is worng", async () => {
        const res = await request(app)
            .post("/api/login")
            .send({
                email: "testuser@gmail.com",
                password: "wrongPassword",
            });
        expect(res.statusCode).toBe(401);

        expect(res.body).toHaveProperty("message");
    });

    //3User not found
    it("should fail login if user doedn't exist", async () => {

        const res = await request(app)
            .post("/api/login")
            .send({
                email: "raaz321@gmail.com",
                password: "wrongPassword",
            });

        expect(res.statusCode).toBe(403);
        expect(res.body).toHaveProperty("message");
    })
});
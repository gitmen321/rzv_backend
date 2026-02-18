require("dotenv").config({ path: ".env.test" });

const request = require("supertest");
const app = require("../src/app");
const User = require("../src/models/User");
const mongoose = require("mongoose");
const connectDB = require("../src/config/db");

describe("Auth module - verify-email", () => {

  beforeAll(async () => {
    await connectDB();
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("should verify email successfully with valid token", async () => {

    // Step 1: Register user
    await request(app).post("/api/register").send({
      name: "TEST USER",
      email: "verifyuser@gmail.com",
      password: "Password123",
      confirmPassword: "Password123",
    });

    // Step 2: Fetch user from DB
    const user = await User.findOne({ email: "verifyuser@gmail.com" });

    expect(user).toBeTruthy();
    expect(user.isEmailVerified).toBe(false);

    // Step 3: Generate raw token manually
    const rawToken = user.createEmailVerificationToken();
    await user.save();

    // Step 4: Call verify endpoint
    const res = await request(app).get(`/api/verify-email/${rawToken}`);

    // Step 5: Assertions
    expect(res.statusCode).toBe(200);

    const updatedUser = await User.findOne({
      email: "verifyuser@gmail.com",
    });

    expect(updatedUser.isEmailVerified).toBe(true);
    expect(updatedUser.emailVerifyToken).toBeUndefined();
  });

  it("should fail if token is invalid", async () => {

    const res = await request(app).get(
      "/api/verify-email/wrongtoken123"
    );

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("INVALID_TOKEN_FORMAT");
  });

  it("should fail if token already used", async () => {

    // Step 1: Register user
    await request(app).post("/api/register").send({
      name: "Used Token User",
      email: "usedtoken@gmail.com",
      password: "Password123",
      confirmPassword: "Password123",
    });

    const user = await User.findOne({ email: "usedtoken@gmail.com" });

    // Step 2: Generate token manually
    const rawToken = user.createEmailVerificationToken();
    await user.save();

    // Step 3: First verify → success
    await request(app).get(`/api/verify-email/${rawToken}`);

    // Step 4: Second verify → should fail
    const res2 = await request(app).get(`/api/verify-email/${rawToken}`);

    expect(res2.statusCode).toBe(400);
    expect(res2.body.message).toBe("TOKEN_INVALID_OR_EXPIRED");
  });

});
import { describe, it, beforeAll, afterAll } from "@jest/globals";
import express from "express";
import request from "supertest";
import { Database } from "../../src/Database/Database";
import { HttpServer } from "../../src/server/HttpsServer";
import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";

describe("UserController Endpoints", () => {
  const app = express();
  const server = new HttpServer(app);
  const database = new Database();
  let userId: string;
  let authToken: string;

  beforeAll(async () => {
    await database.init();
    server.start();

    const response = await request(app)
      .post("/api/auth/sign-up")
      .set("Content-Type", "application/json")
      .send({
        displayName: "john doev2",
        username: "johndoe_userv2",
        passwordHash: "secret_passv2",
      });
    userId = response.body.id;
    authToken = response.body.token;
  });

  it("should return all users", async () => {
    const response = await request(app)
      .get("/api/user/all-users?id=" + userId)
      .set("Authorization", `Bearer ${authToken}`);

    expect(response.status).toBe(StatusCodes.OK);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it("should return user by id", async () => {
    const response = await request(app)
      .get(`/api/user/${userId}`)
      .set("Authorization", `Bearer ${authToken}`);

    expect(response.status).toBe(StatusCodes.OK);
    expect(response.body).toHaveProperty("username", "johndoe_userv2");
  });

  it("should update user details", async () => {
    const updatedData = {
      id: userId,
      displayName: "John Doe Updated",
    };

    const response = await request(app)
      .put("/api/user/update")
      .set("Authorization", `Bearer ${authToken}`)
      .send(updatedData);

    expect(response.status).toBe(StatusCodes.OK);
    expect(response.body).toHaveProperty("displayName", "John Doe Updated");
  });

  it("should delete user", async () => {
    const response = await request(app)
      .delete(`/api/user/delete/${userId}`)
      .set("Authorization", `Bearer ${authToken}`);

    expect(response.status).toBe(StatusCodes.OK);
    expect(response.body.message).toBe("User deleted successfully");
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });
});

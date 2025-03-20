import { describe, it, beforeAll, afterAll } from "@jest/globals";
import express from "express";
import request from "supertest";
import { Database } from "../../src/Database/Database";
import { HttpServer } from "../../src/server/HttpsServer";
import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";

describe("Auth Endpoint Tests", () => {
  const app = express();
  const server = new HttpServer(app);
  const database = new Database();
  let userId: string;
  let authToken: string;

  beforeAll(async () => {
    await database.init();
    server.start();
  });

  it("should create a user and return a token", async () => {
    const response = await request(app)
      .post("/api/auth/sign-up")
      .set("Content-Type", "application/json")
      .send({
        displayName: "john doev1",
        username: "johndoe_userv1",
        passwordHash: "secret_passv1",
      });

    expect(response.status).toBe(StatusCodes.CREATED);
    expect(response.body).toHaveProperty("token");
    expect(response.body).toHaveProperty("id");
    userId = response.body.id;
    authToken = response.body.token;
  });

  it("should sign in a user and return a token", async () => {
    const response = await request(app)
      .post("/api/auth/sign-in")
      .set("Content-Type", "application/json")
      .send({
        username: "johndoe_userv1",
        password: "secret_passv1",
      });

    expect(response.status).toBe(StatusCodes.OK);
    expect(response.body).toHaveProperty("token");
  });

  afterAll(async () => {
    await request(app)
      .delete(`/api/user/delete/${userId}`)
      .set("Authorization", `Bearer ${authToken}`);
    await mongoose.connection.close();
  });
});

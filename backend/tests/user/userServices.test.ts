import express from "express";
import request from "supertest";
import { HttpServer } from "../../src/server/HttpsServer";
import { Database } from "../../src/Database/Database";
import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";

describe("test user services", () => {
  const app = express();
  const server = new HttpServer(app);
  const database = new Database();
  let userId: string;
  let authToken: string;
  const postId = "64d8391f1c4d88a1f0a5fbcc";

  beforeAll(async () => {
    await database.init();
    server.start();
  });

  it("should add post to user", async () => {
    const response1 = await request(app)
      .post("/api/auth/sign-up")
      .set("Content-Type", "application/json")
      .send({
        displayName: "john doev4",
        username: "johndoe_userv4",
        passwordHash: "secret_passv3",
      });

    userId = response1.body.id;
    authToken = response1.body.token;

    const response = await request(app)
      .post("/api/user/add-post")
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        id: userId,
        postId,
      });

    expect(response.status).toBe(StatusCodes.OK);

    await request(app)
      .delete(`/api/user/delete/${userId}`)
      .set("Authorization", `Bearer ${authToken}`);
  });

  afterAll(async ()=>{
    await mongoose.connection.close();
  })
});

import request from 'supertest';
import { describe, it, afterEach } from "@jest/globals";
import { PostsModel } from "../../src/Models/Posts";
import { CommentModel } from "../../src/Models/Comment";
import { HttpServer } from "../../src/server/HttpsServer";
import sinon from 'sinon';
import express from "express";
import { Auth } from '../../src/Auth/Auth';
import mongoose from 'mongoose';

describe('Should test the Comment flow', () => {
  const app = express();
  let testApp: HttpServer;
  let accessToken: string;
  const tokenID = "64d8391f1c4d88a1f0a5fbcc";

  const postModel = new PostsModel();
  const commentModel = new CommentModel();
  const auth = new Auth();

  beforeAll(() => {
    testApp = new HttpServer(app);
    testApp.start();
    accessToken = auth.generateAccessToken(tokenID);
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should return 200 and create a comment', async () => {
    const mockComment = {
      id: tokenID,
      author: '64d8391f1c4d88a1f0a5fbcc',
      post: '64d8392e2c4d88a1f0a5fbbb',
      body: 'Test comment body'
    };

    sinon.stub(postModel.model!, 'findById').resolves({});
    sinon.stub(commentModel.model!, 'create').resolves({ 
      ...mockComment, 
      _id: new mongoose.Types.ObjectId() 
    } as any);
    sinon.stub(postModel.model!, 'findOneAndUpdate').resolves({});

    const response = await request(testApp.getApp())
      .post('/api/comment/create-comment')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(mockComment);

    expect(response.statusCode).toEqual(200);
  });

  it('should return 200 and get all comments', async () => {
    sinon.stub(commentModel.model!, 'find').resolves([]);

    const response = await request(testApp.getApp())
      .get('/api/comment/get-all-comments')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ id: tokenID });

    expect(response.statusCode).toEqual(200);
  });

  it('should return 200 and get comment by id', async () => {
    const commentId = new mongoose.Types.ObjectId();
    
    sinon.stub(commentModel.model!, 'findById').resolves({
      _id: commentId,
      author: tokenID,
      body: 'Test comment'
    });

    const response = await request(testApp.getApp())
      .get(`/api/comment/get-comment-by-id/${commentId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ id: tokenID });

    expect(response.statusCode).toEqual(200);
  });

  it('should return 200 and edit comment', async () => {
    const mockEdit = {
      id: tokenID,
      commentId: new mongoose.Types.ObjectId(),
      body: 'Updated comment body'
    };

    sinon.stub(commentModel.model!, 'findById').resolves({});
    sinon.stub(commentModel.model!, 'findByIdAndUpdate').resolves({});

    const response = await request(testApp.getApp())
      .put('/api/comment/edit-comment')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(mockEdit);

    expect(response.statusCode).toEqual(200);
  });

  it('should return 200 and delete comment', async () => {
    const mockDelete = {
      id: tokenID,
      commentId: new mongoose.Types.ObjectId()
    };

    sinon.stub(commentModel.model!, 'findById').resolves({
      post: new mongoose.Types.ObjectId()
    });
    sinon.stub(commentModel.model!, 'findByIdAndDelete').resolves({});
    sinon.stub(postModel.model!, 'findOneAndUpdate').resolves({});

    const response = await request(testApp.getApp())
      .delete('/api/comment/delete-comment')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(mockDelete);

    expect(response.statusCode).toEqual(200);
  });

  it('should return 200 and add reply to comment', async () => {
    const mockReply = {
      id: tokenID,
      commentId: new mongoose.Types.ObjectId(),
      author: tokenID,
      replyBody: 'Test reply body'
    };

    sinon.stub(commentModel.model!, 'findById').resolves({
      post: new mongoose.Types.ObjectId()
    });
    sinon.stub(commentModel.model!, 'create').resolves({ 
      _id: new mongoose.Types.ObjectId() 
    } as any);
    sinon.stub(commentModel.model!, 'findByIdAndUpdate').resolves({});

    const response = await request(testApp.getApp())
      .put('/api/comment/add-reply')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(mockReply);

    expect(response.statusCode).toEqual(200);
  });

  it('should return 200 and delete reply', async () => {
    const mockDeleteReply = {
      id: tokenID,
      commentId: new mongoose.Types.ObjectId(),
      replyId: new mongoose.Types.ObjectId()
    };

    sinon.stub(commentModel.model!, 'findById')
      .onFirstCall().resolves({}) // parent comment
      .onSecondCall().resolves({ isReply: true }); // reply
    sinon.stub(commentModel.model!, 'findByIdAndDelete').resolves({});
    sinon.stub(commentModel.model!, 'findByIdAndUpdate').resolves({});

    const response = await request(testApp.getApp())
      .delete('/api/comment/delete-reply')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(mockDeleteReply);

    expect(response.statusCode).toEqual(200);
  });
}); 
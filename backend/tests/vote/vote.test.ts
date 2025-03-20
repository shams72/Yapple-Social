import request from 'supertest';
import { describe, it, afterEach } from "@jest/globals";
import { VoteModel } from "../../src/Models/Vote";
import { HttpServer } from "../../src/server/HttpsServer";
import sinon from 'sinon';
import express from "express";
import { Auth } from '../../src/Auth/Auth';
import mongoose from 'mongoose';

describe('Should test the Vote flow', () => {
  const app = express();
  let testApp: HttpServer;
  let accessToken: string;
  const tokenID = "64d8391f1c4d88a1f0a5fbcc";

  const voteModel = new VoteModel();
  const auth = new Auth();

  beforeAll(() => {
    testApp = new HttpServer(app);
    testApp.start();
    accessToken = auth.generateAccessToken(tokenID);
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should return 200 and create an upvote', async () => {
    const mockVote = {
      id: tokenID,
      targetId: new mongoose.Types.ObjectId().toString(),
      targetModel: 'Post',
      voteType: 'upvote'
    };

    // No existing vote
    sinon.stub(voteModel.model!, 'findOne').resolves(null);
    sinon.stub(voteModel.model!, 'create').resolves({
      ...mockVote,
      _id: new mongoose.Types.ObjectId()
    } as any);

    const response = await request(testApp.getApp())
      .post('/api/vote/create')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(mockVote);

    expect(response.statusCode).toEqual(200);
    expect(response.body.message).toBe('Vote created successfully');
  });

  it('should return 200 and remove existing vote when same vote type exists', async () => {
    const mockVote = {
      id: tokenID,
      targetId: new mongoose.Types.ObjectId().toString(),
      targetModel: 'Post',
      voteType: 'upvote'
    };

    // Existing vote of same type
    sinon.stub(voteModel.model!, 'findOne').resolves({
      _id: new mongoose.Types.ObjectId(),
      ...mockVote
    } as any);
    sinon.stub(voteModel.model!, 'findByIdAndDelete').resolves({});

    const response = await request(testApp.getApp())
      .post('/api/vote/create')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(mockVote);

    expect(response.statusCode).toEqual(200);
    expect(response.body.message).toBe('Vote removed successfully');
  });

  it('should return 200 and switch vote type when opposite vote exists', async () => {
    const mockVote = {
      id: tokenID,
      targetId: new mongoose.Types.ObjectId().toString(),
      targetModel: 'Post',
      voteType: 'upvote'
    };

    // First findOne for same vote type
    const findOneStub = sinon.stub(voteModel.model!, 'findOne');
    findOneStub.onFirstCall().resolves(null);
    // Second findOne for opposite vote type
    findOneStub.onSecondCall().resolves({
      _id: new mongoose.Types.ObjectId(),
      ...mockVote,
      voteType: 'downvote'
    } as any);

    sinon.stub(voteModel.model!, 'findByIdAndDelete').resolves({});
    sinon.stub(voteModel.model!, 'create').resolves({
      ...mockVote,
      _id: new mongoose.Types.ObjectId()
    } as any);

    const response = await request(testApp.getApp())
      .post('/api/vote/create')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(mockVote);

    expect(response.statusCode).toEqual(200);
    expect(response.body.message).toBe('Vote created successfully');
  });

  it('should return 200 and delete vote', async () => {
    const mockVote = {
      id: tokenID,
      targetId: new mongoose.Types.ObjectId().toString(),
      targetModel: 'Post',
      voteType: 'upvote'
    };

    sinon.stub(voteModel.model!, 'findOne').resolves({
      _id: new mongoose.Types.ObjectId(),
      ...mockVote
    } as any);
    sinon.stub(voteModel.model!, 'findByIdAndDelete').resolves({});

    const response = await request(testApp.getApp())
      .delete('/api/vote/delete')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(mockVote);

    expect(response.statusCode).toEqual(200);
    expect(response.body.message).toBe('Vote deleted successfully');
  });

  it('should return 200 and get all votes', async () => {
    sinon.stub(voteModel.model!, 'find').resolves([
      {
        _id: new mongoose.Types.ObjectId(),
        user: tokenID,
        targetId: new mongoose.Types.ObjectId(),
        targetModel: 'Post',
        voteType: 'upvote'
      }
    ] as any);

    const response = await request(testApp.getApp())
      .get('/api/vote/all')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ id: tokenID });

    expect(response.statusCode).toEqual(200);
    expect(response.body.message).toBe('Votes retrieved successfully');
  });

  it('should return 404 when vote not found for deletion', async () => {
    const mockVote = {
      id: tokenID,
      targetId: new mongoose.Types.ObjectId().toString(),
      targetModel: 'Post',
      voteType: 'upvote'
    };

    sinon.stub(voteModel.model!, 'findOne').resolves(null);

    const response = await request(testApp.getApp())
      .delete('/api/vote/delete')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(mockVote);

    expect(response.statusCode).toEqual(404);
  });
}); 
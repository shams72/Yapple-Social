import request from "supertest";
import { describe, it, afterEach } from "@jest/globals";
import { PostsModel } from "../../src/Models/Posts";
import { PostBodyModel } from "../../src/Models/PostBody";
import { CommunityModel  } from "../../src/Models/Community";
import { CommentModel } from "../../src/Models/Comment";
import { VoteModel } from "../../src/Models/Vote";
import {HttpServer} from  "../../src/server/HttpsServer"
import sinon from 'sinon';
import { Auth } from '../../src/Auth/Auth';
import express from "express";

describe('Should test the Post flow', () => {
  const app = express(); // Initialize the Express app
  let testApp: HttpServer;
  let accessToken: string;
  const tokenID = "64d8391f1c4d88a1f0a5fbcc";

  const postModel = new PostsModel();
  const postBodyModel = new PostBodyModel();
  const communityModel = new CommunityModel();
  const commentModel = new CommentModel();
  const voteModel = new VoteModel();
  const auth = new Auth();

    beforeAll(() => {
        testApp = new HttpServer(app);
        testApp.start();
        accessToken = auth.generateAccessToken(tokenID);
    });
        
    afterEach(() => {
        sinon.restore()
    });

    it('should return 200 and all posts', async () => {
        
        sinon.stub(postModel.model!, 'find').resolves();
        const response = await request(testApp.getApp()).get('/api/posts/get-all-post')
        .set('Authorization', `Bearer ${accessToken}`).send({id:tokenID});

    expect(response.statusCode).toEqual(200);
  });


    it('should return 200 and create Normal Post', async () => {
      const mockPost = {
        id: tokenID, 
        author: '64d8391f1c4d88a1f0a5fbcc', 
        title: 'Test Post Title', 
        body: '64d8392e2c4d88a1f0a5fbbb', 
        community: '64d8392e2c4d88a1f0a5fbcc', 
        postType: 'normal', 
        createdAt: '2024-12-14T00:00:00Z', 
        votes: '64d8392e2c4d88a1f0a5fbbb', 
        comments: '64d8393e2c4d88a1f0a5fbcc' 
      };
    
      sinon.stub(communityModel.model!, 'findById').resolves({});
      sinon.stub(postBodyModel.model!, 'findById').resolves({});
      sinon.stub(postModel.model!.prototype, 'save').resolves();
    
      const response = await request(testApp.getApp())
        .post('/api/posts/create-normal-post')
        .set('Authorization', `Bearer ${accessToken}`) 
        .send(mockPost);
    
      expect(response.statusCode).toEqual(200);
 
    });
    

   it('should return 200 and create Time Capsule Post', async () => {
      const mockPost = {
          id: tokenID, 
          author: '64d8391f1c4d88a1f0a5fbcc', 
          title: 'Test Post Title', 
          body: '64d8392e2c4d88a1f0a5fbbb', 
          community: '64d8392e2c4d88a1f0a5fbcc', 
          postType: 'timeCapsule', 
          createdAt: '2024-12-14T00:00:00Z', 
          expiresAt: '2024-12-21T00:00:00Z', 
          revealAt: '2023-12-21T00:00:00Z', 
          votes: '64d8392e2c4d88a1f0a5fbbb', 
          comments: '64d8393e2c4d88a1f0a5fbcc' 
        };
        
        sinon.stub(communityModel.model!, 'findById').resolves({});
        sinon.stub(postBodyModel.model!, 'findById').resolves({});
        sinon.stub(postModel.model!.prototype, 'save').resolves();
    
      const response = await request(testApp.getApp())
        .post('/api/posts/create-time-capsule-post').set('Authorization', `Bearer ${accessToken}`) 
        .send(mockPost); 
    
      expect(response.statusCode).toEqual(200);
    });

  it("should return 200 and create Self Destruct Post", async () => {
    const mockPost = {
        id: tokenID, 
        author: '64d8391f1c4d88a1f0a5fbcc', 
        title: 'Test Post Title', 
        body: '64d8392e2c4d88a1f0a5fbbb', 
        community: '64d8392e2c4d88a1f0a5fbcc', 
        postType: 'selfDestruct', 
        createdAt: '2024-12-14T00:00:00Z', 
        expiresAt: '2024-12-21T00:00:00Z', 
        votes: '64d8392e2c4d88a1f0a5fbbb', 
        comments: '64d8393e2c4d88a1f0a5fbcc' 
      };
    
      sinon.stub(communityModel.model!, 'findById').resolves({});
      sinon.stub(postBodyModel.model!, 'findById').resolves({});
      sinon.stub(postModel.model!.prototype, 'save').resolves();
  
    const response = await request(testApp.getApp())
      .post('/api/posts/create-self-destruct-post').set('Authorization', `Bearer ${accessToken}`) 
      .send(mockPost); 
  
    expect(response.statusCode).toEqual(200);
    },50000);

    
    it('should return 200 and delete the given post', async () => {
        const mock = {
          id: tokenID,
          postID: "64d8393e2c4d88a1f0a5fbcc"
        };

        sinon.stub(postModel.model!, 'findById').resolves({});      
        sinon.stub(postModel.model!, 'findByIdAndDelete').resolves({});
      
        const response = await request(testApp.getApp())
          .delete('/api/posts/delete-post-by-ID/'+mock.postID+'/'+mock.id).set('Authorization', `Bearer ${accessToken}`)  
      
        expect(response.statusCode).toEqual(200);
    },50000);

    it('should return 200 and add Comment To Existing Post', async () => {
        const mock = {
            id:  tokenID,
            postID:'64d8393e2c4d88a1f0a5fbcc',
            commentID: '64d8391f1c4d88a1f0a5fbef' 
        };
      
        sinon.stub(commentModel.model!, 'findById').resolves({});
        sinon.stub(postModel.model!, 'findById').resolves({});
        sinon.stub(postModel.model!, 'findOneAndUpdate').resolves({});
              
        const response = await request(testApp.getApp())
          .put('/api/posts/add-commentID-to-existing-post').set('Authorization', `Bearer ${accessToken}`) 
          .send(mock); 
      
        expect(response.statusCode).toEqual(200);
    },50000);

    it('should return 200 and remove Comment ID By Post ID ', async () => {
        const mock = {
            id: tokenID,
            postID:'64d8393e2c4d88a1f0a5fbcc',
            commentID: '64d8391f1c4d88a1f0a5fbef' 
        };

        
        sinon.stub(commentModel.model!, 'findById').resolves({});
        sinon.stub(postModel.model!, 'findById').resolves({});
        sinon.stub(postModel.model!, 'findOneAndUpdate').resolves(mock);
      
        const response = await request(testApp.getApp())
          .delete('/api/posts/remove-commentID-by-postID').set('Authorization', `Bearer ${accessToken}`)  
          .send(mock); 
      
        expect(response.statusCode).toEqual(200);
    },50000);

    it('should return 200 and remove All Comment By Post ID', async () => {
        const mock = {
            id: tokenID,
            postID:'64d8393e2c4d88a1f0a5fbcc',
            commentID: '64d8391f1c4d88a1f0a5fbef' 
        };

        sinon.stub(postModel.model!, 'findById').resolves({});      
        sinon.stub(postModel.model!, 'findOneAndUpdate').resolves();
      
        const response = await request(testApp.getApp())
          .delete('/api/posts/remove-all-commentID-by-postID').set('Authorization', `Bearer ${accessToken}`)  
          .send(mock); 
      
        expect(response.statusCode).toEqual(200);
    },50000);

    it('should return 200 and add Votes By Post ID', async () => {
        const mock = {
            id: tokenID,
            postID:'64d8393e2c4d88a1f0a5fbcc',
            voteID: '64d8391f1c4d88a1f0a5fbef' 
        };        
        
        sinon.stub(postModel.model!, 'findById').resolves({});
        sinon.stub(voteModel.model!, 'findById').resolves({});      
        sinon.stub(postModel.model!, 'findOneAndUpdate').resolves({});
      
        const response = await request(testApp.getApp())
          .put('/api/posts/add-voteID-to-existing-post').set('Authorization', `Bearer ${accessToken}`)  
          .send(mock); 
      
        expect(response.statusCode).toEqual(200);
    },50000);
});

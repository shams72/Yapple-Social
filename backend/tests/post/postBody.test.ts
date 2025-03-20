import request from 'supertest';
import { describe, it,afterEach} from "@jest/globals";
import { PostBodyModel } from "../../src/Models/PostBody";
import {HttpServer} from  "../../src/server/HttpsServer"
import sinon from 'sinon';
import mongoose from 'mongoose';
import express from "express";
import { Auth } from '../../src/Auth/Auth';


describe('Should test the PostBody flow', () => {
    const app = express(); // Initialize the Express app

    const postBodyModel = new PostBodyModel();
    const testApp= new HttpServer(app);
    testApp.start();


    const auth = new Auth();
    const tokenID="64d8391f1c4d88a1f0a5fbcc";
    const accessToken = auth.generateAccessToken(tokenID);
  
    
    afterEach(() => {
        sinon.restore()
    });

    it('should return 200 and save the post Body', async () => {
        
        const mockData = { 
            id: tokenID,
            text: "I am a string",
        };

        sinon.stub(postBodyModel.model!.prototype, 'save').resolves(mockData.text);
        const response = await request(testApp.getApp())
        .post('/api/postBody/add-postBody').set('Authorization', `Bearer ${accessToken}`) 
        .send(mockData); 
        
        expect(response.statusCode).toEqual(200);
    });

    it('should return 200 and get post body by id', async () => {
        const mock = {
            id: tokenID,
            postBodyID: new mongoose.Types.ObjectId(),
        };
      
        sinon.stub(postBodyModel.model!, 'findById').resolves(mock);
      
        const response = await request(testApp.getApp())
          .get('/api/postBody/get-text-postBody-by-ID/'+mock.postBodyID+'/'+mock.id).set('Authorization', `Bearer ${accessToken}`).send(mock);
      
        expect(response.statusCode).toEqual(200);
    });

    it('should return 200 and edit given post body', async () => {
        const mockPost = {
            userID: tokenID,
            postBodyID: new mongoose.Types.ObjectId(), 
        };
        
        sinon.stub(postBodyModel.model!, 'findById').resolves(mockPost);
      
        sinon.stub(postBodyModel.model!, 'findByIdAndUpdate').resolves(mockPost);
      
        const response = await request(testApp.getApp())
          .put('/api/postBody/edit-postBody').set('Authorization', `Bearer ${accessToken}`)  
          .send({ id: mockPost.userID,postBodyID: mockPost.postBodyID, text :"lorem ipsum"}); 
      
        expect(response.statusCode).toEqual(200);
    },50000);

    
    it('should return 404 when not found', async () => {
        const mockPost = {
            userID: tokenID,
            postBodyID: new mongoose.Types.ObjectId(), 
        };

        
        sinon.stub(postBodyModel.model!, 'findById').rejects();
      
        const response = await request(testApp.getApp())
          .put('/api/postBody/edit-postBody').set('Authorization', `Bearer ${accessToken}`)  
          .send({ id: mockPost.userID,postBodyID: mockPost.postBodyID, text :"lorem ipsum"}); 
      
        expect(response.statusCode).toEqual(404);
    },50000);
    
    it('should return 200 and delete Text Post Body', async () => {
        const mock = {
            id: tokenID,
            postBodyID: new mongoose.Types.ObjectId(), 
        };

        sinon.stub(postBodyModel.model!, 'findByIdAndUpdate').resolves(mock);
    
        const response = await request(testApp.getApp())
            .delete('/api/postBody/delete-text-PostBody').set('Authorization', `Bearer ${accessToken}`)  
            .send(mock); 
    
        expect(response.statusCode).toEqual(200);
    });

    it('should return 404 due to missing id on deletion', async () => {
        const mock = {
            id: tokenID,
            postBodyID: new mongoose.Types.ObjectId(), 
        };

        sinon.stub(postBodyModel.model!, 'findById').rejects();
    
        const response = await request(testApp.getApp())
            .delete('/api/postBody/delete-text-PostBody').set('Authorization', `Bearer ${accessToken}`)  
            .send(mock); 
    
        expect(response.statusCode).toEqual(404);
    }, 50000);
   

});

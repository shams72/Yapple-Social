import request from 'supertest';
import { describe, it,afterEach} from "@jest/globals";
import { PostsModel } from "../../src/Models/Posts";
import { CommunityModel  } from "../../src/Models/Community";
import {HttpServer} from  "../../src/server/HttpsServer"
import sinon from 'sinon';
import express from "express";
import { Auth } from '../../src/Auth/Auth';

describe('Should test the Post flow', () => {
  const app = express(); // Initialize the Express app
  let testApp: HttpServer;
  let accessToken: string;
  const tokenID = "64d8391f1c4d88a1f0a5fbcc";

  const postModel = new PostsModel();
  const communityModel = new CommunityModel();

  const auth = new Auth();

    beforeAll(() => {
        testApp = new HttpServer(app);
        testApp.start();
        accessToken = auth.generateAccessToken(tokenID);
    });
        
    afterEach(() => {
        sinon.restore()
    });

    it('should return 200 and create Community Post', async () => {
            const mockCommunity = {
                id: tokenID,
                name: "New Commufbnfgggfvnöfritrfkerfky",
                description: "This is a description of the new community.",
                bannerUrl: "https://example.com/banner.jpg"
            };

            sinon.stub(communityModel.model!, 'findOne').resolves(null);
            sinon.stub(communityModel.model!.prototype, 'save').resolves();
           
        const response = await request(testApp.getApp()).post('/api/community/create-community')
        .set('Authorization', `Bearer ${accessToken}`).send(mockCommunity);

        expect(response.statusCode).toEqual(200);

    },500000);

    it('should return 200 and edit Community Post name', async () => {
        const mockCommunity = {
            id: tokenID,
            communityID :"67630cfb4c94b0b97b88bb18",
            newName:"Happy Community",
            currentName:"Cool Community"
        };

        sinon.stub(communityModel.model!, 'findById').resolves({});
        sinon.stub(communityModel.model!, 'findOne')
        .onFirstCall().resolves(null)  
        .onSecondCall().resolves({});      
        sinon.stub(communityModel.model!, 'findOneAndUpdate').resolves({});
       
    const response = await request(testApp.getApp()).put('/api/community/edit-community-name')
    .set('Authorization', `Bearer ${accessToken}`).send(mockCommunity);

    expect(response.statusCode).toEqual(200);
    
    },500000);

    it('should return 200 and edit Community Post Description by ID', async () => {
        const mockCommunity = {
            id: tokenID,
            communityID :"67630cfb4c94b0b97b88bb18",
            newDescription:"new Description"   
        };

        sinon.stub(communityModel.model!, 'findById').resolves({});      
        sinon.stub(communityModel.model!, 'findByIdAndUpdate').resolves({});
       
    const response = await request(testApp.getApp()).put('/api/community/edit-community-description-by-ID')
    .set('Authorization', `Bearer ${accessToken}`).send(mockCommunity);

    expect(response.statusCode).toEqual(200);
    
    },500000);

    it('should return 200 and add Community Banner url', async () => {
        const mockCommunity = {
            id: tokenID,
            communityID :"67630cfb4c94b0b97b88bb18",
            bannerUrl:"https://example.com/banner.jpg"   
        };

        sinon.stub(communityModel.model!, 'findById').resolves({});      
        sinon.stub(communityModel.model!, 'findByIdAndUpdate').resolves({});
       
    const response = await request(testApp.getApp()).put('/api/community/add-banner-URL-by-ID')
    .set('Authorization', `Bearer ${accessToken}`).send(mockCommunity);

    expect(response.statusCode).toEqual(200);
    
    },500000);

    it('should return 200 and delete Community Banner url', async () => {
        const mockCommunity = {
            id: tokenID,
            communityID :"67630cfb4c94b0b97b88bb18",
        };

        sinon.stub(communityModel.model!, 'findById').resolves({});      
        sinon.stub(communityModel.model!, 'findByIdAndUpdate').resolves({});
       
    const response = await request(testApp.getApp()).delete('/api/community/delete-banner-URL-by-ID')
    .set('Authorization', `Bearer ${accessToken}`).send(mockCommunity);

    expect(response.statusCode).toEqual(200);
    
    },500000);

    it('should return 200 and add Post ID', async () => {
        const mockCommunity = {
            id: tokenID,
            communityID :"67630cfb4c94b0b97b88bb18",
            postID : "676306674ecc6e0c59c4d043",
        };

        sinon.stub(communityModel.model!, 'findById').resolves({});  
        sinon.stub(postModel.model!, 'findById').resolves({});      
        sinon.stub(communityModel.model!, 'findOneAndUpdate').resolves({});
       
    const response = await request(testApp.getApp()).put('/api/community/add-postID-by-communityID')
    .set('Authorization', `Bearer ${accessToken}`).send(mockCommunity);

    expect(response.statusCode).toEqual(200);
    
    },500000);

    it('should return 200 and delete Post ID', async () => {
        const mockCommunity = {
            id: tokenID,
            communityID :"67630cfb4c94b0b97b88bb18",
            postID : "676306674ecc6e0c59c4d043",
        };

        sinon.stub(communityModel.model!, 'findById').resolves({});  
        sinon.stub(postModel.model!, 'findById').resolves({});      
        sinon.stub(communityModel.model!, 'findOneAndUpdate').resolves({});
       
    const response = await request(testApp.getApp()).put('/api/community/delete-postID-by-communityID')
    .set('Authorization', `Bearer ${accessToken}`).send(mockCommunity);

    expect(response.statusCode).toEqual(200);
    
    },500000);

    it('should return 200 and add platform and link ID', async () => {
        const mockCommunity = {
            id: tokenID,
            communityID :"67630cfb4c94b0b97b88bb18",
            platform:"chat platform",
            url:"https://example.com/banner.jpg"   

        };

        sinon.stub(communityModel.model!, 'findById').resolves({});  
        sinon.stub(communityModel.model!, 'findOne').resolves(null);  
        sinon.stub(communityModel.model!, 'findOneAndUpdate').resolves({});
       
    const response = await request(testApp.getApp()).put('/api/community/add-platform-links-by-ID')
    .set('Authorization', `Bearer ${accessToken}`).send(mockCommunity);

    expect(response.statusCode).toEqual(200);
    
    },500000);

    it('should return 200 and edit platform name', async () => {
        const mockCommunity = {
            id: tokenID,
            communityID :"67630cfb4c94b0b97b88bb18",
            platform:"chat platform",
            newPlatform:"video platform"   

        };

        sinon.stub(communityModel.model!, 'findById').resolves({});  
        sinon.stub(communityModel.model!, 'findOne')
        .onFirstCall().resolves({})  
        .onSecondCall().resolves(null);    
        sinon.stub(communityModel.model!, 'findOneAndUpdate').resolves({});
       
    const response = await request(testApp.getApp()).put('/api/community/edit-platform-names-by-ID')
    .set('Authorization', `Bearer ${accessToken}`).send(mockCommunity);

    expect(response.statusCode).toEqual(200);
    
    },500000);

    it('should return 200 and edit platform link', async () => {
        const mockCommunity = {
            id: tokenID,
            communityID :"67630cfb4c94b0b97b88bb18",
            platform:"chat platform",
            url: 'https://link2.com',  

        };

        sinon.stub(communityModel.model!, 'findById').resolves({});  
        sinon.stub(communityModel.model!, 'findOne').resolves({});      
        sinon.stub(communityModel.model!, 'findOneAndUpdate').resolves({});
       
    const response = await request(testApp.getApp()).put('/api/community/edit-platform-links-by-ID')
    .set('Authorization', `Bearer ${accessToken}`).send(mockCommunity);

    expect(response.statusCode).toEqual(200);
    
    },500000);

    it('should return 200 and delete platform', async () => {
        const mockCommunity = {
            id: tokenID,
            communityID :"67630cfb4c94b0b97b88bb18",
            platform:"chat platform",

        };

        sinon.stub(communityModel.model!, 'findById').resolves({});  
        sinon.stub(communityModel.model!, 'findOne').resolves({});      
        sinon.stub(communityModel.model!, 'findOneAndUpdate').resolves({});
       
    const response = await request(testApp.getApp()).delete('/api/community/delete-platform-from-link-by-ID')
    .set('Authorization', `Bearer ${accessToken}`).send(mockCommunity);

    expect(response.statusCode).toEqual(200);
    
    },500000);

    it('should return 200 and get all community', async () => {
       

        sinon.stub(communityModel.model!, 'find').resolves();  
       
    const response = await request(testApp.getApp()).get('/api/community/get-all-community')
    .set('Authorization', `Bearer ${accessToken}`).send({id: tokenID});

    expect(response.statusCode).toEqual(200);
    
    },500000);




});
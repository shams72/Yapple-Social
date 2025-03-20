import { NextFunction, Request, Response } from "express";
import { PostsModel } from "../../Models/Posts";
import { PostBodyModel } from "../../Models/PostBody";
import { CommunityModel } from "../../Models/Community";
import { CommentModel } from "../../Models/Comment";
import { VoteModel } from "../../Models/Vote";
import { CommunitySchemas  } from "../../zodSchemas/Community";
import { Validator } from "../../utils/Validator";
import { CustomError } from "../../Error/Error";


export class CommunityController {
  private Posts: PostsModel;
  private PostBody:PostBodyModel;
  private CommunityModel: CommunityModel;
  private CommentModel: CommentModel;
  private VoteModel:VoteModel;

  constructor() {
    this.Posts = new PostsModel();
    this.PostBody = new PostBodyModel();
    this.CommunityModel = new CommunityModel();
    this.CommentModel = new CommentModel();
    this.VoteModel = new VoteModel();
  }

  public createCommunity = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validator = new Validator(CommunitySchemas.createCommunitySchema,req.body);
      validator.validate();

      const nameCheck = await this.CommunityModel.findCommunityByName(req.body.name);

      if(nameCheck){
          throw new CustomError("Community with this name exist",409);
      }

      const result = await this.CommunityModel.createCommunity(req.body);
      
      res.status(200).json({ message: "Community added successfully", data: result});

    } catch (error) {
      
      next(error);  
         
    }
  };

  public getAllCommunity = async (req: Request, res: Response, next: NextFunction) => {
    try {
      
      const result = await this.CommunityModel.model?.find()

      res.status(200).json({ message: "All Community found", data:result});

    } catch (error) {
      
      next(error);  
         
    }
  };

  public getTenCommunity = async (req: Request, res: Response, next: NextFunction) => {
    try {

      const ids = req.query.seenLastCommunityIDs;

      const communityIDs: string[] = Array.isArray(ids) && ids.every(id => typeof id === 'string') 
      ? ids 
      : [ids].filter(id => typeof id === 'string');

      const validator = new Validator(CommunitySchemas.IDSArraychema,  communityIDs);
      validator.validate();
                        
      const result = await this.CommunityModel.getTenCommunity(communityIDs)

      res.status(200).json({ message: "All Community found", data:result});

    } catch (error) {
      
      next(error);  
         
    }
  };
  
  public getCommunityByID = async (req: Request, res: Response, next: NextFunction) => {
    try {

      const validator = new Validator(CommunitySchemas.IDStringchema,  req.params.communityID);
      validator.validate();

      const result = await this.CommunityModel.findCommunityById(req.params.communityID);

      res.status(200).json({ message: "All Community found", data:result});

    } catch (error) {
      
      next(error);  
         
    }
  };
  
  public getThreeCommunityPosts = async (req: Request, res: Response, next: NextFunction) => {
    try {

      const ids = req.query.postID;

      if (typeof req.query.communityID !== 'string') {
        throw new CustomError("wrong type", 404);
      }
      
      const communityID = req.query.communityID;  
      
      const postIDs: string[] = Array.isArray(ids) && ids.every(id => typeof id === 'string') 
      ? ids 
      : [ids].filter(id => typeof id === 'string');

      const communityValidator = new Validator(CommunitySchemas.IDStringchema, communityID);
      communityValidator.validate();

      const postValidator = new Validator(CommunitySchemas.IDSArraychema,  postIDs);
      postValidator.validate();

      const result = await this.CommunityModel.findCommunityPostsById(communityID,  postIDs);
      
      res.status(200).json({ message: "All Communwity found", data:result});

    } catch (error) {
      
      next(error);  
         
    }
  };



  public editCommunityName = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validator = new Validator(CommunitySchemas.editNameSchema,req.body);
      validator.validate();

      const nameCheck = await this.CommunityModel.findCommunityById(req.body.communityID);

      if(!nameCheck){
          throw new CustomError("Community with this ID doesnot exist",404);
      }

      const dupCheck = await this.CommunityModel.findCommunityByName(req.body.newName);

      if(dupCheck){
          throw new CustomError("Duplicate Community with this suggested name exist",409);
      }

      const currentNameCheck = await this.CommunityModel.findCommunityByName(req.body.currentName);

      if(!currentNameCheck){
          throw new CustomError("Community with this name doesnot exist",409);
      }

      const result = await this.CommunityModel.updateName(req.body.currentName,req.body.newName);
      
      res.status(200).json({ message: "Community name changed successfully", data: result});

    } catch (error) {

      next(error);  
        
    }
  };
  
  public editCommunityDescription = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validator = new Validator(CommunitySchemas.editDescriptionSchema,req.body);
      validator.validate();

      const IDCheck = await this.CommunityModel.findCommunityById(req.body.communityID);

      if(!IDCheck){
          throw new CustomError("Community with this ID doesnot exist",404);
      }

      const result = await this.CommunityModel.updateDescription(req.body.communityID,req.body.newDescription);
      
      res.status(200).json({ message: "Community Description changed successfully", data: result});

    } catch (error) {
      
      next(error);  
      
    }
  };

  public addBannerURL = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validator = new Validator(CommunitySchemas.addBannerURLSchema,req.body);
      validator.validate();

      const IDCheck = await this.CommunityModel.findCommunityById(req.body.communityID);

      if(!IDCheck){
          throw new CustomError("Community with this ID doesnot exist",404);
      }

      const result = await this.CommunityModel.insertBannerField(req.body.communityID,req.body.bannerUrl);
      
      res.status(200).json({ message: "Community Banner changed successfully", data: result});

    } catch (error) {
      
      next(error);  
      
    }
  };

  public deleteBannerURL = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validator = new Validator(CommunitySchemas.deleteBannerURLSchema,req.body);
      validator.validate();

      const IDCheck = await this.CommunityModel.findCommunityById(req.body.communityID);

      if(!IDCheck) {
          throw new CustomError("Community with this ID doesnot exist",404);
      }

      const result = await this.CommunityModel.deleteBannerField(req.body.communityID);
      
      res.status(200).json({ message: "Community Banner deleted successfully", data: result});

    } catch (error) {
      
      next(error);  
      
    }
  };

  public addPostByID = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validator = new Validator(CommunitySchemas.addPostSchema,req.body);
      validator.validate();

      const IDCheck = await this.CommunityModel.findCommunityById(req.body.communityID);

      if(!IDCheck) {
          throw new CustomError("Community with this ID doesnot exist",404);
      }

      const postIDCheck = await this.Posts.findPostById(req.body.postID);

      if(!postIDCheck) {
          throw new CustomError("Community with this post ID doesnot exist",404);
      }

      this.CommunityModel.addPosts(req.body.communityID,req.body.postID);

      res.status(200).json({ message: "Community Post added successfully"});

    } catch (error) {
      
      next(error);  
      
    }
  };

  public deletePostID = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validator = new Validator(CommunitySchemas.removePostSchema,req.body);
      validator.validate();

      const IDCheck = await this.CommunityModel.findCommunityById(req.body.communityID);

      if(!IDCheck) {
          throw new CustomError("Community with this ID doesnot exist",404);
      }
     
      const postIDCheck = await this.Posts.findPostById(req.body.postID);

      if(!postIDCheck) {
          throw new CustomError("Community with this post ID doesnot exist",404);
      }

      await this.CommunityModel.deleteSinglePosts(req.body.communityID,req.body.postID)

      res.status(200).json({ message: "Community Post Deleted successfully"});

    } catch (error) {
      
      next(error);  
      
    }
  };

  public addPlatformLinksbyID = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validator = new Validator(CommunitySchemas.addLinksSchems,req.body);
      validator.validate();

      const IDCheck = await this.CommunityModel.findCommunityById(req.body.communityID);

      if(!IDCheck) {
          throw new CustomError("Community with this ID doesnot exist",404);
      }

      const checkNewPlatformNameExist = await this.CommunityModel.platformExists(req.body.communityID, req.body.platform)

      if(checkNewPlatformNameExist) {
        throw new CustomError("Platformwith suggested Name exists",404);
      }
     
      await this.CommunityModel.addPlatformLinksByID(req.body.communityID,req.body.platform,req.body.url);

      res.status(200).json({ message: "Community Platform added successfully"});

    } catch (error) {
      
      next(error);  
      
    }
  };

  public editPlatformNamesbyID = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validator = new Validator(CommunitySchemas.editPlatformfromLinkSchema, req.body);
      validator.validate();

      const IDCheck = await this.CommunityModel.findCommunityById(req.body.communityID);

      if(!IDCheck) {
          throw new CustomError("Community with this ID doesnot exist",404);
      }
      
      const platformExist = await this.CommunityModel.platformExists(req.body.communityID,req.body.platform)

      if(!platformExist){
        throw new CustomError("Platform Name doesnot exist",404);
      }

      const checkNewPlatformNameExist = await this.CommunityModel.platformExists(req.body.communityID,req.body.newPlatform)

      if(checkNewPlatformNameExist) {
        throw new CustomError("Platformwith sggested Name exists",404);
      }

      await this.CommunityModel.updatePlatformName(req.body.communityID,req.body.platform,req.body.newPlatform);

      res.status(200).json({ message: "Platform Name edited successfully"});

    } catch (error) {
      
      next(error);  
      
    }
  };

  public editPlatformLinksbyID = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validator = new Validator(CommunitySchemas.editURLfromLinkSchema, req.body);
      validator.validate();

      const IDCheck = await this.CommunityModel.findCommunityById(req.body.communityID);

      if(!IDCheck) {
          throw new CustomError("Community with this ID doesnot exist",404);
      }
      
      const platformExist = await this.CommunityModel.platformExists(req.body.communityID,req.body.platform)

      if(!platformExist){
        throw new CustomError("Platform Name doesnot exist",404);
      }

      await this.CommunityModel.updatePlatformLink(req.body.communityID,req.body.platform,req.body.url);

      res.status(200).json({ message: "Platform Link edited successfully"});

    } catch (error) {
      
      next(error);  
      
    }
  };

  public addAdminbyID = async (req: Request, res: Response, next: NextFunction) => {
    try {

      const communityValidator = new Validator(CommunitySchemas.IDStringchema,req.body.communityID);
      communityValidator.validate();

      const userValidator = new Validator(CommunitySchemas.IDStringchema,req.body.userID);
      userValidator.validate();

      const response = await this.CommunityModel.addMemberToCommunity(req.body.communityID,req.body.userID,"admin");

      res.status(200).json({ message: "Platform Link edited successfully",data:response});

    } catch (error) {
      
      next(error);  
      
    }
  };

  public addMembersbyID = async (req: Request, res: Response, next: NextFunction) => {
    try {

      const communityValidator = new Validator(CommunitySchemas.IDStringchema,req.body.communityID);
      communityValidator.validate();

      const userValidator = new Validator(CommunitySchemas.IDStringchema,req.body.userID);
      userValidator.validate();

      const response = await this.CommunityModel.addMemberToCommunity(req.body.communityID,req.body.userID,"member");

      res.status(200).json({ message: "Platform Link edited successfully",data:response});

    } catch (error) {
      
      next(error);  
      
    }
  };

  public removeMembersbyID = async (req: Request, res: Response, next: NextFunction) => {
    try {

      const communityValidator = new Validator(CommunitySchemas.IDStringchema,req.body.communityID);
      communityValidator.validate();

      const userValidator = new Validator(CommunitySchemas.IDStringchema,req.body.userID);
      userValidator.validate();

      const response = await this.CommunityModel.removeMemberFromCommunity(req.body.communityID,req.body.userID);

      res.status(200).json({ message: "User removed successfully",data:response});

    } catch (error) {
      
      next(error);  
      
    }
  };

  public deletePlatformfromLinkbyID = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validator = new Validator(CommunitySchemas.deletePlatformfromLinkSchema, req.body);
      validator.validate();

      const IDCheck = await this.CommunityModel.findCommunityById(req.body.communityID);

      if(!IDCheck) {
          throw new CustomError("Community with this ID doesnot exist",404);
      }
      
      const platformExist = await this.CommunityModel.platformExists(req.body.communityID,req.body.platform)

      if(!platformExist){
        throw new CustomError("Platform Name doesnot exist",404);
      }

      await this.CommunityModel.deletePlatformLink(req.body.communityID,req.body.platform);

      res.status(200).json({ message: "Platform Link deleted successfully"});

    } catch (error) {
      
      next(error);  
      
    }
  };





}

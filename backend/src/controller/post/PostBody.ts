import { NextFunction, Request, Response } from "express";
import { PostBodyModel } from "../../Models/PostBody";
import { PostBodySchemas } from "../../zodSchemas/PostBody";
import { Validator } from "../../utils/Validator";
import { CustomError } from "../../Error/Error";
export class PostBodyController {
  private PostBody: PostBodyModel;
  constructor() {
    this.PostBody = new PostBodyModel();
  }

  public addPostBody = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validator = new Validator(
        PostBodySchemas.uploadPostBodySchema,
        req.body
      );
      validator.validate();

      const result= await this.PostBody.createPostBody(req.body);

      res.status(200).json({ message: "Post Body added successfully" ,data: result._id});
    } catch (error) {
      next(error);
    }
  };

  public editPostBody = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validator = new Validator(PostBodySchemas.editPostBodySchema, req.body);
      validator.validate();

      console.log(req.body.postBodyID)
  
      const postBody = await this.PostBody.findPostBodyById(req.body.postBodyID);
  
      if (!postBody) {
        throw Error;
      }
  
      await this.PostBody.updatePostBodyById(req.body.id, "text", req.body.text);
         
      res.status(200).json({ message: "Post Body edited successfully" });
    } catch (error) {
   
        if (error instanceof Error) {
            next(new CustomError("ID doesnt exist", 404));  
        } 
      
    }
   };

   public getTextPostBodyByID = async (req: Request, res: Response, next: NextFunction) => {
    try {

      const validator = new Validator(PostBodySchemas.IDchecker,req.params.postBodyID);
      validator.validate();
      
      const postBodyID: string =  req.params.postBodyID;
      console.log(postBodyID);
  
      const postBody = await this.PostBody.findPostBodyById(postBodyID);
      if (!postBody) {
        throw Error;
      }
     
      res.status(200).json({ message: "Post Body Found successfully",data: postBody});
    } catch (error) {
   
        if (error instanceof Error) {
            next(new CustomError("ID doesnt exist", 404));  
        } 
      
    }
   };

   public deleteTextPostBody = async (req: Request, res: Response, next: NextFunction) => {
    try {
      
      const validator = new Validator(PostBodySchemas.IDchecker,req.body.postBodyID);
      validator.validate();
      
      const postBody = await this.PostBody.deleteContentsFromPostBody(req.body.postBodyID, "text");

      if (!postBody) {
        throw Error;
      }
      
      res.status(200).json({ message: "Text deleted successfully" });
    } catch (error) {
   
        if (error instanceof Error) {
            next(new CustomError("ID doesnt exist", 404));  
        } 
      
    }
   };
   
}

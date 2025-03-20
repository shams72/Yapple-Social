import { NextFunction, Request, Response } from "express";
import { UserModel } from "../../Models/User";
import { UserSchemas } from "../../zodSchemas/User";
import { Validator } from "../../utils/Validator";
import { Types } from "mongoose";

export class UserServicesController {
  private user: UserModel;
  constructor() {
    this.user = new UserModel();
  }

  public addFollower = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const validator = new Validator(UserSchemas.addFollowerSchema, req.body);
      validator.validate();

      const { id, followerId } = req.body;
      const objectId = new Types.ObjectId(String(id));
      const objectIdFollower = new Types.ObjectId(String(followerId));
      await this.user.addFollower(objectId, objectIdFollower);
      await this.user.addFollowing(objectIdFollower, objectId);

      res.status(200).json({ message: "Follower added successfully" });
    } catch (error) {
      next(error);
    }
  };

  public removeFollower = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const validator = new Validator(
        UserSchemas.removeFollowerSchema,
        req.body
      );
      validator.validate();

      const { id, followerId } = req.body;
      const objectId = new Types.ObjectId(String(id));
      const objectIdFollower = new Types.ObjectId(String(followerId));
      await this.user.removeFollower(objectId, objectIdFollower);
      await this.user.addFollowing(objectIdFollower, objectId);

      res.status(200).json({ message: "Follower removed successfully" });
    } catch (error) {
      next(error);
    }
  };

  public addFollowing = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const validator = new Validator(UserSchemas.addFollowingSchema, req.body);
      validator.validate();

      const { id, followingId } = req.body;
      const objectId = new Types.ObjectId(String(id));
      const objectIdFollowing = new Types.ObjectId(String(followingId));
      await this.user.addFollowing(objectId, objectIdFollowing);
      await this.user.addFollower(objectIdFollowing, objectId);

      res.status(200).json({ message: "Following added successfully" });
    } catch (error) {
      next(error);
    }
  };

  public removeFollowing = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const validator = new Validator(
        UserSchemas.removeFollowingSchema,
        req.body
      );
      validator.validate();

      const { id, followingId } = req.body;
      const objectId = new Types.ObjectId(String(id));
      const objectIdFollowing = new Types.ObjectId(String(followingId));
      await this.user.removeFollowing(objectId, objectIdFollowing);
      await this.user.removeFollower(objectIdFollowing, objectId);

      res.status(200).json({ message: "Following removed successfully" });
    } catch (error) {
      next(error);
    }
  };

  public getTenSuggestion = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const validator = new Validator(
        UserSchemas.getTenSuggetionSchema,
        req.body
      );
      validator.validate();

      const page = req.body.page;
      const nextSuggetions = await this.user.getNextSuggetions(page);
      console.log(nextSuggetions);

      res.json({ suggestions: nextSuggetions });
    } catch (error) {
      next(error);
    }
  };

  public addPost = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validator = new Validator(UserSchemas.addPostSchema, req.body);
      validator.validate();

      const { id, postId } = req.body;
      const objectId = new Types.ObjectId(String(id));
      const PostobjectId = new Types.ObjectId(String(postId));
      await this.user.addPost(objectId, PostobjectId);

      res.status(200).json({ message: "Post added successfully" });
    } catch (error) {
      next(error);
    }
  };

  public removePost = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const validator = new Validator(UserSchemas.removePostSchema, req.body);
      validator.validate();

      const { id, postId } = req.body;
      const objectId = new Types.ObjectId(String(id));
      const PostobjectId = new Types.ObjectId(String(postId));
      await this.user.removePost(objectId, PostobjectId);

      res.status(200).json({ message: "Post removed successfully" });
    } catch (error) {
      next(error);
    }
  };

  public updateBanner = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const validator = new Validator(UserSchemas.updateBanner, req.body);
      validator.validate();

      const { id, url } = req.body;
      const objectId = new Types.ObjectId(String(id));
      await this.user.updateBannerPictureUrl(objectId, url);
      res.json({
        url: url,
      });
    } catch (error) {
      next(error);
    }
  };

  public updateProfile = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const validator = new Validator(UserSchemas.updateProfile, req.body);
      validator.validate();

      const { id, url } = req.body;
      const objectId = new Types.ObjectId(String(id));
      await this.user.upadteProfileUrl(objectId, url);
      res.json({
        url: url,
      });
    } catch (error) {
      next(error);
    }
  };
}

import { NextFunction, Request, Response } from "express";
import { VoteModel } from "../../Models/Vote";
import { VoteSchemas } from "../../zodSchemas/Vote";
import { Validator } from "../../utils/Validator";
import { CustomError } from "../../Error/Error";
import { Auth } from "../../Auth/Auth";
import { WebsocketServer } from "../../server/WebsockerServer";
import { PostsModel } from "../../Models/Posts";
import { NotificationsController } from "../notification/NotificationsController";
import {
  NotificationDocument,
  NotificationModel,
} from "../../Models/Notification";
import mongoose, { Schema } from "mongoose";

export class VoteController {
  private VoteModel: VoteModel;
  private auth: Auth;

  constructor() {
    this.VoteModel = new VoteModel();
    this.auth = new Auth();
  }

  // voting system:
  // 1. validate input
  // 2. get user ID
  // 3. if same vote exists, remove it
  // 4. if opposite vote exists, remove it
  // 5. create new vote
  public createVote = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const validator = new Validator(VoteSchemas.createVoteSchema, req.body);
      validator.validate();

      // get user ID from auth
      const userId = this.auth.getIdFromToken(req);

      // check if vote exists
      const existingVote = await this.VoteModel.model?.findOne({
        user: userId,
        targetId: req.body.targetId,
        targetModel: req.body.targetModel,
        voteType: req.body.voteType,
      });

      if (existingVote) {
        // if same vote type exists, delete it
        await this.VoteModel.model?.findByIdAndDelete(existingVote._id);

        res.status(200).json({
          message: "Vote removed successfully",
        });
        return;
      }

      // check for opposite vote
      const oppositeVoteType =
        req.body.voteType === "upvote" ? "downvote" : "upvote";
      const oppositeVote = await this.VoteModel.model?.findOne({
        user: userId,
        targetId: req.body.targetId,
        targetModel: req.body.targetModel,
        voteType: oppositeVoteType,
      });

      if (oppositeVote) {
        await this.VoteModel.model?.findByIdAndDelete(oppositeVote._id);
      }

      // create new vote
      const newVote = await this.VoteModel.model?.create({
        user: userId,
        targetId: req.body.targetId,
        targetModel: req.body.targetModel,
        voteType: req.body.voteType,
      });
      res.status(200).json({
        message: "Vote created successfully",
        data: newVote,
      });

      if (req.body.voteType === "downvote") {
        return;
      }

      const webSocketInstance = WebsocketServer.getSingletonInstance();
      let publisherId = "";

      const postId :string = req.body.targetId;
      if (req.body.targetModel == "Post") {
       
        const postModel = new PostsModel();

        const post = await postModel.findPostById(postId);
        publisherId = String(post?.author);
      }

      webSocketInstance.sendToClientWithId(
        userId,
        publisherId,
        "someone has upvoted",
        "text"
      );

      const notification = {
        user: new mongoose.Types.ObjectId(publisherId),
        notificationType: "new_vote",
        actor: new mongoose.Types.ObjectId(userId),
        relatedEntity:new mongoose.Types.ObjectId(postId),
        isRead: false,
      };

      const model = new NotificationModel();
      await model.model?.create(notification);
    } catch (error) {
      next(error);
    }
  };

  public deleteVote = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const validator = new Validator(VoteSchemas.deleteVoteSchema, req.body);
      validator.validate();

      const userId = this.auth.getIdFromToken(req);

      const vote = await this.VoteModel.model?.findOne({
        user: userId,
        targetId: req.body.targetId,
        targetModel: req.body.targetModel,
        voteType: req.body.voteType,
      });

      if (!vote) {
        throw new CustomError("Vote not found", 404);
      }

      await this.VoteModel.model?.findByIdAndDelete(vote._id);

      res.status(200).json({
        message: "Vote deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  };

  public getAllVotes = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const votes = await this.VoteModel.model?.find();
      res.status(200).json({
        message: "Votes retrieved successfully",
        data: votes,
      });
    } catch (error) {
      next(error);
    }
  };

  public getVotesByTarget = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const validator = new Validator(VoteSchemas.getVotesSchema, {
        id: req.query.id, // Extract id from query
        targetId: req.params.targetId, // Extract targetId from params
        targetModel: req.params.targetModel, // Extract targetModel from params
      });
      validator.validate();

      const votes = await this.VoteModel.model?.find({
        targetId: req.params.targetId,
        targetModel: req.params.targetModel,
      });

      // Calculate vote counts
      const upvotes =
        votes?.filter((vote) => vote.voteType === "upvote").length || 0;
      const downvotes =
        votes?.filter((vote) => vote.voteType === "downvote").length || 0;
      const total = upvotes - downvotes;

      res.status(200).json({
        message: "Votes retrieved successfully",
        data: {
          upvotes,
          downvotes,
          total,
          votes,
        },
      });
    } catch (error) {
      next(error);
    }
  };
}

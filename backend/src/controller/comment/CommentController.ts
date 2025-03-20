import { NextFunction, Request, Response } from "express";
import { PostsModel } from "../../Models/Posts";
import { CommentModel } from "../../Models/Comment";
import { Validator } from "../../utils/Validator";
import { CustomError } from "../../Error/Error";
import { CommentSchemas } from "../../zodSchemas/Comment";
import { WebsocketServer } from "../../server/WebsockerServer";
import mongoose, { Schema } from "mongoose";
import { NotificationModel } from "../../Models/Notification";
import { Auth } from "../../Auth/Auth";
export class CommentController {
  private Posts: PostsModel;
  private CommentModel: CommentModel;
  private auth: Auth;

  constructor() {
    this.Posts = new PostsModel();
    this.CommentModel = new CommentModel();
    this.auth = new Auth();
  }

  public createComment = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const validator = new Validator(
        CommentSchemas.createCommentSchema,
        req.body
      );
      validator.validate();

      const postCheck = await this.Posts.findPostById(req.body.post);
      if (!postCheck) {
        throw new CustomError("Post with this ID does not exist", 404);
      }

      const result = await this.CommentModel.createComment({
        author: req.body.author,
        post: req.body.post,
        body: req.body.body,
        isReply: false,
      });

      if (!result?._id) {
        throw new CustomError("Failed to create comment", 500);
      }

      await this.Posts.addCommentToPost(req.body.post, result._id.toString());

      res.status(200).json({
        message: "Comment created successfully",
        data: result,
      });
      const webSocketInstance = WebsocketServer.getSingletonInstance();
      let publisherId = "";

      const postId = req.body.post;
      const postModel = new PostsModel();

      const post = await postModel.findPostById(postId);
      publisherId = String(post?.author);
      console.log(publisherId);

      const userId = this.auth.getIdFromToken(req);

      webSocketInstance.sendToClientWithId(
        userId,
        publisherId,
        "someone has upvoted",
        "text"
      );

      const notification = {
        user: new mongoose.Types.ObjectId(publisherId),
        notificationType: "new_comment",
        actor: new mongoose.Types.ObjectId(userId),
        relatedEntity: new mongoose.Types.ObjectId(req.body.post),
        isRead: false,
      };

      const model = new NotificationModel();
      await model.model?.create(notification);
    } catch (error) {
      next(error);
    }
  };

  public getCommentCount = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const id = req.params.id;
      const comments = await this.CommentModel.model?.find({ author: id });
      const commentCount = comments?.length;
      res.status(200).json({ commentCount });
    } catch (error) {
      next(error);
    }
  };

  public getCommentById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const validator = new Validator(
        CommentSchemas.getCommentSchema,
        req.params
      );
      validator.validate();

      const comment = await this.CommentModel.findCommentsById(req.params.id);
      if (!comment) {
        throw new CustomError("Comment not found", 404);
      }

      res.status(200).json({
        message: "Comment found",
        data: comment,
      });
    } catch (error) {
      next(error);
    }
  };

  public editComment = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const validator = new Validator(
        CommentSchemas.editCommentSchema,
        req.body
      );
      validator.validate();

      const comment = await this.CommentModel.findCommentsById(req.body.id);
      if (!comment) {
        throw new CustomError("Comment not found", 404);
      }

      const updatedComment = await this.CommentModel.updateComment(
        req.body.id,
        req.body.body
      );

      res.status(200).json({
        message: "Comment updated successfully",
        data: updatedComment,
      });
    } catch (error) {
      next(error);
    }
  };

  public deleteComment = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const validator = new Validator(
        CommentSchemas.deleteCommentSchema,
        req.body
      );
      validator.validate();

      const comment = await this.CommentModel.findCommentsById(req.body.id);
      if (!comment) {
        throw new CustomError("Comment not found", 404);
      }

      await this.CommentModel.deleteComment(req.body.id);

      // remove comment from post's comments array
      await this.Posts.findAndDeleteSingleCommentsId(
        comment.post.toString(),
        req.body.id
      );

      res.status(200).json({
        message: "Comment deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  };

  public getAllComments = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const comments = await this.CommentModel.model?.find();
      res.status(200).json({
        message: "Comments retrieved successfully",
        data: comments,
      });
    } catch (error) {
      next(error);
    }
  };

  public addReply = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validator = new Validator(CommentSchemas.addReplySchema, req.body);
      validator.validate();

      const parentComment = await this.CommentModel.findCommentsById(
        req.body.commentId
      );
      if (!parentComment) {
        throw new CustomError("Parent comment not found", 404);
      }

      const reply = await this.CommentModel.createComment({
        author: req.body.author,
        post: parentComment.post.toString(),
        body: req.body.replyBody,
        isReply: true,
      });

      if (!reply?._id) {
        throw new CustomError("Failed to create reply", 500);
      }

      await this.CommentModel.model?.findByIdAndUpdate(req.body.commentId, {
        $push: { reply: reply._id },
      });

      res.status(200).json({
        message: "Reply added successfully",
        data: reply,
      });
    } catch (error) {
      next(error);
    }
  };

  public deleteReply = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const validator = new Validator(
        CommentSchemas.deleteReplySchema,
        req.body
      );
      validator.validate();

      const parentComment = await this.CommentModel.findCommentsById(
        req.body.commentId
      );
      if (!parentComment) {
        throw new CustomError("Parent comment not found", 404);
      }

      const reply = await this.CommentModel.findCommentsById(req.body.replyId);
      if (!reply || !reply.isReply) {
        throw new CustomError("Reply not found", 404);
      }

      await this.CommentModel.deleteComment(req.body.replyId);

      // remove reply from parents replies array
      await this.CommentModel.model?.findByIdAndUpdate(req.body.commentId, {
        $pull: { reply: req.body.replyId },
      });

      res.status(200).json({
        message: "Reply deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  };

  public getCommentsByPostId = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const validator = new Validator(CommentSchemas.getCommentSchema, {
        id: req.query.id,
      });
      validator.validate();

      const comments = await this.CommentModel.model
        ?.find({
          post: req.params.postId,
        })
        .populate("author")
        .populate("reply");

      if (!comments || comments.length === 0) {
        res.status(200).json({
          message: "No comments found for this post",
          data: [],
        });
        return;
      }

      res.status(200).json({
        message: "Comments retrieved successfully",
        data: comments,
      });
    } catch (error) {
      next(error);
    }
  };
}

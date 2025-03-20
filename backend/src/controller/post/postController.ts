import { NextFunction, Request, Response } from "express";
import { PostsModel } from "../../Models/Posts";
import { PostBodyModel } from "../../Models/PostBody";
import { CommunityModel } from "../../Models/Community";
import { CommentModel } from "../../Models/Comment";
import { VoteModel } from "../../Models/Vote";
import { PostSchemas } from "../../zodSchemas/Post";
import { Validator } from "../../utils/Validator";
import { CustomError } from "../../Error/Error";
export class PostsController {
  private Posts: PostsModel;
  private PostBody: PostBodyModel;
  private CommunityModel: CommunityModel;
  private CommentModel: CommentModel;
  private VoteModel: VoteModel;

  constructor() {
    this.Posts = new PostsModel();
    this.PostBody = new PostBodyModel();
    this.CommunityModel = new CommunityModel();
    this.CommentModel = new CommentModel();
    this.VoteModel = new VoteModel();
  }

  public createNormalPost = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const validator = new Validator(
        PostSchemas.createNormalPostSchema,
        req.body
      );
      validator.validate();

      const postBodyCheck = await this.PostBody.findPostBodyById(req.body.body);

      if (!postBodyCheck) {
        throw new CustomError("Post Body With this ID doesnot exist", 404);
      }

      if (req.body.community) {
        const comunityCheck = await this.CommunityModel.findCommunityById(
          req.body.community
        );

        if (!comunityCheck) {
          throw new CustomError("Community With this ID doesnot exist", 404);
        }
      }

      const result = await this.Posts.createPost(req.body);

      res
        .status(200)
        .json({ message: "Post added successfully", data: result });
    } catch (error) {
      next(error);
    }
  };

  public getPostCount = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const validator = new Validator(
        PostSchemas.getPostCountSchema,
        req.params
      );
      validator.validate();

      const count = await this.Posts.getPostCount(req.params.id);

      res.json(count);
    } catch (error) {
      next(error);
    }
  };

  public createTimeCapsulePost = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const validator = new Validator(
        PostSchemas.createTimeCapsulePostSchema,
        req.body
      );
      validator.validate();

      if (req.body.body) {
        const postBodyCheck = await this.PostBody.findPostBodyById(
          req.body.body
        );

        if (!postBodyCheck) {
          throw new CustomError("Post Body With this ID doesnot exist", 404);
        }
      }

      if (req.body.community) {
        const comunityCheck = await this.CommunityModel.findCommunityById(
          req.body.community
        );

        if (!comunityCheck) {
          throw new CustomError("Community With this ID doesnot exist", 404);
        }
      }

      const result = await this.Posts.createPost(req.body);

      res
        .status(200)
        .json({ message: "Post added successfully", data: result });
    } catch (error) {
      next(error);
    }
  };

  public createSelfDestructPost = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const validator = new Validator(
        PostSchemas.createSelfDestructPostSchema,
        req.body
      );
      validator.validate();

      if (req.body.body) {
        const postBodyCheck = await this.PostBody.findPostBodyById(
          req.body.body
        );

        if (!postBodyCheck) {
          throw new CustomError("Post Body With this ID doesnot exist", 404);
        }
      }

      if (req.body.community) {
        const comunityCheck = await this.CommunityModel.findCommunityById(
          req.body.community
        );

        if (!comunityCheck) {
          throw new CustomError("Community With this ID doesnot exist", 404);
        }
      }

      const result = await this.Posts.createPost(req.body);

      res
        .status(200)
        .json({ message: "Post added successfully", data: result });
    } catch (error) {
      next(error);
    }
  };

  public getAllPost = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const result = await this.Posts.model?.find();

      res.status(200).json({ message: "All Posts", data: result });
    } catch (error) {
      next(error);
    }
  };

  public getPostByID = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { postID } = req.params;

      const validator = new Validator(PostSchemas.IDchecker, postID);
      validator.validate();

      const post = await this.Posts.model
        ?.findById(postID)
        .populate("author")
        .populate("body");

      const timeNow = new Date();
      const expiredAt = post?.expiresAt;

      if (post?.expiresAt && new Date(expiredAt!) < timeNow) {
        await this.Posts.model?.findByIdAndDelete(postID);
        return;
      }

      if (!post) {
        res.status(404).json({ message: "Post not found" });
      }

      res.status(200).json({ message: "Post found", data: post });
    } catch (error) {
      next(error);
    }
  };

  public getTenPost = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const validator = new Validator(PostSchemas.getTenPost, req.body);
      validator.validate();

      const nextTenObjects = await this.Posts.getTenPost(req.body.seenLastIDs);

      res.status(200).json({ message: "All Posts", data: nextTenObjects });
    } catch (error) {
      next(error);
    }
  };

  public deletePostByID = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      /*const validator = new Validator(PostSchemas.IDchecker, req.body.postID);
      validator.validate();*/

      const { postID } = req.params;

      const validator = new Validator(PostSchemas.IDchecker, postID);
      validator.validate();

      const postCheck = await this.Posts.findPostById(postID);

      if (!postCheck) {
        throw new CustomError("Post With this ID doesnot exist:" + postID, 404);
      }

      console.log(postID);

      const result = await this.Posts.deletePost(postID);

      res
        .status(200)
        .json({ message: "Posts with given id deleted", data: result });
    } catch (error) {
      next(error);
    }
  };

  public addCommentIDToExistingPost = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const validator = new Validator(PostSchemas.IDchecker, req.body.postID);
      validator.validate();

      const commentValidator = new Validator(
        PostSchemas.IDchecker,
        req.body.commentID
      );
      commentValidator.validate();

      const commentCheck = await this.CommentModel.findCommentsById(
        req.body.commentID
      );
      const postCheck = await this.Posts.findPostById(req.body.postID);

      if (!postCheck) {
        throw new CustomError("Post With this ID doesnot exist", 404);
      }

      if (!commentCheck) {
        throw new CustomError("Comment With this ID doesnot exist", 404);
      }

      const result = await this.Posts.addCommentToPost(
        req.body.postID,
        req.body.commentID
      );

      res.status(200).json({
        message: "comments with given id added to post",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  public removeCommentIDByPostID = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const validator = new Validator(PostSchemas.IDchecker, req.body.postID);
      validator.validate();

      const commentValidator = new Validator(
        PostSchemas.IDchecker,
        req.body.commentID
      );
      commentValidator.validate();

      const commentCheck = await this.CommentModel.findCommentsById(
        req.body.commentID
      );
      const postCheck = await this.Posts.findPostById(req.body.postID);

      if (!postCheck) {
        throw new CustomError("Post With this ID doesnot exist", 404);
      }

      if (!commentCheck) {
        throw new CustomError("Comment With this ID doesnot exist", 404);
      }

      const result = await this.Posts.findAndDeleteSingleCommentsId(
        req.body.postID,
        req.body.commentID
      );

      res.status(200).json({ message: "Deleted", data: result });
    } catch (error) {
      next(error);
    }
  };

  public removeAllCommentByPostID = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const validator = new Validator(PostSchemas.IDchecker, req.body.postID);
      validator.validate();

      const postCheck = await this.Posts.findPostById(req.body.postID);

      if (!postCheck) {
        throw new CustomError("Post With this ID doesnot exist", 404);
      }

      const result = await this.Posts.clearComments(req.body.postID);

      res.status(200).json({ message: "Deleted All Comments", data: result });
    } catch (error) {
      next(error);
    }
  };

  public addVoteIDToExistingPost = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const validator = new Validator(PostSchemas.IDchecker, req.body.postID);
      validator.validate();

      const voteValidator = new Validator(
        PostSchemas.IDchecker,
        req.body.voteID
      );
      voteValidator.validate();

      const postCheck = await this.Posts.findPostById(req.body.postID);
      const voteCheck = await this.VoteModel.findVoteById(req.body.postID);

      if (!postCheck) {
        throw new CustomError("Post With this ID doesnot exist", 404);
      }

      if (!voteCheck) {
        throw new CustomError("vote With this ID doesnot exist", 404);
      }

      const result = await this.Posts.addVoteToPost(
        req.body.postID,
        req.body.voteID
      );

      res.status(200).json({ message: "Votes Added", data: result });
    } catch (error) {
      next(error);
    }
  };
}

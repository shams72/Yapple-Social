import { Router } from "express";
import { IRouter } from "./IRouter";
import { PostsController } from "../controller/post/postController";
import { Auth } from "../Auth/Auth";

export class PostRouter implements IRouter {
  public router: Router;
  public routerSubPath: string = "/posts";
  controller: PostsController;
  auth: Auth;

  constructor() {
    this.router = Router();
    this.controller = new PostsController();
    this.auth = new Auth();
  }

  public registerRoutes(): void {
    this.router.post(
      "/create-normal-post",
      this.auth.authenticateToken,
      this.controller.createNormalPost
    );
    this.router.post(
      "/create-time-capsule-post",
      this.auth.authenticateToken,
      this.controller.createTimeCapsulePost
    );
    this.router.post(
      "/create-self-destruct-post",
      this.auth.authenticateToken,
      this.controller.createSelfDestructPost
    );
    this.router.get(
      "/get-posts-by-id/:postID/:id",
      this.auth.authenticateToken,
      this.controller.getPostByID
    );
    this.router.get(
      "/get-all-post",
      this.auth.authenticateToken,
      this.controller.getAllPost
    );
    this.router.get("/get-user-post-count/:id", this.controller.getPostCount);
    this.router.post(
      "/get-ten-post",
      this.auth.authenticateToken,
      this.controller.getTenPost
    );
    this.router.put(
      "/add-commentID-to-existing-post",
      this.auth.authenticateToken,
      this.controller.addCommentIDToExistingPost
    );
    this.router.put(
      "/add-voteID-to-existing-post",
      this.auth.authenticateToken,
      this.controller.addVoteIDToExistingPost
    );
    this.router.delete(
      "/delete-post-by-ID/:postID/:id",
      this.auth.authenticateToken,
      this.controller.deletePostByID
    );
    this.router.delete(
      "/remove-commentID-by-postID",
      this.auth.authenticateToken,
      this.controller.removeCommentIDByPostID
    );
    this.router.delete(
      "/remove-all-commentID-by-postID",
      this.auth.authenticateToken,
      this.controller.removeAllCommentByPostID
    );
  }
}

import { Router } from "express";
import { IRouter } from "./IRouter";
import { CommentController } from "../controller/comment/CommentController";
import { Auth } from "../Auth/Auth";

export class CommentRouter implements IRouter {
  public router: Router;
  auth: Auth;
  public routerSubPath: string = "/comment";
  controller: CommentController;
  
  constructor() {
    this.router = Router();
    this.controller = new CommentController();
    this.auth = new Auth();
  }

  public registerRoutes(): void {
    this.router.post("/create-comment", this.auth.authenticateToken, this.controller.createComment);
    this.router.get("/get-all-comments", this.auth.authenticateToken, this.controller.getAllComments);
    this.router.get("/get-comment-by-id/:id", this.auth.authenticateToken, this.controller.getCommentById);
    this.router.put("/edit-comment", this.auth.authenticateToken, this.controller.editComment);
    this.router.delete("/delete-comment", this.auth.authenticateToken, this.controller.deleteComment);
    this.router.put("/add-reply", this.auth.authenticateToken, this.controller.addReply);
    this.router.delete("/delete-reply", this.auth.authenticateToken, this.controller.deleteReply);
    this.router.get("/get-comments-by-post/:postId", this.auth.authenticateToken, this.controller.getCommentsByPostId);
    this.router.get("/comment-count/:id", this.auth.authenticateToken, this.controller.getCommentCount);
  }
}

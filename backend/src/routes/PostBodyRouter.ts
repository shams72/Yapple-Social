import { Router } from "express";
import { IRouter } from "./IRouter";
import { PostBodyController } from "../controller/post/PostBody";
import { Auth } from "../Auth/Auth";


export class PostBodyRouter implements IRouter {
  public router: Router;
  auth:Auth;
  public routerSubPath: string = "/postBody";
  controller:  PostBodyController;
  
  constructor() {
    this.router = Router();
    this.controller = new  PostBodyController();
    this.auth = new Auth();
  }

  public registerRoutes(): void {
    this.router.post("/add-postBody" ,this.auth.authenticateToken, this.controller.addPostBody);
    this.router.put("/edit-postBody",this.auth.authenticateToken, this.controller.editPostBody);
    this.router.get("/get-text-postBody-by-ID/:postBodyID/:id",this.auth.authenticateToken, this.controller.getTextPostBodyByID);
    this.router.delete("/delete-text-PostBody",this.auth.authenticateToken, this.controller.deleteTextPostBody);
  }
}

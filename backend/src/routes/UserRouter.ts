import { Router } from "express";
import { IRouter } from "./IRouter";
import { UserController } from "../controller/user/User";
import { UserServicesController } from "../controller/user/UserServicesController";
import { Auth } from "../Auth/Auth";

export class UserRouter implements IRouter {
  public router: Router;
  public routerSubPath: string = "/user";
  controller: UserController;
  userServicesController: UserServicesController;
  auth: Auth;
  constructor() {
    this.router = Router();
    this.controller = new UserController();
    this.userServicesController = new UserServicesController();
    this.auth = new Auth();
  }

  public registerRoutes(): void {
    this.router.get(
      "/all-users",
      this.auth.authenticateToken,
      this.controller.getAllUsers
    );

    this.router.get(
      "/:id",
      this.controller.getUserById
    );

    this.router.post(
      "/username",
      this.auth.authenticateToken,
      this.controller.getUserByUsername
    );

    this.router.put(
      "/update",
      this.auth.authenticateToken,
      this.controller.updateUser
    );

    this.router.delete(
      "/delete/:id",
      this.auth.authenticateToken,
      this.controller.deleteUser
    );

    this.router.post(
      "/add-follower",
      this.auth.authenticateToken,
      this.userServicesController.addFollower
    );

    this.router.post(
      "/remove-follower",
      this.userServicesController.removeFollower
    );

    this.router.post(
      "/add-following",
      this.userServicesController.addFollowing
    );

    this.router.post(
      "/remove-following",
      this.userServicesController.removeFollowing
    );

    this.router.post(
      "/add-post",
      this.auth.authenticateToken,
      this.userServicesController.addPost
    );

    this.router.post(
      "/remove-post",
      this.auth.authenticateToken,
      this.userServicesController.removePost
    );

    this.router.post(
      "/get-suggestions",
      this.auth.authenticateToken,
      this.userServicesController.getTenSuggestion
    );

    this.router.put(
      "/update-banner",
      this.auth.authenticateToken,
      this.userServicesController.updateBanner
    );
    this.router.put(
      "/update-profile",
      this.auth.authenticateToken,
      this.userServicesController.updateProfile
    );
    
  }
}

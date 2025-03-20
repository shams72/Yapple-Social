import { Router } from "express";
import { Auth } from "../Auth/Auth";
import { AuthController } from "../controller/auth/Auth";
import { IRouter } from "./IRouter";

export class AuthRouter implements IRouter {
  public router: Router;
  public routerSubPath: string = "/auth";
  controller: AuthController;
  auth: Auth;

  constructor() {
    this.router = Router();
    this.controller = new AuthController();
    this.auth = new Auth();
  }

  registerRoutes(): void {
    this.router.post("/sign-in", this.controller.signIn);
    this.router.post("/sign-up", this.controller.signUp);
  }
}

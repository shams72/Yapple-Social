import { Router } from "express";
import { IRouter } from "./IRouter";
import { VoteController } from "../controller/vote/VoteController";
import { Auth } from "../Auth/Auth";

export class VoteRouter implements IRouter {
  public router: Router;
  auth: Auth;
  public routerSubPath: string = "/vote";
  controller: VoteController;
  
  constructor() {
    this.router = Router();
    this.controller = new VoteController();
    this.auth = new Auth();
  }

  public registerRoutes(): void {
    this.router.post("/create", this.auth.authenticateToken, this.controller.createVote);
    this.router.delete("/delete", this.auth.authenticateToken, this.controller.deleteVote);
    this.router.get("/all", this.auth.authenticateToken, this.controller.getAllVotes);
    this.router.get(
      "/get-votes/:targetModel/:targetId",
      this.auth.authenticateToken,
      this.controller.getVotesByTarget
    );
  }
}

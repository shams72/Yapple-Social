import { Router } from "express";
import { IRouter } from "./IRouter";
import { MessageController } from "../controller/message/messageController";
import { Auth } from "../Auth/Auth";

export class MessageRouter implements IRouter {
  public router: Router;
  public routerSubPath: string = "/messages";
  private controller: MessageController;
  private auth: Auth;

  constructor() {
    this.router = Router();
    this.controller = new MessageController();
    this.auth = new Auth();
  }

  public registerRoutes(): void {
    this.router.post(
      "/create",
      this.auth.authenticateToken,
      this.controller.createMessage
    );

    this.router.get(
      "/get-all",
      this.auth.authenticateToken,
      this.controller.getAllMessages
    );
    this.router.get(
      "/get/:id",
      this.auth.authenticateToken,
      this.controller.getMessageById
    );

    this.router.get(
      "/get-between/:user1/:user2/:id",
    //   this.auth.authenticateToken,
      this.controller.getMessagesBetweenUsers
    );

    this.router.delete(
      "/delete/:id",
      this.auth.authenticateToken,
      this.controller.deleteMessage
    );
  }
}

import { Request, Response, Router } from "express";
import { IRouter } from "./IRouter";
import { PostBodyController } from "../controller/post/PostBody";
import { Auth } from "../Auth/Auth";
import { NotificationsController } from "../controller/notification/NotificationsController";

export class NotificationRouter implements IRouter {
  public router: Router;
  auth: Auth;
  public routerSubPath: string = "/notification";
  controller: NotificationsController;

  constructor() {
    this.router = Router();
    this.controller = new NotificationsController();
    this.auth = new Auth();
  }

  public registerRoutes(): void {
    this.router.get(
      "/get-notifications/:id",
      this.controller.getAllNotifications
    );
    this.router.put(
      "/set-all-user-notification-as-read",
      this.controller.markAllNotificationsAsRead
    );

    this.router.post("/set-notification-as-read", this.controller.markNotificationsAsRead)
  }
}

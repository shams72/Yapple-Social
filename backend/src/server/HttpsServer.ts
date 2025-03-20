import express, { Express, Router } from "express";
import { IRouter } from "../routes/IRouter";
import { UserRouter } from "../routes/UserRouter";
import { PostRouter } from "../routes/PostRouter";
import { PostBodyRouter } from "../routes/PostBodyRouter";
import { NotificationRouter } from "../routes/NotificationsRouter";
import { CommunityRouter } from "../routes/communityRouter";
import { MediaRouter } from "../routes/MediaRouter";
import { CommentRouter } from "../routes/CommentRouter";
import { VoteRouter } from "../routes/VoteRouter";
import helmet from "helmet";
import cors from 'cors';
import { ErrorHandler } from "../Error/Error";
import { AuthRouter } from "../routes/AuthRouter";
import { MessageRouter } from "../routes/Messages";

export class HttpServer implements IServer {
  private routes: IRouter[];
  private rootRouter: Router;
  private app: Express;

  constructor(app: Express) {
    this.routes = [
      new UserRouter(),
      new PostRouter(),
      new PostBodyRouter(),
      new CommunityRouter(),
      new AuthRouter(),
      new UserRouter(),
      new MediaRouter(),
      new MessageRouter(),
      new CommentRouter(),
      new VoteRouter(),
      new NotificationRouter()
    ];
    this.rootRouter = Router();
    this.app = app;
  }
  start(): void {
    this.RegisterRoutes();
    this.registerMiddleWares();
  }

  private registerMiddleWares() {
    this.app.use(express.json({ limit: '500mb' }));
    this.app.use(express.urlencoded({ limit: '500mb', extended: true }));
    this.app.use("/api", express.static("/app/dist/uploads/"))

    this.app.use(cors());
    this.app.use("/api", this.rootRouter);
    this.app.use(ErrorHandler.errorMiddleware);
  }

  private RegisterRoutes() {
    this.routes.forEach((router) => {
      router.registerRoutes();
      this.rootRouter.use(router.routerSubPath, router.router);
    });
  }

  public getApp() {
    return this.app;
  }
}

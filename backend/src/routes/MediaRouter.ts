import { Request, Response, Router } from "express";
import { IRouter } from "./IRouter";
import { MediaController } from "../controller/MediaController";
import { Auth } from "../Auth/Auth";
import multer from "multer";
import fs from "fs";
import { v4 as uuid } from "uuid";

export class MediaRouter implements IRouter {
  public router: Router;
  auth: Auth;
  public routerSubPath: string = "/media";
  controller: MediaController;
  upload: multer.Multer;

  constructor() {
    this.router = Router();
    this.controller = new MediaController();
    this.auth = new Auth();

    const existsUploadPath = fs.existsSync("/app/dist/uploads/");
    if (!existsUploadPath) {
      fs.mkdirSync("/app/dist/uploads/", { recursive: true });
    }

    const storage = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, "/app/dist/uploads/");
      },
      filename: function (req, file, cb) {
        const uniqueSuffix = uuid();
        const originalName = file.originalname.replace(/\s+/g, "-");
        cb(null, uniqueSuffix + originalName);
      },
    });

    this.upload = multer({ storage: storage });

    this.registerRoutes();
  }

  public registerRoutes(): void {
    this.router.post(
      "/upload-community-pic",
      this.auth.authenticateToken,
      this.controller.uploadMedia
    );
    this.router.post(
      "/upload-community-banner",
      this.auth.authenticateToken,
      this.controller.uploadMedia
    );
    this.router.get(
      "/get-community-banner-by-ID/:communityID/:id",
      this.auth.authenticateToken,
      this.controller.getBannerByID
    );
    this.router.get(
      "/get-community-profile-by-ID/:communityID/:id",
      this.auth.authenticateToken,
      this.controller.getProfileByID
    );
    this.router.post(
      "/upload",
      this.auth.authenticateToken,
      this.controller.uploadMedia
    );
    this.router.post(
      "/upload-and-save-to-disk",
      /*this.auth.authenticateToken,*/
      this.upload.single("file"),
      (req, res, next) => {
        res.json({
          url: req.file?.filename,
        });
      }
    );
    this.router.get(
      "/get-all",
      this.auth.authenticateToken,
      this.controller.getAllMedia
    );

    this.router.put(
      "/update",
      this.auth.authenticateToken,
      this.controller.updateMedia
    );
    this.router.delete(
      "/delete",
      this.auth.authenticateToken,
      this.controller.deleteMedia
    );
    this.router.put(
      "/update-url",
      this.auth.authenticateToken,
      this.controller.updateUrl
    );
  }
}

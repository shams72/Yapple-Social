import { NextFunction, Request, Response } from "express";
import { MediaModel } from "../Models/Media";
import { MediaSchemas } from "../zodSchemas/MediaSchemas";
import { Validator } from "../utils/Validator";
import { CustomError } from "../Error/Error";

export class MediaController {
  private mediaModel: MediaModel;

  constructor() {
    this.mediaModel = new MediaModel();
  }


  public uploadMedia = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const validator = new Validator(MediaSchemas.uploadMediaSchema, req.body);
      validator.validate();

      //front end -> bild hochgeladet - > base64 -> backend -> base64 -> buffer -> mongodb
      const base64String:string = req.body.data;
      const [metaData , encodedMedia ]= base64String.split(",")


      // const regex = /^data:image\/(jpeg|jpg|png|webp);base64,/;
      //   if (regex.test(base64String)) {
        
      //     base64String = base64String.replace(regex, '');
      //   }

      const buffer = Buffer.from(encodedMedia, "base64");


      // req.body.data = buffer;

      const { relatedObject, url } = req.body;

      const filter = { relatedObject, url };
      const options = { new: true, upsert: true };

      const result = await this.mediaModel.model?.findOneAndUpdate(filter,{data: buffer , mimeType: metaData}, options);

      result!.url = String(result!._id);

      res.status(201).json({
        message: "Media uploaded successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  public getBannerByID = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {


      const result = await this.mediaModel.model?.findOne({
        relatedObject: req.params.communityID,
        url: "banner"
      });

      let base64String = "";

      if (result) {
        const buffer = result.data;
    
        base64String = buffer.toString("base64");

      } else {
        console.log("No matching document found");
      }  

      res.status(201).json({
        message: "Media got successfully",
        data:result?.mimeType+ "," + base64String,
      });
    } catch (error) {
      next(error);
    }
  };

  public getProfileByID = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {


      const result = await this.mediaModel.model?.findOne({
        relatedObject: req.params.communityID,
        url: "profile"
      });

      let base64String = "";

      if (result) {
        const buffer = result.data;
    
        base64String = buffer.toString("base64");

      } else {
        console.log("No matching document found");
      }  

      res.status(201).json({
        message: "Media got successfully",
        data:result?.mimeType+ "," + base64String,
      });
    } catch (error) {
      next(error);
    }
  };



  public getAllMedia = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const result = await this.mediaModel.model?.find();

      if (!result) {
        throw new CustomError("No media found", 404);
      }

      res.status(200).json({
        message: "Media retrieved successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  public updateMedia = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const validator = new Validator(MediaSchemas.updateMediaSchema, req.body);
      validator.validate();

      // Buffer konvertierung wenn base64 vorhanden
      let updateData = { ...req.body };
      if (updateData.data && typeof updateData.data === "string") {
        updateData.data = Buffer.from(updateData.data, "base64");
      }

      // Korrektes Update-Objekt erstellen
      const result = await this.mediaModel.model?.findByIdAndUpdate(
        req.body.mediaId,
        { $set: updateData },
        {
          new: true,
        }
      );

      if (!result) {
        throw new CustomError("Media not found", 404);
      }

      res.status(200).json({
        message: "Media updated successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  public deleteMedia = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const validator = new Validator(MediaSchemas.deleteMediaSchema, req.body);
      validator.validate();

      const result = await this.mediaModel.model?.findByIdAndDelete(
        req.body.mediaId
      );

      if (!result) {
        throw new CustomError("Media not found", 404);
      }

      res.status(200).json({
        message: "Media deleted successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  public updateUrl = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const validator = new Validator(MediaSchemas.updateUrlSchema, req.body);
      validator.validate();

      const result = await this.mediaModel.model?.findByIdAndUpdate(
        req.body.mediaId,
        { $set: { url: req.body.url } },
        { new: true }
      );

      if (!result) {
        throw new CustomError("Media not found", 404);
      }

      res.status(200).json({
        message: "Media updated successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };
}

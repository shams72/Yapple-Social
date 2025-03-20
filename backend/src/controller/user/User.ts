import { NextFunction, Request, Response } from "express";
import { UserDocument, UserModel } from "../../Models/User";
import { UserSchemas } from "../../zodSchemas/User";
import { Validator } from "../../utils/Validator";
import { Auth } from "../../Auth/Auth";
import { Types } from "mongoose";
import { CustomError } from "../../Error/Error";

export class UserController {
  private user: UserModel;
  constructor() {
    this.user = new UserModel();
  }

  public getAllUsers = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      console.log("get all users endpoint is beeing called ");
      const result = await this.user.getAllUsers();
      res.status(200).json(result);
    } catch (error: any) {
      next(error);
    }
  };

  public getUserById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const validator = new Validator(
        UserSchemas.getUserByIdSchema,
        req.params
      );
      validator.validate();

      const userId = req.params.id;
      const objectId = new Types.ObjectId(userId);
      const result = await this.user.findUserById(objectId);
      
      if (result!.length === 0) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      res.status(200).json(result![0]);
    } catch (error) {
      next(error);
    }
  };

  public getUserByUsername = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const validator = new Validator(
        UserSchemas.getUserByUsername,
        req.params
      );
      validator.validate();

      const { username } = req.params;

      const user = await this.user.findUserByUsername(username);

      if (!user) {
        throw new CustomError("User not found", 404);
      }

      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  };

  public updateUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const validator = new Validator(UserSchemas.updateUserSchema, req.body);
      validator.validate();

      const { id, ...updateData } = req.body;
      const objectId = new Types.ObjectId(String(id));

      const updatedUser = await this.user.updateUser(objectId, updateData);
      if (!updatedUser) {
        throw new CustomError("User not found", 404);
      }

      res.status(200).json(updatedUser);
    } catch (error) {
      next(error);
    }
  };

  public deleteUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const validator = new Validator(
        UserSchemas.deleteUserSchemas,
        req.params
      );
      validator.validate();

      const userId = req.params.id;
      const objectId = new Types.ObjectId(userId);

      const result = await this.user.findUserById(objectId);
      if (!result || result.length === 0) {
        throw new CustomError("User not found", 404);
      }

      await this.user.deleteUser(objectId);
      res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      next(error);
    }
  };
}

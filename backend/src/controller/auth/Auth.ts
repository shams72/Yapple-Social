import { NextFunction, Request, Response } from "express";
import { Validator } from "../../utils/Validator";
import { AuthSchemas } from "../../zodSchemas/Auth";
import { UserDocument, UserModel } from "../../Models/User";
import { CustomError } from "../../Error/Error";
import { AESHelper } from "../../utils/ASEhelper";
import { StatusCodes } from "http-status-codes";
import { Auth } from "../../Auth/Auth";

export class AuthController {
  public signIn = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = req.body;
      const validator = new Validator(AuthSchemas.Signin, body);
      validator.validate();

      const { username, password } = body;
      console.log(username, password);

      const userModel = new UserModel();
      const user = await userModel.findUserByUsername(username);
      if (!user) {
        throw new CustomError("user not found ", 404);
      }

      const aes = new AESHelper();
      const passwordDesscrypted = aes.decrypt(user.passwordHash!);

      if (passwordDesscrypted !== password) {
        throw new CustomError(
          "password doesnt match",
          StatusCodes.UNAUTHORIZED
        );
      }

      const auth = new Auth();
      const token = auth.generateAccessToken(String(user._id));
      res.status(StatusCodes.OK).json({ token, id: user._id });
    } catch (error) {
      next(error);
    }
  };

  public signUp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validator = new Validator(AuthSchemas.signUp, req.body);
      validator.validate();

      const userInstance: UserDocument = {
        ...req.body,
      };

      const user = new UserModel();
      const newUser = await user.createUser(userInstance);

      const auth = new Auth();
      const generatedToken = auth.generateAccessToken(String(newUser._id));

      res.status(201).json({
        token: generatedToken,
        id: newUser._id,
      });
    } catch (error) {
      next(error);
    }
  };
}

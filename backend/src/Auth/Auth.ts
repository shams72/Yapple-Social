import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { CustomError } from "../Error/Error";

export class Auth {
  constructor() {}

  generateAccessToken(id: string) {
    const payload = { id };

    return jwt.sign(payload, process.env.TOKEN_SECRET as string, {
      expiresIn: "3600s",
    });
  }

  authenticateToken(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (token == null) {
      res.sendStatus(401);
      return;
    }

    const id = req.body.id;
    const idParam = req.params.id;
    const idQuery = req.query.id;

    if (!id && !idParam && !idQuery) {
      res
        .status(StatusCodes.UNPROCESSABLE_ENTITY)
        .json({ message: "id is required" });
      return;
    }

    try {
      jwt.verify(
        token,
        process.env.TOKEN_SECRET as string,
        (err: any, payload: any) => {
          if (err) {
            throw new CustomError(err.message, StatusCodes.UNAUTHORIZED);
          }

          if (
            payload.id !== id &&
            payload.id !== idParam &&
            payload.id !== idQuery
          ) {
            throw new CustomError(
              "not authorized to access this entity",
              StatusCodes.FORBIDDEN
            );
          }

          next();
        }
      );
    } catch (error) {
      next(error);
    }
  }

  getIdFromToken(req: Request): string {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    
    if (!token) {
      throw new CustomError("No token provided", StatusCodes.UNAUTHORIZED);
    }

    const decoded = jwt.verify(token, process.env.TOKEN_SECRET as string) as { id: string };
    return decoded.id;
  }
}

import { NextFunction, Request, Response } from "express";
import { MessageModel } from "../../Models/Messages";
import { MessageSchemas } from "../../zodSchemas/message";
import { Validator } from "../../utils/Validator";
import { Schema, Types } from "mongoose";
import { CustomError } from "../../Error/Error";

export class MessageController {
  private message: MessageModel;

  constructor() {
    this.message = new MessageModel();
  }

  public getAllMessages = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const messages = await this.message.getAllMessages();
      res.status(200).json(messages);
    } catch (error) {
      next(error);
    }
  };

  public getMessageById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const validator = new Validator(
        MessageSchemas.getMessageByIdSchema,
        req.params
      );
      validator.validate();

      const messageId = req.params.id;
      const objectId = new Types.ObjectId(messageId);

      const message = await this.message.findMessageById(messageId);
      if (!message) {
        throw new CustomError("Message not found", 404);
      }

      res.status(200).json(message);
    } catch (error) {
      next(error);
    }
  };

  public createMessage = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const validator = new Validator(
        MessageSchemas.createMessageSchema,
        req.body
      );
      validator.validate();

      const { to, from, content } = req.body;

      const newMessage = await this.message.createMessage(to, from, content);
      res.status(201).json(newMessage);
    } catch (error) {
      next(error);
    }
  };

  public getMessagesBetweenUsers = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const validator = new Validator(
        MessageSchemas.getMessagesBetweenUsersSchema,
        req.params
      );
      validator.validate();

      const { user1, user2 } = req.params;

      const messages = await this.message.getMessagesBetweenUsers(user1, user2);
      res.status(200).json(messages);
    } catch (error) {
      next(error);
    }
  };

  public deleteMessage = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const validator = new Validator(
        MessageSchemas.deleteMessageSchema,
        req.params
      );
      validator.validate();

      const messageId = req.params.id;
      const objectId = new Schema.Types.ObjectId(messageId);

      const message = await this.message.findMessageById(messageId);
      if (!message) {
        throw new CustomError("Message not found", 404);
      }

      await this.message.deleteMessageById(messageId);
      res.status(200).json({ message: "Message deleted successfully" });
    } catch (error) {
      next(error);
    }
  };
}

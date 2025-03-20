import { NextFunction, Request, Response } from "express";
import {
  NotificationDocument,
  NotificationModel,
} from "../../Models/Notification";
import mongoose, { model, Mongoose, Schema, Types } from "mongoose";
import { StatusCodes } from "http-status-codes";
import { Validator } from "../../utils/Validator";
import { NotificationSchemas } from "../../zodSchemas/Notifications";

export class NotificationsController {
  private notification: NotificationModel;
  constructor() {
    this.notification = new NotificationModel();
  }
  async getAllNotifications(req: Request, res: Response, next: NextFunction) {
    try {
      const id = String(req.params.id);
      const notification = new NotificationModel();

      const result = await notification.getNotifications(id);
      res.status(StatusCodes.OK).json(result);
    } catch (error) {
      next(error);
    }
  }

  async markNotificationsAsRead(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const validator = new Validator(
      NotificationSchemas.markNotificationAsRead,
      req.body
    );

    try {
      validator.validate();
      const notification = new NotificationModel();
      await notification.markNotificationAsRead(req.body.notificationId);
      res.status(200).json({ message: "notification is marked read" });
    } catch (error) {
      next(error);
    }
  }

  async markAllNotificationsAsRead(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const validator = new Validator(
      NotificationSchemas.markAllNotificationAsRead,
      req.body
    );

    try {
      validator.validate();
      const notification = new NotificationModel();
      await notification.markAllNotificationsAsRead(req.body.id);
      res.status(200).json({ message: "notification is marked read" });
    } catch (error) {
      next(error);
    }
  }


  async createNotification(notificationDocument: NotificationDocument) {
    try {
      const validator = new Validator(
        NotificationSchemas.createNotification,
        notificationDocument
      );
      validator.validate();

      const createdNotification =
        await this.notification.createNotification(notificationDocument);

      return createdNotification;
    } catch (error) {
      throw error;
    }
  }
}

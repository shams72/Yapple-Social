import mongoose from "mongoose";
import { UserModel } from "../Models/User";
import { PostsModel } from "../Models/Posts";
import { PostBodyModel } from "../Models/PostBody";
import { CommunityModel } from "../Models/Community";
import { VoteModel } from "../Models/Vote";
import { CommentModel } from "../Models/Comment";
import { MediaModel } from "../Models/Media";
import { NotificationModel } from "../Models/Notification";

export class Database {
  private databaseUrl: string;
  constructor() {
    this.databaseUrl = process.env.DATABASE_URL as string;
  }

  public async init() {
    try {
      await mongoose.connect(this.databaseUrl, {
        autoCreate: true,
        dbName: "yapple",
      });
      console.log("app is connected to database");
      await this.initModels();
    } catch (error: any) {
      console.log(error.message);
    }
  }

  private async initModels() {
    new NotificationModel() ;
    new MediaModel() ;
    new CommentModel() ;
    new VoteModel() ; 
    new CommunityModel() ; 
    new PostBodyModel() ;
    new PostsModel() ; 
    new UserModel();
  }

  async disconnect() {
    await mongoose.disconnect();
  }
}

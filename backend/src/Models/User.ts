import mongoose, { Model, Document, Schema, ObjectId, Types } from "mongoose";
import { AESHelper } from "../utils/ASEhelper";
import { CustomError } from "../Error/Error";
import { StatusCodes } from "http-status-codes";

export interface UserDocument extends Document {
  username: string;
  passwordHash?: string;
  displayName: string;
  profilePictureUrl: string;
  bio?: string;
  links?: { platform: string; url: string };
  joinedAt?: Date;
  posts?: ObjectId[];
  bannerPictureUrl?: string;
  followers?: ObjectId[];
  following?: ObjectId[];
}
export class UserModel {
  public schema?: Schema<UserDocument>;
  public model?: Model<UserDocument>;

  constructor() {
    this.init();
  }

  init() {
    if (mongoose.models.User) {
      this.model = mongoose.model<UserDocument>("User");
    } else {
      const userSchema = new mongoose.Schema<UserDocument>({
        username: {
          type: String,
          required: true,
          unique: true,
        },
        passwordHash: {
          type: String,
        },
        displayName: {
          type: String,
          required: true,
        },
        profilePictureUrl: {
          type: String,
          default: "",
        },
        bannerPictureUrl: {
          type: String,
          default: "",
        },
        bio: {
          type: String,
        },
        links: [
          {
            platform: {
              type: String,
              required: true,
            },
            url: {
              type: String,
              required: true,
            },
          },
        ],
        joinedAt: {
          type: Date,
          default: Date.now,
        },
        posts: {
          type: [mongoose.Schema.Types.ObjectId],
          ref: "Posts",
          default: [],
        },
        followers: {
          type: [mongoose.Schema.Types.ObjectId],
          ref: "User",
          default: [],
        },
        following: {
          type: [mongoose.Schema.Types.ObjectId],
          ref: "User",
          default: [],
        },
      });

      this.schema = userSchema;
      this.model = mongoose.model<UserDocument>("User", this.schema);
    }
  }

  public async createUser(userInstance: UserDocument) {
    const ase = new AESHelper();
    const encryptedPass = ase.encrypt(userInstance.passwordHash!);
    const newUser = new this.model!({
      ...userInstance,
      passwordHash: encryptedPass,
    });

    try {
      await newUser.save();
      console.log("User:", userInstance.username, "added successfully.");
      return newUser;
    } catch (error: any) {
      throw new CustomError(error.message, StatusCodes.NOT_ACCEPTABLE);
    }
  }

  public async findUserByUsername(username: string) {
    return await this.model?.findOne({ username: username });
  }

  public async getAllUsers() {
    return await this.model?.find({});
  }

  public async findUserById(id: Types.ObjectId) {
    return await this.model?.find({ _id: id });
  }

  public async deleteUser(id: Types.ObjectId) {
    await this.model?.deleteOne({ _id: id });
  }

  public async updateUser(id: Types.ObjectId, newUser: UserDocument) {
    return await this.model?.findOneAndUpdate(
      { _id: id },
      { $set: { ...newUser } },
      { new: true }
    );
  }

  public async addFollower(id: Types.ObjectId, followerId: Types.ObjectId) {
    await this.model?.updateOne(
      { _id: id },
      { $addToSet: { followers: followerId } }
    );
  }

  public async removeFollower(id: Types.ObjectId, followerId: Types.ObjectId) {
    await this.model?.updateOne(
      { _id: id },
      { $pull: { followers: followerId } }
    );
  }

  public async addFollowing(id: Types.ObjectId, followerId: Types.ObjectId) {
    await this.model?.updateOne(
      { _id: id },
      { $addToSet: { following: followerId } }
    );
  }

  public async removeFollowing(id: Types.ObjectId, followerId: Types.ObjectId) {
    await this.model?.updateOne(
      { _id: id },
      { $pull: { following: followerId } }
    );
  }

  public async addPost(id: Types.ObjectId, postId: Types.ObjectId) {
    await this.model?.findByIdAndUpdate(
      { _id: id },
      { $push: { posts: postId } }
    );
  }

  public async removePost(id: Types.ObjectId, postId: Types.ObjectId) {
    await this.model?.updateOne({ _id: id }, { $pull: { posts: postId } });
  }

  public async updateBannerPictureUrl(id: Types.ObjectId, bannerUrl: string) {
    await this.model?.updateOne(
      { _id: id },
      { $set: { bannerPictureUrl: bannerUrl } }
    );
  }
  
  public async upadteProfileUrl(id: Types.ObjectId, profileUrl: string) {
    await this.model?.updateOne(
      { _id: id },
      { $set: { profilePictureUrl: profileUrl } }
    );
  }

  public getNextSuggetions(page: number) {
    const USERCOUNT = 5;
    const offset = page * USERCOUNT;
    return this.model?.find().sort({ _id: 1 }).skip(offset).limit(USERCOUNT);
  }
}

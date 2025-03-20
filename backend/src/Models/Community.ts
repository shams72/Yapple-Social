import mongoose, { Schema, Model, Document, ObjectId } from "mongoose";
import { Types } from "mongoose"; // Import ObjectId from Mongoose

interface CommunityDocument extends Document {
  name: string;
  description: string;
  bannerUrl?: string;
  createdAt: Date;
  members: {
    user: ObjectId;
    role: "member" | "admin";
  }[];
  links?: { platform: string; url: string }[];
  posts: ObjectId[];
}

export class CommunityModel {
  model?: Model<CommunityDocument>;
  schema?: Schema<CommunityDocument>;
 

  constructor() {
    this.init();
  }

  private init() {
    if (mongoose.models.Community) {
      this.model = mongoose.model<CommunityDocument>("Community");
    } else {
      this.schema = new mongoose.Schema<CommunityDocument>({
        name: {
          type: String,
          required: true,
        },
        description: {
          type: String,
          required: true,
        },
        bannerUrl: {
          type: String,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
        members: [
          {
            user: {
              type: mongoose.Schema.Types.ObjectId,
              required: true,
              ref: "User",
            },
            role: {
              type: String,
              enum: ["member", "admin"],
              required: true,
            },
          },
        ],
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
        posts: {
          type: [mongoose.Schema.Types.ObjectId],
          ref: "Post",
          default: [],
        },
      });

      this.model = mongoose.model("Community", this.schema);
    }
  }

  public async addMemberToCommunity(communityId: string, userId:string, role:string) {
    try {
      // Validate the role
      const validRoles = ['member', 'admin'];
      if (!validRoles.includes(role)) {
        throw new Error('Invalid role. Role must be "member" or "admin".');
      }
  
      const objectIdUserId = new mongoose.Types.ObjectId(userId);
      console.log(objectIdUserId)
  
      const community = await mongoose.model('Community').findById(communityId);
      if (!community) {
        throw new Error('Community not found');
      }
  
      const newMember = {
        user: objectIdUserId,
        role: role,
      };
  
      community.members.push(newMember);
  
      // Save the updated community
      const response = await community.save();
      console.log(response)
  
      console.log('Member added successfully');
    } catch (error) {
      console.error('Error adding member:', error);
    }
  }

  public async removeMemberFromCommunity(communityId: string, userId: string) {
    try {
      // Convert userId to ObjectId
      const objectIdUserId = new mongoose.Types.ObjectId(userId);

      // Find the community
      const community = await mongoose.model('Community').findById(communityId);
      if (!community) {
        throw new Error('Community not found');
      }

      // Find the index of the member to be removed
      const memberIndex = community.members.findIndex(
        (member:{user:string,role:string,_id:string}) => member.user.toString() === objectIdUserId.toString()
      );

      if (memberIndex === -1) {
        throw new Error('Member not found');
      }

      // Remove the member from the array
      community.members.splice(memberIndex, 1);

      // Save the updated community
      const response = await community.save();
      console.log(response);

      console.log('Member removed successfully');
    } catch (error) {
      console.error('Error removing member:', error);
    }
  }

  public async findCommunityById(id: string) {
    const community = await this.model!.findById(id);
    return community;
  }

  public async findFirstThreeCommunityPostById(id: string) {
    try {
      
      const result = await this.model!.aggregate([
        { $match: { _id: new Types.ObjectId(id) } },
        { $unwind: "$posts" },
        // Group back the posts into an array
        {
          $group: {
            _id: "$_id",
            posts: { $push: "$posts" },
          },
        },
        { $project: { _id: 0, posts: { $slice: ["$posts", 3] } } },
      ]).exec();

      if (result.length === 0) {
        return [];
      }

      return result[0].posts;
    } catch (error) {
      console.error("Error finding community posts:", error);
      throw error; // Re-throw the error for the caller to handle
    }
  }

  public async findCommunityPostsById(id: string, postIDs: string[]) {
    try {
      const postIDsAsObjectId = postIDs.map((id) => new Types.ObjectId(id));

      const result = await this.model!.aggregate([
        // Match the community by its ID
        { $match: { _id: new Types.ObjectId(id) } },
        // Unwind the posts array to work with individual posts
        { $unwind: "$posts" },
        // Filter out posts that are in the postIDs array
        { $match: { posts: { $nin: postIDsAsObjectId } } },
        // Group back the filtered posts into an array
        {
          $group: {
            _id: "$_id",
            posts: { $push: "$posts" },
          },
        },
        // Limit the number of posts in the array to 3
        { $project: { _id: 0, posts: { $slice: ["$posts", 3] } } },
      ]).exec();

      // If no result is found, return an empty array
      if (result.length === 0) {
        return [];
      }

      console.log(result[0].posts);

      // Return the filtered posts
      return result[0].posts;
    } catch (error) {
      console.error("Error finding community posts:", error);
      throw error; // Re-throw the error for the caller to handle
    }
  }

  public async findCommunityByName(name: string) {
    const community = await this.model!.findOne({ name });
    return community;
  }

  public async updateName(oldName: string, newName: string) {
    const updatedCommunity = await this.model!.findOneAndUpdate(
      { name: oldName },
      { name: newName },
      { new: true }
    );

    return updatedCommunity;
  }

  public async getTenCommunity(ids: string[]) {
    const objects = await this.model!.find({ _id: { $nin: ids } }).limit(10);
    return objects;
  }

  public async getFirstTenCommunity() {
    const objects = await this.model!.find().limit(10);
    return objects;
  }

  public async updateDescription(communityId: string, newDesc: string) {
    const updatedCommunity = await this.model!.findByIdAndUpdate(
      communityId,
      { description: newDesc },
      { new: true }
    );

    return updatedCommunity;
  }

  public async insertBannerField(communityId: string, newBannerURL: string) {
    const updatedCommunity = await this.model!.findByIdAndUpdate(
      communityId,
      { bannerUrl: newBannerURL },
      { new: true }
    );

    return updatedCommunity;
  }

  public async deleteBannerField(communityId: string) {
    const updatedCommunity = await this.model!.findByIdAndUpdate(
      communityId,
      { $unset: { bannerUrl: "" } },
      { new: true }
    );

    return updatedCommunity;
  }

  public async createCommunity(community: CommunityDocument) {
    const newCommunity = new this.model!(community);
    await newCommunity.save();
    return newCommunity;
  }

  public async addPosts(communityID: string, postID: string) {
    return await this.model!.findOneAndUpdate(
      { _id: communityID },
      { $push: { posts: postID } },
      { new: true }
    );
  }

  public async deleteSinglePosts(communityID: string, postID: string) {
    return await this.model!.findOneAndUpdate(
      { _id: communityID },
      { $pull: { posts: postID } },
      { new: true }
    );
  }

  public async addPlatformLinksByID(
    communityID: string,
    name: string,
    link: string
  ) {
    return await this.model!.findOneAndUpdate(
      { _id: communityID },
      { $push: { links: { platform: name, url: link } } },
      { new: true }
    );
  }

  public async editPlatformNamesByID(
    communityID: string,
    name: string,
    link: string
  ) {
    return await this.model!.findOneAndUpdate(
      { _id: communityID },
      { $push: { links: { platform: name, url: link } } },
      { new: true }
    );
  }

  public async platformExists(communityID: string, name: string) {
    return await this.model!.findOne({
      _id: communityID,
      "links.platform": name,
    });
  }

  public async updatePlatformName(
    communityID: string,
    name: string,
    newName: string
  ) {
    return await this.model!.findOneAndUpdate(
      { _id: communityID, "links.platform": name },
      { $set: { "links.$.platform": newName } },
      { new: true }
    );
  }

  public async updatePlatformLink(
    communityID: string,
    name: string,
    link: string
  ) {
    return await this.model!.findOneAndUpdate(
      { _id: communityID, "links.platform": name },
      { $set: { "links.$.url": link } },
      { new: true }
    );
  }

  public async deletePlatformLink(communityID: string, name: string) {
    return await this.model!.findOneAndUpdate(
      { _id: communityID, "links.platform": name },
      { $pull: { links: { platform: name } } },
      { new: true }
    );
  }
}

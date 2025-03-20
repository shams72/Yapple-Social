import mongoose, { Schema, Model, Document, ObjectId } from "mongoose";

interface PostsModelDocument extends Document {
  id: ObjectId;
  author: ObjectId;
  title: string;
  body: ObjectId;
  community?: ObjectId;
  createdAt: Date;
  postType?: "normal" | "timeCapsule" | "selfDestruct";
  expiresAt?: Date;
  revealAt?: Date;
  votes: ObjectId[];
  comments: ObjectId[];
}

export class PostsModel {
  model?: Model<PostsModelDocument>;
  schema?: Schema<PostsModelDocument>;
  constructor() {
    this.init();
  }

  private init() {
    if (mongoose.models.Posts) {
      this.model = mongoose.model<PostsModelDocument>("Posts");
    } else {
      this.schema = new mongoose.Schema<PostsModelDocument>({
        author: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "User",
        },
        title: {
          type: String,
          required: true,
        },
        body: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "PostBody",
          required: true,
        },
        community: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Community",
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
        postType: {
          type: String,
          enum: ["normal", "timeCapsule", "selfDestruct"],
        },
        expiresAt: {
          type: Date,
        },
        revealAt: {
          type: Date,
        },
        votes: {
          type: [mongoose.Schema.Types.ObjectId],
          ref: "Vote",
          default: [],
        },
        comments: {
          type: [mongoose.Schema.Types.ObjectId],
          ref: "Comment",
          default: [],
        },
      });

      this.model = mongoose.model("Posts", this.schema);
    }
  }

  public async getPostCount(userId: string) {
    return await this.model?.countDocuments({ author: userId });
  }

  public async createPost(post: PostsModelDocument) {
    const newPost = new this.model!(post);
    await newPost.save();
    console.log(newPost);
    return newPost;
  }

  public async findPostById(id: string) {
    const post = await this.model!.findById(id);
    return post;
  }

  public async getTenPost(ids: string[]) {
    try {
      const posts = await this.model!.find({
        _id: { $nin: ids }, // Exclude posts with IDs in the `ids` array
        $or: [
          { community: { $exists: false } }, // Include documents where `community` does not exist
          { community: null }, // Include documents where `community` is null
        ],
      })
        .populate("author")
        .populate("body") // Populate the `body` field with the corresponding `PostBody` document
        .limit(100); // Limit the results to 10 posts

      return posts;
    } catch (error) {
      console.error("Error fetching posts:", error);
      throw new Error("Failed to fetch posts");
    }
  }

  public async deletePost(postID: string) {
    const deletedPost = await this.model!.findByIdAndDelete(postID);
    return deletedPost;
  }

  public async findAndDeleteSingleCommentsId(postID: string, refID: string) {
    return await this.model!.findOneAndUpdate(
      { _id: postID },
      { $pull: { comments: refID } },
      { new: true }
    );
  }

  public async clearComments(postID: string) {
    return await this.model!.findOneAndUpdate(
      { _id: postID },
      { $set: { comments: [] } },
      { new: true }
    );
  }

  public async addCommentToPost(postID: string, commentID: string) {
    return await this.model!.findOneAndUpdate(
      { _id: postID },
      { $push: { comments: commentID } },
      { new: true }
    );
  }

  public async addVoteToPost(postID: string, commentID: string) {
    return await this.model!.findOneAndUpdate(
      { _id: postID },
      { $push: { votes: commentID } },
      { new: true }
    );
  }
}

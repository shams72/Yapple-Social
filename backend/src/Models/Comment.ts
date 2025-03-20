import mongoose, { Schema, Model, Document, ObjectId } from "mongoose";

interface CommentDocument extends Document {
  author: ObjectId;
  post: ObjectId;
  body: string;
  createdAt: Date;
  votes: ObjectId[];
  reply?: ObjectId[];
  isReply: boolean;
}

export class CommentModel {
  model?: Model<CommentDocument>;
  schema?: Schema<CommentDocument>;

  constructor() {
    this.init();
  }

  private init() {
    if (mongoose.models.Comment) {
      this.model = mongoose.model<CommentDocument>("Comment");
    } else {
      this.schema = new mongoose.Schema<CommentDocument>({
        author: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "User",
        },
        post: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "Post",
        },
        body: {
          type: String,
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
        votes: {
          type: [mongoose.Schema.Types.ObjectId],
          ref: "Vote",
          default: [],
        },
        reply: {
          type: [mongoose.Schema.Types.ObjectId],
          ref: "Comment",
        },
        isReply: {
          type: Boolean,
          required: true,
          default: false,
        },
      });

      this.model = mongoose.model("Comment", this.schema);
    }
  }
  public async findCommentsById(id: string) {
    const comment = await this.model!.findById(id);
    return comment;
  }

  public async updateComment(id: string, body: string) {
    return await this.model!.findByIdAndUpdate(id, { body }, { new: true });
  }

  public async deleteComment(id: string) {
    return await this.model!.findByIdAndDelete(id);
  }

  public async createComment(commentData: {
    author: string;
    post: string;
    body: string;
    isReply: boolean;
  }) {
    const comment = await this.model!.create(commentData);
    return comment;
  }

  public async addReplyToComment(commentId: string, replyId: string) {
    return await this.model!.findByIdAndUpdate(
      commentId,
      { $push: { reply: replyId } },
      { new: true }
    );
  }

  public async removeReplyFromComment(commentId: string, replyId: string) {
    return await this.model!.findByIdAndUpdate(
      commentId,
      { $pull: { reply: replyId } },
      { new: true }
    );
  }
}

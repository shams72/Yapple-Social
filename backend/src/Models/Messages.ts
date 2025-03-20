import mongoose, { Schema, Model, Document, ObjectId } from "mongoose";

interface MessageDocument extends Document {
  to: ObjectId;
  from: ObjectId;
  content: string;
  createdAt: Date;
}

export class MessageModel {
  model?: Model<MessageDocument>;
  schema?: Schema<MessageDocument>;

  constructor() {
    this.init();
  }

  private init() {
    if (mongoose.models.Message) {
      this.model = mongoose.model<MessageDocument>("Message");
    } else {
      this.schema = new mongoose.Schema<MessageDocument>(
        {
          to: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User",
          },
          from: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User",
          },
          content: {
            type: String,
            required: true,
          },
          createdAt: {
            type: Date,
            default: Date.now,
          },
        },
        {
          timestamps: true,
        }
      );

      this.model = mongoose.model("Message", this.schema);
    }
  }

  public async getAllMessages() {
    return await this.model?.find().populate("to from", "username email");
  }

  public async findMessageById(id: string) {
    return await this.model?.findById(id).populate("to from", "username email");
  }

  public async createMessage(to: string, from: string, content: string) {
    const message = new this.model!({ to, from, content });
    return await message.save();
  }

  public async getMessagesBetweenUsers(user1: string, user2: string) {
    return await this.model
      ?.find({
        $or: [
          { to: user1, from: user2 },
          { to: user2, from: user1 },
        ],
      })
      .sort({ createdAt: 1 })
      .populate("to from", "username email");
  }

  public async deleteMessageById(id: string) {
    return await this.model?.findByIdAndDelete(id);
  }
}

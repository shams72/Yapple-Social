import mongoose, { Schema, Model, Document, ObjectId } from "mongoose";

interface VoteDocument extends Document {
  user: ObjectId;
  targetModel: 'Post' | 'Comment';
  targetId: ObjectId;
  voteType: 'upvote' | 'downvote';
  createdAt: Date;
}

export class VoteModel {
  model?: Model<VoteDocument>;
  schema?: Schema<VoteDocument>;

  constructor() {
    this.init();
  }

  private init() {
    if (mongoose.models.Vote) {
      this.model = mongoose.model<VoteDocument>("Vote");
    } else {
      this.schema = new mongoose.Schema<VoteDocument>({
        user: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "User",
        },
        targetModel: {
          type: String,
          required: true,
          enum: ['Post', 'Comment'],
        },
        targetId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
        },
        voteType: {
          type: String,
          required: true,
          enum: ['upvote', 'downvote'], 
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      });

      this.model = mongoose.model("Vote", this.schema);
    }
  }
  public async findVoteById(id: string) {
    const vote = await this.model!.findById(id);                
    return vote;    
  }

  public async createVote(voteData: {
    user: string,
    targetId: string,
    targetModel: 'Post' | 'Comment',
    voteType: 'upvote' | 'downvote'
  }) {
    const vote = await this.model!.create(voteData);
    return vote;
  }

  public async findVote(query: {
    user: string,
    targetId: string,
    targetModel: 'Post' | 'Comment',
    voteType: 'upvote' | 'downvote'
  }) {
    return await this.model!.findOne(query);
  }

  public async deleteVote(id: string) {
    return await this.model!.findByIdAndDelete(id);
  }
}
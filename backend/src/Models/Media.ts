import mongoose, { Schema, Model, Document, ObjectId } from "mongoose";

interface MediaDocument extends Document {
  url: string;
  data: Buffer;         
  uploadedBy: ObjectId; 
  uploadedAt: Date;     
  relatedObject?: ObjectId; 
  mimeType?: string;    
  width?: number;      
  height?: number;      
  fileSize?: number;    
}

export class MediaModel {
  model?: Model<MediaDocument>;
  schema?: Schema<MediaDocument>;

  constructor() {
    this.init();
  }

  private init() {
    if (mongoose.models.Media) {
      this.model = mongoose.model<MediaDocument>("Media");
    } else {
      this.schema = new mongoose.Schema<MediaDocument>({
        url: {
          type: String,
          required: true, 
        },
        data: {
          type: Buffer,
          required: true, 
        },
        uploadedBy: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "User",
        },
        uploadedAt: {
          type: Date,
          default: Date.now, 
        },
        relatedObject: {
          type: mongoose.Schema.Types.ObjectId,
          refPath: 'relatedModel', 
        },
        mimeType: {
          type: String, 
        },
        width: {
          type: Number, 
        },
        height: {
          type: Number, 
        },
        fileSize: {
          type: Number, 
        },
      });

      this.model = mongoose.model("Media", this.schema);
    }
  }

  public async getAllMedia() {
    return await this.model?.find();
  }

  public async findMediaById(id: string) {
    return await this.model?.findById(id);
  }
}
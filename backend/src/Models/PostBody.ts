import mongoose, { Model, Schema, Document } from "mongoose";

interface PostBodyDocument extends Document {
  text?: string;
  image?: string;
  video?: string;
}

export class PostBodyModel {
  model?: Model<PostBodyDocument>;
  schema?: Schema<PostBodyDocument>;
  constructor() {
    if (mongoose.models.PostBody) {
      this.model = mongoose.model<PostBodyDocument>("PostBody");
    } else {
      this.schema = new mongoose.Schema<PostBodyDocument>({
        text: {
          type: String,
        },
        image: {
          type: String,
        },
        video: {
          type: String,
        },
      });

      this.model = mongoose.model("PostBody", this.schema);
    }
  }

  public async createPostBody(postBody: PostBodyDocument) {
      const newPostBody = new this.model!(postBody)
      return await newPostBody.save()
  }

  public async updatePostBodyById(id: string, type: string, data:string) {

    const update = { [type]: data };

      const postBody = await this.model!.findByIdAndUpdate(
      id,               
      update , 
      { new: true }     
    );
  
    return postBody;    
  }

  public async findPostBodyById(id: string) {
    const postBody = await this.model!.findById(id);
    console.log(postBody);                
    return postBody;    
  }

  public async deleteContentsFromPostBody(id: string, type: string) {
    const deleteType = { $unset: { [type]: 1 } };
    const result = await this.model!.findByIdAndUpdate(id, deleteType);
    return result;
  }
  
}

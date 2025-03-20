import { isValidObjectId } from "mongoose";
import { z } from "zod";

export class PostBodySchemas {
    static uploadPostBodySchema = z.object({
      id:  z.string().refine((id) => isValidObjectId(id)),
      text: z.string().min(1, "Text content must be provided").optional(),
      image: z.string().min(1, "Image request must be provided").optional(),
      video: z.string().min(1, "Video request must be provided").optional(),
    }).refine(data => {

        if (!data.text && !data.image && !data.video) {
            throw new Error("At least one of text, image, or video must be provided");  
        }
        return true;
      
    });

    static editPostBodySchema = z.object({
        id:  z.string().refine((id) => isValidObjectId(id)),
        postBodyID: z.string().refine((postBodyID) => isValidObjectId(postBodyID)),
        text: z.string().min(1, "Text content must be provided").optional(),
        image: z.string().min(1, "Image request must be provided").optional(),
        video: z.string().min(1, "Video request must be provided").optional(),
      }).refine(data => {
  
          if (!data.text && !data.image && !data.video) {
              throw new Error("At least one of text, image, or video must be provided");  
          }
          return true;
        
    });

    static checkIDPostBodySchema = z.object({
        id: z.string(),
        postBodyID: z.string(),
    });

    static IDchecker = z.string().refine((id) => isValidObjectId(id), {
        message: "Invalid Object ID",
    });
}

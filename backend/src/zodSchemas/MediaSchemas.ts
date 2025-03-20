import { isValidObjectId } from "mongoose";
import { z } from "zod";

export class MediaSchemas {
    static uploadMediaSchema = z.object({
        id: z.string().refine(isValidObjectId, {
            message: "Invalid ObjectId for id",
        }),
        url: z.string(),
        data: z.any(),
        uploadedBy: z.string().refine(isValidObjectId, {
            message: "Invalid ObjectId for uploadedBy",
        }),
        relatedObject: z.string().refine(isValidObjectId, {
            message: "Invalid ObjectId for id",
        }),
        mimeType: z.string().optional(),
        width: z.number().optional(),
        height: z.number().optional(),
        fileSize: z.number().optional()
    });

    static updateMediaSchema = z.object({
        id: z.string().refine(isValidObjectId, {
            message: "Invalid ObjectId for id",
        }),
        mediaId: z.string().refine(isValidObjectId, {
            message: "Invalid ObjectId for mediaId",
        }),
        data: z.any(),
        url: z.string().url("Invalid URL").optional(),
        mimeType: z.string().optional(),
        width: z.number().optional(),
        height: z.number().optional(),
        fileSize: z.number().optional()
    });

    static deleteMediaSchema = z.object({
        id: z.string().refine(isValidObjectId, {
            message: "Invalid ObjectId for id",
        }),
        mediaId: z.string().refine(isValidObjectId, {
            message: "Invalid ObjectId for mediaId",
        })
    });
    static updateUrlSchema = z.object({
        id: z.string().refine(isValidObjectId, {
            message: "Invalid ObjectId for id",
        }),
        mediaId: z.string().refine(isValidObjectId, {
            message: "Invalid ObjectId for mediaId",
        }),
        url: z.string().url("Invalid URL")
    });
    static IDchecker = z.string().refine((id) => isValidObjectId(id), {
        message: "Invalid Object ID",
    });
}


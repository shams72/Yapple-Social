import { z } from "zod";
import { isValidObjectId } from "mongoose";

export const CommentSchemas = {
  createCommentSchema: z.object({
    author: z.string().refine(id => isValidObjectId(id)),
    post: z.string().refine(id => isValidObjectId(id)),
    body: z.string().min(1)
  }),
  
  getCommentSchema: z.object({
    id: z.string().refine(id => isValidObjectId(id))
  }),

  editCommentSchema: z.object({
    id: z.string().refine(id => isValidObjectId(id)),
    body: z.string().min(1)
  }),

  deleteCommentSchema: z.object({
    id: z.string().refine(id => isValidObjectId(id))
  }),

  addReplySchema: z.object({
    commentId: z.string().refine(id => isValidObjectId(id)),
    replyBody: z.string().min(1),
    author: z.string().refine(id => isValidObjectId(id))
  }),

  deleteReplySchema: z.object({
    commentId: z.string().refine(id => isValidObjectId(id)),
    replyId: z.string().refine(id => isValidObjectId(id))
  })
}; 
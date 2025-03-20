import { z } from "zod";
import { isValidObjectId } from "mongoose";

export const VoteSchemas = {
  createVoteSchema: z.object({
    targetId: z.string().refine(id => isValidObjectId(id)),
    voteType: z.enum(['upvote', 'downvote']),
    targetModel: z.enum(['Post', 'Comment'])
  }),

  deleteVoteSchema: z.object({
    targetId: z.string().refine(id => isValidObjectId(id)),
    voteType: z.enum(['upvote', 'downvote']),
    targetModel: z.enum(['Post', 'Comment'])
  }),

  getVotesSchema: z.object({
    id: z.string().refine(id => isValidObjectId(id)),
    targetId: z.string().refine(id => isValidObjectId(id)),
    targetModel: z.enum(['Post', 'Comment'])
  })
};

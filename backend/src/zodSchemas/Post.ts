import { isValidObjectId } from "mongoose";
import { z } from "zod";

export class PostSchemas {
  static createNormalPostSchema = z
    .object({
      id: z.string().refine((id) => isValidObjectId(id)),
      author: z.string().refine((author) => isValidObjectId(author)),
      title: z.string().min(1, "Title must be provided"),
      body: z.string().refine((body) => isValidObjectId(body)),
      community: z
        .string()
        .refine((community) => isValidObjectId(community))
        .optional(),
      postType: z
        .literal("normal")
        .describe("Post type must be exactly 'normal'."),
      createdAt: z.string().min(1, "Creation date must be provided").optional(),
      votes: z
        .string()
        .refine((votes) => isValidObjectId(votes))
        .optional(),
      comments: z
        .string()
        .refine((comments) => isValidObjectId(comments))
        .optional(),
    })
    .refine((data) => {
      if (data.createdAt) {
        const createdAt = new Date(data.createdAt);

        if (isNaN(createdAt.getTime())) {
          throw new Error("Please Enter valid date format");
        }
      }
      return true;
    });

  static getPostCountSchema = z.object({
    id: z.string().refine((id) => isValidObjectId(id)),
  });

  static createSelfDestructPostSchema = z
    .object({
      id: z.string().refine((id) => isValidObjectId(id)),
      author: z.string().refine((author) => isValidObjectId(author)),
      title: z.string().min(1, "Title must be provided"),
      body: z.string().refine((body) => isValidObjectId(body)),
      community: z
        .string()
        .refine((community) => isValidObjectId(community))
        .optional(),
      postType: z
        .literal("selfDestruct")
        .describe("Post type must be exactly 'selfDestruct'"),
      createdAt: z.string().min(1, "Creation date must be provided").optional(),
      expiresAt: z
        .string()
        .min(1, "Expiration date must be provided")
        .optional(),
      votes: z
        .string()
        .refine((votes) => isValidObjectId(votes))
        .optional(),
      comments: z
        .string()
        .refine((comments) => isValidObjectId(comments))
        .optional(),
    })
    .refine((data) => {
      if (data.createdAt) {
        const createdAt = new Date(data.createdAt);

        if (isNaN(createdAt.getTime())) {
          throw new Error("Please Enter valid date format");
        }
      }

      if (data.postType === "selfDestruct" && !data.expiresAt) {
        throw new Error("Please Provide expiry date for self Destruct");
      }
      return true;
    });

  static createTimeCapsulePostSchema = z
    .object({
      id: z.string().refine((id) => isValidObjectId(id)),
      author: z.string().refine((author) => isValidObjectId(author)),
      title: z.string().min(1, "Title must be provided"),
      body: z.string().refine((body) => isValidObjectId(body)),
      community: z
        .string()
        .refine((community) => isValidObjectId(community))
        .optional(),
      postType: z
        .literal("timeCapsule")
        .describe("Post type must be exactly 'timeCapsule'."),
      createdAt: z.string().min(1, "Creation date must be provided").optional(),
      expiresAt: z
        .string()
        .min(1, "Expiration date must be provided")
        .optional(),
      revealAt: z.string().min(1, "Reveal date must be provided").optional(),
      votes: z
        .string()
        .refine((votes) => isValidObjectId(votes))
        .optional(),
      comments: z
        .string()
        .refine((comments) => isValidObjectId(comments))
        .optional(),
    })
    .refine((data) => {
      if (data.createdAt) {
        const createdAt = new Date(data.createdAt);
        console.log(createdAt);

        if (isNaN(createdAt.getTime())) {
          throw new Error("Please Enter valid date format");
        }
      }

      if (data.postType === "timeCapsule") {
        if (!data.expiresAt || !data.revealAt) {
          throw new Error(
            "Please provide both expiry and reveal dates for time Capsule"
          );
        }

        const expiredAt = new Date(data.expiresAt);
        const revealAt = new Date(data.revealAt);
        if (isNaN(expiredAt.getTime()) || isNaN(revealAt.getTime())) {
          throw new Error(
            "Please Enter valid date format for expiry/reveal field"
          );
        }
        if (new Date(data.expiresAt) <= new Date(data.revealAt)) {
          throw new Error(
            "Reveal date must be before the Expiry date for time Capsule"
          );
        }
      }
      return true;
    });

  static getTenPost = z.object({
    id: z.string().refine((id) => isValidObjectId(id), {
      message: "Invalid ID format",
    }),
    seenLastIDs: z.array(z.any()),
  });

  static IDchecker = z.string().refine((id) => isValidObjectId(id), {
    message: "Invalid Object ID",
  });
}

import { isValidObjectId } from "mongoose";
import { z } from "zod";

export class UserSchemas {
  static getUserByIdSchema = z.object({
    id: z.string().refine((id) => isValidObjectId(id)),
  });

  static getTenSuggetionSchema = z.object({
    id: z.string().refine((id) => isValidObjectId(id)),
    page: z.number().min(0, "page should be bigger or equal 0"),
  });

  static getUserByUsername = z.object({
    username: z.string().min(3, "username must be longer than 3 "),
  });

  static updateUserSchema = z.object({
    id: z
      .string()
      .refine((id) => isValidObjectId(id), "Invalid ObjectId format"),
    displayName: z.string().optional(),
    profilePictureUrl: z.string().url().optional(),
    bio: z.string().optional(),
    links: z
      .array(
        z.object({
          platform: z.string().min(1, "Platform name cannot be empty"),
          url: z.string().url("Invalid URL format"),
        })
      )
      .optional(),
  });

  static addFollowerSchema = z.object({
    id: z
      .string()
      .refine((id) => isValidObjectId(id), "Invalid ObjectId format"),
    followerId: z
      .string()
      .refine((id) => isValidObjectId(id), "Invalid ObjectId format"),
  });

  static removeFollowerSchema = z.object({
    id: z
      .string()
      .refine((id) => isValidObjectId(id), "Invalid ObjectId format"),
    followerId: z
      .string()
      .refine((id) => isValidObjectId(id), "Invalid ObjectId format"),
  });

  static addFollowingSchema = z.object({
    id: z
      .string()
      .refine((id) => isValidObjectId(id), "Invalid ObjectId format"),
    followingId: z
      .string()
      .refine((id) => isValidObjectId(id), "Invalid ObjectId format"),
  });

  static removeFollowingSchema = z.object({
    id: z
      .string()
      .refine((id) => isValidObjectId(id), "Invalid ObjectId format"),
    followingId: z
      .string()
      .refine((id) => isValidObjectId(id), "Invalid ObjectId format"),
  });

  static deleteUserSchemas = z.object({
    id: z
      .string()
      .refine((id) => isValidObjectId(id), "Invalid ObjectId format"),
  });

  static addPostSchema = z.object({
    id: z
      .string()
      .refine((id) => isValidObjectId(id), "Invalid ObjectId format"),
    postId: z
      .string()
      .refine((id) => isValidObjectId(id), "Invalid ObjectId format"),
  });

  static removePostSchema = z.object({
    id: z
      .string()
      .refine((id) => isValidObjectId(id), "Invalid ObjectId format"),
    postId: z
      .string()
      .refine((id) => isValidObjectId(id), "Invalid ObjectId format"),
  });

  static updateBanner = z.object({
    id: z
      .string()
      .refine((id) => isValidObjectId(id), "Invalid ObjectId format"),
    url: z.string(),
  });

  static updateProfile = z.object({
    id: z
      .string()
      .refine((id) => isValidObjectId(id), "Invalid ObjectId format"),
    url: z.string(),
  });
}

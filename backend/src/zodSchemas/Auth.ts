import { isValidObjectId } from "mongoose";
import { z } from "zod";

export class AuthSchemas {
  static Signin = z.object({
    username: z.string().min(3, "username must be longer than 3"),
    password: z.string().min(3, "password must be longer than 6"),
  });

  static signUp = z.object({
    username: z.string().min(1, "Username cannot be empty"),
    passwordHash: z.string().min(1, "Password hash cannot be empty"),
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
    joinedAt: z.date().optional(),
    posts: z.array(z.string().refine((id) => isValidObjectId(id))).optional(),
    followers: z
      .array(z.string().refine((id) => isValidObjectId(id)))
      .optional(),
    following: z
      .array(z.string().refine((id) => isValidObjectId(id)))
      .optional(),
  });
}

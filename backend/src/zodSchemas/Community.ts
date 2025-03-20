import { isValidObjectId } from "mongoose";
import { z } from "zod";

export class CommunitySchemas {
    static createCommunitySchema = z.object({
        id: z.string().refine(isValidObjectId, {
          message: "Invalid ObjectId for id",
        }),
        name: z.string().min(1, "Name must be provided"), 
        description: z.string().min(1, "Description must be provided"), 
        bannerUrl: z.string().url("Invalid URL").optional(), 
        links: z.array(
          z.object({
            platform: z.string().min(1, "Platform must be provided"), 
            url: z.string().url("Invalid URL"),
          })
        ).optional(), 
    });

    static IDSArraychema = z.array(z.string().min(0, ""));
    
    static IDStringchema =  z.string().refine(isValidObjectId, {
            message: "Invalid ObjectId for id",
          });

    static editNameSchema = z.object({

        id: z.string().refine(isValidObjectId, {
            message: "Invalid ObjectId for id",
          }),
        communityID: z.string().refine(isValidObjectId, {
            message: "Invalid ObjectId for id",
        }),       
        currentName : z.string().min(1, "Description must be provided"), 
        newName : z.string().min(1, "Description must be provided")
    });


    static editDescriptionSchema = z.object({

        id: z.string().refine(isValidObjectId, {
            message: "Invalid ObjectId for id",
          }),
        communityID: z.string().refine(isValidObjectId, {
            message: "Invalid ObjectId for id",
          }),        
        newDescription : z.string().min(1, "Description must be provided")
    });

    static addBannerURLSchema = z.object({

        id: z.string().refine(isValidObjectId, {
            message: "Invalid ObjectId for id",
          }),       
        communityID: z.string().refine(isValidObjectId, {
            message: "Invalid ObjectId for id",
        }),  
        bannerUrl : z.string().min(1, "BannerUrl must be provided"), 
    });

    static deleteBannerURLSchema = z.object({

        id: z.string().refine(isValidObjectId, {
            message: "Invalid ObjectId for id",
        }),
        communityID: z.string().refine(isValidObjectId, {
            message: "Invalid ObjectId for id",
        }),   
    });

    static addUsersSchema =  z.object({

        id: z.string().refine(isValidObjectId, {
            message: "Invalid ObjectId for id",
        }),
        communityID: z.string().refine(isValidObjectId, {
            message: "Invalid ObjectId for id",
        }),
        userID: z.string().refine(isValidObjectId, {
            message: "Invalid ObjectId for id",
        }),   
    });

    
    static deleteUsersSchema =  z.object({

        id: z.string().refine(isValidObjectId, {
            message: "Invalid ObjectId for id",
        }),
        communityID: z.string().refine(isValidObjectId, {
            message: "Invalid ObjectId for id",
        }),
        userID: z.string().refine(isValidObjectId, {
            message: "Invalid ObjectId for id",
        }),   
    });


    static addLinksSchems =  z.object({

        id: z.string().refine(isValidObjectId, {
            message: "Invalid ObjectId for id",
        }),
        communityID: z.string().refine(isValidObjectId, {
            message: "Invalid ObjectId for id",
        }),
        platform: z.string().min(1, "Platform must be provided"),
        url: z.string().url("Invalid URL"),   
    });

    static editURLfromLinkSchema =  z.object({

        id: z.string().refine(isValidObjectId, {
            message: "Invalid ObjectId for id",
        }),
        communityID: z.string().refine(isValidObjectId, {
            message: "Invalid ObjectId for id",
        }),
        platform: z.string().min(1, "Platform must be provided"),
        url: z.string().url("Invalid URL"),   
    });

    static editPlatformfromLinkSchema =  z.object({

        id: z.string().refine(isValidObjectId, {
            message: "Invalid ObjectId for id",
        }),
        communityID: z.string().refine(isValidObjectId, {
            message: "Invalid ObjectId for id",
        }),
        platform: z.string().min(1, "Platform must be provided"),
        newPlatform: z.string().min(1, "Platform must be provided"), 
    });

    static deletePlatformfromLinkSchema =  z.object({

        id: z.string().refine(isValidObjectId, {
            message: "Invalid ObjectId for id",
        }),
        communityID: z.string().refine(isValidObjectId, {
            message: "Invalid ObjectId for id",
        }),
        platform: z.string().min(1, "Platform must be provided"),
    });

    static addPostSchema =  z.object({

        id: z.string().refine(isValidObjectId, {
            message: "Invalid ObjectId for id",
        }),
        communityID: z.string().refine(isValidObjectId, {
            message: "Invalid ObjectId for id",
        }),
        postID: z.string().refine(isValidObjectId, {
            message: "Invalid ObjectId for id",
        }),
    });

    static removePostSchema =  z.object({

        id: z.string().refine(isValidObjectId, {
            message: "Invalid ObjectId for id",
        }),
        communityID: z.string().refine(isValidObjectId, {
            message: "Invalid ObjectId for id",
        }),
        postID: z.string().refine(isValidObjectId, {
            message: "Invalid ObjectId for id",
        }),
    });
}
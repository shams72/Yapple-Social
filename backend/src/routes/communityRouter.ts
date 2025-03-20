import { Router } from "express";
import { IRouter } from "./IRouter";
import {CommunityController } from "../controller/community/communityController";
import { Auth } from "../Auth/Auth";


export class CommunityRouter implements IRouter {
  public router: Router;
  auth:Auth;
  public routerSubPath: string = "/community";
  controller:  CommunityController;
  
  constructor() {
    this.router = Router();
    this.controller = new CommunityController();
    this.auth = new Auth();
  }

  public registerRoutes(): void {
    this.router.post("/create-community", this.auth.authenticateToken, this.controller.createCommunity);
    this.router.get("/get-all-community", this.auth.authenticateToken, this.controller.getAllCommunity);
    this.router.get("/get-ten-community/:id",this.auth.authenticateToken,this.controller.getTenCommunity);//
    this.router.get("/get-community-by-ID/:communityID",this.auth.authenticateToken,this.controller.getCommunityByID); 
    this.router.get("/get-three-community-posts/:id",this.auth.authenticateToken,this.controller.getThreeCommunityPosts); 
    this.router.put("/add-members-by-ID", this.auth.authenticateToken, this.controller.addMembersbyID);
    this.router.put("/add-admin-by-ID", this.auth.authenticateToken, this.controller.addAdminbyID);
    this.router.put("/remove-members-by-ID", this.auth.authenticateToken, this.controller.removeMembersbyID);
    this.router.put("/edit-community-name", this.auth.authenticateToken, this.controller.editCommunityName);
    this.router.put("/edit-community-description-by-ID", this.auth.authenticateToken, this.controller.editCommunityDescription);
    this.router.put("/add-banner-URL-by-ID", this.auth.authenticateToken, this.controller.addBannerURL);
    this.router.put("/add-postID-by-communityID",this.auth.authenticateToken, this.controller.addPostByID);
    this.router.put("/add-platform-links-by-ID", this.auth.authenticateToken, this.controller.addPlatformLinksbyID);
    this.router.put("/edit-platform-names-by-ID", this.auth.authenticateToken, this.controller.editPlatformNamesbyID);
    this.router.put("/edit-platform-links-by-ID", this.auth.authenticateToken, this.controller.editPlatformLinksbyID);
    this.router.delete("/delete-platform-from-link-by-ID", this.auth.authenticateToken, this.controller.deletePlatformfromLinkbyID);
    this.router.put("/delete-postID-by-communityID",this.auth.authenticateToken, this.controller.deletePostID);
    this.router.delete("/delete-banner-URL-by-ID", this.auth.authenticateToken, this.controller.deleteBannerURL);
    

  }
}

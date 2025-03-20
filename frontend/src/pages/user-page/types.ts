export interface userType {
  profilePic?:string;
  displayName: string;
  followers: string[];
  following: string[];
  joinedAt: Date;
  links: string[];
  username: string;
  bannerPictureUrl?: string;
  profilePictureUrl: string;
  posts: string[];
  id: string;
  bio?: string;
}

export interface PostData {
  id: string;
  _id: string;
  profilePic?:string;
  author: any;
  title: string;
  postType: string;
  body?: {
    id: string;
    text: string;
    image?: string;
    video?: string;
  };
  community?: string;
  revealAt?: string;
  expiresAt?: string;
  createdAt?: string;
  comments?: any[];
}

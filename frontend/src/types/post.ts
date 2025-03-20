export interface PostData {
  id: string;
  author: {
    username: string;
    // Add other author fields as needed
  };
  title: string;
  postType: string;
  body?: {
    id: string;
    text: string;
    image?: string;
    video?: string;
  };
  createdAt?: string;
  revealAt?: string;
  expiresAt?: string;
  comments?: any[]; // Define a proper Comment type if you have one
} 
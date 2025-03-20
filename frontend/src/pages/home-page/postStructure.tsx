import React from "react";
import { FormControl, Select, MenuItem, Typography } from "@mui/material";
import PostComponent from "../../components/Post";

interface NormalPost {
  _id: string;
  author: {
    displayName: string;
  };
  title: string;
  body: {
    text: string;
    image?: string;
    video?: string;
  };
  postType: "normal";
  votes?: string[];
  comments?: string[];
  createdAt: string;
}

interface SelfDestructPost {
  _id: string;
  author: {
    displayName: string;
  };
  title: string;
  body: {
    text: string;
    image?: string;
    video?: string;
  };
  postType: "selfDestruct";
  expiresAt: string;
  votes?: string[];
  comments?: string[];
  createdAt: string;
}

interface TimeCapsulePost {
  _id: string;
  author: {
    displayName: string;
  };
  title: string;

  body: {
    text: string;
    image?: string;
    video?: string;
  };
  postType: "timeCapsule";
  expiresAt: string;
  revealAt: string;
  votes?: string[];
  comments?: string[];
  createdAt: string;
}

type postStructure = NormalPost | SelfDestructPost | TimeCapsulePost;

interface PostListProps {
  postData: postStructure[];
  viewStates: Record<string, string>;
  onSortChange?: (sortBy: string) => void;
}

const PostList: React.FC<PostListProps> = ({ postData, onSortChange }) => {
  const handleSortChange = (event: any) => {
    if (onSortChange) {
      onSortChange(event.target.value);
    }
  };

  return (
    <div className="post-container">
      <div className="sort-container">
        <div>
          <Typography
            variant="body2"
            sx={{
              color: "#666",
              marginBottom: "8px",
              fontSize: "0.875rem",
            }}
          >
            Sort By
          </Typography>
          <FormControl variant="outlined" size="small" className="sort-select">
            <Select
              defaultValue="newest"
              onChange={handleSortChange}
              sx={{
                "& .MuiSelect-select": {
                  paddingY: "8px",
                  color: "#2c2c2c",
                  fontWeight: 500,
                },
                "& .MuiSvgIcon-root": {
                  color: "#666",
                },
              }}
            >
              <MenuItem value="newest">Newest</MenuItem>
              <MenuItem value="best">Best (Vote Count)</MenuItem>
              <MenuItem value="hot">Hot (Comment Count)</MenuItem>
            </Select>
          </FormControl>
        </div>
      </div>

      {postData?.map((post) =>
        post.postType === "normal" ||
        (post.postType === "timeCapsule" &&
          new Date(post.expiresAt).getTime() > new Date().getTime()) ||
        (post.postType === "selfDestruct" &&
          new Date(post.expiresAt).getTime() > new Date().getTime()) ? (
          <PostComponent
            key={post._id}
            id={post._id}
            _id={post._id}
            author={{
              ...post.author,
              username: post.author.displayName,
             // Using post ID as author ID since it's not provided  
            }}
            title={post.title}
            body={{
              id: post._id,
              text: post.body.text,
              image: post.body.image,
              video: post.body.video,
            }}
            postType={post.postType}
            createdAt={post.createdAt}
            expiresAt={post.postType !== "normal" ? post.expiresAt : undefined}
            revealAt={
              post.postType === "timeCapsule" ? post.revealAt : undefined
            }
            comments={post.comments || []}
          />
        ) : null
      )}
    </div>
  );
};

export default PostList;

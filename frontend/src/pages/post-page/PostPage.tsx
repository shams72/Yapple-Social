import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../../App';
import { useAuth } from '../../hooks';
import PostComponent from '../../components/Post';
import { PostData } from '../user-page/types';

import { 
  Box, 
  TextField, 
  Button, 
  Avatar, 
  Typography, 
  Paper,
  CircularProgress 
} from '@mui/material';

interface Comment {
  _id: string;
  body: string;
  author: {
    _id: string;
    username: string;
    profilePictureUrl?: string;
  };
  createdAt: string;
  votes: string[];
  reply: string[];
  isReply: boolean;
}

interface VoteData {
  upvotes: number;
  downvotes: number;
  total: number;
  votes: Array<{
    _id: string;
    user: string;
    targetModel: string;
    targetId: string;
    voteType: 'upvote' | 'downvote';
    createdAt: string;
  }>;
}

const PostPage: React.FC = () => {
  const { postId } = useParams();
  const { id, token } = useAuth();
  const [post, setPost] = useState<PostData | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [_, setVoteData] = useState<VoteData | null>(null);

  const fetchPost = async () => {
    try {
      const res = await axios.get<{ data: PostData }>(
        `${API_URL}/posts/get-posts-by-id/${postId}/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPost(res.data.data);
    } catch (error) {
      console.error('Error fetching post:', error);
    }
  };

  const fetchComments = async () => {
    try {
      const url = `${API_URL}/comment/get-comments-by-post/${postId}?id=${id}`;
      const res = await axios.get<{ data: Comment[] }>(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setComments(res.data.data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const fetchVotes = async () => {
    try {
      const url = `${API_URL}/vote/get-votes/Post/${postId}?id=${id}`;
      const res = await axios.get<{ data: VoteData }>(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setVoteData(res.data.data);
    } catch (error) {
      console.error('Error fetching votes:', error);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      const res = await axios.post<{ data: Comment }>(
        `${API_URL}/comment/create-comment`,
        {
          id: id,
          author: id,
          post: postId,
          body: newComment,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setComments((prev) => [...prev, res.data.data]);
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleDeletePost = async () => {
    // this should navigate back to the previous page after deleting the post (todo)
  };

  useEffect(() => {
    if (postId) {
      fetchPost();
      fetchComments();
      fetchVotes();
    }
  }, [postId]);

  if (!post) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          height: 'calc(100vh - 6em)',
          marginTop: '6em'
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box 
      sx={{ 
        width: '100%',
        maxWidth: '1200px',
        margin: '6em auto 2em',
        padding: '0',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5em'
      }}
    >
      <Box sx={{ padding: '0 20px' }}>
        <PostComponent 
          {...post} 
          onDelete={handleDeletePost}
        />
      </Box>

      <Box sx={{ padding: '0 20px' }}>
        <Paper 
          elevation={0}
          sx={{ 
            width: 'calc(75% - 3em)',
            margin: '0 auto',
            padding: '1.5em',
            backgroundColor: '#fff',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
          }}
        >
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 600,
              marginBottom: '1em',
              color: '#2c2c2c',
              fontSize: '1.1rem',
            }}
          >
            Comments ({comments.length})
          </Typography>
          
          <Box sx={{ marginBottom: '1.5em' }}>
            <TextField
              fullWidth
              multiline
              rows={3}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              variant="outlined"
              sx={{
                backgroundColor: '#fafafa',
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  '& fieldset': {
                    borderColor: '#e0e0e0',
                  },
                  '&:hover fieldset': {
                    borderColor: '#bdbdbd',
                  },
                }
              }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
              <Button
                variant="contained"
                onClick={handleAddComment}
                disabled={!newComment.trim()}
                sx={{
                  borderRadius: '8px',
                  textTransform: 'none',
                  padding: '0.5em 1.5em',
                  backgroundColor: '#FF4B2B',
                  '&:hover': {
                    backgroundColor: '#FF3517',
                  },
                  '&.Mui-disabled': {
                    backgroundColor: '#ffcdc4',
                  }
                }}
              >
                Post Comment
              </Button>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1em' }}>
            {comments.map((comment) => (
              <Paper 
                key={comment._id} 
                elevation={0}
                sx={{
                  padding: '1.25em',
                  backgroundColor: '#fafafa',
                  borderRadius: '8px',
                  border: '1px solid #f0f0f0'
                }}
              >
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '1em',
                  marginBottom: '0.75em'
                }}>
                  <Avatar
                    src={comment.author.profilePictureUrl ? `${API_URL}/${comment.author.profilePictureUrl}` : undefined}
                    sx={{ width: 36, height: 36 }}
                  />
                  <Box sx={{ flex: 1 }}>
                    <Typography 
                      variant="subtitle2"
                      sx={{ 
                        fontWeight: 600, 
                        color: '#2c2c2c',
                        fontSize: '0.95rem'
                      }}
                    >
                      {comment.author.username}
                    </Typography>
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        color: '#666',
                        fontSize: '0.8rem'
                      }}
                    >
                      {new Date(comment.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </Typography>
                  </Box>
                </Box>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: '#444',
                    lineHeight: 1.5,
                    fontSize: '0.95rem'
                  }}
                >
                  {comment.body}
                </Typography>
              </Paper>
            ))}
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default PostPage;

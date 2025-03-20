import React, { useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Card, 
  CardContent, 
  CardActions, 
  Button, 
  Grid,
  Box,
  Divider,
  CardHeader,
  Avatar,
  Skeleton,
  Alert,
  CircularProgress
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Link } from 'react-router-dom';
import { useCommunity } from '../../context/communityContext';
import ArticleIcon from '@mui/icons-material/Article';
import { API_URL } from '../../App';

const StyledContainer = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(8),
  marginBottom: theme.spacing(4),
}));

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[4],
  },
}));

const StyledLink = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  color: theme.palette.primary.main,
  '&:hover': {
    textDecoration: 'underline',
  },
}));

const LoadingSkeleton = () => (
  <Grid container spacing={3}>
    {[1, 2, 3, 4, 5, 6].map((item) => (
      <Grid item xs={12} sm={6} md={4} key={item}>
        <Card>
          <CardHeader
            avatar={<Skeleton variant="circular" width={40} height={40} />}
            title={<Skeleton variant="text" width="80%" />}
          />
          <CardContent>
            <Skeleton variant="text" width="100%" />
            <Skeleton variant="text" width="60%" />
          </CardContent>
          <CardActions>
            <Skeleton variant="rectangular" width={120} height={36} />
          </CardActions>
        </Card>
      </Grid>
    ))}
  </Grid>
);

const AllCommunity: React.FC = () => {
  const { 
    communityData,
    isLoading,
    error,
    hasMore,
    loadMore,
    refreshCommunities
  } = useCommunity();

  useEffect(() => {
    // refresh communities when component mounts
    refreshCommunities();
  }, []);

  const handleScroll = () => {
    if (!isLoading && hasMore) {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      if (scrollTop + clientHeight >= scrollHeight - 40) {
        loadMore();
      }
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isLoading, hasMore]);

  return (
    <StyledContainer maxWidth="lg">
      <Typography 
        variant="h3" 
        component="h1" 
        gutterBottom 
        align="center"
        sx={{ mb: 4, fontWeight: 'bold' }}
      >
        Explore Communities
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {isLoading && communityData.length === 0 ? (
        <LoadingSkeleton />
      ) : (
        <Grid container spacing={3}>
          {communityData?.map((community) => (
            <Grid item xs={12} sm={6} md={4} key={community._id}>
              <StyledCard>
                <CardHeader
                  avatar={
                    <Avatar 
                    src={`${API_URL}/${community.bannerUrl}`}
                    sx={{ bgcolor: 'primary.main' }}>
                      {community.name.charAt(0).toUpperCase()}
                    </Avatar>
                  }
                  title={
                    <StyledLink to={`/explore-community/${community._id}`}>
                      <Typography variant="h6">
                        ./{community.name}
                      </Typography>
                    </StyledLink>
                  }
                />
                
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="body1" color="text.secondary" paragraph>
                    {community.description}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                    <ArticleIcon sx={{ mr: 1 }} color="action" />
                    <Typography variant="body2" color="text.secondary">
                      {community.posts?.length || 0} Posts
                    </Typography>
                  </Box>
                </CardContent>

                <Divider />
                
                <CardActions>
                  <Button 
                    size="small" 
                    component={Link} 
                    to={`/explore-community/${community._id}`}
                  >
                    View Community
                  </Button>
                </CardActions>
              </StyledCard>
            </Grid>
          ))}
        </Grid>
      )}

      {isLoading && communityData.length > 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {!isLoading && hasMore && (
        <Typography 
          variant="body2" 
          color="text.secondary" 
          align="center" 
          sx={{ mt: 2 }}
        >
          Scroll for more communities...
        </Typography>
      )}
    </StyledContainer>
  );
}

export default AllCommunity;
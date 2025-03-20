import React from 'react';
import { Formik, Field, Form } from 'formik';
import { Box, Button, TextField, Typography } from '@mui/material';
import axios from 'axios';
import { useCommunity } from'../../context/communityContext';
import { API_URL } from '../../App';
import { useNavigate } from 'react-router-dom';


interface CreateCommunityProps {
  setCreateCommunity: React.Dispatch<React.SetStateAction<boolean>>;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

const CreateCommunity: React.FC<CreateCommunityProps> = ({ 
  setCreateCommunity,
  onSuccess,
  onError
}) => {
  const { refreshCommunities } = useCommunity();
  const navigate = useNavigate();

  const initialValues = {
    communityName: '',
    communityDescription: ''
  };

  const handleSubmit = async (values: any) => {
    try {
      const createCommunityData = {
          id: localStorage.getItem("id"), 
          name: values.communityName,
          description: values.communityDescription
      };

      const createCommunityResponse = await axios.post(
        `${API_URL}/community/create-community`, 
        createCommunityData,  
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}`}}
      );
      
      const admin = {
        id: localStorage.getItem("id"), 
        communityID: createCommunityResponse.data.data._id,
        userID: localStorage.getItem("id"),
      };
    
      await axios.put(
        `${API_URL}/community/add-admin-by-ID`, 
        admin,  
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}`}}
      );
      
      refreshCommunities();
      onSuccess?.();
      setCreateCommunity(false);
    } catch (error) {
      console.error("Error creating community:", error);
      onError?.(error instanceof Error ? error.message : "Unknown error");
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" sx={{ mb: 4, color: 'text.primary', fontWeight: 500 }}>
        Create Community
      </Typography>
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
      >
        {({ values, handleChange }) => (
          <Form>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Box>
                <Typography variant="subtitle1" sx={{ mb: 1, color: 'text.secondary' }}>
                  Community Name
                </Typography>
                <Field
                  name="communityName"
                  as={TextField}
                  value={values.communityName}
                  onChange={handleChange}
                  fullWidth
                  required
                  variant="outlined"
                  placeholder="Enter community name"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 1,
                    }
                  }}
                />
              </Box>

              <Box>
                <Typography variant="subtitle1" sx={{ mb: 1, color: 'text.secondary' }}>
                  Community Description
                </Typography>
                <Field
                  name="communityDescription"
                  as={TextField}
                  value={values.communityDescription}
                  onChange={handleChange}
                  fullWidth
                  required
                  variant="outlined"
                  placeholder="Enter community description"
                  multiline
                  rows={4}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 1,
                    }
                  }}
                />
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: 2,
                  mt: 2
                }}
              >
                <Button
                  type="button"
                  variant="outlined"
                  onClick={() => navigate(-1)}
                  sx={{
                    minWidth: 120,
                    height: 42,
                    textTransform: 'none',
                    fontWeight: 500
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  onClick={() => navigate(-1)}
                  variant="contained"
                  sx={{
                    minWidth: 120,
                    height: 42,
                    textTransform: 'none',
                    fontWeight: 500
                  }}
                >
                  Create
                </Button>
              </Box>
            </Box>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default CreateCommunity;

import React, { useState, useCallback, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Autocomplete,
  Chip,
  Grid,
  CircularProgress,
  MenuItem,
  Rating,
  Alert,
  InputAdornment,
  Avatar
} from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { LoadScript, Autocomplete as GoogleAutocomplete } from '@react-google-maps/api';
import { api, endpoints } from '../config/api';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhotoCamera from '@mui/icons-material/PhotoCamera';

const libraries = ['places'];
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const skillCategories = [
  'Arts & Crafts',
  'Music & Performance',
  'Technology',
  'Technical Language',
  'Cooking & Culinary',
  'Fitness & Wellness',
  'Business & Finance',
  'Languages',
  'Academic Subjects',
  'Personal Development',
  'Sports & Recreation'
];

const experienceLevels = [
  'Beginner',
  'Intermediate',
  'Advanced',
  'Expert',
  'Master'
];

const teachingMethods = [
  'One-on-One Sessions',
  'Group Classes',
  'Workshops',
  'Online Courses',
  'Recorded Content',
  'Hands-on Projects',
  'Mentoring'
];

const SkillProfileForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isEditing = location.pathname.includes('/edit');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [autocomplete, setAutocomplete] = useState(null);
  const [loadError, setLoadError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [useGoogleMaps] = useState(!!GOOGLE_MAPS_API_KEY);
  const [profileImage, setProfileImage] = useState(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    skills: [],
    experienceLevel: '',
    teachingMethods: [],
    availability: '',
    address: '',
    city: '',
    state: '',
    country: '',
    online: false,
    portfolio: '',
    certificates: [],
    languages: [],
    profilePicture: ''
  });

  const getProfilePictureUrl = (path) => {
    if (!path) return undefined;
    
    // If it's already a full URL, return it as is
    if (path.startsWith('http')) return path;
    
    // Get the API base URL from environment variable, fallback to localhost
    const baseUrl = API_BASE_URL;
    
    // Remove any leading double slashes from path and trailing slash from baseUrl
    const cleanPath = path.replace(/^\/+/, '');
    const cleanBaseUrl = baseUrl.replace(/\/+$/, '');
    
    // Combine the base URL and path
    return `${cleanBaseUrl}/${cleanPath}`;
  };

  useEffect(() => {
    if (isEditing) {
      fetchExistingProfile();
    }
  }, [isEditing]);

  const fetchExistingProfile = async () => {
    try {
      setLoading(true);
      const response = await api.get(endpoints.skillProfile.get);
      if (response.data.success) {
        const profileData = response.data.data;
        setFormData({
          title: profileData.title || '',
          category: profileData.category || '',
          description: profileData.description || '',
          skills: profileData.skills || [],
          experienceLevel: profileData.experienceLevel || '',
          teachingMethods: profileData.teachingMethods || [],
          availability: profileData.availability || '',
          address: profileData.address || '',
          city: profileData.city || '',
          state: profileData.state || '',
          country: profileData.country || '',
          online: profileData.online || false,
          portfolio: profileData.portfolio || '',
          certificates: profileData.certificates || [],
          languages: profileData.languages || [],
          profilePicture: profileData.profilePicture || ''
        });
      }
    } catch (error) {
      setError('Failed to fetch profile data');
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('profilePicture', file);

    try {
      setImageLoading(true);
      const response = await api.post(endpoints.skillProfile.uploadImage, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        const imageUrl = response.data.imageUrl;
        console.log('Server response:', response.data);
        console.log('Image URL from server:', imageUrl);
        
        setFormData(prev => ({
          ...prev,
          profilePicture: imageUrl
        }));
      }
    } catch (error) {
      setError('Failed to upload image');
      console.error('Error uploading image:', error);
    } finally {
      setImageLoading(false);
    }
  };

  const onLoad = useCallback((autocompleteInstance) => {
    console.log('Google Maps Places loaded');
    setAutocomplete(autocompleteInstance);
  }, []);

  const onPlaceChanged = useCallback(() => {
    if (autocomplete) {
      const place = autocomplete.getPlace();
      console.log('Selected place:', place);
      
      if (!place.geometry) {
        console.error('No geometry for this place');
        return;
      }

      let state = '';
      let country = '';
      let city = '';
      
      place.address_components?.forEach(component => {
        const types = component.types;
        if (types.includes('locality') || types.includes('postal_town')) {
          city = component.long_name;
        }
        if (types.includes('administrative_area_level_1')) {
          state = component.long_name;
        }
        if (types.includes('country')) {
          country = component.long_name;
        }
      });

      setFormData(prev => ({
        ...prev,
        address: place.formatted_address || '',
        city,
        state,
        country
      }));
    }
  }, [autocomplete]);

  const onLoadError = useCallback((error) => {
    console.error('Google Maps Places load error:', error);
    setLoadError(error);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const endpoint = isEditing ? endpoints.skillProfile.update : endpoints.skillProfile.create;
      const response = await api.post(endpoint, formData);

      if (response.data.success) {
        navigate('/dashboard');
      }
    } catch (error) {
      setError(error.response?.data?.message || error.message || 'Failed to save skill profile');
      console.error('Error saving skill profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: { xs: 4, sm: 6 }, mb: { xs: 4, sm: 6 } }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Paper elevation={6} sx={{ 
            p: { xs: 3, sm: 6 },
            borderRadius: 3,
            background: 'linear-gradient(to bottom right, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.95))',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          }}>
            <Typography variant="h4" align="center" sx={{
              fontWeight: 700,
              background: 'linear-gradient(45deg, #1976d2, #21CBF3)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 1
            }}>
              {isEditing ? 'Edit Your Skill Profile' : 'Create Your Skill Profile'}
            </Typography>

            {/* Profile Picture Upload */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
              <Box sx={{ position: 'relative' }}>
                <Avatar
                  src={formData.profilePicture ? getProfilePictureUrl(formData.profilePicture) : undefined}
                  sx={{ 
                    width: 120, 
                    height: 120, 
                    mb: 2,
                    border: '4px solid #fff',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  }}
                  imgProps={{
                    onError: (e) => {
                      console.error('Image load error for URL:', e.target.src);
                      e.target.src = undefined;
                    }
                  }}
                />
                {imageLoading && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: 'rgba(255, 255, 255, 0.7)',
                      borderRadius: '50%'
                    }}
                  >
                    <CircularProgress size={40} />
                  </Box>
                )}
                <label htmlFor="profile-picture">
                  <input
                    accept="image/*"
                    id="profile-picture"
                    type="file"
                    style={{ display: 'none' }}
                    onChange={handleImageChange}
                    disabled={imageLoading}
                  />
                  <Button
                    component="span"
                    variant="contained"
                    disabled={imageLoading}
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      right: 0,
                      minWidth: 'auto',
                      width: 36,
                      height: 36,
                      borderRadius: '50%'
                    }}
                  >
                    {imageLoading ? <CircularProgress size={24} /> : <PhotoCamera />}
                  </Button>
                </label>
              </Box>
            </Box>

            <Typography 
              variant="body1" 
              align="center" 
              color="textSecondary" 
              sx={{ 
                mb: 5,
                fontSize: '1.1rem',
                opacity: 0.8
              }}
            >
              Share your expertise and start teaching others
            </Typography>

            {error && (
              <Alert 
                severity="error" 
                sx={{ 
                  mb: 4,
                  borderRadius: 2,
                  '& .MuiAlert-icon': {
                    fontSize: '1.5rem'
                  }
                }}
              >
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Profile Title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    helperText="E.g., 'Expert Guitar Teacher' or 'Professional Photography Instructor'"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        '&:hover fieldset': {
                          borderColor: '#1976d2',
                        },
                      }
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    select
                    label="Skill Category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        '&:hover fieldset': {
                          borderColor: '#1976d2',
                        },
                      }
                    }}
                  >
                    {skillCategories.map((category) => (
                      <MenuItem 
                        key={category} 
                        value={category}
                        sx={{
                          '&:hover': {
                            background: 'rgba(25, 118, 210, 0.08)',
                          }
                        }}
                      >
                        {category}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    select
                    label="Experience Level"
                    name="experienceLevel"
                    value={formData.experienceLevel}
                    onChange={handleChange}
                    required
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        '&:hover fieldset': {
                          borderColor: '#1976d2',
                        },
                      }
                    }}
                  >
                    {experienceLevels.map((level) => (
                      <MenuItem 
                        key={level} 
                        value={level}
                        sx={{
                          '&:hover': {
                            background: 'rgba(25, 118, 210, 0.08)',
                          }
                        }}
                      >
                        {level}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    helperText="Describe your expertise and teaching approach"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        '&:hover fieldset': {
                          borderColor: '#1976d2',
                        },
                      }
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Autocomplete
                    multiple
                    freeSolo
                    options={[]}
                    value={formData.skills}
                    onChange={(event, newValue) => {
                      setFormData(prev => ({ ...prev, skills: newValue }));
                    }}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <Chip
                          {...getTagProps({ index })}
                          key={option}
                          label={option}
                          sx={{
                            background: 'linear-gradient(45deg, #1976d2 30%, #21CBF3 90%)',
                            color: 'white',
                            '& .MuiChip-deleteIcon': {
                              color: 'white',
                              '&:hover': {
                                color: '#ff4444'
                              }
                            }
                          }}
                        />
                      ))
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Skills"
                        placeholder="Add specific skills"
                        helperText="Press enter to add each skill"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            '&:hover fieldset': {
                              borderColor: '#1976d2',
                            },
                          }
                        }}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Autocomplete
                    multiple
                    options={teachingMethods}
                    value={formData.teachingMethods}
                    onChange={(event, newValue) => {
                      setFormData(prev => ({ ...prev, teachingMethods: newValue }));
                    }}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <Chip
                          {...getTagProps({ index })}
                          key={option}
                          label={option}
                          sx={{
                            background: 'linear-gradient(45deg, #1976d2 30%, #21CBF3 90%)',
                            color: 'white',
                            '& .MuiChip-deleteIcon': {
                              color: 'white',
                              '&:hover': {
                                color: '#ff4444'
                              }
                            }
                          }}
                        />
                      ))
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Teaching Methods"
                        placeholder="Select teaching methods"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            '&:hover fieldset': {
                              borderColor: '#1976d2',
                            },
                          }
                        }}
                      />
                    )}
                  />
                </Grid>

                <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>Location Information</Typography>
                <Grid container spacing={2}>
                  {useGoogleMaps ? (
                    <Grid item xs={12}>
                      <LoadScript
                        googleMapsApiKey={GOOGLE_MAPS_API_KEY}
                        libraries={libraries}
                        onLoad={() => setIsLoaded(true)}
                        onError={(error) => setLoadError(error)}
                      >
                        {isLoaded && !loadError ? (
                          <GoogleAutocomplete
                            onLoad={onLoad}
                            onPlaceChanged={onPlaceChanged}
                          >
                            <TextField
                              fullWidth
                              label="Search Location"
                              variant="outlined"
                              value={formData.address}
                              onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <LocationOnIcon />
                                  </InputAdornment>
                                ),
                              }}
                            />
                          </GoogleAutocomplete>
                        ) : loadError ? (
                          <Alert severity="error" sx={{ mb: 2 }}>
                            Error loading Google Maps: {loadError.message}
                          </Alert>
                        ) : (
                          <CircularProgress />
                        )}
                      </LoadScript>
                    </Grid>
                  ) : (
                    <>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Address"
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          required
                        />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <TextField
                          fullWidth
                          label="City"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          required
                        />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <TextField
                          fullWidth
                          label="State"
                          name="state"
                          value={formData.state}
                          onChange={handleChange}
                          required
                        />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <TextField
                          fullWidth
                          label="Country"
                          name="country"
                          value={formData.country}
                          onChange={handleChange}
                          required
                        />
                      </Grid>
                    </>
                  )}
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Availability"
                    name="availability"
                    value={formData.availability}
                    onChange={handleChange}
                    required
                    helperText="E.g., 'Weekends' or 'Weekday Evenings'"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        '&:hover fieldset': {
                          borderColor: '#1976d2',
                        },
                      }
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Portfolio URL"
                    name="portfolio"
                    value={formData.portfolio}
                    onChange={handleChange}
                    helperText="Add a link to your portfolio or relevant work"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        '&:hover fieldset': {
                          borderColor: '#1976d2',
                        },
                      }
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    disabled={loading}
                    sx={{
                      mt: 2,
                      py: 1.5,
                      borderRadius: 2,
                      fontSize: '1.1rem',
                      textTransform: 'none',
                      background: 'linear-gradient(45deg, #1976d2 30%, #21CBF3 90%)',
                      boxShadow: '0 3px 15px rgba(25, 118, 210, 0.3)',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #1976d2 50%, #21CBF3 100%)',
                        boxShadow: '0 5px 20px rgba(25, 118, 210, 0.4)',
                      }
                    }}
                  >
                    {loading ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      isEditing ? 'Save Changes' : 'Create Profile'
                    )}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </motion.div>
      </Box>
    </Container>
  );
};

export default SkillProfileForm;

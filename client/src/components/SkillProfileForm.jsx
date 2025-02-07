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
  InputAdornment
} from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { LoadScript, Autocomplete as GoogleAutocomplete } from '@react-google-maps/api';
import { api, endpoints } from '../config/api';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const libraries = ['places'];
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [autocomplete, setAutocomplete] = useState(null);
  const [loadError, setLoadError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
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
    languages: []
  });

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
      
      // Extract city, state and country from address components
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

      console.log('Extracted location:', { city, state, country });

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
      const response = await api.post(endpoints.skillProfile.create, formData);

      if (response.data.success) {
        navigate('/dashboard');
      }
    } catch (error) {
      setError(error.response?.data?.message || error.message || 'Failed to create skill profile');
      console.error('Error creating skill profile:', error);
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
      <Box sx={{ 
        mt: { xs: 4, sm: 6 }, 
        mb: { xs: 4, sm: 6 },
      }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Paper 
            elevation={6} 
            sx={{ 
              p: { xs: 3, sm: 6 },
              borderRadius: 3,
              background: 'linear-gradient(to bottom right, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.95))',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            }}
          >
            <Typography 
              variant="h4" 
              align="center"
              sx={{
                fontWeight: 700,
                background: 'linear-gradient(45deg, #1976d2, #21CBF3)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 1
              }}
            >
              Create Your Skill Profile
            </Typography>
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
                  <Grid item xs={12}>
                    <LoadScript
                      googleMapsApiKey={GOOGLE_MAPS_API_KEY}
                      libraries={libraries}
                      onLoad={() => setIsLoaded(true)}
                      onError={onLoadError}
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
                  
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="City"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      disabled
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="State"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      disabled
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="Country"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      disabled
                    />
                  </Grid>
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
                      'Create Profile'
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

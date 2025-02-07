import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  Paper,
  Alert,
  CircularProgress
} from '@mui/material';
import api, { endpoints } from '../../config/api';
import { motion } from 'framer-motion';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const response = await api.post(endpoints.register, {
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      
      const { data } = response;

      if (data.success) {
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('user', JSON.stringify({
          id: data.data.id,
          name: data.data.name,
          email: data.data.email
        }));
        navigate('/create-profile');
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.response?.data?.message || 'An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box 
        sx={{ 
          mt: { xs: 4, sm: 6 },
          mb: { xs: 4, sm: 6 },
          minHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}
      >
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
              Create Account
            </Typography>
            <Typography 
              variant="body1" 
              align="center" 
              color="textSecondary" 
              sx={{ 
                mb: 4,
                fontSize: '1.1rem',
                opacity: 0.8
              }}
            >
              Join our community today
            </Typography>

            {error && (
              <Alert 
                severity="error" 
                sx={{ 
                  mb: 3,
                  borderRadius: 2,
                  '& .MuiAlert-icon': {
                    fontSize: '1.5rem'
                  }
                }}
              >
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit} noValidate>
              <TextField
                fullWidth
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                margin="normal"
                autoComplete="name"
                disabled={loading}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '&:hover fieldset': {
                      borderColor: '#1976d2',
                    },
                  },
                  mb: 2
                }}
              />
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                margin="normal"
                autoComplete="email"
                disabled={loading}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '&:hover fieldset': {
                      borderColor: '#1976d2',
                    },
                  },
                  mb: 2
                }}
              />
              <TextField
                fullWidth
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                margin="normal"
                autoComplete="new-password"
                disabled={loading}
                helperText="Password must be at least 6 characters long"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '&:hover fieldset': {
                      borderColor: '#1976d2',
                    },
                  },
                  mb: 2
                }}
              />
              <TextField
                fullWidth
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                margin="normal"
                autoComplete="new-password"
                disabled={loading}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '&:hover fieldset': {
                      borderColor: '#1976d2',
                    },
                  },
                  mb: 3
                }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                sx={{
                  mt: 2,
                  mb: 3,
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
                  'Create Account'
                )}
              </Button>
            </form>

            <Typography 
              align="center" 
              sx={{ 
                mt: 2,
                color: 'text.secondary',
                '& a': {
                  color: '#1976d2',
                  textDecoration: 'none',
                  fontWeight: 500,
                  '&:hover': {
                    textDecoration: 'underline'
                  }
                }
              }}
            >
              Already have an account?{' '}
              <Link 
                to="/login" 
                style={{ 
                  color: '#1976d2', 
                  textDecoration: 'none',
                  fontWeight: 600
                }}
              >
                Sign In
              </Link>
            </Typography>
          </Paper>
        </motion.div>
      </Box>
    </Container>
  );
};

export default Register;

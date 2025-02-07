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

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
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

    try {
      const response = await api.post(endpoints.login, formData);
      const { data } = response;

      if (data.success) {
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('user', JSON.stringify({
          id: data.data.id,
          name: data.data.name,
          email: data.data.email
        }));

        // Redirect based on whether user has a skill profile
        if (data.data.hasSkillProfile) {
          navigate('/dashboard');
        } else {
          navigate('/create-profile');
        }
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box 
        sx={{ 
          mt: { xs: 4, sm: 8 },
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
              component="h1" 
              gutterBottom 
              align="center"
              sx={{
                fontWeight: 700,
                background: 'linear-gradient(45deg, #1976d2, #21CBF3)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 3
              }}
            >
              Welcome Back
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

            <form onSubmit={handleSubmit}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={formData.email}
                onChange={handleChange}
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
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={formData.password}
                onChange={handleChange}
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
                  'Sign In'
                )}
              </Button>
            </form>

            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Typography 
                variant="body1" 
                sx={{ 
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
                Don't have an account?{' '}
                <Button
                  onClick={() => navigate('/register')}
                  sx={{ 
                    textTransform: 'none',
                    fontWeight: 600,
                    '&:hover': {
                      background: 'transparent',
                      textDecoration: 'underline'
                    }
                  }}
                >
                  Register here
                </Button>
              </Typography>
            </Box>
          </Paper>
        </motion.div>
      </Box>
    </Container>
  );
};

export default Login;

import React from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  Stack,
} from '@mui/material';
import { motion } from 'framer-motion';

const Membership = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Box
        component={motion.div}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography
          variant="h3"
          component="h1"
          align="center"
          gutterBottom
          sx={{ 
            color: '#1a237e',
            fontWeight: 'bold',
            mb: 4
          }}
        >
          Join Our Community
        </Typography>

        <Typography
          variant="h6"
          align="center"
          color="text.secondary"
          sx={{ mb: 6 }}
        >
          Connect with skilled professionals, share your expertise, and grow together
        </Typography>

        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} md={6}>
            <Paper
              component={motion.div}
              whileHover={{ y: -5 }}
              elevation={4}
              sx={{ p: 4, height: '100%', borderRadius: 2 }}
            >
              <Typography variant="h5" component="h2" gutterBottom sx={{ color: '#1976d2' }}>
                Already have an account?
              </Typography>
              <Typography color="text.secondary" paragraph>
                Sign in to continue your journey, connect with professionals, and share your expertise.
              </Typography>
              <Button
                component={Link}
                to="/login"
                variant="contained"
                fullWidth
                size="large"
                sx={{
                  mt: 2,
                  bgcolor: '#1976d2',
                  '&:hover': { bgcolor: '#1565c0' }
                }}
              >
                Sign In
              </Button>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper
              component={motion.div}
              whileHover={{ y: -5 }}
              elevation={4}
              sx={{ 
                p: 4, 
                height: '100%', 
                borderRadius: 2,
                bgcolor: '#1976d2',
                color: 'white'
              }}
            >
              <Typography variant="h5" component="h2" gutterBottom color="inherit">
                New to our platform?
              </Typography>
              <Typography color="inherit" paragraph sx={{ opacity: 0.9 }}>
                Create an account to start your journey. Join our community of professionals and enthusiasts.
              </Typography>
              <Button
                component={Link}
                to="/signup"
                variant="contained"
                fullWidth
                size="large"
                sx={{
                  mt: 2,
                  bgcolor: 'white',
                  color: '#1976d2',
                  '&:hover': { 
                    bgcolor: 'rgba(255, 255, 255, 0.9)',
                  }
                }}
              >
                Sign Up
              </Button>
            </Paper>
          </Grid>
        </Grid>

        <Box sx={{ mt: 6, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            By joining, you agree to our Terms of Service and Privacy Policy
          </Typography>
          <Stack 
            direction="row" 
            spacing={2} 
            justifyContent="center" 
            sx={{ mt: 2 }}
          >
            <Link to="/terms" style={{ color: '#1976d2', textDecoration: 'none' }}>
              Terms of Service
            </Link>
            <Link to="/privacy" style={{ color: '#1976d2', textDecoration: 'none' }}>
              Privacy Policy
            </Link>
          </Stack>
        </Box>
      </Box>
    </Container>
  );
};

export default Membership;

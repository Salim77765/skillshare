import React from 'react';
import { Box, Button, Container, Typography, Grid, useTheme, useMediaQuery } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ParticleBackground from './animations/ParticleBackground';
import LandingNavbar from './LandingNavbar';

const GlowingButton = ({ children, ...props }) => (
  <Button
    component={motion.button}
    whileHover={{ 
      scale: 1.05,
      boxShadow: '0 0 25px rgba(25, 118, 210, 0.6)'
    }}
    whileTap={{ scale: 0.95 }}
    sx={{
      borderRadius: '12px',
      textTransform: 'none',
      fontSize: '1.1rem',
      fontWeight: 600,
      padding: '12px 32px',
      ...props.sx
    }}
    {...props}
  >
    {children}
  </Button>
);

const FeatureCard = ({ icon, title, description, delay }) => (
  <motion.div
    initial={{ y: 50, opacity: 1 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ duration: 0.8, delay }}
    style={{
      background: 'rgba(25, 118, 210, 0.1)',
      backdropFilter: 'blur(10px)',
      borderRadius: '24px',
      padding: '32px',
      border: '1px solid rgba(25, 118, 210, 0.2)',
      height: '100%',
    }}
  >
    <Typography variant="h2" sx={{ mb: 2, color: '#1976d2' }}>{icon}</Typography>
    <Typography variant="h5" sx={{ mb: 2, color: '#1976d2', fontWeight: 600 }}>{title}</Typography>
    <Typography variant="body1" sx={{ color: '#333' }}>{description}</Typography>
  </motion.div>
);

const LandingPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const features = [
    {
      icon: '🎯',
      title: 'Find Your Perfect Match',
      description: 'Connect with skilled mentors or eager students who share your passion and learning goals.'
    },
    {
      icon: '🌟',
      title: 'Share Your Expertise',
      description: 'Transform your skills into valuable knowledge that helps others grow and succeed.'
    },
    {
      icon: '🚀',
      title: 'Learn & Grow Together',
      description: 'Experience interactive learning through real-time collaboration and personalized guidance.'
    }
  ];

  return (
    <Box sx={{ minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
      <ParticleBackground />
      <LandingNavbar />
      
      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          background: 'linear-gradient(135deg, rgba(25, 118, 210, 0.97), rgba(33, 203, 243, 0.97))',
          color: 'white',
          pt: { xs: 15, md: 20 },
          pb: { xs: 10, md: 15 },
          borderRadius: { md: '0 0 60px 60px' },
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Container maxWidth="xl">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 1 }}
              >
                <Typography
                  variant="h1"
                  sx={{
                    fontWeight: 900,
                    mb: 4,
                    textShadow: '2px 2px 8px rgba(0,0,0,0.2)',
                    fontSize: { xs: '3rem', sm: '3.5rem', md: '4.5rem' },
                    letterSpacing: '-0.5px',
                    lineHeight: 1.2,
                    color: '#ffffff'
                  }}
                >
                  Share Your Skills,{' '}
                  <span style={{ 
                    background: 'linear-gradient(to right, #ffffff, #f0f0f0)', 
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    textShadow: 'none'
                  }}>
                    Grow Together
                  </span>
                </Typography>
                <Typography
                  variant="h5"
                  sx={{ 
                    mb: 5,
                    opacity: 0.95,
                    fontSize: { xs: '1.3rem', md: '1.6rem' },
                    fontWeight: 400,
                    lineHeight: 1.6,
                    maxWidth: '600px',
                    color: '#ffffff'
                  }}
                >
                  Join our vibrant community where knowledge flows freely and skills are shared with passion.
                </Typography>
                <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                  <GlowingButton
                    variant="contained"
                    onClick={() => navigate('/register')}
                    sx={{
                      backgroundColor: 'white',
                      color: '#1976d2',
                      '&:hover': {
                        backgroundColor: '#f8f9fa',
                      },
                      minWidth: '200px',
                    }}
                  >
                    Get Started
                  </GlowingButton>
                  <GlowingButton
                    variant="outlined"
                    onClick={() => navigate('/login')}
                    sx={{
                      borderColor: 'white',
                      borderWidth: '2px',
                      color: 'white',
                      '&:hover': {
                        borderColor: '#f8f9fa',
                        borderWidth: '2px',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      },
                      minWidth: '200px',
                    }}
                  >
                    Learn More
                  </GlowingButton>
                </Box>
              </motion.div>
            </Grid>
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  position: 'relative'
                }}
              >
                <Box
                  component="img"
                  src="/hero-illustration.svg"
                  alt="Learning Illustration"
                  sx={{
                    width: '100%',
                    maxWidth: '600px',
                    filter: 'drop-shadow(0 0 20px rgba(255,255,255,0.2))',
                  }}
                />
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="xl" sx={{ py: { xs: 8, md: 12 }, position: 'relative', zIndex: 1 }}>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <FeatureCard {...feature} delay={index * 0.2} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default LandingPage;

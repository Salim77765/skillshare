import React, { useEffect, useState } from 'react';
import { Box, Button, Container, Typography, Grid, useTheme, useMediaQuery } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ParticleBackground from './animations/ParticleBackground';

const SkillCategory = ({ category, icon, delay }) => (
  <motion.div
    initial={{ scale: 0, rotate: -180 }}
    animate={{ scale: 1, rotate: 0 }}
    transition={{ 
      type: "spring",
      stiffness: 260,
      damping: 20,
      delay: delay 
    }}
    whileHover={{ 
      scale: 1.05,
      boxShadow: '0 8px 25px rgba(25, 118, 210, 0.4)',
      transform: 'translateY(-5px)'
    }}
    whileTap={{ scale: 0.95 }}
    style={{
      display: 'inline-block',
      margin: '10px',
      padding: '20px 28px',
      borderRadius: '24px',
      background: 'linear-gradient(135deg, #1976d2 20%, #21CBF3 100%)',
      color: 'white',
      cursor: 'pointer',
      boxShadow: '0 4px 15px rgba(33, 203, 243, .25)',
      textAlign: 'center',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
    }}
  >
    <Typography variant="h4" sx={{ mb: 1.5, fontSize: '2.2rem' }}>{icon}</Typography>
    <Typography variant="body1" sx={{ fontWeight: 500 }}>{category}</Typography>
  </motion.div>
);

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

const LandingPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [activeIndex, setActiveIndex] = useState(0);

  const skillCategories = [
    { name: 'Technology', icon: '💻' },
    { name: 'Arts & Design', icon: '🎨' },
    { name: 'Music', icon: '🎵' },
    { name: 'Languages', icon: '🌍' },
    { name: 'Business', icon: '💼' },
    { name: 'Cooking', icon: '👨‍🍳' },
    { name: 'Photography', icon: '📸' },
    { name: 'Fitness', icon: '💪' },
    { name: 'Digital Marketing', icon: '📱' },
    { name: 'Writing', icon: '✍️' },
    { name: 'Data Science', icon: '📊' },
    { name: 'Web Development', icon: '🌐' },
    { name: 'Video Editing', icon: '🎬' },
    { name: 'Public Speaking', icon: '🎤' },
    { name: 'Finance', icon: '💰' },
    { name: 'UI/UX Design', icon: '🎯' },
    { name: 'Animation', icon: '🎪' },
    { name: 'Teaching', icon: '👩‍🏫' },
    { name: 'Mobile Apps', icon: '📲' },
    { name: 'Game Dev', icon: '🎮' }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % skillCategories.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [skillCategories.length]);

  return (
    <Box sx={{ minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
      <ParticleBackground />
      
      {/* Hero Section */}
      <Box
        component={motion.div}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        sx={{
          position: 'relative',
          background: 'linear-gradient(-45deg, rgba(25, 118, 210, 0.95) 0%, rgba(33, 203, 243, 0.95) 50%, rgba(25, 118, 210, 0.95) 100%)',
          backgroundSize: '200% 200%',
          animation: 'gradient-animation 15s ease infinite',
          color: 'white',
          pt: { xs: 10, md: 15 },
          pb: { xs: 8, md: 10 },
          borderRadius: { md: '0 0 60px 60px' },
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
          '@keyframes gradient-animation': {
            '0%': { backgroundPosition: '0% 50%' },
            '50%': { backgroundPosition: '100% 50%' },
            '100%': { backgroundPosition: '0% 50%' },
          },
        }}
      >
        <Container maxWidth="xl">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 1, delay: 0.2 }}
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
                  }}
                >
                  Share Your Skills,<br />
                  <span style={{ 
                    background: 'linear-gradient(to right, #ffffff, #e0e0e0)', 
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
                    maxWidth: '600px'
                  }}
                >
                  Connect with experts, share your knowledge, and learn from others in our vibrant community.
                </Typography>
                <Box sx={{ display: 'flex', gap: 3, mb: 6, flexWrap: 'wrap' }}>
                  <GlowingButton
                    variant="contained"
                    size="large"
                    onClick={() => navigate('/register')}
                    sx={{
                      backgroundColor: 'white',
                      color: '#1976d2',
                      '&:hover': {
                        backgroundColor: '#f8f9fa',
                      },
                      minWidth: '200px',
                      boxShadow: '0 4px 15px rgba(255, 255, 255, 0.2)',
                    }}
                  >
                    Start Sharing
                  </GlowingButton>
                  <GlowingButton
                    variant="outlined"
                    size="large"
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
                    Sign In
                  </GlowingButton>
                </Box>
              </motion.div>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
                {skillCategories.map((category, index) => (
                  <SkillCategory
                    key={category.name}
                    category={category.name}
                    icon={category.icon}
                    delay={index * 0.1}
                  />
                ))}
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Typography
            variant="h3"
            align="center"
            gutterBottom
            sx={{
              fontWeight: 800,
              background: 'linear-gradient(135deg, #1976d2 30%, #21CBF3 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 8,
              fontSize: { xs: '2.5rem', md: '3.2rem' },
              textAlign: 'center',
              position: 'relative',
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: '-15px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '80px',
                height: '4px',
                background: 'linear-gradient(90deg, #1976d2 0%, #21CBF3 100%)',
                borderRadius: '2px',
              }
            }}
          >
            How It Works
          </Typography>
          <Grid container spacing={4}>
            {[
              {
                title: 'Share Your Skills',
                description: 'Whether you\'re a musician, chef, artist, or professional, share your expertise with others.',
                icon: '🎯'
              },
              {
                title: 'Connect & Learn',
                description: 'Find experts in your area of interest and learn through direct interaction.',
                icon: '🤝'
              },
              {
                title: 'Grow Together',
                description: 'Build a network, earn recognition, and help others achieve their goals.',
                icon: '🌱'
              },
            ].map((feature, index) => (
              <Grid item xs={12} md={4} key={feature.title}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  viewport={{ once: true }}
                >
                  <Box
                    sx={{
                      p: 4,
                      height: '100%',
                      borderRadius: 4,
                      background: 'rgba(255, 255, 255, 0.05)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      transition: 'transform 0.3s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-10px)',
                      }
                    }}
                  >
                    <Typography variant="h1" sx={{ mb: 2 }}>
                      {feature.icon}
                    </Typography>
                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                      {feature.title}
                    </Typography>
                    <Typography color="text.secondary">
                      {feature.description}
                    </Typography>
                  </Box>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>
      </Container>
    </Box>
  );
};

export default LandingPage;

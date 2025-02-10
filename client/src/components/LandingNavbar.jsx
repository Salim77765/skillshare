import React from 'react';
import { AppBar, Box, Button, Container, Toolbar, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const LandingNavbar = () => {
  const navigate = useNavigate();

  return (
    <AppBar 
      position="fixed" 
      elevation={0}
      sx={{
        background: 'rgba(25, 118, 210, 0.95)',
        backdropFilter: 'blur(100px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ justifyContent: 'space-between', py: 1 }}>
          <Typography
            variant="h4"
            component={motion.div}
            whileHover={{ scale: 1.05 }}
            sx={{
              fontWeight: 700,
              color: '#ffffff',
              textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
              cursor: 'pointer',
            }}
            onClick={() => navigate('/')}
          >
            SkillShare
          </Typography>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              component={motion.button}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              variant="text"
              onClick={() => navigate('/login')}
              sx={{
                color: '#ffffff',
                fontSize: '1rem',
                textTransform: 'none',
                fontWeight: 500,
                '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' }
              }}
            >
              Login
            </Button>
            <Button
              component={motion.button}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              variant="contained"
              onClick={() => navigate('/register')}
              sx={{
                backgroundColor: '#ffffff',
                color: '#1976d2',
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 500,
                px: 3,
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                }
              }}
            >
              Sign Up
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default LandingNavbar;

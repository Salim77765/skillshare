import React from 'react';
import { Box, Container, Grid, Typography, Paper } from '@mui/material';
import { motion } from 'framer-motion';
import CodeIcon from '@mui/icons-material/Code';
import PeopleIcon from '@mui/icons-material/People';
import SchoolIcon from '@mui/icons-material/School';
import WorkIcon from '@mui/icons-material/Work';
import StarIcon from '@mui/icons-material/Star';
import SecurityIcon from '@mui/icons-material/Security';

const FeatureCard = ({ icon: Icon, title, description, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
  >
    <Paper
      elevation={0}
      sx={{
        p: 3,
        height: '100%',
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        borderRadius: 4,
        border: '1px solid rgba(255, 255, 255, 0.2)',
        transition: 'transform 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-10px)',
        },
      }}
    >
      <Box
        component={motion.div}
        whileHover={{ rotate: 360 }}
        transition={{ duration: 0.5 }}
        sx={{
          width: 60,
          height: 60,
          borderRadius: '50%',
          background: 'linear-gradient(45deg, #2196f3, #1976d2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 2,
          mx: 'auto',
        }}
      >
        <Icon sx={{ fontSize: 30, color: 'white' }} />
      </Box>
      <Typography
        variant="h6"
        component="h3"
        align="center"
        gutterBottom
        sx={{ color: 'white', fontWeight: 'bold' }}
      >
        {title}
      </Typography>
      <Typography
        variant="body1"
        align="center"
        sx={{ color: 'rgba(255, 255, 255, 0.8)' }}
      >
        {description}
      </Typography>
    </Paper>
  </motion.div>
);

const Features = () => {
  const features = [
    {
      icon: CodeIcon,
      title: 'Skill Development',
      description: 'Access a comprehensive curriculum covering the latest technologies and programming languages. Learn at your own pace with hands-on projects.',
      delay: 0.2,
    },
    {
      icon: PeopleIcon,
      title: 'Developer Community',
      description: 'Connect with experienced developers, participate in code reviews, and collaborate on real-world projects to enhance your skills.',
      delay: 0.4,
    },
    {
      icon: SchoolIcon,
      title: 'Expert Mentorship',
      description: 'Get guidance from industry professionals who will help you navigate your development journey and overcome technical challenges.',
      delay: 0.6,
    },
    {
      icon: WorkIcon,
      title: 'Career Growth',
      description: 'Build a strong portfolio, prepare for technical interviews, and connect with companies looking for skilled developers.',
      delay: 0.8,
    },
    {
      icon: StarIcon,
      title: 'Project Showcase',
      description: 'Showcase your projects, get feedback from peers, and build a reputation in the developer community.',
      delay: 1.0,
    },
    {
      icon: SecurityIcon,
      title: 'Verified Skills',
      description: 'Earn certifications and badges that validate your expertise in specific technologies and development areas.',
      delay: 1.2,
    },
  ];

  return (
    <Box
      sx={{
        py: 8,
        background: 'linear-gradient(45deg, #1a237e 30%, #0d47a1 90%)',
        color: 'white',
      }}
    >
      <Container maxWidth="lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Typography
            variant="h3"
            component="h2"
            align="center"
            gutterBottom
            sx={{ fontWeight: 'bold', mb: 2 }}
          >
            About Our Platform
          </Typography>
          <Typography
            variant="h5"
            align="center"
            sx={{ mb: 6, color: 'rgba(255, 255, 255, 0.9)' }}
          >
            Welcome to the future of developer education and career growth. Our platform combines hands-on learning, 
            community collaboration, and professional development to help you become a skilled developer ready for 
            today's tech industry.
          </Typography>
        </motion.div>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <FeatureCard {...feature} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Features;

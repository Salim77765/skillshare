import React, { useEffect, useState } from 'react';
import { Box, Container, Typography, Button, Grid, Paper, Avatar, Stack, Chip } from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ParticleBackground from './animations/ParticleBackground';
import PeopleIcon from '@mui/icons-material/People';
import StarIcon from '@mui/icons-material/Star';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

const PopularSkillChip = ({ label, delay }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay, duration: 0.5 }}
  >
    <Chip
      label={label}
      sx={{
        m: 0.5,
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        color: 'white',
        '&:hover': {
          background: 'rgba(255, 255, 255, 0.2)',
        }
      }}
    />
  </motion.div>
);

const StatsCard = ({ icon: Icon, title, value, delay }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay, duration: 0.5 }}
  >
    <Paper
      sx={{
        p: 2,
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
      }}
    >
      <Icon sx={{ fontSize: 40, color: 'primary.main' }} />
      <Box>
        <Typography variant="h6" sx={{ color: 'white' }}>{value}</Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>{title}</Typography>
      </Box>
    </Paper>
  </motion.div>
);

const CategoryCard = ({ icon, title, skills, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
  >
    <Paper
      sx={{
        p: 3,
        height: '100%',
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
      }}
    >
      <Typography variant="h2" sx={{ mb: 2 }}>{icon}</Typography>
      <Typography variant="h6" sx={{ mb: 2, color: 'white' }}>{title}</Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 0.5 }}>
        {skills.map((skill) => (
          <Chip
            key={skill}
            label={skill}
            size="small"
            sx={{
              background: 'rgba(255, 255, 255, 0.05)',
              color: 'text.secondary',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          />
        ))}
      </Box>
    </Paper>
  </motion.div>
);

const WelcomePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      setUser(JSON.parse(userStr));
    }
  }, []);

  const handleCreateProfile = () => {
    navigate('/skill-profile');
  };

  const stats = [
    { icon: PeopleIcon, title: 'Active Mentors', value: '5,000+' },
    { icon: StarIcon, title: 'Skills Shared', value: '100+' },
    { icon: TrendingUpIcon, title: 'Learning Hours', value: '50K+' },
    { icon: EmojiEventsIcon, title: 'Success Stories', value: '2,000+' }
  ];

  const categories = [
    {
      icon: '🎨',
      title: 'Creative Arts',
      skills: ['Drawing', 'Photography', 'UI Design', 'Animation']
    },
    {
      icon: '💻',
      title: 'Technology',
      skills: ['Web Dev', 'Mobile Apps', 'Data Science', 'AI']
    },
    {
      icon: '🎵',
      title: 'Music & Performance',
      skills: ['Guitar', 'Singing', 'Piano', 'Dance']
    },
    {
      icon: '💪',
      title: 'Fitness & Wellness',
      skills: ['Yoga', 'Nutrition', 'Meditation', 'Workout']
    }
  ];

  const popularSkills = [
    'Digital Marketing', 'Photography', 'Guitar', 'Cooking',
    'Web Development', 'Yoga', 'Public Speaking', 'Writing',
    'Graphic Design', 'Language Learning', 'Financial Planning', 'Video Editing'
  ];

  return (
    <Box sx={{ minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
      <ParticleBackground />
      <Container maxWidth="lg">
        <Box
          component={motion.div}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          sx={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            zIndex: 1,
            py: 8,
            gap: 4
          }}
        >
          {/* Header Section */}
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Avatar
                sx={{
                  width: 100,
                  height: 100,
                  margin: 'auto',
                  mb: 2,
                  background: 'linear-gradient(45deg, #1976d2 30%, #21CBF3 90%)',
                  fontSize: '2.5rem'
                }}
              >
                {user?.name?.charAt(0).toUpperCase() || '?'}
              </Avatar>
            </motion.div>
            <Typography
              variant="h2"
              sx={{
                fontWeight: 800,
                mb: 2,
                background: 'linear-gradient(45deg, #1976d2 30%, #21CBF3 90%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Welcome to Your Learning Journey{user ? `, ${user.name}` : ''}!
            </Typography>
            <Typography variant="h5" sx={{ color: 'text.secondary', mb: 4 }}>
              Share your skills, learn from others, and grow together
            </Typography>
          </Box>

          {/* Stats Section */}
          <Grid container spacing={3} sx={{ mb: 6 }}>
            {stats.map((stat, index) => (
              <Grid item xs={12} sm={6} md={3} key={stat.title}>
                <StatsCard {...stat} delay={0.2 + index * 0.1} />
              </Grid>
            ))}
          </Grid>

          {/* Popular Skills Section */}
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="h4" sx={{ mb: 3, color: 'white' }}>
              Trending Skills
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 1 }}>
              {popularSkills.map((skill, index) => (
                <PopularSkillChip key={skill} label={skill} delay={0.4 + index * 0.05} />
              ))}
            </Box>
          </Box>

          {/* Profile Creation CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Paper 
              elevation={3}
              sx={{
                p: 4,
                mb: 6,
                maxWidth: 800,
                mx: 'auto',
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                textAlign: 'center'
              }}
            >
              <Typography variant="h4" sx={{ mb: 2, color: 'primary.main' }}>
                🌟 Start Your Skill-Sharing Journey
              </Typography>
              <Typography variant="h6" sx={{ mb: 3, color: 'text.primary' }}>
                Your skills are valuable - share them with the world!
              </Typography>
              <Typography sx={{ mb: 4, color: 'text.secondary' }}>
                Whether you're a master chef, a talented musician, a tech guru, or a fitness enthusiast,
                our platform helps you connect with learners who want to master your skills.
                Create your profile to start sharing your knowledge and earning while you teach!
              </Typography>
              <Button
                variant="contained"
                size="large"
                onClick={handleCreateProfile}
                sx={{
                  py: 2,
                  px: 6,
                  fontSize: '1.2rem',
                  background: 'linear-gradient(45deg, #1976d2 30%, #21CBF3 90%)',
                  color: 'white',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #1976d2 50%, #21CBF3 100%)',
                    transform: 'scale(1.05)',
                    transition: 'transform 0.2s'
                  }
                }}
              >
                Create Your Skill Profile
              </Button>
            </Paper>
          </motion.div>

          {/* Skill Categories */}
          <Typography
            variant="h4"
            sx={{
              textAlign: 'center',
              mb: 4,
              color: 'white'
            }}
          >
            Explore Skill Categories
          </Typography>
          <Grid container spacing={3} sx={{ mb: 6 }}>
            {categories.map((category, index) => (
              <Grid item xs={12} sm={6} md={3} key={category.title}>
                <CategoryCard {...category} delay={0.8 + index * 0.1} />
              </Grid>
            ))}
          </Grid>

          {/* Success Stories */}
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
            >
              <Typography variant="h6" sx={{ color: 'text.secondary', mb: 2 }}>
                Join our vibrant community of skill sharers and learners!
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Over 2,000 success stories and counting. Start your journey today!
              </Typography>
            </motion.div>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default WelcomePage;

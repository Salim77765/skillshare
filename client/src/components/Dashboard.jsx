import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Typography,
  Button,
  TextField,
  Grid,
  Paper,
  CircularProgress,
  IconButton,
  Menu,
  MenuItem,
  Badge,
  AppBar,
  Toolbar,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  Autocomplete,
  InputAdornment,
  Avatar,
  Chip,
  ListItemIcon,
  ListItemText,
  Container
} from '@mui/material';
import {
  Search as SearchIcon,
  Person as PersonIcon,
  School as SchoolIcon,
  Notifications as NotificationsIcon,
  AccountCircle as AccountCircleIcon,
  Logout as LogoutIcon,
  Message as MessageIcon,
  LocationOn as LocationOnIcon,
  Close as CloseIcon,
  DoneAll as DoneAllIcon,
  Edit as EditIcon,
  SupervisorAccount as MentorIcon,
  Chat as ChatIcon,
  RequestPage as RequestsIcon
} from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { motion } from 'framer-motion';
import { api, endpoints } from '../config/api';
import { toast } from 'react-toastify';

// Default locations data
const defaultLocations = {
  'United States': ['New York', 'California', 'Texas', 'Florida'],
  'India': ['Maharashtra', 'Karnataka', 'Tamil Nadu', 'Delhi'],
  'United Kingdom': ['England', 'Scotland', 'Wales', 'Northern Ireland'],
  'Canada': ['Ontario', 'Quebec', 'British Columbia', 'Alberta'],
  'Australia': ['New South Wales', 'Victoria', 'Queensland', 'Western Australia']
};

const Dashboard = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  const [requestAnchorEl, setRequestAnchorEl] = useState(null);
  const [searchAnchorEl, setSearchAnchorEl] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    country: '',
    state: '',
    city: '',
    category: '',
    experienceLevel: '',
    teachingMethod: ''
  });
  const [showProfile, setShowProfile] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [categories] = useState([
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
  ]);

  const [experienceLevels] = useState([
    'Beginner',
    'Intermediate',
    'Advanced',
    'Expert'
  ]);

  const [teachingMethods] = useState([
    'One-on-One Sessions',
    'Group Classes',
    'Workshops',
    'Project-Based Learning',
    'Online Courses',
    'Mentoring',
    'Hands-on Practice',
    'Video Tutorials',
    'Written Guides',
    'Interactive Exercises'
  ]);

  const [notifications, setNotifications] = useState([]);
  const [requestNotifications, setRequestNotifications] = useState([]);
  const [requests, setRequests] = useState([]);
  const [requestCount, setRequestCount] = useState(0);
  const [locationSearch, setLocationSearch] = useState('');
  const [notificationCount, setNotificationCount] = useState(2);
  const [userName, setUserName] = useState('');
  const [openRequestDialog, setOpenRequestDialog] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [requestMessage, setRequestMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mentors, setMentors] = useState([]);
  const [students, setStudents] = useState([]);
  const [mentorAnchorEl, setMentorAnchorEl] = useState(null);
  const [studentAnchorEl, setStudentAnchorEl] = useState(null);
  const [chatAnchorEl, setChatAnchorEl] = useState(null);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoadingChat, setIsLoadingChat] = useState(false);
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [user, setUser] = useState(null);
  const [skillProfile, setSkillProfile] = useState(null);
  const [trendingSkills, setTrendingSkills] = useState([]);
  const [userStats, setUserStats] = useState({
    studentsCount: 0,
    skillsLearnedCount: 0
  });
  const [chatOpen, setChatOpen] = useState(false);
  const messagesEndRef = useRef(null);

  const filteredMentors = useMemo(() => {
    return mentors.filter(request => request.mentor._id !== user?._id);
  }, [mentors, user?._id]);

  const filteredStudents = useMemo(() => {
    return students.filter(request => request.student._id !== user?._id);
  }, [students, user?._id]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    try {
      const userString = localStorage.getItem('user');
      if (!userString) {
        navigate('/login');
        return;
      }
      const userData = JSON.parse(userString);
      if (!userData) {
        navigate('/login');
        return;
      }
      setUser(userData);
    } catch (error) {
      console.error('Error parsing user data:', error);
      localStorage.removeItem('user'); // Clear invalid data
      localStorage.removeItem('token'); // Clear token as well
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    fetchLocations();
    fetchNotifications();
    fetchRequests();
    fetchMentors();
    fetchStudents();
    fetchTrendingSkills();
    fetchUserStats();
    // Get user name from localStorage
    const user = JSON.parse(localStorage.getItem('user'));
    if (user?.name) {
      setUserName(user.name);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
    fetchLocations();
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery || filters.country || filters.state || filters.city || filters.category || filters.experienceLevel || filters.teachingMethod || locationSearch) {
        searchProfiles();
      } else {
        searchProfiles();
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, filters, locationSearch]);

  useEffect(() => {
    const pollNotifications = async () => {
      await fetchNotifications();
    };

    // Poll every 5 seconds
    const interval = setInterval(pollNotifications, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const pollMessages = async () => {
      if (selectedChat && chatOpen) {
        try {
          const response = await api.get(`/api/messages/${selectedChat._id}`);
          if (response.data.success) {
            setMessages(response.data.data);
          }
        } catch (error) {
          console.error('Error polling messages:', error);
          // Don't show error toast for polling failures
        }
      }
    };

    // Poll messages every 3 seconds when chat is open
    const interval = setInterval(pollMessages, 3000);

    return () => clearInterval(interval);
  }, [selectedChat, chatOpen]);

  const fetchLocations = async () => {
    try {
      // Set the countries directly from defaultLocations
      setCountries(Object.keys(defaultLocations));
      if (filters.country) {
        setStates(defaultLocations[filters.country] || []);
      }
    } catch (error) {
      console.error('Error fetching locations:', error);
    }
  };

  const fetchProfile = async () => {
    try {
      const response = await api.get(endpoints.skillProfile.create);
      if (response.data.success) {
        setProfile(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchNotifications = async () => {
    try {
      const response = await api.get('/api/notifications');
      if (response.data.success) {
        // Separate request notifications from other notifications
        const requests = response.data.data.filter(n => n.type === 'request');
        const otherNotifications = response.data.data.filter(n => n.type !== 'request');
        
        setRequestNotifications(requests);
        setRequestCount(requests.filter(n => !n.read).length);
        setNotifications(otherNotifications);
        setNotificationCount(otherNotifications.filter(n => !n.read).length);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const fetchRequests = async () => {
    try {
      const response = await api.get('/api/requests');
      if (response.data.success) {
        setRequests(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching requests:', error);
    }
  };

  const fetchMentors = async () => {
    try {
      const response = await api.get('/api/requests?status=accepted&role=student');
      if (response.data.success) {
        // These are requests where current user is the student and mentor has accepted
        setMentors(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching mentors:', error);
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await api.get('/api/requests?status=accepted&role=mentor');
      if (response.data.success) {
        // These are requests where current user is the mentor and they have accepted
        setStudents(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const fetchSkillProfile = async () => {
    try {
      const response = await api.get(endpoints.skillProfile.create);
      if (response.data.success) {
        setSkillProfile(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching skill profile:', error);
    }
  };

  const fetchTrendingSkills = async () => {
    try {
      const response = await api.get('/api/skills/trending');
      if (response.data.success) {
        setTrendingSkills(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching trending skills:', error);
    }
  };

  const fetchUserStats = async () => {
    try {
      const response = await api.get('/api/skill-profile/stats');
      if (response.data.success) {
        setUserStats({
          studentsCount: response.data.data.studentsCount || 0,
          skillsLearnedCount: response.data.data.skillsLearnedCount || 0
        });
      }
    } catch (error) {
      console.error('Error fetching user stats:', error);
      // Set default values if stats can't be fetched
      setUserStats({
        studentsCount: 0,
        skillsLearnedCount: 0
      });
    }
  };

  const handleCourseCompletion = async (studentRequest) => {
    try {
      const response = await api.delete(`/api/requests/${studentRequest._id}`);
      if (response.data.success) {
        // Remove from students list
        setStudents(prev => prev.filter(req => req._id !== studentRequest._id));
        
        // Update stats
        setUserStats(prev => ({
          ...prev,
          studentsCount: Math.max(0, (prev.studentsCount || 0) - 1)
        }));

        // Refresh all data
        await Promise.all([
          fetchNotifications(),
          fetchRequests(),
          fetchMentors(),
          fetchStudents(),
          fetchUserStats()
        ]);

        toast.success('Course completed successfully');
      }
    } catch (error) {
      console.error('Error completing course:', error);
      toast.error(error.response?.data?.message || error.message || 'Failed to complete course');
    }
  };

  const handleLeaveRequest = async (mentorRequest) => {
    try {
      const response = await api.delete(`/api/requests/${mentorRequest._id}`);
      if (response.data.success) {
        // Remove from mentors list
        setMentors(prev => prev.filter(req => req._id !== mentorRequest._id));
        
        // Update stats
        setUserStats(prev => ({
          ...prev,
          skillsLearnedCount: (prev.skillsLearnedCount || 0) + 1
        }));

        // Refresh all data
        await Promise.all([
          fetchNotifications(),
          fetchRequests(),
          fetchMentors(),
          fetchStudents(),
          fetchUserStats()
        ]);

        toast.success('Successfully left the course');
      }
    } catch (error) {
      console.error('Error leaving course:', error);
      toast.error(error.response?.data?.message || error.message || 'Failed to leave course');
    }
  };

  const handleContactClick = (profile) => {
    setSelectedProfile(profile);
    setOpenRequestDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenRequestDialog(false);
    setSelectedProfile(null);
    setRequestMessage('');
  };

  const handleSendRequest = async () => {
    try {
      setIsSubmitting(true);
      const response = await api.post('/api/requests', {
        mentorId: selectedProfile.user,
        skillProfileId: selectedProfile._id,
        message: requestMessage
      });

      if (response.data.success) {
        toast.success('Request sent successfully!');
        handleCloseDialog();
        // Refresh the requests list
        await Promise.all([
          fetchRequests(),
          fetchNotifications()
        ]);
      } else {
        throw new Error(response.data.message || 'Failed to send request');
      }
    } catch (error) {
      console.error('Error sending request:', error);
      toast.error(error.response?.data?.message || error.message || 'Failed to send request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNotificationAction = async (notificationId, action) => {
    try {
      const notificationResponse = await api.get(`/api/notifications/${notificationId}`);
      
      if (notificationResponse.data.success && notificationResponse.data.data.relatedRequest) {
        const requestId = notificationResponse.data.data.relatedRequest._id;
        
        if (action === 'accept') {
          await handleRequestAction(requestId, 'accepted');
        } else if (action === 'reject') {
          await handleRequestAction(requestId, 'rejected');
        }
        
        // Delete the notification after handling the request
        await api.delete(`/api/notifications/${notificationId}`);
        
        // Refresh notifications
        await fetchNotifications();
      }
    } catch (error) {
      console.error('Error handling notification:', error);
      toast.error(error.response?.data?.message || error.message || 'Failed to process notification');
    }
  };

  const handleChatOpen = async (request) => {
    try {
      setSelectedChat(request);
      setIsLoadingChat(true);
      const response = await api.get(`/api/messages/${request._id}`);
      if (response.data.success) {
        setMessages(response.data.data);
        setChatOpen(true);
        scrollToBottom();
      } else {
        throw new Error(response.data.message || 'Failed to load chat messages');
      }
    } catch (error) {
      console.error('Error opening chat:', error);
      toast.error('Failed to open chat');
    } finally {
      setIsLoadingChat(false);
    }
  };

  const handleChatClose = () => {
    setSelectedChat(null);
    setMessages([]);
    setChatOpen(false);
    setNewMessage('');
  };

  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    if (!newMessage.trim() || !selectedChat || isSendingMessage) return;

    setIsSendingMessage(true);
    try {
      const response = await api.post('/api/messages', {
        requestId: selectedChat._id,
        content: newMessage.trim()
      });
      if (response.data.success) {
        // Add the new message to the messages array immediately
        setMessages(prevMessages => [...prevMessages, response.data.data]);
        setNewMessage('');
        scrollToBottom();
      } else {
        throw new Error(response.data.message || 'Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error(error.response?.data?.message || error.message || 'Failed to send message. Please try again.');
    } finally {
      setIsSendingMessage(false);
    }
  };

  const handleRequestAction = async (requestId, action) => {
    try {
      // Convert action to status for API endpoint
      const status = action === 'accepted' ? 'accept' : 'reject';
      const response = await api.put(`/api/requests/${requestId}/${status}`);

      if (response.data.success) {
        toast.success(`Request ${action} successfully`);
        
        // Refresh all data
        await Promise.all([
          fetchNotifications(),
          fetchRequests(),
          fetchMentors(),
          fetchStudents()
        ]);

        // Close any open menus
        handleRequestClose();
        handleNotificationClose();
      }
    } catch (error) {
      console.error('Error handling request action:', error);
      toast.error(error.response?.data?.message || error.message || 'Failed to process request');
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    try {
      const response = await api.delete(`/api/notifications/${notificationId}`);
      if (response.data.success) {
        // Remove the notification from both lists
        setNotifications(prev => prev.filter(n => n._id !== notificationId));
        setRequestNotifications(prev => prev.filter(n => n._id !== notificationId));
        
        // Update notification counts
        setNotificationCount(prev => Math.max(0, prev - 1));
        setRequestCount(prev => Math.max(0, prev - 1));
        
        toast.success('Notification deleted successfully');
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
      toast.error(error.response?.data?.message || error.message || 'Failed to delete notification');
    }
  };

  const markNotificationAsRead = async (notificationId) => {
    try {
      const response = await api.put(`/api/notifications/${notificationId}/read`);
      if (response.data.success) {
        await fetchNotifications();
        toast.success('Notification marked as read');
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast.error(error.response?.data?.message || error.message || 'Failed to mark notification as read');
    }
  };

  useEffect(() => {
    fetchSkillProfile();
  }, []);

  useEffect(() => {
    fetchLocations();
    fetchNotifications();
    fetchRequests();
    fetchMentors();
    fetchStudents();
    fetchTrendingSkills();
    fetchUserStats();
    // Get user name from localStorage
    const user = JSON.parse(localStorage.getItem('user'));
    if (user?.name) {
      setUserName(user.name);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
    fetchLocations();
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery || filters.country || filters.state || filters.city || filters.category || filters.experienceLevel || filters.teachingMethod || locationSearch) {
        searchProfiles();
      } else {
        searchProfiles();
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, filters, locationSearch]);

  useEffect(() => {
    const pollNotifications = async () => {
      await fetchNotifications();
    };

    // Poll every 5 seconds
    const interval = setInterval(pollNotifications, 5000);

    return () => clearInterval(interval);
  }, []);

  const searchProfiles = async () => {
    try {
      setSearching(true);
      const queryParams = new URLSearchParams({
        ...(searchQuery && { query: searchQuery }),
        ...(filters.country && { country: filters.country }),
        ...(filters.state && { state: filters.state }),
        ...(filters.city && { city: filters.city }),
        ...(filters.category && { category: filters.category }),
        ...(filters.experienceLevel && { experienceLevel: filters.experienceLevel }),
        ...(filters.teachingMethod && { teachingMethod: filters.teachingMethod }),
        ...(locationSearch && { location: locationSearch })
      });

      const response = await api.get(`${endpoints.skillProfile.search}?${queryParams}`);
      if (response.data.success) {
        // Include all profiles including the user's own profile
        setSearchResults(response.data.data);
      }
    } catch (error) {
      console.error('Error searching profiles:', error);
    } finally {
      setSearching(false);
    }
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleEditProfile = () => {
    navigate('/edit-profile');
  };

  const handleFilterChange = (key, value) => {
    if (key === 'country') {
      setStates(defaultLocations[value] || []);
      setFilters(prev => ({
        ...prev,
        [key]: value,
        state: ''
      }));
    } else {
      setFilters(prev => ({
        ...prev,
        [key]: value
      }));
    }
  };

  const handleNotificationClick = (event) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleRequestClick = (event) => {
    setRequestAnchorEl(event.currentTarget);
  };

  const handleSearchClick = (event) => {
    setSearchAnchorEl(event.currentTarget);
  };

  const handleMentorClick = (event) => {
    setMentorAnchorEl(event.currentTarget);
  };

  const handleStudentClick = (event) => {
    setStudentAnchorEl(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchorEl(null);
  };

  const handleRequestClose = () => {
    setRequestAnchorEl(null);
  };

  const handleSearchClose = () => {
    setSearchAnchorEl(null);
  };

  const handleMentorClose = () => {
    setMentorAnchorEl(null);
  };

  const handleStudentClose = () => {
    setStudentAnchorEl(null);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, rgba(248, 250, 252, 0.95), rgba(241, 245, 249, 0.95))',
      backgroundAttachment: 'fixed'
    }}>
      {/* Enhanced Navigation Bar */}
      <AppBar 
        position="sticky"
        elevation={0}
        sx={{
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(226, 232, 240, 0.8)',
          boxShadow: '0 4px 30px rgba(0, 0, 0, 0.03)',
        }}
      >
        <Container maxWidth="lg">
          <Toolbar 
            disableGutters 
            sx={{ 
              justifyContent: 'space-between',
              height: 70,
              px: { xs: 2, sm: 3 }
            }}
          >
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '-0.5px'
              }}
            >
              SkillShare
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 } }}>
              {/* Search Icon */}
              <IconButton
                size="small"
                onClick={handleSearchClick}
                sx={{
                  bgcolor: 'rgba(59, 130, 246, 0.1)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(59, 130, 246, 0.2)',
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    bgcolor: 'rgba(59, 130, 246, 0.15)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.15)'
                  }
                }}
              >
                <SearchIcon sx={{ fontSize: 20, color: '#3b82f6' }} />
              </IconButton>
              <Menu
                anchorEl={searchAnchorEl}
                open={Boolean(searchAnchorEl)}
                onClose={handleSearchClose}
                PaperProps={{
                  sx: {
                    mt: 2,
                    width: '80vw',
                    maxWidth: '600px',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
                  }
                }}
              >
                <Box sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ mb: 3, color: '#1e293b', fontWeight: 600 }}>
                    Search Skills
                  </Typography>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Search Skills"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        variant="outlined"
                        placeholder="Search by skills, title, or description..."
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <SearchIcon sx={{ color: '#64748b' }} />
                            </InputAdornment>
                          ),
                        }}
                        sx={{ mb: 2 }}
                      />
                      
                      <TextField
                        fullWidth
                        label="Search by Location"
                        value={locationSearch}
                        onChange={(e) => setLocationSearch(e.target.value)}
                        variant="outlined"
                        placeholder="Enter city, area, or landmark..."
                        sx={{ mb: 2 }}
                      />
                    </Grid>
                    
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={4}>
                        <TextField
                          select
                          fullWidth
                          label="Country"
                          value={filters.country}
                          onChange={(e) => handleFilterChange('country', e.target.value)}
                        >
                          <MenuItem value="">All Countries</MenuItem>
                          {countries.map((country) => (
                            <MenuItem key={country} value={country}>
                              {country}
                            </MenuItem>
                          ))}
                        </TextField>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <TextField
                          select
                          fullWidth
                          label="State"
                          value={filters.state}
                          onChange={(e) => handleFilterChange('state', e.target.value)}
                          disabled={!filters.country}
                        >
                          <MenuItem value="">All States</MenuItem>
                          {states.map((state) => (
                            <MenuItem key={state} value={state}>
                              {state}
                            </MenuItem>
                          ))}
                        </TextField>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <TextField
                          fullWidth
                          label="City"
                          value={filters.city}
                          onChange={(e) => handleFilterChange('city', e.target.value)}
                          placeholder="Enter city name"
                        />
                      </Grid>
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <InputLabel>Category</InputLabel>
                        <Select
                          value={filters.category}
                          label="Category"
                          onChange={(e) => handleFilterChange('category', e.target.value)}
                          sx={{
                            borderRadius: '8px',
                            bgcolor: '#f8fafc',
                            '& .MuiOutlinedInput-notchedOutline': {
                              borderColor: '#e2e8f0',
                            },
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                              borderColor: '#94a3b8',
                            }
                          }}
                        >
                          <MenuItem value="">All Categories</MenuItem>
                          {categories.map((category) => (
                            <MenuItem key={category} value={category}>
                              {category}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <InputLabel>Experience Level</InputLabel>
                        <Select
                          value={filters.experienceLevel}
                          label="Experience Level"
                          onChange={(e) => handleFilterChange('experienceLevel', e.target.value)}
                          sx={{
                            borderRadius: '8px',
                            bgcolor: '#f8fafc',
                            '& .MuiOutlinedInput-notchedOutline': {
                              borderColor: '#e2e8f0',
                            },
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                              borderColor: '#94a3b8',
                            }
                          }}
                        >
                          <MenuItem value="">All Levels</MenuItem>
                          {experienceLevels.map((level) => (
                            <MenuItem key={level} value={level}>
                              {level}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                </Box>
              </Menu>              
              <Menu
                anchorEl={requestAnchorEl}
                open={Boolean(requestAnchorEl)}
                onClose={handleRequestClose}
              >
                <Divider />
                {!requests.length ? (
                  <MenuItem>
                  </MenuItem>
                ) : (
                  <>
                    {/* Incoming Requests */}
                    {requests.filter(r => r.mentor._id === JSON.parse(localStorage.getItem('user'))._id).map((request) => (
                      <MenuItem key={request._id} sx={{ py: 2 }}>
                        <Box sx={{ width: '100%' }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                            <Typography variant="body2" sx={{ color: '#1e293b', fontWeight: 500 }}>
                              {request.student.name} wants to learn {request.skillProfile.title}
                            </Typography>
                            <Chip 
                              size="small" 
                              label={request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                              color={request.status === 'pending' ? 'warning' : request.status === 'accepted' ? 'success' : 'error'}
                            />
                          </Box>
                          {request.message && (
                            <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mb: 1 }}>
                              "{request.message}"
                            </Typography>
                          )}
                          {request.status === 'pending' && (
                            <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                              <Button
                                size="small"
                                variant="contained"
                                color="primary"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRequestAction(request._id, 'accepted');
                                }}
                              >
                                Accept
                              </Button>
                              <Button
                                size="small"
                                variant="outlined"
                                color="error"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRequestAction(request._id, 'rejected');
                                }}
                              >
                                Reject
                              </Button>
                            </Box>
                          )}
                        </Box>
                      </MenuItem>
                    ))}
                    
                    {/* Outgoing Requests */}
                    {requests.filter(r => r.student._id === JSON.parse(localStorage.getItem('user'))._id).map((request) => (
                      <MenuItem key={request._id} sx={{ py: 2 }}>
                        <Box sx={{ width: '100%' }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                            <Typography variant="body2" sx={{ color: '#1e293b', fontWeight: 500 }}>
                              Request to {request.mentor.name}
                            </Typography>
                            <Chip 
                              size="small" 
                              label={request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                              color={request.status === 'pending' ? 'warning' : request.status === 'accepted' ? 'success' : 'error'}
                            />
                          </Box>
                          <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>
                            For: {request.skillName}
                          </Typography>
                          {request.message && (
                            <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mt: 1 }}>
                              Your message: "{request.message}"
                            </Typography>
                          )}
                        </Box>
                      </MenuItem>
                    ))}
                  </>
                )}
              </Menu>

              {/* Your Mentors */}
              <IconButton
                size="small"
                onClick={handleMentorClick}
                sx={{
                  bgcolor: 'rgba(99, 102, 241, 0.05)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    bgcolor: 'rgba(99, 102, 241, 0.1)',
                    transform: 'translateY(-1px)',
                    boxShadow: '0 4px 12px rgba(99, 102, 241, 0.1)'
                  }
                }}
              >
                <Badge badgeContent={filteredMentors.length} color="primary">
                  <MentorIcon sx={{ fontSize: 20, color: 'primary.main' }} />
                </Badge>
              </IconButton>
              <Menu
                anchorEl={mentorAnchorEl}
                open={Boolean(mentorAnchorEl)}
                onClose={handleMentorClose}
                PaperProps={{
                  sx: {
                    mt: 2,
                    minWidth: 320,
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
                  }
                }}
              >
                <Box sx={{ p: 2 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1e293b' }}>
                    Your Mentors
                  </Typography>
                </Box>
                <Divider />
                {!filteredMentors.length ? (
                  <MenuItem>
                    <Typography variant="body2" sx={{ color: '#64748b' }}>
                      No mentors yet
                    </Typography>
                  </MenuItem>
                ) : (
                  filteredMentors.map((request) => (
                    <MenuItem 
                      key={request._id} 
                      sx={{ py: 2 }}
                      onClick={() => handleChatOpen(request)}
                    >
                      <Box sx={{ width: '100%' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                          <Typography variant="body2" sx={{ color: '#1e293b', fontWeight: 500 }}>
                            {request.skillProfile.title}
                          </Typography>
                          <Chip 
                            size="small" 
                            label="Active"
                            color="success"
                          />
                        </Box>
                        <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>
                          {request.mentor.name} • {request.mentor.email}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleChatOpen(request);
                            }}
                            sx={{
                              bgcolor: 'rgba(99, 102, 241, 0.1)',
                              color: 'primary.main',
                              '&:hover': {
                                bgcolor: 'rgba(99, 102, 241, 0.2)'
                              }
                            }}
                          >
                            <ChatIcon sx={{ fontSize: 20 }} />
                          </IconButton>

                          <Button
                            variant="contained"
                            size="small"
                            color="error"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleLeaveRequest(request);
                            }}
                            sx={{
                              minWidth: 'auto',
                              px: 2,
                              py: 0.5,
                              fontSize: '0.75rem',
                              bgcolor: 'error.main',
                              '&:hover': {
                                bgcolor: 'error.dark'
                              }
                            }}
                          >
                            Leave
                          </Button>
                        </Box>
                      </Box>
                    </MenuItem>
                  ))
                )}
              </Menu>

              {/* Your Students */}
              <IconButton
                size="small"
                onClick={handleStudentClick}
                sx={{
                  bgcolor: 'rgba(99, 102, 241, 0.05)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    bgcolor: 'rgba(99, 102, 241, 0.1)',
                    transform: 'translateY(-1px)',
                    boxShadow: '0 4px 12px rgba(99, 102, 241, 0.1)'
                  }
                }}
              >
                <Badge badgeContent={filteredStudents.length} color="primary">
                  <SchoolIcon sx={{ fontSize: 20, color: 'primary.main' }} />
                </Badge>
              </IconButton>
              <Menu
                anchorEl={studentAnchorEl}
                open={Boolean(studentAnchorEl)}
                onClose={handleStudentClose}
                PaperProps={{
                  sx: {
                    maxHeight: 300,
                    width: '300px',
                  }
                }}
              >
                <Box sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Your Students
                  </Typography>
                  {filteredStudents.length === 0 ? (
                    <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                      No students yet
                    </Typography>
                  ) : (
                    filteredStudents.map((request) => (
                      <Box
                        key={request._id}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          p: 1,
                          '&:not(:last-child)': {
                            borderBottom: 1,
                            borderColor: 'divider'
                          }
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                          <Avatar
                            src={request.student.avatar}
                            alt={request.student.name}
                            sx={{ width: 32, height: 32, mr: 1 }}
                          />
                          <Box>
                            <Typography variant="subtitle2">
                              {request.student.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {request.skillName}
                            </Typography>
                          </Box>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => handleChatOpen(request)}
                          >
                            Chat
                          </Button>
                          <Button
                            variant="contained"
                            size="small"
                            color="success"
                            onClick={() => handleCourseCompletion(request)}
                            startIcon={<DoneAllIcon />}
                          >
                            Complete
                          </Button>
                        </Box>
                      </Box>
                    ))
                  )}
                </Box>
              </Menu>

              {/* Request Icon */}
              <IconButton
                size="small"
                color="inherit"
                onClick={(e) => setRequestAnchorEl(e.currentTarget)}
              >
                <Badge badgeContent={requestCount} color="error">
                  <MessageIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                </Badge>
              </IconButton>

              {/* Request Menu */}
              <Menu
                anchorEl={requestAnchorEl}
                open={Boolean(requestAnchorEl)}
                onClose={handleRequestClose}
                PaperProps={{
                  sx: {
                    mt: 2,
                    minWidth: 320,
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
                  }
                }}
              >
                <Box sx={{ p: 2 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1e293b' }}>
                    Requests
                  </Typography>
                </Box>
                <Divider />
                {!requestNotifications.length ? (
                  <MenuItem>
                    <Typography variant="body2" sx={{ color: '#64748b' }}>
                      No requests
                    </Typography>
                  </MenuItem>
                ) : (
                  requestNotifications.map((notification) => (
                    <MenuItem 
                      key={notification._id} 
                      sx={{ 
                        py: 2,
                        bgcolor: notification.read ? 'transparent' : 'action.hover'
                      }}
                    >
                      <Box sx={{ width: '100%' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                          <Typography variant="body2" sx={{ color: '#1e293b', fontWeight: notification.read ? 400 : 500 }}>
                            {notification.title}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#64748b' }}>
                            {new Date(notification.createdAt).toLocaleDateString()}
                          </Typography>
                        </Box>
                        <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mb: 2 }}>
                          {notification.message}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                          <Button
                            size="small"
                            variant="contained"
                            color="primary"
                            onClick={() => handleNotificationAction(notification._id, 'accept')}
                          >
                            Accept
                          </Button>
                          <Button
                            size="small"
                            variant="outlined"
                            color="error"
                            onClick={() => handleNotificationAction(notification._id, 'reject')}
                          >
                            Reject
                          </Button>
                        </Box>
                      </Box>
                    </MenuItem>
                  ))
                )}
              </Menu>

              {/* Notifications Icon */}
              <IconButton
                size="small"
                color="inherit"
                onClick={(e) => setNotificationAnchorEl(e.currentTarget)}
              >
                <Badge badgeContent={notificationCount} color="error">
                  <NotificationsIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                </Badge>
              </IconButton>

              {/* Notifications Menu */}
              <Menu
                anchorEl={notificationAnchorEl}
                open={Boolean(notificationAnchorEl)}
                onClose={handleNotificationClose}
                PaperProps={{
                  sx: {
                    mt: 2,
                    minWidth: 320,
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
                  }
                }}
              >
                <Box sx={{ p: 2 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1e293b' }}>
                    Notifications
                  </Typography>
                </Box>
                <Divider />
                {!notifications.length ? (
                  <MenuItem>
                    <Typography variant="body2" sx={{ color: '#64748b' }}>
                      No notifications
                    </Typography>
                  </MenuItem>
                ) : (
                  notifications.map((notification) => (
                    <MenuItem 
                      key={notification._id} 
                      sx={{ 
                        py: 2,
                        bgcolor: notification.read ? 'transparent' : 'action.hover'
                      }}
                    >
                      <Box sx={{ width: '100%' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                          <Typography variant="body2" sx={{ color: '#1e293b', fontWeight: notification.read ? 400 : 500 }}>
                            {notification.title}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="caption" sx={{ color: '#64748b' }}>
                              {new Date(notification.createdAt).toLocaleDateString()}
                            </Typography>
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteNotification(notification._id);
                              }}
                              sx={{ 
                                p: 0.5,
                                '&:hover': { color: 'error.main' }
                              }}
                            >
                              <CloseIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </Box>
                        <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>
                          {notification.message}
                        </Typography>
                      </Box>
                    </MenuItem>
                  ))
                )}
              </Menu>

              {/* Profile Icon */}
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <IconButton
                  onClick={handleMenu}
                  sx={{
                    p: 0.5,
                    border: '2px solid rgba(59, 130, 246, 0.3)',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      border: '2px solid rgba(59, 130, 246, 0.5)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 12px rgba(59, 130, 246, 0.15)'
                    }
                  }}
                >
                  <Avatar 
                    sx={{ 
                      width: 35, 
                      height: 35,
                      bgcolor: 'primary.main',
                      fontWeight: 600
                    }}
                  >
                    {userName?.[0]?.toUpperCase() || 'U'}
                  </Avatar>
                </IconButton>
              </Box>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                onClick={handleClose}
                PaperProps={{
                  elevation: 0,
                  sx: {
                    mt: 1,
                    width: 320,
                    overflow: 'visible',
                    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.08))',
                    background: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(10px)',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.1) 100%)',
                      pointerEvents: 'none'
                    },
                  },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                {/* Profile Details */}
                <Box sx={{ p: 2 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 0.5 }}>
                    {user?.name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                    {user?.email}
                  </Typography>
                  {skillProfile && (
                    <>
                      <Typography variant="subtitle2" sx={{ color: 'text.primary', mt: 2 }}>
                        {skillProfile.title}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                        {skillProfile.category} • {skillProfile.experienceLevel}
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                        {skillProfile.skills.map((skill, index) => (
                          <Chip
                            key={index}
                            label={skill}
                            size="small"
                            sx={{
                              bgcolor: 'rgba(99, 102, 241, 0.1)',
                              color: 'primary.main',
                              '& .MuiChip-label': {
                                fontSize: '0.75rem'
                              }
                            }}
                          />
                        ))}
                      </Box>
                      <Typography variant="body2" sx={{ color: 'text.secondary', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <LocationOnIcon sx={{ fontSize: 16 }} />
                        {skillProfile.city}, {skillProfile.country}
                      </Typography>
                    </>
                  )}
                </Box>
                
                <Divider />
                <MenuItem onClick={() => navigate('/edit-profile')} sx={{ py: 1.5 }}>
                  <ListItemIcon>
                    <EditIcon fontSize="small" />
                  </ListItemIcon>
                  Edit Profile
                </MenuItem>
                <MenuItem onClick={handleLogout} sx={{ py: 1.5 }}>
                  <ListItemIcon>
                    <LogoutIcon fontSize="small" />
                  </ListItemIcon>
                  Logout
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Main Content */}
      <Container 
        maxWidth="lg" 
        sx={{ 
          pt: 4, 
          pb: 8,
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: '20%',
            left: '5%',
            width: '90%',
            height: '70%',
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, rgba(59, 130, 246, 0) 70%)',
            filter: 'blur(60px)',
            zIndex: 0,
            pointerEvents: 'none'
          }
        }}
      >
        <Grid container spacing={3}>
          {/* Stats Cards */}
          <Grid item xs={12} md={6}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                height: '100%',
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                border: '1px solid rgba(226, 232, 240, 0.8)',
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 12px 24px rgba(148, 163, 184, 0.15)'
                }
              }}
            >
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#1e293b' }}>
                Your Statistics
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Box sx={{ textAlign: 'center', p: 2 }}>
                    <Typography variant="h4" sx={{ color: 'primary.main', fontWeight: 700 }}>
                      {userStats.studentsCount}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#64748b' }}>
                      Students Taught
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ textAlign: 'center', p: 2 }}>
                    <Typography variant="h4" sx={{ color: 'primary.main', fontWeight: 700 }}>
                      {userStats.skillsLearnedCount}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#64748b' }}>
                      Skills Learned
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Trending Skills */}
          <Grid item xs={12} md={6}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                height: '100%',
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                border: '1px solid rgba(226, 232, 240, 0.8)',
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 12px 24px rgba(148, 163, 184, 0.15)'
                }
              }}
            >
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#1e293b' }}>
                Trending Skills
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {trendingSkills.map((skill, index) => (
                  <Chip
                    key={index}
                    label={skill}
                    sx={{
                      bgcolor: 'rgba(59, 130, 246, 0.1)',
                      color: '#3b82f6',
                      fontWeight: 500,
                      '&:hover': {
                        bgcolor: 'rgba(59, 130, 246, 0.2)'
                      }
                    }}
                  />
                ))}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
          {/* Results section */}
          <Grid item xs={12}>
            {searching ? (
              <Grid item xs={12} sx={{ textAlign: 'center', py: 4 }}>
                <CircularProgress sx={{ color: '#3b82f6' }} />
              </Grid>
            ) : searchResults.length > 0 ? (
              searchResults.map((result) => {
                const isOwnProfile = result.user?._id === user?._id;
                return (
                  <Grid item xs={12} sm={6} md={4} key={result._id}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 3,
                        height: '100%',
                        background: 'rgba(255, 255, 255, 0.9)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: '16px',
                        border: '1px solid rgba(226, 232, 240, 0.8)',
                        transition: 'all 0.3s ease-in-out',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 12px 24px rgba(148, 163, 184, 0.15)'
                        }
                      }}
                    >
                      {isOwnProfile && (
                        <Box
                          sx={{
                            position: 'absolute',
                            top: 16,
                            right: 16,
                            background: '#3b82f6',
                            color: 'white',
                            px: 2,
                            py: 0.5,
                            borderRadius: '20px',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            letterSpacing: '0.5px',
                            boxShadow: '0 2px 8px rgba(59, 130, 246, 0.25)',
                            zIndex: 1,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5
                          }}
                        >
                          <PersonIcon sx={{ fontSize: 16 }} />
                          Your Profile
                        </Box>
                      )}
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar 
                          sx={{ 
                            mr: 2,
                            bgcolor: '#3b82f6',
                            color: 'white'
                          }}
                        >
                          {result.user?.name?.[0] || 'U'}
                        </Avatar>
                        <Box>
                          <Typography variant="h6" sx={{ mb: 0, color: '#1e293b', fontWeight: 600 }}>
                            {result.title}
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#64748b' }}>
                            {result.user?.name}
                          </Typography>
                        </Box>
                      </Box>

                      <Typography variant="body2" sx={{ color: '#64748b' }} gutterBottom>
                        {result.category} • {result.experienceLevel}
                      </Typography>

                      <Typography
                        variant="body2"
                        sx={{
                          mb: 2,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                          color: '#475569',
                          lineHeight: 1.6
                        }}
                      >
                        {result.description}
                      </Typography>

                      <Box sx={{ mt: 'auto' }}>
                        <Typography variant="body2" sx={{ color: '#64748b', mb: 1 }}>
                          Skills:
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          {result.skills.slice(0, 3).map((skill, index) => (
                            <Chip
                              key={index}
                              label={skill}
                              size="small"
                              sx={{ 
                                borderRadius: '6px',
                                bgcolor: '#dbeafe',
                                color: '#1e40af',
                                fontWeight: 500,
                                '&:hover': {
                                  bgcolor: '#bfdbfe'
                                }
                              }}
                            />
                          ))}
                          {result.skills.length > 3 && (
                            <Chip
                              label={`+${result.skills.length - 3}`}
                              size="small"
                              sx={{ 
                                borderRadius: '6px',
                                bgcolor: '#dbeafe',
                                color: '#1e40af',
                                fontWeight: 500,
                                '&:hover': {
                                  bgcolor: '#bfdbfe'
                                }
                              }}
                            />
                          )}
                        </Box>
                      </Box>

                      <Box sx={{ 
                        mt: 2,
                        pt: 2,
                        borderTop: '1px solid #e2e8f0',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <Typography variant="body2" sx={{ color: '#64748b', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <LocationOnIcon sx={{ fontSize: '1rem' }} />
                          {[result.city, result.state, result.country].filter(Boolean).join(', ') || 'Location not specified'}
                        </Typography>
                        <Button
                          variant="outlined"
                          color="primary"
                          onClick={() => handleContactClick(result)}
                          sx={{
                            borderRadius: '8px',
                            textTransform: 'none',
                            '&:hover': {
                              backgroundColor: 'rgba(0, 0, 0, 0.04)'
                            }
                          }}
                        >
                          Contact
                        </Button>
                      </Box>
                    </Paper>
                  </Grid>
                );
              })
            ) : (
              <Grid item xs={12} sx={{ textAlign: 'center', py: 6 }}>
                <Box sx={{ maxWidth: 400, mx: 'auto' }}>
                  <Typography variant="h6" sx={{ color: '#1e293b', mb: 1 }}>
                    No Results Found
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#64748b' }}>
                    {searchQuery || filters.country || filters.state || filters.city || filters.category || filters.experienceLevel || filters.teachingMethod || locationSearch
                      ? 'Try adjusting your search criteria to find more mentors.'
                      : 'Start searching to find skilled mentors that match your interests!'}
                  </Typography>
                </Box>
              </Grid>
            )}
          </Grid>
        </Grid>
      </Container>

      <Dialog
        open={Boolean(selectedChat)}
        onClose={handleChatClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            height: '80vh',
            maxHeight: '600px',
            display: 'flex',
            flexDirection: 'column',
            background: 'rgba(255, 255, 255, 0.6)',
            backdropFilter: 'blur(20px)',
            borderRadius: '20px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.3)'
          }
        }}
        sx={{
          '& .MuiBackdrop-root': {
            backgroundColor: 'rgba(255, 255, 255, 0.3)',
            backdropFilter: 'blur(8px)'
          }
        }}
      >
        <DialogTitle sx={{ background: 'rgba(255, 255, 255, 0.3)' }}>
          {selectedChat && user && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
                pb: 1
              }}
            >
              <Box>
                <Typography variant="h6" sx={{ 
                  color: 'primary.main',
                  fontWeight: 500,
                  fontSize: '1.1rem'
                }}>
                </Typography>
                <Typography variant="caption" display="block" sx={{ color: 'text.secondary', opacity: 0.7 }}>
                  {selectedChat.skillProfile.title}
                </Typography>
              </Box>
              <IconButton 
                onClick={handleChatClose} 
                size="small"
                sx={{
                  color: 'text.secondary',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.04)'
                  }
                }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
          )}
        </DialogTitle>
        <DialogContent 
          sx={{ 
            flex: 1, 
            display: 'flex', 
            flexDirection: 'column', 
            p: 2,
            bgcolor: 'transparent'
          }}
        >
          <Box 
            sx={{ 
              flex: 1, 
              overflowY: 'auto', 
              mb: 2,
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {isLoadingChat ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <CircularProgress size={32} thickness={4} sx={{ color: 'primary.light' }} />
              </Box>
            ) : (
              messages.map((message) => {
                const isSender = message.sender._id === user?._id;
                return (
                  <Box
                    key={message._id}
                    sx={{
                      width: '100%',
                      display: 'flex',
                      justifyContent: isSender ? 'flex-end' : 'flex-start',
                      mb: 2
                    }}
                  >
                    <Box
                      sx={{
                        maxWidth: '70%',
                        display: 'flex',
                        flexDirection: isSender ? 'row' : 'row-reverse',
                        alignItems: 'flex-end',
                        gap: 1
                      }}
                    >
                      <Avatar
                        sx={{
                          width: 28,
                          height: 28,
                          bgcolor: isSender ? 'primary.main' : 'grey.300',
                          color: isSender ? 'white' : 'text.primary',
                          fontSize: '0.875rem',
                          fontWeight: 500
                        }}
                      >
                        {isSender ? user?.name?.charAt(0) : message.sender.name?.charAt(0)}
                      </Avatar>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 1.5,
                          backgroundColor: isSender 
                            ? 'primary.main'
                            : 'grey.100',
                          color: isSender ? 'white' : 'text.primary',
                          borderRadius: isSender 
                            ? '20px 20px 0 20px'
                            : '20px 20px 20px 0',
                          position: 'relative',
                          boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
                        }}
                      >
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            lineHeight: 1.5,
                            fontWeight: 400,
                            wordBreak: 'break-word'
                          }}
                        >
                          {message.content}
                        </Typography>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-end',
                            gap: 0.5,
                            mt: 0.5,
                            opacity: 0.8
                          }}
                        >
                          <Typography
                            variant="caption"
                            sx={{
                              color: isSender ? 'white' : 'text.secondary',
                              fontSize: '0.7rem'
                            }}
                          >
                            {new Date(message.createdAt).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </Typography>
                          {isSender && (
                            <DoneAllIcon
                              sx={{
                                fontSize: 14,
                                color: message.read ? '#fff' : 'rgba(255,255,255,0.7)'
                              }}
                            />
                          )}
                        </Box>
                      </Paper>
                    </Box>
                  </Box>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </Box>
          <Box 
            component="form" 
            onSubmit={handleSendMessage} 
            sx={{ 
              mt: 2,
              pt: 2,
              borderTop: '1px solid rgba(255, 255, 255, 0.2)',
              backgroundColor: 'rgba(255, 255, 255, 0.3)',
              borderRadius: '16px',
              p: 1.5,
              backdropFilter: 'blur(8px)'
            }}
          >
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                fullWidth
                size="small"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                variant="outlined"
                disabled={isLoadingChat || isSendingMessage}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'rgba(255, 255, 255, 0.4)',
                    borderRadius: '12px',
                    '& fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(99, 102, 241, 0.2)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'primary.main',
                      borderWidth: '1px',
                    },
                  },
                  '& .MuiOutlinedInput-input': {
                    '&::placeholder': {
                      color: 'rgba(0, 0, 0, 0.4)'
                    }
                  }
                }}
              />
              <LoadingButton 
                type="submit" 
                variant="contained" 
                loading={isSendingMessage}
                disabled={!newMessage.trim() || isLoadingChat}
                sx={{
                  minWidth: '100px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(99, 102, 241, 0.7)',
                  backdropFilter: 'blur(8px)',
                  '&:hover': {
                    backgroundColor: 'rgba(99, 102, 241, 0.8)',
                  },
                  '&.Mui-disabled': {
                    backgroundColor: 'rgba(203, 213, 225, 0.2)',
                  }
                }}
              >
                Send
              </LoadingButton>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>

      <Dialog
        open={openRequestDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Send Learning Request
          {selectedProfile && (
            <Typography variant="subtitle2" color="text.secondary">
              to {selectedProfile.title}
            </Typography>
          )}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Message (Optional)"
              placeholder="Introduce yourself and explain what you'd like to learn..."
              value={requestMessage}
              onChange={(e) => setRequestMessage(e.target.value)}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="inherit">
            Cancel
          </Button>
          <LoadingButton
            onClick={handleSendRequest}
            loading={isSubmitting}
            variant="contained"
            color="primary"
          >
            Send Request
          </LoadingButton>
        </DialogActions>
      </Dialog>

    </Box>
  );
};

export default Dashboard;

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
import { api } from '../config/api';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  const [requestAnchorEl, setRequestAnchorEl] = useState(null);
  const [searchAnchorEl, setSearchAnchorEl] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);  // Initialize as true
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [filters, setFilters] = useState({
    country: '',
    state: '',
    city: '',
    category: '',
    experienceLevel: '',
    teachingMethod: ''
  });
  const [showProfile, setShowProfile] = useState(false);
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
  const [profileState, setProfileState] = useState(null);
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
    const init = async () => {
      setLoading(true);
      try {
        await Promise.all([
          fetchProfile(),
          fetchNotifications(),
          fetchRequests(),
          fetchMentors(),
          fetchStudents(),
          fetchTrendingSkills(),
          fetchUserStats()
        ]);
        // Get user name from localStorage
        const user = JSON.parse(localStorage.getItem('user'));
        if (user?.name) {
          setUserName(user.name);
        }
      } catch (error) {
        console.error('Error initializing dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  useEffect(() => {
    fetchProfile();
    fetchLocations();
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
      if (selectedChat) {
        try {
          const response = await fetch(`${api.baseURL}/api/messages/${selectedChat._id}`, {
            method: 'GET',
            headers: api.getHeaders()
          });
          const data = await response.json();
          if (data.success) {
            setMessages(data.data);
          }
        } catch (error) {
          console.error('Error polling messages:', error);
        }
      }
    };

    // Poll messages every 3 seconds when chat is open
    const interval = setInterval(pollMessages, 3000);

    return () => clearInterval(interval);
  }, [selectedChat]);

  const fetchLocations = async () => {
    // Set the countries directly from defaultLocations
    setCountries(Object.keys(defaultLocations));
    if (filters.country) {
      setStates(defaultLocations[filters.country] || []);
    }
  };

  const fetchProfile = async () => {
    try {
      const response = await fetch(`${api.baseURL}${api.endpoints.skillProfile}`, {
        method: 'GET',
        headers: api.getHeaders()
      });
      
      const data = await response.json();
      if (data.success) {
        setProfile(data.data);
        console.log('Fetched profile:', data.data);
      } else {
        console.error('Failed to fetch profile:', data.message);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const fetchNotifications = async () => {
    try {
      const response = await fetch(`${api.baseURL}/api/notifications`, {
        method: 'GET',
        headers: api.getHeaders()
      });
      const data = await response.json();
      if (data.success) {
        // Separate request notifications from other notifications
        const requests = data.data.filter(n => n.type === 'request');
        const otherNotifications = data.data.filter(n => n.type !== 'request');
        
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
      const response = await fetch(`${api.baseURL}/api/requests`, {
        method: 'GET',
        headers: api.getHeaders()
      });
      const data = await response.json();
      if (data.success) {
        setRequests(data.data);
      }
    } catch (error) {
      console.error('Error fetching requests:', error);
    }
  };

  const fetchMentors = async () => {
    try {
      const response = await fetch(`${api.baseURL}/api/requests?status=accepted&role=student`, {
        method: 'GET',
        headers: api.getHeaders()
      });
      const data = await response.json();
      if (data.success) {
        // These are requests where current user is the student and mentor has accepted
        setMentors(data.data);
      }
    } catch (error) {
      console.error('Error fetching mentors:', error);
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await fetch(`${api.baseURL}/api/requests?status=accepted&role=mentor`, {
        method: 'GET',
        headers: api.getHeaders()
      });
      const data = await response.json();
      if (data.success) {
        // These are requests where current user is the mentor and they have accepted
        setStudents(data.data);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const fetchSkillProfile = async () => {
    try {
      const response = await fetch(`${api.baseURL}${api.endpoints.skillProfile}`, {
        method: 'GET',
        headers: api.getHeaders()
      });
      const data = await response.json();
      if (data.success) {
        setSkillProfile(data.data);
      }
    } catch (error) {
      console.error('Error fetching skill profile:', error);
    }
  };

  const fetchTrendingSkills = async () => {
    try {
      const response = await fetch(`${api.baseURL}/api/skills/trending`, {
        method: 'GET',
        headers: api.getHeaders()
      });
      const data = await response.json();
      if (data.success) {
        setTrendingSkills(data.data);
      }
    } catch (error) {
      console.error('Error fetching trending skills:', error);
    }
  };

  const fetchUserStats = async () => {
    try {
      const response = await fetch(`${api.baseURL}/api/skill-profile/stats`, {
        method: 'GET',
        headers: api.getHeaders()
      });
      const data = await response.json();
      if (data.success) {
        setUserStats({
          studentsCount: data.data.studentsCount || 0,
          skillsLearnedCount: data.data.skillsLearnedCount || 0
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
      const response = await fetch(`${api.baseURL}/api/requests/${studentRequest._id}`, {
        method: 'DELETE',
        headers: api.getHeaders()
      });

      const data = await response.json();
      if (data.success) {
        // Remove from students list
        setStudents(prev => prev.filter(req => req._id !== studentRequest._id));
        
        // Update stats
        setUserStats(prev => ({
          ...prev,
          studentsCount: (prev.studentsCount || 0) + 1
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
      } else {
        throw new Error(data.message || 'Failed to complete course');
      }
    } catch (error) {
      console.error('Error completing course:', error);
      toast.error(error.message || 'Failed to complete course');
    }
  };

  const handleLeaveRequest = async (mentorRequest) => {
    try {
      const response = await fetch(`${api.baseURL}/api/requests/${mentorRequest._id}`, {
        method: 'DELETE',
        headers: api.getHeaders()
      });

      const data = await response.json();
      if (data.success) {
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
      } else {
        throw new Error(data.message || 'Failed to leave course');
      }
    } catch (error) {
      console.error('Error leaving course:', error);
      toast.error(error.message || 'Failed to leave course');
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
      const response = await fetch(`${api.baseURL}/api/requests`, {
        method: 'POST',
        headers: api.getHeaders(),
        body: JSON.stringify({
          mentorId: selectedProfile.user,
          skillProfileId: selectedProfile._id,
          message: requestMessage
        })
      });

      const data = await response.json();
      if (data.success) {
        alert('Request sent successfully!');
        handleCloseDialog();
      } else {
        throw new Error(data.message || 'Failed to send request');
      }
    } catch (error) {
      console.error('Error sending request:', error);
      alert(error.message || 'Failed to send request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNotificationAction = async (notificationId, action) => {
    try {
      if (action === 'reject') {
        // Get the notification details to get the request ID
        const notificationResponse = await fetch(`${api.baseURL}/api/notifications/${notificationId}`, {
          method: 'GET',
          headers: api.getHeaders()
        });
        const notificationData = await notificationResponse.json();
        
        if (notificationData.success && notificationData.data.relatedRequest) {
          // First reject the request
          const requestResponse = await fetch(`${api.baseURL}/api/requests/${notificationData.data.relatedRequest._id}`, {
            method: 'DELETE',
            headers: api.getHeaders()
          });
          
          const requestData = await requestResponse.json();
          if (requestData.success) {
            // Then delete the notification
            await fetch(`${api.baseURL}/api/notifications/${notificationId}`, {
              method: 'DELETE',
              headers: api.getHeaders()
            });
            
            // Update UI
            setRequests(prev => prev.filter(req => req._id !== notificationData.data.relatedRequest._id));
            toast.success('Request rejected successfully');
            
            // Refresh data
            await Promise.all([
              fetchNotifications(),
              fetchRequests(),
              fetchMentors(),
              fetchStudents()
            ]);
          } else {
            throw new Error(requestData.message || 'Failed to reject request');
          }
        }
      } else if (action === 'accept') {
        // Existing accept logic
        const response = await fetch(`${api.baseURL}/api/notifications/${notificationId}`, {
          method: 'GET',
          headers: api.getHeaders()
        });
        const data = await response.json();
        
        if (data.success && data.data.relatedRequest && data.data.relatedRequest._id) {
          await handleRequestAction(data.data.relatedRequest._id, 'accepted');
          
          await fetch(`${api.baseURL}/api/notifications/${notificationId}`, {
            method: 'DELETE',
            headers: api.getHeaders()
          });
          
          fetchNotifications();
        } else {
          throw new Error('Could not find related request');
        }
      }
    } catch (error) {
      console.error('Error handling notification action:', error);
      toast.error(error.message || 'Failed to process the action');
    }
  };

  const handleChatOpen = async (request) => {
    try {
      setSelectedChat(request);
      setIsLoadingChat(true);
      const response = await fetch(`${api.baseURL}/api/messages/${request._id}`, {
        method: 'GET',
        headers: api.getHeaders()
      });

      const data = await response.json();
      if (data.success) {
        setMessages(data.data);
        scrollToBottom();
      } else {
        throw new Error(data.message || 'Failed to load chat messages');
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
    setNewMessage('');
  };

  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    if (!newMessage.trim() || !selectedChat || isSendingMessage) return;

    setIsSendingMessage(true);
    try {
      const response = await fetch(`${api.baseURL}/api/messages`, {
        method: 'POST',
        headers: api.getHeaders(),
        body: JSON.stringify({
          requestId: selectedChat._id,
          content: newMessage.trim()
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to send message');
      }

      // Add the new message to the messages array immediately
      setMessages(prevMessages => [...prevMessages, data.data]);
      setNewMessage('');
      scrollToBottom();
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSendingMessage(false);
    }
  };

  const handleRequestAction = async (requestId, action) => {
    try {
      let endpoint = `${api.baseURL}/api/requests/${requestId}`;
      
      if (action === 'accepted') {
        endpoint += '/accept';
      } else if (action === 'rejected') {
        endpoint += '/reject';
      }

      console.log('Making request to:', endpoint); // Debug log

      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: api.getHeaders()
      });

      console.log('Response status:', response.status); // Debug log

      const data = await response.json();
      console.log('Response data:', data); // Debug log

      if (data.success) {
        if (action === 'rejected') {
          // Remove from all lists
          setRequests(prev => prev.filter(req => req._id !== requestId));
          setMentors(prev => prev.filter(req => req._id !== requestId));
          setStudents(prev => prev.filter(req => req._id !== requestId));
          
          // Delete associated notification if exists
          const notification = [...notifications, ...requestNotifications]
            .find(n => n.relatedRequest && n.relatedRequest._id === requestId);
          
          if (notification) {
            await fetch(`${api.baseURL}/api/notifications/${notification._id}`, {
              method: 'DELETE',
              headers: api.getHeaders()
            });
          }

          toast.success('Request rejected successfully');
        } else {
          // Existing accept logic
          const currentUser = JSON.parse(localStorage.getItem('user'));
          setRequests(prev => prev.filter(req => req._id !== requestId));
          
          const request = [...requests, ...mentors, ...students].find(req => req._id === requestId);
          if (request) {
            if (currentUser._id === request.mentor._id) {
              setStudents(prev => [...prev, { ...request, status: 'accepted' }]);
            } else if (currentUser._id === request.student._id) {
              setMentors(prev => [...prev, { ...request, status: 'accepted' }]);
            }
          }
          toast.success('Request accepted successfully');
        }

        // Refresh all data
        await Promise.all([
          fetchNotifications(),
          fetchRequests(),
          fetchMentors(),
          fetchStudents()
        ]);

        // Close menus
        handleRequestClose();
        handleNotificationClose();
      } else {
        throw new Error(data.message || 'Failed to update request');
      }
    } catch (error) {
      console.error('Error updating request:', error);
      toast.error(error.message || 'Failed to update request');
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    try {
      const response = await fetch(`${api.baseURL}/api/notifications/${notificationId}`, {
        method: 'DELETE',
        headers: api.getHeaders()
      });

      const data = await response.json();
      if (data.success) {
        // Remove the notification from the state
        setNotifications(prev => prev.filter(n => n._id !== notificationId));
        setNotificationCount(prev => prev - 1);
        toast.success('Notification deleted successfully');
      } else {
        throw new Error(data.message || 'Failed to delete notification');
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
      toast.error(error.message || 'Failed to delete notification');
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

      const response = await fetch(`${api.baseURL}${api.endpoints.searchProfiles}?${queryParams}`, {
        method: 'GET',
        headers: api.getHeaders()
      });

      const data = await response.json();
      if (data.success) {
        // Include all profiles including the user's own profile
        setSearchResults(data.data);
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

  const markNotificationAsRead = async (notificationId) => {
    try {
      await fetch(`${api.baseURL}/api/notifications/${notificationId}/read`, {
        method: 'PUT',
        headers: api.getHeaders()
      });
      await fetchNotifications();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
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
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <img 
                src="https://static.vecteezy.com/system/resources/previews/019/485/187/non_2x/decorative-dragon-emblem-image-for-logo-emblem-tattoo-embroidery-laser-cutting-sublimation-vector.jpg" // Update with your actual logo path
                alt="SkillShare Logo" 
                style={{ 
                  height: 40, 
                  width: 'auto', 
                  marginRight: 8,
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' // Optional: add a subtle shadow
                }} 
              />
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
            </Box>
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
                    borderRadius: '12px',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                    overflow: 'hidden'
                  }
                }}
              >
                <Box sx={{ 
                  p: 3, 
                  background: 'linear-gradient(to right, #f8fafc, #f1f5f9)', 
                  borderBottom: '1px solid rgba(226, 232, 240, 0.6)' 
                }}>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      mb: 3, 
                      color: '#1e293b', 
                      fontWeight: 700, 
                      letterSpacing: '-0.5px', 
                      textAlign: 'center' 
                    }}
                  >
                    Discover Skills
                  </Typography>
                  
                  <Grid container spacing={3}>
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
                              <SearchIcon sx={{ 
                                color: '#64748b',
                                mr: 1 
                              }} />
                            </InputAdornment>
                          ),
                        }}
                        sx={{ 
                          mb: 2,
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '10px',
                            '&.Mui-focused fieldset': {
                              borderColor: '#3b82f6',
                              borderWidth: 2
                            }
                          }
                        }}
                      />
                      
                      <TextField
                        fullWidth
                        label="Search by Location"
                        value={locationSearch}
                        onChange={(e) => setLocationSearch(e.target.value)}
                        variant="outlined"
                        placeholder="Enter city, area, or landmark..."
                        sx={{ 
                          mb: 2,
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '10px',
                            '&.Mui-focused fieldset': {
                              borderColor: '#3b82f6',
                              borderWidth: 2
                            }
                          }
                        }}
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
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: '10px',
                              '&.Mui-focused fieldset': {
                                borderColor: '#3b82f6'
                              }
                            }
                          }}
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
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: '10px',
                              '&.Mui-focused fieldset': {
                                borderColor: '#3b82f6'
                              }
                            }
                          }}
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
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: '10px',
                              '&.Mui-focused fieldset': {
                                borderColor: '#3b82f6'
                              }
                            }
                          }}
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
                            borderRadius: '10px',
                            bgcolor: '#f8fafc',
                            '& .MuiOutlinedInput-notchedOutline': {
                              borderColor: '#e2e8f0',
                              borderWidth: 1
                            },
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                              borderColor: '#94a3b8'
                            },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                              borderColor: '#3b82f6',
                              borderWidth: 2
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
                            borderRadius: '10px',
                            bgcolor: '#f8fafc',
                            '& .MuiOutlinedInput-notchedOutline': {
                              borderColor: '#e2e8f0',
                              borderWidth: 1
                            },
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                              borderColor: '#94a3b8'
                            },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                              borderColor: '#3b82f6',
                              borderWidth: 2
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
                    <Typography variant="body2" color="text.secondary">
                      No requests available
                    </Typography>
                  </MenuItem>
                ) : (
                  [
                    /* Incoming Requests */
                    ...requests
                      .filter(r => r.mentor._id === JSON.parse(localStorage.getItem('user'))._id)
                      .map((request) => (
                        <MenuItem key={`incoming-${request._id}`} sx={{ py: 2 }}>
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
                      )),
                    /* Outgoing Requests */
                    ...requests
                      .filter(r => r.student._id === JSON.parse(localStorage.getItem('user'))._id)
                      .map((request) => (
                        <MenuItem key={`outgoing-${request._id}`} sx={{ py: 2 }}>
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
                      ))
                  ]
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
                  size="small"
                  onClick={handleMenu}
                  sx={{
                    p: 0.5,
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
                  {loading ? (
                    <CircularProgress size={32} />
                  ) : (
                    <Avatar 
                      src={profile?.profilePicture ? `${api.baseURL}${profile.profilePicture}` : ''}
                      sx={{ 
                        mr: 2,
                        width: 32,
                        height: 32,
                        bgcolor: profile?.profilePicture ? 'transparent' : 'primary.main',
                        fontSize: '1rem'
                      }}
                    >
                      {!profile?.profilePicture && userName?.charAt(0)?.toUpperCase()}
                    </Avatar>
                  )}
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
                        transform: 'scale(1.05)',
                        boxShadow: '0 4px 10px rgba(59, 130, 246, 0.2)'
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
                <CircularProgress 
                  sx={{ 
                    color: '#3b82f6', 
                    '& .MuiCircularProgress-circle': { 
                      strokeLinecap: 'round',
                      animation: 'pulse 1.5s infinite ease-in-out'
                    }
                  }} 
                />
              </Grid>
            ) : searchResults.length > 0 ? (
              <Grid container spacing={3}>
                {searchResults.map((result) => {
                  const isOwnProfile = result.user?._id === user?._id;
                  return (
                    <Grid item xs={12} sm={6} md={4} key={result._id}>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 3,
                          height: '100%',
                          background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.95), rgba(248, 250, 252, 0.95))',
                          backdropFilter: 'blur(15px)',
                          borderRadius: '20px',
                          border: '1px solid rgba(226, 232, 240, 0.6)',
                          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)',
                          transition: 'all 0.4s ease-in-out',
                          position: 'relative',
                          overflow: 'hidden',
                          '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: '-50%',
                            left: '-50%',
                            width: '200%',
                            height: '200%',
                            background: 'radial-gradient(circle at center, rgba(59, 130, 246, 0.05) 0%, transparent 70%)',
                            transform: 'rotate(-45deg)',
                            zIndex: 0
                          },
                          '&:hover': {
                            transform: 'translateY(-8px)',
                            boxShadow: '0 15px 35px rgba(0, 0, 0, 0.1)'
                          }
                        }}
                      >
                        {isOwnProfile && (
                          <Box
                            sx={{
                              position: 'absolute',
                              top: 16,
                              right: 16,
                              background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                              color: 'white',
                              px: 2,
                              py: 0.5,
                              borderRadius: '20px',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              letterSpacing: '0.5px',
                              boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)',
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
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, position: 'relative', zIndex: 1 }}>
                          <Avatar 
                            src={result.profilePicture ? `${api.baseURL}${result.profilePicture}` : ''}
                            sx={{ 
                              mr: 2,
                              width: 64,
                              height: 64,
                              bgcolor: result.profilePicture ? 'transparent' : '#3b82f6',
                              color: 'white',
                              border: '3px solid #3b82f6',
                              boxShadow: '0 4px 15px rgba(59, 130, 246, 0.25)',
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                transform: 'scale(1.05)'
                              }
                            }}
                          >
                            {!result.profilePicture && result.user?.name?.[0]}
                          </Avatar>
                          <Box>
                            <Typography variant="h6" sx={{ mb: 0, color: '#1e293b', fontWeight: 700, letterSpacing: '-0.5px' }}>
                              {result.title}
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500 }}>
                              {result.user?.name}
                            </Typography>
                          </Box>
                        </Box>

                        <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500, mb: 1 }} gutterBottom>
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
                            lineHeight: 1.6,
                            fontWeight: 400
                          }}
                        >
                          {result.description}
                        </Typography>

                        <Box sx={{ mt: 'auto' }}>
                          <Typography variant="body2" sx={{ color: '#64748b', mb: 1, fontWeight: 600 }}>
                            Skills:
                          </Typography>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {result.skills.slice(0, 3).map((skill, index) => (
                              <Chip
                                key={index}
                                label={skill}
                                size="small"
                                sx={{ 
                                  borderRadius: '8px',
                                  background: 'linear-gradient(135deg, #dbeafe, #bfdbfe)',
                                  color: '#1e40af',
                                  fontWeight: 600,
                                  transition: 'all 0.3s ease',
                                  '&:hover': {
                                    transform: 'scale(1.05)',
                                    boxShadow: '0 4px 10px rgba(59, 130, 246, 0.2)'
                                  }
                                }}
                              />
                            ))}
                            {result.skills.length > 3 && (
                              <Chip
                                label={`+${result.skills.length - 3}`}
                                size="small"
                                sx={{ 
                                  borderRadius: '8px',
                                  background: 'linear-gradient(135deg, #f0f9ff, #e6f2ff)',
                                  color: '#1e40af',
                                  fontWeight: 600
                                }}
                              />
                            )}
                          </Box>
                        </Box>

                        <Box sx={{ 
                          mt: 2,
                          pt: 2,
                          borderTop: '1px solid rgba(226, 232, 240, 0.6)',
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
                              borderRadius: '12px',
                              borderColor: '#3b82f6',
                              color: '#3b82f6',
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                bgcolor: '#3b82f6',
                                color: 'white',
                                transform: 'translateY(-2px)',
                                boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)'
                              }
                            }}
                          >
                            Contact
                          </Button>
                        </Box>
                      </Paper>
                    </Grid>
                  );
                })}
              </Grid>
            ) : (
              <Grid item xs={12} sx={{ textAlign: 'center', py: 6 }}>
                <Box sx={{ 
                  maxWidth: 400, 
                  mx: 'auto', 
                  p: 4, 
                  borderRadius: '20px', 
                  background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.95), rgba(248, 250, 252, 0.95))',
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)',
                  border: '1px solid rgba(226, 232, 240, 0.6)'
                }}>
                  <Typography variant="h5" sx={{ color: '#1e293b', mb: 2, fontWeight: 700 }}>
                    No Results Found
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#64748b', mb: 3, lineHeight: 1.6 }}>
                    Try adjusting your search or filter criteria to find the perfect mentor or skill.
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{
                      borderRadius: '12px',
                      background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-3px)',
                        boxShadow: '0 8px 20px rgba(59, 130, 246, 0.3)'
                      }
                    }}
                  >
                    Reset Filters
                  </Button>
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

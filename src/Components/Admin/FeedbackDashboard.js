import React, { useState, useEffect, useMemo } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  TablePagination,
  TextField,
  InputAdornment,
  IconButton,
  Collapse,
  Chip,
  CircularProgress,
  Tabs,
  Tab,
  Alert,
  AlertTitle,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tooltip,
  Card,
  CardContent,
  Rating,
  Divider,
  useTheme,
} from '@mui/material';
import { 
  Search as SearchIcon, 
  ExpandMore as ExpandMoreIcon, 
  ExpandLess as ExpandLessIcon,
  FilterList as FilterListIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  BarChart as BarChartIcon,
  List as ListIcon,
  DateRange as DateRangeIcon,
  People as PeopleIcon,
  ThumbUp as ThumbUpIcon,
  ThumbDown as ThumbDownIcon,
  SentimentSatisfiedAlt as SentimentSatisfiedAltIcon,
  SentimentNeutral as SentimentNeutralIcon,
  SentimentDissatisfied as SentimentDissatisfiedIcon,
  InboxOutlined as InboxOutlinedIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { format } from 'date-fns';
import useSWR from 'swr';
import axios from 'axios';

// Styled Components
const StatCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.2s, box-shadow 0.2s',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[8],
  },
}));

const RatingLabel = styled('span')({
  display: 'inline-flex',
  alignItems: 'center',
  marginRight: 8,
  fontWeight: 500,
});

// Create a fetcher function for SWR
const fetcher = async (url) => {
  console.log('Fetching:', url);
  try {
    const response = await fetch(url);
    if (!response.ok) {
      const error = new Error('An error occurred while fetching the data.');
      error.info = await response.json();
      error.status = response.status;
      throw error;
    }
    return response.json();
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
};

// Fetch all event names from feedback
const fetchEventNames = async () => {
  try {
    const response = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/feedback/events`);
    if (!response.ok) throw new Error('Failed to fetch events');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching events:', error);
    return [];
  }
};

const FeedbackDashboard = () => {
  const theme = useTheme();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedFeedback, setExpandedFeedback] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [dateRange, setDateRange] = useState({
    startDate: null,
    endDate: null,
  });
  const [selectedEvent, setSelectedEvent] = useState('all');
  const [events, setEvents] = useState([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);
  const [eventsError, setEventsError] = useState(null);

  // Fetch events on component mount
  useEffect(() => {
    const loadEvents = async () => {
      try {
        setIsLoadingEvents(true);
        const response = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/feedback/events`);
        if (!response.ok) throw new Error('Failed to fetch events');
        const { data } = await response.json();
        setEvents(data);
        
        // If there are events, select the first one by default
        if (data.length > 0) {
          setSelectedEvent(data[0]._id);
        }
      } catch (error) {
        console.error('Error loading events:', error);
        setEventsError(error.message);
      } finally {
        setIsLoadingEvents(false);
      }
    };
    
    loadEvents();
  }, []);

  // Log environment variables for debugging
  useEffect(() => {
    console.log('Environment Variables:', {
      BACKEND_BASE_URL: process.env.REACT_APP_BACKEND_BASE_URL
    });
  }, []);

  // Fetch feedback data with SWR
  const { 
    data: feedbackData, 
    error: feedbackError, 
    isLoading: isFeedbackLoading,
    mutate: mutateFeedback 
  } = useSWR(
    selectedEvent 
      ? `${process.env.REACT_APP_BACKEND_BASE_URL}/api/feedback/event/${selectedEvent}`
      : null,
    fetcher,
    {
      revalidateOnFocus: false,
      shouldRetryOnError: true,
      errorRetryCount: 3,
      errorRetryInterval: 5000,
      onError: (error) => {
        console.error('Error fetching feedback:', error);
      }
    }
  );

  // Fetch feedback stats with SWR - using 'all' as eventId to get stats for all events
  const { 
    data: statsData, 
    error: statsError, 
    isLoading: isStatsLoading 
  } = useSWR(
    `${process.env.REACT_APP_BACKEND_BASE_URL}/api/feedback/stats/all`,
    async (url) => {
      // First try the /all endpoint
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return response.json();
      } catch (error) {
        console.log('Could not fetch stats from /all endpoint, trying fallback...');
        // Fallback to fetching all feedback and calculating stats on the client
        const allFeedback = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/feedback`).then(res => res.json());
        if (!allFeedback.success) throw new Error('Failed to fetch feedback data');
        
        // Calculate basic stats client-side
        const feedbacks = allFeedback.data || [];
        const total = feedbacks.length;
        const avgOverall = total > 0 
          ? feedbacks.reduce((sum, f) => sum + (f.overallRating || 0), 0) / total 
          : 0;
          
        return {
          success: true,
          data: {
            totalResponses: total,
            averageRatings: {
              overall: parseFloat(avgOverall.toFixed(2)),
              // Add other averages if needed
            },
            // Add other stats as needed
          }
        };
      }
    },
    {
      revalidateOnFocus: false,
      shouldRetryOnError: true,
      errorRetryCount: 3,
      errorRetryInterval: 5000
    }
  );

  // Log API responses and errors
  useEffect(() => {
    if (feedbackData) console.log('Feedback Data:', feedbackData);
    if (feedbackError) console.error('Feedback Error:', feedbackError);
    if (statsData) console.log('Stats Data:', statsData);
    if (statsError) console.error('Stats Error:', statsError);
  }, [feedbackData, feedbackError, statsData, statsError]);

  const isLoading = isFeedbackLoading || isStatsLoading;
  const error = feedbackError || statsError;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleExpandFeedback = (id) => {
    setExpandedFeedback(expandedFeedback === id ? null : id);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleEventChange = (event) => {
    setSelectedEvent(event.target.value);
    setPage(0); // Reset to first page when changing events
  };

  // Filter feedback based on search term and date range
  const filteredFeedback = useMemo(() => {
    if (!feedbackData) return [];
    
    const feedbackList = Array.isArray(feedbackData) ? feedbackData : (feedbackData.data || []);
    
    return feedbackList.filter(feedback => {
      if (!feedback) return false;
      
      const matchesSearch = 
        (feedback.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (feedback.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (feedback.comments?.toLowerCase() || '').includes(searchTerm.toLowerCase());
        
      const matchesDate = !dateRange.startDate || !dateRange.endDate || 
        (new Date(feedback.createdAt) >= dateRange.startDate && 
         new Date(feedback.createdAt) <= dateRange.endDate);
         
      return matchesSearch && matchesDate;
    });
  }, [feedbackData, searchTerm, dateRange]);

  // Calculate stats based on filtered feedback
  const stats = useMemo(() => {
    if (!filteredFeedback || !filteredFeedback.length) {
      return {
        averageRating: 0,
        totalResponses: 0,
        satisfactionRate: 0,
        averageRatings: {
          overall: 0,
          recommendLikelihood: 0,
          futureParticipationLikelihood: 0,
          registrationCheckin: 0,
          venue: 0,
          trackRoute: 0,
        }
      };
    }


    const total = filteredFeedback.length;
    const sum = (key) => 
      filteredFeedback.reduce((acc, curr) => acc + (curr[key] || 0), 0);
    
    const average = (key) => (sum(key) / total).toFixed(1);
    
    // Calculate satisfaction rate (percentage of ratings >= 4)
    const satisfiedCount = filteredFeedback
      .filter(f => f.overallRating >= 4).length;
    const satisfactionRate = ((satisfiedCount / total) * 100).toFixed(1);
    
    return {
      averageRating: average('overallRating'),
      totalResponses: total,
      satisfactionRate,
      averageRatings: {
        overall: average('overallRating'),
        recommendLikelihood: average('recommendLikelihood'),
        futureParticipationLikelihood: average('futureParticipationLikelihood'),
        registrationCheckin: average('registrationCheckin'),
        venue: average('venue'),
        trackRoute: average('trackRoute'),
      }
    };
  }, [filteredFeedback]);
  
  const { averageRating, totalResponses, satisfactionRate, averageRatings } = stats;

  // Rating categories for the radar chart
  const ratingCategories = [
    { id: 'overallRating', label: 'Overall' },
    { id: 'recommendLikelihood', label: 'Recommendation' },
    { id: 'futureParticipationLikelihood', label: 'Future Participation' },
    { id: 'registrationCheckin', label: 'Registration' },
    { id: 'venue', label: 'Venue' },
    { id: 'trackRoute', label: 'Track/Route' },
  ];

  if (isLoading) {
    return (
      <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '50vh', gap: 2 }}>
        <CircularProgress size={60} thickness={4} />
        <Typography variant="h6" color="textSecondary" sx={{ mt: 2 }}>
          Loading feedback data...
        </Typography>
        <Typography variant="body2" color="textSecondary">
          This may take a moment
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert 
          severity="error" 
          sx={{ mb: 2 }}
          action={
            <Button 
              color="inherit" 
              size="small" 
              onClick={() => window.location.reload()}
            >
              Retry
            </Button>
          }
        >
          <AlertTitle>Error Loading Data</AlertTitle>
          <Typography variant="body1" gutterBottom>
            We couldn't load the feedback data. {error.status && `(Status: ${error.status})`}
          </Typography>
          {error.info?.message && (
            <Typography variant="body2" sx={{ mt: 1, fontFamily: 'monospace' }}>
              {error.info.message}
            </Typography>
          )}
        </Alert>
        <Box sx={{ mt: 3, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
          <Typography variant="h6" gutterBottom>Debug Information</Typography>
          <Typography variant="body2" component="pre" sx={{ 
            p: 2, 
            bgcolor: 'grey.100', 
            borderRadius: 1, 
            overflow: 'auto',
            maxHeight: '200px'
          }}>
            {JSON.stringify({
              timestamp: new Date().toISOString(),
              error: error.message,
              status: error.status,
              info: error.info,
              backendUrl: process.env.REACT_APP_BACKEND_BASE_URL
            }, null, 2)}
          </Typography>
        </Box>
      </Box>
    );
  }

  if (!feedbackData || feedbackData.length === 0) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Box sx={{ maxWidth: 500, mx: 'auto', py: 4 }}>
          <InboxOutlinedIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            No Feedback Data Available
          </Typography>
          <Typography variant="body1" color="textSecondary" paragraph>
            It looks like there's no feedback submitted yet. Check back later or verify your data source.
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<RefreshIcon />}
            onClick={() => window.location.reload()}
            sx={{ mt: 2 }}
          >
            Refresh Data
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4">
            Feedback Dashboard
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <FormControl size="small" sx={{ minWidth: 250 }}>
              <InputLabel id="event-select-label">Select Event</InputLabel>
              <Select
                labelId="event-select-label"
                id="event-select"
                value={selectedEvent || ''}
                label="Select Event"
                onChange={handleEventChange}
                disabled={isLoadingEvents || events.length === 0}
              >
                {events.map((event) => (
                  <MenuItem key={event._id} value={event._id}>
                    {event.name} ({event.feedbackCount})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <Tooltip title="Refresh data">
              <span>
                <IconButton 
                  onClick={() => {
                    mutateFeedback();
                    // Refresh events list
                    fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/feedback/events`)
                      .then(res => res.json())
                      .then(({ data }) => setEvents(data));
                  }}
                  disabled={isLoading || isLoadingEvents}
                >
                  <RefreshIcon />
                </IconButton>
              </span>
            </Tooltip>
          </Box>
        </Box>
        
        {selectedEvent && events.length > 0 && (
          <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 1 }}>
            Viewing feedback for: <strong>{events.find(e => e._id === selectedEvent)?.name}</strong>
          </Typography>
        )}
      </Box>
      
      {/* Stats Overview */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <StatCard elevation={3}>
            <Box display="flex" alignItems="center" mb={1}>
              <PeopleIcon color="primary" sx={{ mr: 1, fontSize: 40 }} />
              <Box>
                <Typography variant="h6" color="textSecondary">Total Responses</Typography>
                <Typography variant="h3">{totalResponses}</Typography>
                <Typography variant="caption" color="textSecondary">
                  {events.find(e => e._id === selectedEvent)?.name || 'All Events'}
                </Typography>
              </Box>
            </Box>
          </StatCard>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <StatCard elevation={3}>
            <Box display="flex" alignItems="center" mb={1}>
              <StarIcon color="primary" sx={{ mr: 1, fontSize: 40 }} />
              <Box>
                <Typography variant="h6" color="textSecondary">Average Rating</Typography>
                <Box display="flex" alignItems="center">
                  <Typography variant="h3" sx={{ mr: 1 }}>
                    {averageRating}
                  </Typography>
                  <Rating 
                    value={parseFloat(averageRating) || 0} 
                    precision={0.1} 
                    readOnly 
                    size="small"
                  />
                </Box>
                <Typography variant="caption" color="textSecondary">
                  out of 5 stars
                </Typography>
              </Box>
            </Box>
          </StatCard>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <StatCard elevation={3}>
            <Box display="flex" alignItems="center" mb={1}>
              <ThumbUpIcon color="primary" sx={{ mr: 1, fontSize: 40 }} />
              <Box>
                <Typography variant="h6" color="textSecondary">Satisfaction</Typography>
                <Typography variant="h3">
                  {satisfactionRate}%
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  of respondents rated 4+ stars
                </Typography>
              </Box>
            </Box>
          </StatCard>
        </Grid>
      </Grid>

      {/* Tabs for different views */}
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab icon={<ListIcon />} label="All Feedback" />
          <Tab icon={<BarChartIcon />} label="Analytics" />
          <Tab icon={<PeopleIcon />} label="Respondents" />
        </Tabs>
      </Paper>

      {/* Search and Filter */}
      <Box display="flex" justifyContent="space-between" mb={3} flexWrap="wrap" gap={2}>
        <TextField
          variant="outlined"
          size="small"
          placeholder="Search feedback..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ minWidth: 300 }}
        />
        
        <Box display="flex" gap={2}>
          <TextField
            type="date"
            size="small"
            label="From"
            InputLabelProps={{ shrink: true }}
            value={dateRange.startDate || ''}
            onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
          />
          <TextField
            type="date"
            size="small"
            label="To"
            InputLabelProps={{ shrink: true }}
            value={dateRange.endDate || ''}
            onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
          />
        </Box>
      </Box>

      {/* Feedback Table */}
      <TableContainer component={Paper} elevation={2}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Respondent</TableCell>
              <TableCell>Event</TableCell>
              <TableCell>Rating</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Comments</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredFeedback.length > 0 ? (
              filteredFeedback
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((feedback) => (
                  <React.Fragment key={feedback._id}>
                    <TableRow 
                      hover 
                      onClick={() => handleExpandFeedback(feedback._id)}
                      sx={{ '&:hover': { cursor: 'pointer' } }}
                    >
                      <TableCell>
                        <Box>
                          <Typography variant="subtitle2">{feedback.name}</Typography>
                          <Typography variant="caption" color="textSecondary">
                            {feedback.email}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{feedback.eventName}</TableCell>
                      <TableCell>
                        <Rating 
                          value={feedback.overallRating} 
                          readOnly 
                          size="small" 
                          precision={0.5}
                        />
                      </TableCell>
                      <TableCell>
                        {/* {format(new Date(feedback.createdAt), 'MMM d, yyyy')} */}
                      </TableCell>
                      <TableCell>
                        <Typography noWrap sx={{ maxWidth: 300 }}>
                          {feedback.comments || 'No comments'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <IconButton>
                          {expandedFeedback === feedback._id ? (
                            <ExpandLessIcon />
                          ) : (
                            <ExpandMoreIcon />
                          )}
                        </IconButton>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell style={{ padding: 0 }} colSpan={6}>
                        <Collapse in={expandedFeedback === feedback._id} timeout="auto" unmountOnExit>
                          <Box p={3} bgcolor="action.hover">
                            <Grid container spacing={3}>
                              <Grid item xs={12} md={6}>
                                <Typography variant="subtitle2" gutterBottom>
                                  Detailed Ratings
                                </Typography>
                                <Box>
                                  {ratingCategories.map((category) => (
                                    feedback[category.id] && (
                                      <Box key={category.id} display="flex" alignItems="center" mb={1}>
                                        <RatingLabel>{category.label}:</RatingLabel>
                                        <Rating 
                                          value={feedback[category.id]} 
                                          readOnly 
                                          size="small"
                                          icon={<StarIcon fontSize="inherit" />}
                                          emptyIcon={<StarBorderIcon fontSize="inherit" />}
                                        />
                                        <Typography variant="body2" color="textSecondary" sx={{ ml: 1 }}>
                                          ({feedback[category.id].toFixed(1)})
                                        </Typography>
                                      </Box>
                                    )
                                  ))}
                                </Box>
                              </Grid>
                              <Grid item xs={12} md={6}>
                                {feedback.mostEnjoyed && (
                                  <Box mb={2}>
                                    <Typography variant="subtitle2" gutterBottom>
                                      Most Enjoyed
                                    </Typography>
                                    <Typography variant="body2">
                                      {feedback.mostEnjoyed}
                                    </Typography>
                                  </Box>
                                )}
                                {feedback.improvements && (
                                  <Box mb={2}>
                                    <Typography variant="subtitle2" gutterBottom>
                                      Suggested Improvements
                                    </Typography>
                                    <Typography variant="body2">
                                      {feedback.improvements}
                                    </Typography>
                                  </Box>
                                )}
                                {feedback.otherComments && (
                                  <Box>
                                    <Typography variant="subtitle2" gutterBottom>
                                      Additional Comments
                                    </Typography>
                                    <Typography variant="body2">
                                      {feedback.otherComments}
                                    </Typography>
                                  </Box>
                                )}
                              </Grid>
                            </Grid>
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                  <Typography variant="subtitle1" color="textSecondary">
                    No feedback found matching your criteria
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredFeedback.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
    </Box>
  );
};

export default FeedbackDashboard;

import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  Paper,
  Divider,
  useTheme,
  alpha,
  Grid
} from '@mui/material';
import Header from '../Header';
// import Footer from '../Footer';
import NewFeedbackFormDialog from './NewFeedbackFormDialog';
import RateReviewIcon from '@mui/icons-material/RateReview';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { Helmet } from 'react-helmet-async';
import feedBackIllustration from '../../assets/images/feedback-illustration.jpg'

const events = [
  {
    id: "RFH She Run 2025",
    name: "RFH She Run 2025",
    description: "The premier women's running event organized by Rupee For Humanity in Cubbon Park, Bengaluru.",
    date: "May 25, 2025"
  },
  {
    id: "RFH Juniors Run 2025",
    name: "RFH Juniors Run 2025",
    description: "A special running event for children organized by Rupee For Humanity in Cubbon Park, Bengaluru.",
    date: "May 25, 2025"
  }
];

const FeedbackPage = () => {
  const theme = useTheme();
  const [selectedEvent, setSelectedEvent] = useState('');
  const [openFeedbackDialog, setOpenFeedbackDialog] = useState(false);
  const [currentEventId, setCurrentEventId] = useState('');
  const [currentEventName, setCurrentEventName] = useState('');

  const handleEventChange = (event) => {
    setSelectedEvent(event.target.value);
  };

  const handleOpenFeedback = () => {
    const event = events.find(e => e.id === selectedEvent);
    if (event) {
      setCurrentEventId(event.id);
      setCurrentEventName(event.name);
      setOpenFeedbackDialog(true);
    }
  };

  const handleCloseFeedback = () => {
    setOpenFeedbackDialog(false);
  };

  return (
    <>
      <Helmet>
        <title>Event Feedback | RFH Run 2025</title>
        <meta name="description" content="Share your feedback about RFH She Run 2025 and RFH Juniors Run 2025 events." />
      </Helmet>
      <Header />
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Paper 
          elevation={3} 
          sx={{ 
            p: { xs: 3, md: 5 }, 
            borderRadius: 2,
            background: `linear-gradient(145deg, ${theme.palette.background.paper} 0%, ${alpha(theme.palette.primary.light, 0.05)} 100%)`,
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 5 }}>
            <Typography 
              variant="h3" 
              component="h1" 
              gutterBottom
              sx={{
                fontWeight: 700,
                color: theme.palette.primary.main,
                mb: 2
              }}
            >
              Event Feedback
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 700, mx: 'auto' }}>
              Your feedback helps us improve future events. Thank you for taking the time to share your thoughts!
            </Typography>
          </Box>

          <Divider sx={{ mb: 5 }} />

          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 4 }}>
                <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                  <EmojiEventsIcon sx={{ mr: 1 }} /> Select Your Event
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  Please select the event you participated in and would like to provide feedback for:
                </Typography>

                <FormControl component="fieldset" sx={{ mt: 2 }}>
                  <RadioGroup
                    aria-label="event-selection"
                    name="event-selection"
                    value={selectedEvent}
                    onChange={handleEventChange}
                  >
                    {events.map((event) => (
                      <Card 
                        key={event.id} 
                        variant="outlined" 
                        sx={{ 
                          mb: 2, 
                          borderColor: selectedEvent === event.id ? theme.palette.primary.main : 'divider',
                          borderWidth: selectedEvent === event.id ? 2 : 1,
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            borderColor: theme.palette.primary.light,
                            boxShadow: 2
                          }
                        }}
                      >
                        <CardContent sx={{ p: 2 }}>
                          <FormControlLabel 
                            value={event.id} 
                            control={<Radio />} 
                            label={
                              <Box>
                                <Typography variant="h6" component="div">{event.name}</Typography>
                                <Typography variant="body2" color="text.secondary">{event.description}</Typography>
                                <Typography variant="caption" color="primary">Event Date: {event.date}</Typography>
                              </Box>
                            }
                            sx={{ width: '100%', m: 0 }}
                          />
                        </CardContent>
                      </Card>
                    ))}
                  </RadioGroup>
                </FormControl>
              </Box>

              <Box sx={{ mt: 4, textAlign: 'center' }}>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  disabled={!selectedEvent}
                  onClick={handleOpenFeedback}
                  startIcon={<RateReviewIcon />}
                  sx={{
                    px: 4,
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600,
                    letterSpacing: 0.5,
                    boxShadow: `0 4px 14px ${alpha(theme.palette.primary.main, 0.3)}`,
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: `0 6px 20px ${alpha(theme.palette.primary.main, 0.4)}`,
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  Provide Feedback
                </Button>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  justifyContent: 'center',
                  alignItems: 'center',
                  p: 3,
                  backgroundColor: alpha(theme.palette.primary.light, 0.05),
                  borderRadius: 2
                }}
              >
                <Box 
                  component="img" 
                  src={feedBackIllustration} 
                  alt="Feedback Illustration"
                  sx={{ 
                    width: '80%', 
                    maxWidth: 300,
                    mb: 3,
                    display: { xs: 'none', md: 'block' }
                  }}
                />
                <Typography variant="h5" component="h3" gutterBottom sx={{ fontWeight: 600, textAlign: 'center' }}>
                  Why Your Feedback Matters
                </Typography>
                <Typography variant="body1" paragraph sx={{ textAlign: 'center' }}>
                  Your insights help us create better experiences for future events. We value your honest opinions about what worked well and what could be improved.
                </Typography>
                <Box sx={{ 
                  p: 2, 
                  borderRadius: 1, 
                  bgcolor: alpha(theme.palette.success.main, 0.1),
                  border: `1px solid ${alpha(theme.palette.success.main, 0.3)}`,
                  width: '100%'
                }}>
                  <Typography variant="body2" sx={{ fontStyle: 'italic', textAlign: 'center' }}>
                    "Your feedback directly influences how we organize our future events. Thank you for helping us improve!"
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Container>

      <NewFeedbackFormDialog
        open={openFeedbackDialog}
        onClose={handleCloseFeedback}
        eventId={currentEventId}
        eventName={currentEventName}
      />
      
      {/* <Footer /> */}
    </>
  );
};

export default FeedbackPage;

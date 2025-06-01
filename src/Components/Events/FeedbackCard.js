import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  Box, 
  CardMedia, 
  CardActionArea,
  useTheme,
  alpha
} from '@mui/material';
import NewFeedbackFormDialog from './NewFeedbackFormDialog';
import RateReviewIcon from '@mui/icons-material/RateReview';
import { keyframes } from '@emotion/react';

// Animation for the pulse effect
const pulse = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(25, 118, 210, 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(25, 118, 210, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(25, 118, 210, 0);
  }
`;

const FeedbackCard = ({ eventId, eventName }) => {
  const [open, setOpen] = useState(false);
  const [elevation, setElevation] = useState(3);
  const theme = useTheme();

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Card 
      sx={{
        maxWidth: 400,
        margin: '20px auto',
        borderRadius: 2,
        overflow: 'visible',
        position: 'relative',
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: theme.shadows[8],
        },
        animation: `${pulse} 2s infinite`,
      }}
      elevation={elevation}
      onMouseEnter={() => setElevation(6)}
      onMouseLeave={() => setElevation(3)}
    >
      <Box
        sx={{
          position: 'absolute',
          top: -24,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 60,
          height: 60,
          borderRadius: '50%',
          backgroundColor: theme.palette.primary.main,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: 3,
          color: 'white',
        }}
      >
        <RateReviewIcon fontSize="large" />
      </Box>
      
      <CardContent sx={{ 
        pt: 5,
        pb: 3,
        px: 3,
        background: `linear-gradient(145deg, ${theme.palette.background.paper} 0%, ${alpha(theme.palette.primary.light, 0.05)} 100%)`,
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8,
      }}>
        <Typography 
          variant="h5" 
          component="div" 
          gutterBottom 
          sx={{
            fontWeight: 600,
            color: theme.palette.primary.dark,
            textAlign: 'center',
            mb: 2,
            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Share Your Experience
        </Typography>
        
        <Typography 
          variant="body1" 
          color="text.secondary" 
          sx={{ 
            mb: 3,
            textAlign: 'center',
            lineHeight: 1.6,
          }}
        >
          We value your feedback about {eventName}. Help us make our next event even better by sharing your thoughts!
        </Typography>
        
        <Box sx={{ textAlign: 'center' }}>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleOpen}
            size="large"
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
            Share Feedback
          </Button>
        </Box>
      </CardContent>
      
      <NewFeedbackFormDialog 
        open={open} 
        onClose={handleClose} 
        eventId={eventId} 
        eventName={eventName} 
      />
    </Card>
  );
};

export default FeedbackCard;

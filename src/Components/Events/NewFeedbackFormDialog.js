import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Rating,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormHelperText,
  Alert,
  Snackbar,
  Box,
  Divider,
  Stepper,
  Step,
  StepLabel,
  Paper,
  IconButton,
  Collapse,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

// Custom styled components
const StyledRating = styled(Rating)(({ theme }) => ({
  '& .MuiRating-iconFilled': {
    color: theme.palette.primary.main,
  },
  '& .MuiRating-iconHover': {
    color: theme.palette.primary.light,
  },
  '& .MuiRating-icon': {
    margin: theme.spacing(0, 0.5),
  },
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[1],
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  color: theme.palette.primary.main,
  fontWeight: 600,
}));

const steps = ['Your Information', 'Event Experience', 'Event Logistics', 'Impact & Feedback'];

// Form validation schema
const feedbackSchema = yup.object().shape({
  // Personal Information
  name: yup.string().required('Name is required').min(2, 'Name must be at least 2 characters'),
  email: yup.string().email('Please enter a valid email').required('Email is required'),
  phone: yup
    .string()
    .required('Phone number is required')
    .matches(/^[0-9]{10}$/, 'Please enter a valid 10-digit phone number'),
  
  // Overall Experience
  overallRating: yup.number().required('Please rate your overall experience').min(1, 'Rating is required'),
  recommendLikelihood: yup.number().required('Please rate how likely you are to recommend').min(1, 'Rating is required'),
  futureParticipationLikelihood: yup.number().required('Please rate your likelihood of future participation').min(1, 'Rating is required'),
  
  // Event Logistics
  registrationCheckin: yup.number().required('Please rate registration & check-in').min(1, 'Rating is required'),
  venue: yup.number().required('Please rate the venue').min(1, 'Rating is required'),
  trackRoute: yup.number().required('Please rate the track/route').min(1, 'Rating is required'),
  kitDistribution: yup.number().required('Please rate kit distribution').min(1, 'Rating is required'),
  onCourseSupport: yup.number().required('Please rate on-track support').min(1, 'Rating is required'),
  medalCertificateDistribution: yup.number().required('Please rate medal and certificate distribution').min(1, 'Rating is required'),
  breakfastDistribution: yup.number().required('Please rate breakfast distribution and taste').min(1, 'Rating is required'),
  eventCommunication: yup.number().required('Please rate event communication').min(1, 'Rating is required'),
  
  // Impact & Engagement
  awarenessIncreased: yup.string().required('This field is required'),
  motivation: yup
    .string()
    .oneOf(
      [
        'To run in Cubbon Park',
        'Supporting the cause',
        'Health & fitness',
        'Community involvement',
        'Other'
      ],
      'Please select a valid option'
    )
    .required('Please select your primary motivation'),
  motivationOther: yup.string().when('motivation', {
    is: 'Other',
    then: yup.string().required('Please specify your motivation'),
  }),
  interestedInFutureSupport: yup.string().required('This field is required'),
  
  // Open-ended
  mostEnjoyed: yup.string(),
  improvements: yup.string(),
  otherComments: yup.string(),
});

const FeedbackFormDialog = ({ open, onClose, eventId, eventName }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [activeStep, setActiveStep] = useState(0);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    personalInfo: true,
    overallExperience: false,
    eventLogistics: false,
    impactEngagement: false,
    openFeedback: false,
  });

  const [showSuccess, setShowSuccess] = useState(false)

  // Initialize form with react-hook-form
  const {
    control,
    handleSubmit,
    formState: { errors },
    trigger,
    watch,
    reset,
    setValue,
  } = useForm({
    resolver: yupResolver(feedbackSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      overallRating: 0,
      recommendLikelihood: 0,
      futureParticipationLikelihood: 0,
      registrationCheckin: 0,
      venue: 0,
      trackRoute: 0,
      kitDistribution: 0,
      onCourseSupport: 0,
      medalCertificateDistribution: 0,
      breakfastDistribution: 0,
      eventCommunication: 0,
      awarenessIncreased: '',
      motivation: '',
      motivationOther: '',
      interestedInFutureSupport: '',
      mostEnjoyed: '',
      improvements: '',
      otherComments: '',
    },
  });

  // Watch motivation to conditionally show/hide other field
  const motivation = watch('motivation');

  // Reset form when dialog is opened/closed
  useEffect(() => {
    if (!open) {
      reset();
      setActiveStep(0);
      setExpandedSections({
        personalInfo: true,
        overallExperience: false,
        eventLogistics: false,
        impactEngagement: false,
        openFeedback: false,
      });
    }
  }, [open, reset]);

  const handleNext = async () => {
    console.log('handleNext called with activeStep:', activeStep);
    // Define all fields that need validation for each step
    const stepValidations = {
      0: ['name', 'email', 'phone'], // Personal Info
      1: ['overallRating', 'recommendLikelihood', 'futureParticipationLikelihood'], // Overall Experience
      2: [ // Event Logistics
        'registrationCheckin', 'venue', 'trackRoute', 
        'kitDistribution', 'onCourseSupport', 'medalCertificateDistribution', 
        'breakfastDistribution', 'eventCommunication'
      ],
      3: ['awarenessIncreased', 'motivation', 'interestedInFutureSupport'] // Impact & Engagement
    };

    // Get fields to validate for current step
    let fieldsToValidate = stepValidations[activeStep] || [];
    
    // Add conditional fields if needed
    if (activeStep === 3 && motivation === 'Other') {
      fieldsToValidate.push('motivationOther');
    }

    // Validate the current step
    console.log('Validating fields:', fieldsToValidate);
    const isValid = await trigger(fieldsToValidate);
    console.log('Validation result:', isValid, 'Errors:', errors);
    
    if (isValid) {
      console.log('Validation passed, proceeding to next step or submit');
      if (activeStep < steps.length - 1) {
        setActiveStep((prevStep) => prevStep + 1);
        // Expand the next section when moving forward
        const nextSection = ['personalInfo', 'overallExperience', 'eventLogistics', 'impactEngagement', 'openFeedback'][activeStep + 1];
        if (nextSection) {
          setExpandedSections(prev => ({
            ...prev,
            [nextSection]: true
          }));
        }
      } else {
        // If it's the last step, validate all fields and submit
        console.log('Validating all fields before submission');
        const allFieldsValid = await trigger();
        console.log('All fields validation result:', allFieldsValid, 'Current errors:', errors);
        if (allFieldsValid) {
          console.log('All fields valid, proceeding with submission');
          await handleSubmit(onSubmit)();
        } else {
          // Scroll to the first error
          const firstError = Object.keys(errors)[0];
          if (firstError) {
            document.getElementById(firstError)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }
      }
    } else {
      // Scroll to the first error
      const firstError = Object.keys(errors)[0];
      if (firstError) {
        document.getElementById(firstError)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleRatingChange = (field, value) => {
    const numValue = Number(value);
    console.log(`Setting ${field} to:`, { value, numValue, type: typeof numValue });
    setValue(field, numValue, { shouldValidate: true });
    trigger(field);
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleSectionClick = (section, stepIndex) => {
    // Only allow going to a previous section
    if (stepIndex < activeStep) {
      setActiveStep(stepIndex);
      toggleSection(section);
    }
  };

  const onSubmit = async (data) => {
    console.log('Form submission started with data:', data);
    setIsSubmitting(true);
    
    try {
      // Ensure all ratings are valid numbers between 1-5
      const ratings = [
        'overallRating',
        'recommendLikelihood',
        'futureParticipationLikelihood',
        'registrationCheckin',
        'venue',
        'trackRoute',
        'kitDistribution',
        'onCourseSupport',
        'medalCertificateDistribution',
        'breakfastDistribution',
        'eventCommunication'
      ];
      
      console.log('Checking ratings:', ratings.map(rating => ({
        field: rating,
        value: data[rating],
        type: typeof data[rating]
      })));

      // Validate all ratings are between 1-5
      const invalidRatings = ratings.filter(rating => {
        const value = data[rating];
        return value === undefined || value === null || value < 1 || value > 5;
      });

      if (invalidRatings.length > 0) {
        throw new Error('Please provide a rating between 1-5 for all required fields');
      }

      // Prepare the submission data
      const submissionData = {
        ...data,
        eventId,
        eventName,
        // Ensure all ratings are numbers
        ...Object.fromEntries(
          ratings.map(key => [key, Number(data[key])])
        )
      };

      const response = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      });

      const responseData = await response.json();

      if (!response.ok) {
        // If there are validation errors from the server, show them
        if (responseData.errors && Array.isArray(responseData.errors)) {
          const errorMessages = responseData.errors.map(err => err.message || 'Validation error');
          throw new Error(errorMessages.join('\n'));
        }
        throw new Error(responseData.message || 'Failed to submit feedback');
      }

      // Show success message
      setSnackbarMessage('Thank you for your valuable feedback!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      setShowSuccess(true)
      
      
      // Close the dialog after a short delay
      // setTimeout(() => {
      //   onClose();
      // }, 1500);
      
    } catch (error) {
      console.error('Error submitting feedback:', error);
      setSnackbarMessage(error.message || 'Failed to submit feedback. Please try again.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      
      // Scroll to the first error field if possible
      setTimeout(() => {
        const firstError = error.message.includes('rating') ? 'registrationCheckin' : null;
        if (firstError) {
          const element = document.getElementById(firstError);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }
      }, 100);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  // Rating labels
  const ratingLabels = {
    1: 'Poor',
    2: 'Fair',
    3: 'Good',
    4: 'Very Good',
    5: 'Excellent',
  };

  // Likelihood labels
  const likelihoodLabels = {
    1: 'Not at all likely',
    2: 'Slightly likely',
    3: 'Moderately likely',
    4: 'Very likely',
    5: 'Extremely likely',
  };

  return (
    <>
      <Dialog 
        open={open} 
        onClose={onClose} 
        maxWidth="md" 
        fullWidth
        fullScreen={isMobile}
        scroll="paper"
        aria-labelledby="feedback-dialog-title"
      >
        <DialogTitle id="feedback-dialog-title" sx={{ borderBottom: '1px solid', borderColor: 'divider', pb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h6" component="div">Event Feedback</Typography>
            <Typography variant="subtitle2" color="text.secondary">{eventName}</Typography>
          </Box>
          <IconButton edge="end" onClick={onClose} aria-label="close">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        
        <DialogContent dividers>
          {!isMobile && (
            <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
              {steps.map((label, index) => (
                <Step key={label} onClick={() => handleSectionClick(Object.keys(expandedSections)[index], index)} sx={{ cursor: index < activeStep ? 'pointer' : 'default' }}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          )}
          {!showSuccess ? (
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Step 1: Personal Information */}
            {activeStep === 0 && (
            <StyledPaper elevation={0}>
              <Box 
                onClick={() => toggleSection('personalInfo')} 
                sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  cursor: 'pointer',
                  mb: expandedSections.personalInfo ? 2 : 0
                }}
              >
                <SectionTitle variant="h6">
                  {activeStep >= 0 && <CheckCircleIcon color="primary" sx={{ mr: 1, verticalAlign: 'middle', fontSize: '1.2rem' }} />}
                  Your Information
                </SectionTitle>
                <Typography variant="body2" color="primary">
                  {expandedSections.personalInfo ? 'Hide' : 'Show'}
                </Typography>
              </Box>
              
              <Collapse in={expandedSections.personalInfo}>
                <Typography variant="body2" color="text.secondary" paragraph>
                  We'd love to know who you are. This information helps us improve our events.
                </Typography>
                
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2, mb: 2 }}>
                  <Controller
                    name="name"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        id="name"
                        label="Full Name"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        error={!!errors.name}
                        helperText={errors.name?.message}
                        required
                      />
                    )}
                  />
                  
                  <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        id="email"
                        label="Email Address"
                        type="email"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        error={!!errors.email}
                        helperText={errors.email?.message}
                        required
                      />
                    )}
                  />
                  
                  <Controller
                    name="phone"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        id="phone"
                        label="Phone Number"
                        type="tel"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        error={!!errors.phone}
                        helperText={errors.phone?.message || '10-digit number without spaces or special characters'}
                        required
                        inputProps={{
                          inputMode: 'numeric',
                          pattern: '[0-9]*',
                          maxLength: 10,
                        }}
                      />
                    )}
                  />
                </Box>
              </Collapse>
            </StyledPaper>
            )}
            {/* Step 2: Overall Experience */}
            {activeStep === 1 && (
            <StyledPaper elevation={0}>
              <Box 
                onClick={() => toggleSection('overallExperience')} 
                sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  cursor: 'pointer',
                  mb: expandedSections.overallExperience ? 2 : 0
                }}
              >
                <SectionTitle variant="h6">
                  {activeStep > 1 && <CheckCircleIcon color="primary" sx={{ mr: 1, verticalAlign: 'middle', fontSize: '1.2rem' }} />}
                  Overall Experience
                </SectionTitle>
                <Typography variant="body2" color="primary">
                  {expandedSections.overallExperience ? 'Hide' : 'Show'}
                </Typography>
              </Box>
              
              <Collapse in={expandedSections.overallExperience}>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Rate your overall experience with the event.
                </Typography>
                
                <Box sx={{ mb: 4 }}>
                  <FormControl component="fieldset" fullWidth error={!!errors.overallRating}>
                    <FormLabel component="legend" required>How would you rate your overall experience?</FormLabel>
                    <Controller
                      name="overallRating"
                      control={control}
                      render={({ field: { onChange, value } }) => (
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', my: 2 }}>
                          <StyledRating
                            name="overallRating"
                            value={Number(value) || 0}
                            onChange={(event, newValue) => {
                              handleRatingChange('overallRating', newValue);
                              onChange(Number(newValue));
                            }}
                            precision={1}
                            size="large"
                          />
                          {value > 0 && (
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                              {ratingLabels[value]}
                            </Typography>
                          )}
                        </Box>
                      )}
                    />
                    {errors.overallRating && (
                      <FormHelperText error>{errors.overallRating.message}</FormHelperText>
                    )}
                  </FormControl>
                </Box>
                
                <Box sx={{ mb: 4 }}>
                  <FormControl component="fieldset" fullWidth error={!!errors.recommendLikelihood}>
                    <FormLabel component="legend" required>How likely are you to recommend this event to others?</FormLabel>
                    <Controller
                      name="recommendLikelihood"
                      control={control}
                      render={({ field: { onChange, value } }) => (
                        <Box sx={{ my: 2 }}>
                          <StyledRating
                            name="recommendLikelihood"
                            value={Number(value) || 0}
                            onChange={(event, newValue) => {
                              handleRatingChange('recommendLikelihood', newValue);
                              onChange(Number(newValue));
                            }}
                            precision={1}
                            size="large"
                          />
                          {value > 0 && (
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                              {likelihoodLabels[value]}
                            </Typography>
                          )}
                        </Box>
                      )}
                    />
                    {errors.recommendLikelihood && (
                      <FormHelperText error>{errors.recommendLikelihood.message}</FormHelperText>
                    )}
                  </FormControl>
                </Box>
                
                <Box sx={{ mb: 4 }}>
                  <FormControl component="fieldset" fullWidth error={!!errors.futureParticipationLikelihood}>
                    <FormLabel component="legend" required>How likely are you to participate in our future events?</FormLabel>
                    <Controller
                      name="futureParticipationLikelihood"
                      control={control}
                      render={({ field: { onChange, value } }) => (
                        <Box sx={{ my: 2 }}>
                          <StyledRating
                            name="futureParticipationLikelihood"
                            value={Number(value) || 0}
                            onChange={(event, newValue) => {
                              handleRatingChange('futureParticipationLikelihood', newValue);
                              onChange(Number(newValue));
                            }}
                            precision={1}
                            size="large"
                          />
                          {value > 0 && (
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                              {likelihoodLabels[value]}
                            </Typography>
                          )}
                        </Box>
                      )}
                    />
                    {errors.futureParticipationLikelihood && (
                      <FormHelperText error>{errors.futureParticipationLikelihood.message}</FormHelperText>
                    )}
                  </FormControl>
                </Box>
              </Collapse>
            </StyledPaper>
            )}
            {/* Step 3: Event Logistics */}
            {activeStep === 2 && (
            <StyledPaper elevation={0}>
              <Box 
                onClick={() => toggleSection('eventLogistics')} 
                sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  cursor: 'pointer',
                  mb: expandedSections.eventLogistics ? 2 : 0
                }}
              >
                <SectionTitle variant="h6">
                  {activeStep > 2 && <CheckCircleIcon color="primary" sx={{ mr: 1, verticalAlign: 'middle', fontSize: '1.2rem' }} />}
                  Event Logistics
                </SectionTitle>
                <Typography variant="body2" color="primary">
                  {expandedSections.eventLogistics ? 'Hide' : 'Show'}
                </Typography>
              </Box>
              
              <Collapse in={expandedSections.eventLogistics}>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Please rate the following aspects of the event logistics.
                </Typography>
                
                {[
                  { name: 'registrationCheckin', label: 'Registration & Check-in' },
                  { name: 'venue', label: 'Venue' },
                  { name: 'trackRoute', label: 'Track/Route' },
                  { name: 'kitDistribution', label: 'Kit Distribution' },
                  { name: 'onCourseSupport', label: 'On-track Support' },
                  { name: 'medalCertificateDistribution', label: 'Medal and Certificate Distribution' },
                  { name: 'breakfastDistribution', label: 'Breakfast Distribution and Taste' },
                  { name: 'eventCommunication', label: 'Event Communication' },
                ].map(({ name, label }) => (
                  <Box key={name} sx={{ mb: 4 }}>
                    <FormControl component="fieldset" fullWidth error={!!errors[name]}>
                      <FormLabel component="legend" required>{label}</FormLabel>
                      <Controller
                        name={name}
                        control={control}
                        render={({ field: { onChange, value } }) => (
                          <Box sx={{ my: 2 }}>
                            <StyledRating
                              name={name}
                              value={Number(value) || 0}
                              onChange={(event, newValue) => {
                                handleRatingChange(name, newValue);
                                onChange(Number(newValue));
                              }}
                              precision={1}
                              size="large"
                            />
                            {value > 0 && (
                              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                {ratingLabels[value]}
                              </Typography>
                            )}
                          </Box>
                        )}
                      />
                      {errors[name] && (
                        <FormHelperText error>{errors[name].message}</FormHelperText>
                      )}
                    </FormControl>
                  </Box>
                ))}
              </Collapse>
            </StyledPaper>
            )}
            {/* Step 4: Impact & Engagement */}
            {activeStep === 3 && (
            <StyledPaper elevation={0}>
              <Box 
                onClick={() => toggleSection('impactEngagement')} 
                sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  cursor: 'pointer',
                  mb: expandedSections.impactEngagement ? 2 : 0
                }}
              >
                <SectionTitle variant="h6">
                  {activeStep > 3 && <CheckCircleIcon color="primary" sx={{ mr: 1, verticalAlign: 'middle', fontSize: '1.2rem' }} />}
                  Impact & Engagement
                </SectionTitle>
                <Typography variant="body2" color="primary">
                  {expandedSections.impactEngagement ? 'Hide' : 'Show'}
                </Typography>
              </Box>
              
              <Collapse in={expandedSections.impactEngagement}>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Help us understand the impact of this event.
                </Typography>
                
                <Box sx={{ mb: 4 }}>
                  <FormControl component="fieldset" fullWidth error={!!errors.awarenessIncreased}>
                    <FormLabel component="legend" required>Did this event increase your awareness about the cause?</FormLabel>
                    <Controller
                      name="awarenessIncreased"
                      control={control}
                      render={({ field }) => (
                        <RadioGroup {...field} row>
                          <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                          <FormControlLabel value="Somewhat" control={<Radio />} label="Somewhat" />
                          <FormControlLabel value="No" control={<Radio />} label="No" />
                        </RadioGroup>
                      )}
                    />
                    {errors.awarenessIncreased && (
                      <FormHelperText error>{errors.awarenessIncreased.message}</FormHelperText>
                    )}
                  </FormControl>
                </Box>
                
                <Box sx={{ mb: 4 }}>
                  <FormControl component="fieldset" fullWidth error={!!errors.motivation}>
                    <FormLabel component="legend" required>What was your primary motivation for participating?</FormLabel>
                    <Controller
                      name="motivation"
                      control={control}
                      render={({ field }) => (
                        <RadioGroup {...field}>
                          <FormControlLabel value="To run in Cubbon Park" control={<Radio />} label="To run in Cubbon Park" />
                          <FormControlLabel value="Supporting the cause" control={<Radio />} label="Supporting the cause" />
                          <FormControlLabel value="Health & fitness" control={<Radio />} label="Health & fitness" />
                          <FormControlLabel value="Community involvement" control={<Radio />} label="Community involvement" />
                          <FormControlLabel value="Other" control={<Radio />} label="Other" />
                        </RadioGroup>
                      )}
                    />
                    {motivation === 'Other' && (
                      <Controller
                        name="motivationOther"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            variant="outlined"
                            margin="normal"
                            label="Please specify"
                            error={!!errors.motivationOther}
                            helperText={errors.motivationOther?.message}
                          />
                        )}
                      />
                    )}
                    {errors.motivation && (
                      <FormHelperText error>{errors.motivation.message}</FormHelperText>
                    )}
                  </FormControl>
                </Box>
                
                <Box sx={{ mb: 4 }}>
                  <FormControl component="fieldset" fullWidth error={!!errors.interestedInFutureSupport}>
                    <FormLabel component="legend" required>Would you be interested in supporting or participating in future events?</FormLabel>
                    <Controller
                      name="interestedInFutureSupport"
                      control={control}
                      render={({ field }) => (
                        <RadioGroup {...field} row>
                          <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                          <FormControlLabel value="Maybe" control={<Radio />} label="Maybe" />
                          <FormControlLabel value="No" control={<Radio />} label="No" />
                        </RadioGroup>
                      )}
                    />
                    {errors.interestedInFutureSupport && (
                      <FormHelperText error>{errors.interestedInFutureSupport.message}</FormHelperText>
                    )}
                  </FormControl>
                </Box>
                
                <Box sx={{ mb: 4 }}>
                  <FormLabel component="legend">What did you enjoy most about the event? (Optional)</FormLabel>
                  <Controller
                    name="mostEnjoyed"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        multiline
                        rows={3}
                        variant="outlined"
                        margin="normal"
                      />
                    )}
                  />
                </Box>
                
                <Box sx={{ mb: 4 }}>
                  <FormLabel component="legend">What could be improved for future events? (Optional)</FormLabel>
                  <Controller
                    name="improvements"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        multiline
                        rows={3}
                        variant="outlined"
                        margin="normal"
                      />
                    )}
                  />
                </Box>
                
                <Box>
                  <FormLabel component="legend">Any other comments or suggestions? (Optional)</FormLabel>
                  <Controller
                    name="otherComments"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        multiline
                        rows={3}
                        variant="outlined"
                        margin="normal"
                      />
                    )}
                  />
                </Box>
              </Collapse>
            </StyledPaper>
            )}
          </form>
          ) : (
            <Box sx={{ textAlign: 'center', py: 2 }}>
              <CheckCircleIcon color="success" sx={{ fontSize: 48, mb: 2 }} />
              <Typography variant="h6" component="div" gutterBottom>Thank you for your valuable feedback!</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                We truly appreciate you taking the time to share your thoughts about the {eventName}. 
                Your insights will help us improve future events and better serve our community.
              </Typography>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={onClose}
                startIcon={<CloseIcon />}
                sx={{ mt: 1 }}
              >
                Close
              </Button>
            </Box>
          )}
        </DialogContent>
        
        <DialogActions sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
          <Button 
            onClick={activeStep === 0 ? onClose : handleBack}
            disabled={isSubmitting}
          >
            {activeStep === 0 ? 'Cancel' : 'Back'}
          </Button>
          
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleNext}
            disabled={isSubmitting}
          >
            {activeStep === steps.length - 1 ? 'Submit Feedback' : 'Next'}
            {isSubmitting && '...'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbarSeverity} 
          sx={{ width: '100%' }}
          variant="filled"
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default FeedbackFormDialog;

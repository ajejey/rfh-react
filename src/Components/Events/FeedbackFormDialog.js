// import React, { useState } from 'react';
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   Typography,
//   RadioGroup,
//   FormControlLabel,
//   Radio,
//   TextField,
//   Rating,
//   Box,
//   MenuItem,
//   Select,
//   FormControl,
//   InputLabel,
//   Snackbar,
// } from '@mui/material';
// import MuiAlert from '@mui/material/Alert';

// const Alert = React.forwardRef(function Alert(props, ref) {
//   return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
// });

// const FeedbackFormDialog = ({ open, handleClose, eventId }) => {
//   const [formData, setFormData] = useState({
//     overallRating: 0,
//     recommendLikelihood: 0,
//     futureParticipationLikelihood: 0,
//     registrationCheckin: 0,
//     venue: 0,
//     trackRoute: 0,
//     kitDistribution: 0,
//     onCourseSupport: 0,
//     medalCertificateDistribution: 0,
//     breakfastDistribution: 0,
//     eventCommunication: 0,
//     awarenessIncreased: '',
//     motivation: '',
//     motivationOther: '',
//     interestedInFutureSupport: '',
//     mostEnjoyed: '',
//     improvements: '',
//     otherComments: '',
//   });

//   const [snackbarOpen, setSnackbarOpen] = useState(false);
//   const [snackbarMessage, setSnackbarMessage] = useState('');
//   const [snackbarSeverity, setSnackbarSeverity] = useState('success');

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//   };

//   const handleRatingChange = (name) => (event, newValue) => {
//     setFormData((prevData) => ({
//       ...prevData,
//       [name]: newValue,
//     }));
//   };

//   const handleSubmit = async () => {
//     try {
//       const response = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/feedback`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ ...formData, eventId }),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         setSnackbarMessage(data.message);
//         setSnackbarSeverity('success');
//         setSnackbarOpen(true);
//         handleClose();
//         // Optionally reset form
//         setFormData({
//           overallRating: 0,
//           recommendLikelihood: 0,
//           futureParticipationLikelihood: 0,
//           registrationCheckin: 0,
//           venue: 0,
//           trackRoute: 0,
//           kitDistribution: 0,
//           onCourseSupport: 0,
//           medalCertificateDistribution: 0,
//           breakfastDistribution: 0,
//           eventCommunication: 0,
//           awarenessIncreased: '',
//           motivation: '',
//           motivationOther: '',
//           interestedInFutureSupport: '',
//           mostEnjoyed: '',
//           improvements: '',
//           otherComments: '',
//         });
//       } else {
//         setSnackbarMessage(data.message || 'Failed to submit feedback.');
//         setSnackbarSeverity('error');
//         setSnackbarOpen(true);
//       }
//     } catch (error) {
//       console.error('Error submitting feedback:', error);
//       setSnackbarMessage('An error occurred while submitting feedback.');
//       setSnackbarSeverity('error');
//       setSnackbarOpen(true);
//     }
//   };

//   const handleSnackbarClose = (event, reason) => {
//     if (reason === 'clickaway') {
//       return;
//     }
//     setSnackbarOpen(false);
//   };

//   const ratingLabels = {
//     1: 'Poor',
//     2: 'Fair',
//     3: 'Good',
//     4: 'Very Good',
//     5: 'Excellent',
//   };

//   return (
//     <>
//       <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
//         <DialogTitle>Event Feedback Form</DialogTitle>
//         <DialogContent dividers>
//           <Typography variant="h6" gutterBottom>
//             Section 1: Overall Experience
//           </Typography>
//           <Box sx={{ mb: 2 }}>
//             <Typography component="legend">
//               Overall, how would you rate your experience at the Run for Kids event?
//             </Typography>
//             <Rating
//               name="overallRating"
//               value={formData.overallRating}
//               onChange={handleRatingChange('overallRating')}
//               getLabelText={(value) => `${value} Star${value !== 1 ? 's' : ''}, ${ratingLabels[value]}`}
//               emptyIcon={<Radio icon={<Radio />} checkedIcon={<Radio />} />}
//             />
//             {formData.overallRating !== null && (
//               <Box sx={{ ml: 2 }}>{ratingLabels[formData.overallRating]}</Box>
//             )}
//           </Box>

//           <Box sx={{ mb: 2 }}>
//             <Typography component="legend">How likely are you to recommend this event to others?</Typography>
//             <Rating
//               name="recommendLikelihood"
//               value={formData.recommendLikelihood}
//               onChange={handleRatingChange('recommendLikelihood')}
//               getLabelText={(value) => `${value} Star${value !== 1 ? 's' : ''}, ${ratingLabels[value]}`}
//               emptyIcon={<Radio icon={<Radio />} checkedIcon={<Radio />} />}
//             />
//             {formData.recommendLikelihood !== null && (
//               <Box sx={{ ml: 2 }}>{ratingLabels[formData.recommendLikelihood]}</Box>
//             )}
//           </Box>

//           <Box sx={{ mb: 4 }}>
//             <Typography component="legend">
//               How likely are you to participate in future events organized by us?
//             </Typography>
//             <Rating
//               name="futureParticipationLikelihood"
//               value={formData.futureParticipationLikelihood}
//               onChange={handleRatingChange('futureParticipationLikelihood')}
//               getLabelText={(value) => `${value} Star${value !== 1 ? 's' : ''}, ${ratingLabels[value]}`}
//               emptyIcon={<Radio icon={<Radio />} checkedIcon={<Radio />} />}
//             />
//             {formData.futureParticipationLikelihood !== null && (
//               <Box sx={{ ml: 2 }}>{ratingLabels[formData.futureParticipationLikelihood]}</Box>
//             )}
//           </Box>

//           <Typography variant="h6" gutterBottom>
//             Section 2: Event Logistics & Elements
//           </Typography>
//           <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
//             (Rate the following on a scale of 1 (Poor) to 5 (Excellent), with an option for "N/A" if not applicable)
//           </Typography>

//           {[{
//             label: 'Registration and Check-in Process',
//             name: 'registrationCheckin'
//           },
//           {
//             label: 'Venue (Location & Accessibility)',
//             name: 'venue'
//           },
//           {
//             label: 'Track Route (Clarity, Safety, Interest)',
//             name: 'trackRoute'
//           },
//           {
//             label: 'Kit Distribution & T-shirt Quality',
//             name: 'kitDistribution'
//           },
//           {
//             label: 'On-Track Support (Hydration, Volunteers, Medical)',
//             name: 'onCourseSupport'
//           },
//           {
//             label: 'Medal and Certificate Distribution',
//             name: 'medalCertificateDistribution'
//           },
//           {
//             label: 'Breakfast Distribution and Taste',
//             name: 'breakfastDistribution'
//           },
//           {
//             label: 'Event Communication (Pre-event information, updates)',
//             name: 'eventCommunication'
//           },
//           ].map((item) => (
//             <Box key={item.name} sx={{ mb: 2 }}>
//               <Typography component="legend">{item.label}</Typography>
//               <Rating
//                 name={item.name}
//                 value={formData[item.name]}
//                 onChange={handleRatingChange(item.name)}
//                 getLabelText={(value) => `${value} Star${value !== 1 ? 's' : ''}, ${ratingLabels[value]}`}
//                 emptyIcon={<Radio icon={<Radio />} checkedIcon={<Radio />} />}
//               />
//               {formData[item.name] !== null && (
//                 <Box sx={{ ml: 2 }}>{ratingLabels[formData[item.name]]}</Box>
//               )}
//             </Box>
//           ))}

//           <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
//             Section 3: Impact & Engagement
//           </Typography>
//           <FormControl component="fieldset" sx={{ mb: 2 }}>
//             <Typography component="legend">
//               Did participating in Run for Kids raise your awareness about our NGO, Rupee for Humanity?
//             </Typography>
//             <RadioGroup
//               row
//               name="awarenessIncreased"
//               value={formData.awarenessIncreased}
//               onChange={handleChange}
//             >
//               <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
//               <FormControlLabel value="No" control={<Radio />} label="No" />
//               <FormControlLabel value="Somewhat" control={<Radio />} label="Somewhat" />
//             </RadioGroup>
//           </FormControl>

//           <FormControl fullWidth sx={{ mb: 2 }}>
//             <InputLabel id="motivation-label">What motivated you to participate in Run for Kids?</InputLabel>
//             <Select
//               labelId="motivation-label"
//               id="motivation"
//               name="motivation"
//               value={formData.motivation}
//               label="What motivated you to participate in Run for Kids?"
//               onChange={handleChange}
//             >
//               <MenuItem value="">
//                 <em>Select primary reason</em>
//               </MenuItem>
//               <MenuItem value="To run in Cubbon Park">To run in Cubbon Park</MenuItem>
//               <MenuItem value="Supporting the cause">Supporting the cause</MenuItem>
//               <MenuItem value="Health & fitness">Health & fitness</MenuItem>
//               <MenuItem value="Community & social aspect">Community & social aspect</MenuItem>
//               <MenuItem value="Fun event">Fun event</MenuItem>
//               <MenuItem value="Other">Other (please specify briefly)</MenuItem>
//             </Select>
//           </FormControl>
//           {formData.motivation === 'Other' && (
//             <TextField
//               fullWidth
//               label="Please specify your motivation"
//               name="motivationOther"
//               value={formData.motivationOther}
//               onChange={handleChange}
//               margin="normal"
//               sx={{ mb: 2 }}
//             />
//           )}

//           <FormControl component="fieldset" sx={{ mb: 4 }}>
//             <Typography component="legend">
//               Would you be interested in supporting Rupee for Humanity in future initiatives?
//             </Typography>
//             <RadioGroup
//               row
//               name="interestedInFutureSupport"
//               value={formData.interestedInFutureSupport}
//               onChange={handleChange}
//             >
//               <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
//               <FormControlLabel value="No" control={<Radio />} label="No" />
//               <FormControlLabel value="Maybe" control={<Radio />} label="Maybe" />
//             </RadioGroup>
//           </FormControl>

//           <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
//             Section 4: Your Voice (Open-Ended)
//           </Typography>
//           <TextField
//             fullWidth
//             label="What did you enjoy most about the event? (Optional)"
//             name="mostEnjoyed"
//             value={formData.mostEnjoyed}
//             onChange={handleChange}
//             margin="normal"
//             multiline
//             rows={3}
//           />
//           <TextField
//             fullWidth
//             label="What one or two things could be done to improve this event in the future? (Optional)"
//             name="improvements"
//             value={formData.improvements}
//             onChange={handleChange}
//             margin="normal"
//             multiline
//             rows={3}
//           />
//           <TextField
//             fullWidth
//             label="Any other comments or suggestions? (Optional)"
//             name="otherComments"
//             value={formData.otherComments}
//             onChange={handleChange}
//             margin="normal"
//             multiline
//             rows={3}
//           />
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleClose}>Cancel</Button>
//           <Button onClick={handleSubmit} variant="contained" color="primary">
//             Submit Feedback
//           </Button>
//         </DialogActions>
//       </Dialog>
//       <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
//         <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
//           {snackbarMessage}
//         </Alert>
//       </Snackbar>
//     </>
//   );
// };

// export default FeedbackFormDialog;

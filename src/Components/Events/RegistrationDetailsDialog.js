import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  Divider,
  Box
} from '@mui/material';

const RegistrationDetailsDialog = ({ open, onClose, eventName }) => {
  const [searchBy, setSearchBy] = useState('email');
  const [searchValue, setSearchValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [registrationData, setRegistrationData] = useState(null);

  const handleSearch = async () => {
    console.log("Search Value", searchValue)
    if (!searchValue.trim()) {
      setError('Please enter a value to search');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const queryParam = searchBy === 'email' 
        ? `email=${encodeURIComponent(searchValue)}` 
        : `phone=${encodeURIComponent(searchValue)}`;
      console.log("Query Param", queryParam)
      
      const response = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/marathons/registration-details?${queryParam}`);
      const data = await response.json();
      console.log("Registration Details Data", data)

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch registration details');
      }

      // Filter registrations for the current event
      const filteredRegistrations = data.registrations.filter(
        reg => reg.marathonName === eventName
      );

      if (filteredRegistrations.length === 0) {
        throw new Error('No registration found for this event');
      }

      setRegistrationData({
        ...data.user,
        registrations: filteredRegistrations
      });
    } catch (err) {
      setError(err.message || 'Failed to fetch registration details');
      setRegistrationData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSearchValue('');
    setError('');
    setRegistrationData(null);
    onClose();
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>Check Your Registration Details</DialogTitle>
      <DialogContent>
        {!registrationData ? (
          <>
            <Typography variant="body1" gutterBottom>
              Enter your {searchBy === 'email' ? 'email address' : 'phone number'} to view your registration details.
            </Typography>
            
            <Box display="flex" gap={2} mb={3}>
              <Button
                variant={searchBy === 'email' ? 'contained' : 'outlined'}
                onClick={() => setSearchBy('email')}
              >
                Search by Email
              </Button>
              <Button
                variant={searchBy === 'phone' ? 'contained' : 'outlined'}
                onClick={() => setSearchBy('phone')}
              >
                Search by Phone
              </Button>
            </Box>

            <TextField
              fullWidth
              variant="outlined"
              label={searchBy === 'email' ? 'Email Address' : 'Phone Number'}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              type={searchBy === 'email' ? 'email' : 'tel'}
              placeholder={searchBy === 'email' ? 'Enter your email' : 'Enter your phone number'}
              disabled={loading}
            />

            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}

            <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
              <Button onClick={handleClose} disabled={loading}>
                Cancel
              </Button>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={handleSearch}
                disabled={loading || !searchValue.trim()}
                startIcon={loading ? <CircularProgress size={20} /> : null}
              >
                {loading ? 'Searching...' : 'Search'}
              </Button>
            </Box>
          </>
        ) : (
          <>
            <Typography variant="h6" gutterBottom>
              Registration Details
            </Typography>
            
            <Box mb={3}>
              <Typography><strong>Name:</strong> {registrationData.fullName}</Typography>
              <Typography><strong>Email:</strong> {registrationData.email}</Typography>
              <Typography><strong>Phone:</strong> {registrationData.mobNo}</Typography>
            </Box>

            <Divider sx={{ my: 2 }} />
            
            <Typography variant="subtitle1" gutterBottom>
              Event Registration
            </Typography>
            
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Receipt No.</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>T-Shirt Size</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {registrationData.registrations.map((reg, index) => (
                    <TableRow key={index}>
                      <TableCell>{reg.merchantTransactionId}</TableCell>
                      <TableCell>{formatDate(reg.date)}</TableCell>
                      <TableCell>{reg.tshirtSize}</TableCell>
                      <TableCell>{reg.category}</TableCell>
                      <TableCell>₹{reg.amount.toFixed(2)}</TableCell>
                      <TableCell>
                        <span style={{
                          color: reg.paymentStatus === 'Success' ? 'green' : 'red',
                          fontWeight: 'bold'
                        }}>
                          {reg.paymentStatus}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Box mt={3}>
              <Typography variant="body2" color="textSecondary">
                If you have any questions about your registration, please contact support.
              </Typography>
            </Box>
          </>
        )}
      </DialogContent>
      
      {registrationData && (
        <DialogActions>
          <Button onClick={() => setRegistrationData(null)} color="primary">
            Back to Search
          </Button>
          <Button onClick={handleClose} color="primary" variant="contained">
            Close
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
};

export default RegistrationDetailsDialog;

import React, { useState } from 'react';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleResetPassword = async () => {
    try {
      const auth = getAuth();
      await sendPasswordResetEmail(auth, email);
      setMessage('Password reset email sent. Please check your inbox.');
    } catch (error) {
      setMessage(error.message);
    }
  };


  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px' }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Forgot Password
      </Typography>
      {message && <Typography color={message.includes('success') ? 'success' : 'error'}>{message}</Typography>}
      <TextField
        type="email"
        label="Email"
        value={email}
        onChange={handleEmailChange}
        variant="outlined"
        margin="normal"
      />
      <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '16px', alignItems: 'center' }}>
        <Button variant="contained" onClick={handleResetPassword}>
        Reset Password
      </Button>
      <Link to="/login">Go back to login</Link>
      </div>
      
    </Box>
  );
};

export default ForgotPassword;
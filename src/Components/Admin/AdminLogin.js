import React, { useState } from 'react';
import {
    Box, Card, TextField, Button, Typography, Alert,
    InputAdornment, IconButton, CircularProgress,
} from '@mui/material';
import { Visibility, VisibilityOff, LockOutlined } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import useAdminAuth from '../../CustomHooks/useAdminAuth';

const BASE_URL = process.env.REACT_APP_BACKEND_BASE_URL;

export default function AdminLogin() {
    const [email, setEmail]           = useState('');
    const [password, setPassword]     = useState('');
    const [showPass, setShowPass]     = useState(false);
    const [error, setError]           = useState('');
    const [loading, setLoading]       = useState(false);
    const { login }                   = useAdminAuth();
    const navigate                    = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res  = await fetch(`${BASE_URL}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const data = await res.json();
            if (!res.ok) { setError(data.message || 'Login failed.'); return; }
            login(data.token, data.user);
            navigate('/admin');
        } catch {
            setError('Unable to connect. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #0c0f1a 0%, #0f2027 50%, #0c0f1a 100%)',
                p: 2,
            }}
        >
            {/* Subtle grid lines decoration */}
            <Box sx={{
                position: 'fixed', inset: 0, pointerEvents: 'none',
                backgroundImage: `
                    linear-gradient(rgba(47,110,73,0.04) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(47,110,73,0.04) 1px, transparent 1px)
                `,
                backgroundSize: '40px 40px',
            }} />

            <Card
                elevation={0}
                sx={{
                    width: '100%', maxWidth: 440,
                    bgcolor: 'rgba(22, 27, 44, 0.95)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    borderRadius: 4,
                    backdropFilter: 'blur(20px)',
                    p: { xs: 3, sm: 5 },
                    position: 'relative',
                    overflow: 'visible',
                }}
            >
                {/* Top accent bar */}
                <Box sx={{
                    position: 'absolute', top: 0, left: '10%', right: '10%',
                    height: '3px',
                    background: 'linear-gradient(90deg, transparent, #2f6e49, #4ade80, #2f6e49, transparent)',
                    borderRadius: '0 0 4px 4px',
                }} />

                {/* Icon */}
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                    <Box sx={{
                        width: 56, height: 56,
                        borderRadius: '16px',
                        background: 'linear-gradient(135deg, #1a3a2a, #2f6e49)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 8px 32px rgba(47,110,73,0.3)',
                    }}>
                        <LockOutlined sx={{ color: '#4ade80', fontSize: 26 }} />
                    </Box>
                </Box>

                {/* Heading */}
                <Typography
                    variant="h5"
                    sx={{ textAlign: 'center', fontWeight: 700, color: '#f1f5f9', mb: 0.5 }}
                >
                    RFH Admin
                </Typography>
                <Typography
                    variant="body2"
                    sx={{ textAlign: 'center', color: '#64748b', mb: 4 }}
                >
                    Sign in to manage Rupee For Humanity
                </Typography>

                {error && (
                    <Alert
                        severity="error"
                        sx={{
                            mb: 3, borderRadius: 2,
                            bgcolor: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
                            color: '#fca5a5',
                            '& .MuiAlert-icon': { color: '#f87171' },
                        }}
                    >
                        {error}
                    </Alert>
                )}

                <Box component="form" onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        label="Email address"
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                        autoFocus
                        sx={fieldSx}
                        inputProps={{ autoComplete: 'email' }}
                    />
                    <TextField
                        fullWidth
                        label="Password"
                        type={showPass ? 'text' : 'password'}
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                        sx={{ ...fieldSx, mt: 2 }}
                        inputProps={{ autoComplete: 'current-password' }}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => setShowPass(s => !s)}
                                        edge="end"
                                        sx={{ color: '#64748b' }}
                                    >
                                        {showPass ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />

                    <Button
                        fullWidth
                        type="submit"
                        variant="contained"
                        disabled={loading}
                        sx={{
                            mt: 3, py: 1.5,
                            borderRadius: 2,
                            fontWeight: 700,
                            fontSize: '0.95rem',
                            background: 'linear-gradient(135deg, #2f6e49, #3d8c5e)',
                            boxShadow: '0 4px 20px rgba(47,110,73,0.35)',
                            '&:hover': {
                                background: 'linear-gradient(135deg, #3d8c5e, #2f6e49)',
                                boxShadow: '0 6px 28px rgba(47,110,73,0.5)',
                            },
                            '&:disabled': { background: '#1e2a22', color: '#4b5563' },
                        }}
                    >
                        {loading ? <CircularProgress size={22} sx={{ color: '#4ade80' }} /> : 'Sign In'}
                    </Button>
                </Box>

                <Typography
                    variant="caption"
                    sx={{ display: 'block', textAlign: 'center', color: '#334155', mt: 4 }}
                >
                    Access restricted to authorised RFH team members only.
                </Typography>
            </Card>
        </Box>
    );
}

const fieldSx = {
    '& .MuiInputLabel-root': { color: '#64748b' },
    '& .MuiInputLabel-root.Mui-focused': { color: '#4ade80' },
    '& .MuiOutlinedInput-root': {
        color: '#e2e8f0',
        '& fieldset': { borderColor: 'rgba(255,255,255,0.08)' },
        '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.18)' },
        '&.Mui-focused fieldset': { borderColor: '#2f6e49' },
    },
};

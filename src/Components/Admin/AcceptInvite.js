import React, { useState, useEffect } from 'react';
import {
    Box, Card, TextField, Button, Typography, Alert,
    InputAdornment, IconButton, CircularProgress, LinearProgress,
} from '@mui/material';
import { Visibility, VisibilityOff, CheckCircleOutline, ErrorOutline } from '@mui/icons-material';
import { useSearchParams, useNavigate } from 'react-router-dom';
import useAdminAuth from '../../CustomHooks/useAdminAuth';

const BASE_URL = process.env.REACT_APP_BACKEND_BASE_URL;

export default function AcceptInvite() {
    const [searchParams]              = useSearchParams();
    const navigate                    = useNavigate();
    const { login }                   = useAdminAuth();
    const token                       = searchParams.get('token');

    const [validating, setValidating] = useState(true);
    const [inviteState, setInviteState] = useState(null); // { valid, email, message }
    const [name, setName]             = useState('');
    const [password, setPassword]     = useState('');
    const [confirm, setConfirm]       = useState('');
    const [showPass, setShowPass]     = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [done, setDone]             = useState(false);

    useEffect(() => {
        if (!token) {
            setInviteState({ valid: false, message: 'No invite token found. Please use the link from your email.' });
            setValidating(false);
            return;
        }
        fetch(`${BASE_URL}/api/auth/validate-invite?token=${token}`)
            .then(r => r.json())
            .then(data => setInviteState(data))
            .catch(() => setInviteState({ valid: false, message: 'Could not validate the invite. Please try again.' }))
            .finally(() => setValidating(false));
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitError('');
        if (password !== confirm) { setSubmitError('Passwords do not match.'); return; }
        if (password.length < 8)  { setSubmitError('Password must be at least 8 characters.'); return; }

        setSubmitting(true);
        try {
            const res  = await fetch(`${BASE_URL}/api/auth/accept-invite`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, name, password }),
            });
            const data = await res.json();
            if (!res.ok) { setSubmitError(data.message || 'Failed to create account.'); return; }
            login(data.token, data.user);
            setDone(true);
            setTimeout(() => navigate('/admin'), 2000);
        } catch {
            setSubmitError('Network error. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Box sx={{
            minHeight: '100vh',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'linear-gradient(135deg, #0c0f1a 0%, #0f2027 50%, #0c0f1a 100%)',
            p: 2,
        }}>
            <Box sx={{
                position: 'fixed', inset: 0, pointerEvents: 'none',
                backgroundImage: `linear-gradient(rgba(47,110,73,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(47,110,73,0.04) 1px, transparent 1px)`,
                backgroundSize: '40px 40px',
            }} />

            <Card elevation={0} sx={{
                width: '100%', maxWidth: 460,
                bgcolor: 'rgba(22, 27, 44, 0.95)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 4, backdropFilter: 'blur(20px)',
                p: { xs: 3, sm: 5 }, position: 'relative', overflow: 'visible',
            }}>
                {/* Top accent bar */}
                <Box sx={{
                    position: 'absolute', top: 0, left: '10%', right: '10%', height: '3px',
                    background: 'linear-gradient(90deg, transparent, #2f6e49, #4ade80, #2f6e49, transparent)',
                    borderRadius: '0 0 4px 4px',
                }} />

                {/* Logo */}
                <Box sx={{ textAlign: 'center', mb: 3 }}>
                    <Typography sx={{ color: '#4ade80', fontWeight: 800, fontSize: '1.4rem', lineHeight: 1 }}>
                        RFH
                    </Typography>
                    <Typography sx={{ color: '#64748b', fontSize: '0.65rem', letterSpacing: 2 }}>
                        ADMIN PANEL
                    </Typography>
                </Box>

                {validating ? (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                        <LinearProgress sx={{ borderRadius: 4, bgcolor: 'rgba(255,255,255,0.06)', '& .MuiLinearProgress-bar': { bgcolor: '#2f6e49' } }} />
                        <Typography sx={{ color: '#64748b', fontSize: '0.85rem', mt: 2 }}>
                            Validating your invite…
                        </Typography>
                    </Box>
                ) : !inviteState?.valid ? (
                    <Box sx={{ textAlign: 'center', py: 2 }}>
                        <ErrorOutline sx={{ color: '#f87171', fontSize: 48, mb: 2 }} />
                        <Typography sx={{ color: '#f1f5f9', fontWeight: 600, mb: 1 }}>
                            Invalid Invitation
                        </Typography>
                        <Typography sx={{ color: '#64748b', fontSize: '0.85rem', lineHeight: 1.6 }}>
                            {inviteState?.message}
                        </Typography>
                    </Box>
                ) : done ? (
                    <Box sx={{ textAlign: 'center', py: 2 }}>
                        <CheckCircleOutline sx={{ color: '#4ade80', fontSize: 52, mb: 2 }} />
                        <Typography sx={{ color: '#f1f5f9', fontWeight: 700, fontSize: '1.1rem', mb: 1 }}>
                            Account Created!
                        </Typography>
                        <Typography sx={{ color: '#64748b', fontSize: '0.85rem' }}>
                            Redirecting you to the dashboard…
                        </Typography>
                        <LinearProgress sx={{ mt: 3, borderRadius: 4, bgcolor: 'rgba(255,255,255,0.06)', '& .MuiLinearProgress-bar': { bgcolor: '#2f6e49' } }} />
                    </Box>
                ) : (
                    <>
                        <Typography variant="h6" sx={{ color: '#f1f5f9', fontWeight: 700, mb: 0.5 }}>
                            Set up your account
                        </Typography>
                        <Typography sx={{ color: '#64748b', fontSize: '0.83rem', mb: 3 }}>
                            Invited as <strong style={{ color: '#4ade80' }}>{inviteState.email}</strong>
                        </Typography>

                        {submitError && (
                            <Alert severity="error" sx={{
                                mb: 2.5, borderRadius: 2,
                                bgcolor: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
                                color: '#fca5a5', '& .MuiAlert-icon': { color: '#f87171' },
                            }}>
                                {submitError}
                            </Alert>
                        )}

                        <Box component="form" onSubmit={handleSubmit}>
                            <TextField
                                fullWidth label="Your full name"
                                value={name} onChange={e => setName(e.target.value)}
                                required autoFocus sx={fieldSx}
                            />
                            <TextField
                                fullWidth label="Password"
                                type={showPass ? 'text' : 'password'}
                                value={password} onChange={e => setPassword(e.target.value)}
                                required sx={{ ...fieldSx, mt: 2 }}
                                helperText="At least 8 characters"
                                FormHelperTextProps={{ sx: { color: '#475569' } }}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={() => setShowPass(s => !s)} edge="end" sx={{ color: '#64748b' }}>
                                                {showPass ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <TextField
                                fullWidth label="Confirm password"
                                type={showPass ? 'text' : 'password'}
                                value={confirm} onChange={e => setConfirm(e.target.value)}
                                required sx={{ ...fieldSx, mt: 2 }}
                            />

                            <Button
                                fullWidth type="submit"
                                variant="contained" disabled={submitting}
                                sx={{
                                    mt: 3, py: 1.5, borderRadius: 2, fontWeight: 700, fontSize: '0.95rem',
                                    background: 'linear-gradient(135deg, #2f6e49, #3d8c5e)',
                                    boxShadow: '0 4px 20px rgba(47,110,73,0.35)',
                                    '&:hover': { background: 'linear-gradient(135deg, #3d8c5e, #2f6e49)' },
                                    '&:disabled': { background: '#1e2a22', color: '#4b5563' },
                                }}
                            >
                                {submitting ? <CircularProgress size={22} sx={{ color: '#4ade80' }} /> : 'Create Account'}
                            </Button>
                        </Box>
                    </>
                )}
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

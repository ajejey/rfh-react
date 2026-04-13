import React, { useState, useEffect, useCallback } from 'react';
import {
    Box, Typography, Card, Avatar, Chip, IconButton, Button,
    Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, Switch, Tooltip,
    CircularProgress, Alert, Divider, Stack,
} from '@mui/material';
import PersonAddRoundedIcon from '@mui/icons-material/PersonAddRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import MailOutlineRoundedIcon from '@mui/icons-material/MailOutlineRounded';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import TuneRoundedIcon from '@mui/icons-material/TuneRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import HourglassTopRoundedIcon from '@mui/icons-material/HourglassTopRounded';

const BASE_URL  = process.env.REACT_APP_BACKEND_BASE_URL;
const CARD_BG   = '#1a2035';
const BORDER    = 'rgba(255,255,255,0.06)';
const ACCENT    = '#2f6e49';
const ACCENT_LT = '#4ade80';
const TEXT_PRI  = '#f1f5f9';
const TEXT_SEC  = '#64748b';
const SURFACE   = '#151929';

const PERMISSION_LABELS = {
    canViewRunners:           { label: 'View Registered Runners',   description: 'See the full participant list' },
    canUseCheckIn:            { label: 'Use Check-in Scanner',      description: 'Scan QR codes at the event' },
    canDownloadCSV:           { label: 'Download Runners CSV',      description: 'Export participant data' },
    canViewFeedback:          { label: 'View Feedback Dashboard',   description: 'See participant feedback' },
    canDoOfflineRegistration: { label: 'Offline Registration',      description: 'Add manual registrations' },
    canViewDonations:         { label: 'View Donations',            description: 'Access donation records' },
};

function getToken() { return localStorage.getItem('rfh_admin_token'); }

function authHeaders() {
    return { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` };
}

function MemberAvatar({ name, size = 40 }) {
    const initials = name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || '?';
    const hue = [...(name || '')].reduce((acc, c) => acc + c.charCodeAt(0), 0) % 360;
    return (
        <Avatar sx={{
            width: size, height: size, fontSize: size * 0.38,
            fontWeight: 700,
            background: `hsl(${hue},40%,30%)`,
            color: `hsl(${hue},70%,75%)`,
        }}>
            {initials}
        </Avatar>
    );
}

function PermissionToggles({ permissions, onChange, saving }) {
    return (
        <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <TuneRoundedIcon sx={{ color: ACCENT_LT, fontSize: 18 }} />
                <Typography sx={{ color: TEXT_PRI, fontWeight: 600, fontSize: '0.9rem' }}>
                    Global Viewer Permissions
                </Typography>
            </Box>
            <Typography sx={{ color: TEXT_SEC, fontSize: '0.78rem', mb: 3, lineHeight: 1.6 }}>
                These settings apply to all team members. Toggle on what they should be able to see and do.
            </Typography>
            <Stack spacing={0.5}>
                {Object.entries(PERMISSION_LABELS).map(([key, { label, description }]) => (
                    <Box
                        key={key}
                        sx={{
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            p: 1.5, borderRadius: 2,
                            bgcolor: permissions?.[key] ? 'rgba(47,110,73,0.08)' : 'transparent',
                            border: `1px solid ${permissions?.[key] ? 'rgba(47,110,73,0.2)' : BORDER}`,
                            transition: 'all 0.15s ease',
                        }}
                    >
                        <Box>
                            <Typography sx={{ color: TEXT_PRI, fontSize: '0.83rem', fontWeight: 500 }}>
                                {label}
                            </Typography>
                            <Typography sx={{ color: TEXT_SEC, fontSize: '0.72rem' }}>
                                {description}
                            </Typography>
                        </Box>
                        <Switch
                            size="small"
                            checked={!!permissions?.[key]}
                            onChange={e => onChange(key, e.target.checked)}
                            disabled={saving}
                            sx={{
                                '& .MuiSwitch-switchBase.Mui-checked': { color: ACCENT_LT },
                                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: ACCENT },
                            }}
                        />
                    </Box>
                ))}
            </Stack>
        </Box>
    );
}

export default function TeamManagement() {
    const [members, setMembers]               = useState([]);
    const [pending, setPending]               = useState([]);
    const [permissions, setPermissions]       = useState(null);
    const [loading, setLoading]               = useState(true);
    const [saving, setSaving]                 = useState(false);
    const [error, setError]                   = useState('');
    const [success, setSuccess]               = useState('');
    const [inviteOpen, setInviteOpen]         = useState(false);
    const [inviteEmail, setInviteEmail]       = useState('');
    const [inviteLoading, setInviteLoading]   = useState(false);
    const [inviteError, setInviteError]       = useState('');
    const [revokeId, setRevokeId]             = useState(null);

    const fetchAll = useCallback(async () => {
        setLoading(true);
        try {
            const [teamRes, permRes] = await Promise.all([
                fetch(`${BASE_URL}/api/admin/team`,        { headers: authHeaders() }),
                fetch(`${BASE_URL}/api/admin/permissions`, { headers: authHeaders() }),
            ]);
            const teamData = await teamRes.json();
            const permData = await permRes.json();
            setMembers(teamData.members || []);
            setPending(teamData.pendingInvites || []);
            setPermissions(permData);
        } catch {
            setError('Failed to load team data.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchAll(); }, [fetchAll]);

    const handlePermChange = async (key, value) => {
        const updated = { ...permissions, [key]: value };
        setPermissions(updated);
        setSaving(true);
        try {
            const res = await fetch(`${BASE_URL}/api/admin/permissions`, {
                method: 'PUT',
                headers: authHeaders(),
                body: JSON.stringify({ [key]: value }),
            });
            if (!res.ok) throw new Error();
            setSuccess('Permissions saved.');
            setTimeout(() => setSuccess(''), 3000);
        } catch {
            setPermissions(permissions);
            setError('Failed to save permissions.');
        } finally {
            setSaving(false);
        }
    };

    const handleInvite = async () => {
        setInviteError('');
        if (!inviteEmail.includes('@')) { setInviteError('Enter a valid email address.'); return; }
        setInviteLoading(true);
        try {
            const res = await fetch(`${BASE_URL}/api/auth/invite`, {
                method: 'POST',
                headers: authHeaders(),
                body: JSON.stringify({ email: inviteEmail }),
            });
            const data = await res.json();
            if (!res.ok) { setInviteError(data.message || 'Failed to send invite.'); return; }
            setSuccess(`Invite sent to ${inviteEmail}`);
            setInviteOpen(false);
            setInviteEmail('');
            fetchAll();
            setTimeout(() => setSuccess(''), 4000);
        } catch {
            setInviteError('Network error. Please try again.');
        } finally {
            setInviteLoading(false);
        }
    };

    const handleRevoke = async (id) => {
        try {
            const res = await fetch(`${BASE_URL}/api/admin/team/${id}`, {
                method: 'DELETE', headers: authHeaders(),
            });
            const data = await res.json();
            if (!res.ok) { setError(data.message || 'Failed to revoke.'); return; }
            setSuccess(data.message);
            fetchAll();
            setTimeout(() => setSuccess(''), 3000);
        } catch {
            setError('Network error.');
        } finally {
            setRevokeId(null);
        }
    };

    const handleCancelInvite = async (id) => {
        await fetch(`${BASE_URL}/api/admin/invite/${id}`, {
            method: 'DELETE', headers: authHeaders(),
        });
        fetchAll();
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
                <CircularProgress sx={{ color: ACCENT_LT }} />
            </Box>
        );
    }

    return (
        <Box sx={{ p: { xs: 2, sm: 3, md: 5 }, maxWidth: 960, mx: 'auto' }}>
            {/* Page header */}
            <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 4, flexWrap: 'wrap', gap: 2 }}>
                <Box>
                    <Typography variant="h5" sx={{ color: TEXT_PRI, fontWeight: 700, mb: 0.5 }}>
                        Team Management
                    </Typography>
                    <Typography sx={{ color: TEXT_SEC, fontSize: '0.875rem' }}>
                        Invite team members and control what they can access.
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<PersonAddRoundedIcon />}
                    onClick={() => { setInviteOpen(true); setInviteError(''); }}
                    sx={{
                        bgcolor: ACCENT, fontWeight: 600, borderRadius: 2,
                        '&:hover': { bgcolor: '#3d8c5e' },
                        boxShadow: '0 4px 16px rgba(47,110,73,0.3)',
                    }}
                >
                    Invite Member
                </Button>
            </Box>

            {error   && <Alert severity="error"   onClose={() => setError('')}   sx={alertSx('error')}   >{error}</Alert>}
            {success && <Alert severity="success" onClose={() => setSuccess('')} sx={alertSx('success')} >{success}</Alert>}

            <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' }, alignItems: 'flex-start' }}>
                {/* Left: Members list */}
                <Box sx={{ flex: 1, minWidth: 0 }}>
                    {/* Active members */}
                    <Typography sx={{ color: TEXT_SEC, fontSize: '0.75rem', fontWeight: 600, letterSpacing: 1, mb: 1.5, textTransform: 'uppercase' }}>
                        Active Members ({members.filter(m => m.isActive).length})
                    </Typography>
                    <Stack spacing={1.5} sx={{ mb: 3 }}>
                        {members.filter(m => m.isActive).length === 0 ? (
                            <Card elevation={0} sx={{ p: 3, bgcolor: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: 2, textAlign: 'center' }}>
                                <Typography sx={{ color: TEXT_SEC, fontSize: '0.85rem' }}>
                                    No team members yet. Send your first invite!
                                </Typography>
                            </Card>
                        ) : (
                            members.filter(m => m.isActive).map(member => (
                                <Card key={member._id} elevation={0} sx={{
                                    p: 2, bgcolor: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: 2,
                                    display: 'flex', alignItems: 'center', gap: 2,
                                }}>
                                    <MemberAvatar name={member.name} />
                                    <Box sx={{ flex: 1, minWidth: 0 }}>
                                        <Typography sx={{ color: TEXT_PRI, fontWeight: 600, fontSize: '0.875rem' }}>
                                            {member.name}
                                        </Typography>
                                        <Typography sx={{ color: TEXT_SEC, fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.25 }}>
                                            <MailOutlineRoundedIcon sx={{ fontSize: 13 }} />
                                            {member.email}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 0.75 }}>
                                        <Chip icon={<CheckCircleRoundedIcon />} label="Active" size="small" sx={chipSx('#10b981', 'rgba(16,185,129,0.12)')} />
                                        {member.lastLogin && (
                                            <Typography sx={{ color: TEXT_SEC, fontSize: '0.68rem', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                <AccessTimeRoundedIcon sx={{ fontSize: 11 }} />
                                                {new Date(member.lastLogin).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                                            </Typography>
                                        )}
                                    </Box>
                                    <Tooltip title="Revoke access">
                                        <IconButton
                                            size="small"
                                            onClick={() => setRevokeId(member._id)}
                                            sx={{ color: TEXT_SEC, '&:hover': { color: '#f87171', bgcolor: 'rgba(239,68,68,0.1)' } }}
                                        >
                                            <DeleteOutlineRoundedIcon fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                </Card>
                            ))
                        )}
                    </Stack>

                    {/* Pending invites */}
                    {pending.length > 0 && (
                        <>
                            <Typography sx={{ color: TEXT_SEC, fontSize: '0.75rem', fontWeight: 600, letterSpacing: 1, mb: 1.5, textTransform: 'uppercase' }}>
                                Pending Invites ({pending.length})
                            </Typography>
                            <Stack spacing={1.5}>
                                {pending.map(invite => (
                                    <Card key={invite._id} elevation={0} sx={{
                                        p: 2, bgcolor: CARD_BG, border: `1px dashed rgba(255,255,255,0.1)`, borderRadius: 2,
                                        display: 'flex', alignItems: 'center', gap: 2,
                                    }}>
                                        <Avatar sx={{ width: 40, height: 40, bgcolor: 'rgba(255,255,255,0.05)', color: TEXT_SEC }}>
                                            <MailOutlineRoundedIcon fontSize="small" />
                                        </Avatar>
                                        <Box sx={{ flex: 1, minWidth: 0 }}>
                                            <Typography sx={{ color: TEXT_PRI, fontWeight: 500, fontSize: '0.875rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                {invite.email}
                                            </Typography>
                                            <Typography sx={{ color: TEXT_SEC, fontSize: '0.72rem', mt: 0.25 }}>
                                                Expires {new Date(invite.expiresAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </Typography>
                                        </Box>
                                        <Chip icon={<HourglassTopRoundedIcon />} label="Pending" size="small" sx={chipSx('#f59e0b', 'rgba(245,158,11,0.12)')} />
                                        <Tooltip title="Cancel invite">
                                            <IconButton
                                                size="small"
                                                onClick={() => handleCancelInvite(invite._id)}
                                                sx={{ color: TEXT_SEC, '&:hover': { color: '#f87171', bgcolor: 'rgba(239,68,68,0.1)' } }}
                                            >
                                                <DeleteOutlineRoundedIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    </Card>
                                ))}
                            </Stack>
                        </>
                    )}
                </Box>

                {/* Right: Permissions panel */}
                <Card elevation={0} sx={{
                    width: { xs: '100%', md: 340 }, flexShrink: 0,
                    p: 3, bgcolor: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: 2,
                    position: { md: 'sticky' }, top: { md: 24 },
                }}>
                    <PermissionToggles permissions={permissions} onChange={handlePermChange} saving={saving} />
                    {saving && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
                            <CircularProgress size={14} sx={{ color: ACCENT_LT }} />
                            <Typography sx={{ color: TEXT_SEC, fontSize: '0.75rem' }}>Saving…</Typography>
                        </Box>
                    )}
                </Card>
            </Box>

            {/* Invite dialog */}
            <Dialog open={inviteOpen} onClose={() => setInviteOpen(false)} maxWidth="xs" fullWidth PaperProps={{
                sx: { bgcolor: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 3 },
            }}>
                <DialogTitle sx={{ color: TEXT_PRI, fontWeight: 700, pb: 1 }}>
                    Invite Team Member
                </DialogTitle>
                <Divider sx={{ borderColor: BORDER }} />
                <DialogContent sx={{ pt: 3 }}>
                    <Typography sx={{ color: TEXT_SEC, fontSize: '0.85rem', mb: 2.5, lineHeight: 1.6 }}>
                        They'll receive an email with a secure link to set up their account with viewer access.
                    </Typography>
                    <TextField
                        fullWidth autoFocus
                        label="Email address"
                        type="email"
                        value={inviteEmail}
                        onChange={e => setInviteEmail(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleInvite()}
                        sx={dialogFieldSx}
                    />
                    {inviteError && (
                        <Alert severity="error" sx={{ mt: 2, ...alertSx('error') }}>
                            {inviteError}
                        </Alert>
                    )}
                </DialogContent>
                <DialogActions sx={{ p: 2.5, pt: 0, gap: 1 }}>
                    <Button onClick={() => setInviteOpen(false)} sx={{ color: TEXT_SEC }}>
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleInvite}
                        disabled={inviteLoading}
                        sx={{ bgcolor: ACCENT, '&:hover': { bgcolor: '#3d8c5e' }, fontWeight: 600, borderRadius: 2, minWidth: 120 }}
                    >
                        {inviteLoading ? <CircularProgress size={18} sx={{ color: '#fff' }} /> : 'Send Invite'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Revoke confirmation dialog */}
            <Dialog open={!!revokeId} onClose={() => setRevokeId(null)} maxWidth="xs" fullWidth PaperProps={{
                sx: { bgcolor: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 3 },
            }}>
                <DialogTitle sx={{ color: TEXT_PRI, fontWeight: 700 }}>Revoke Access</DialogTitle>
                <Divider sx={{ borderColor: BORDER }} />
                <DialogContent>
                    <Typography sx={{ color: TEXT_SEC, fontSize: '0.875rem', mt: 1, lineHeight: 1.6 }}>
                        This will immediately remove their access to the admin panel. They won't be able to log in anymore.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ p: 2.5, pt: 0, gap: 1 }}>
                    <Button onClick={() => setRevokeId(null)} sx={{ color: TEXT_SEC }}>Cancel</Button>
                    <Button
                        variant="contained"
                        onClick={() => handleRevoke(revokeId)}
                        sx={{ bgcolor: '#ef4444', '&:hover': { bgcolor: '#dc2626' }, fontWeight: 600, borderRadius: 2 }}
                    >
                        Revoke Access
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

const alertSx = (type) => ({
    mb: 2, borderRadius: 2,
    bgcolor: type === 'error' ? 'rgba(239,68,68,0.08)' : 'rgba(16,185,129,0.08)',
    border: `1px solid ${type === 'error' ? 'rgba(239,68,68,0.2)' : 'rgba(16,185,129,0.2)'}`,
    color: type === 'error' ? '#fca5a5' : '#6ee7b7',
    '& .MuiAlert-icon': { color: type === 'error' ? '#f87171' : '#34d399' },
});

const chipSx = (color, bg) => ({
    bgcolor: bg, color, border: `1px solid ${color}44`,
    fontWeight: 600, fontSize: '0.68rem', height: 22,
    '& .MuiChip-icon': { color, fontSize: 12 },
});

const dialogFieldSx = {
    '& .MuiInputLabel-root': { color: '#64748b' },
    '& .MuiInputLabel-root.Mui-focused': { color: '#4ade80' },
    '& .MuiOutlinedInput-root': {
        color: '#e2e8f0',
        '& fieldset': { borderColor: 'rgba(255,255,255,0.08)' },
        '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.18)' },
        '&.Mui-focused fieldset': { borderColor: '#2f6e49' },
    },
};

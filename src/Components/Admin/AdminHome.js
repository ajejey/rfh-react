import React from 'react';
import { Box, Typography, Card, Grid, Chip, Avatar } from '@mui/material';
import { Link } from 'react-router-dom';
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded';
import QrCodeScannerRoundedIcon from '@mui/icons-material/QrCodeScannerRounded';
import EditNoteRoundedIcon from '@mui/icons-material/EditNoteRounded';
import FeedbackRoundedIcon from '@mui/icons-material/FeedbackRounded';
import MonetizationOnRoundedIcon from '@mui/icons-material/MonetizationOnRounded';
import TuneRoundedIcon from '@mui/icons-material/TuneRounded';
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import useAdminAuth from '../../CustomHooks/useAdminAuth';

const CARD_BG   = '#1a2035';
const BORDER    = 'rgba(255,255,255,0.06)';
const ACCENT    = '#2f6e49';
const ACCENT_LT = '#4ade80';
const TEXT_PRI  = '#f1f5f9';
const TEXT_SEC  = '#64748b';

const ALL_MODULES = [
    {
        key: 'runners',
        icon: <PeopleAltRoundedIcon />,
        label: 'Registered Runners',
        description: 'View and manage all event registrations',
        to: '/admin/marathon-participants',
        permission: 'canViewRunners',
        color: '#3b82f6',
        bg: 'rgba(59,130,246,0.12)',
    },
    {
        key: 'checkin',
        icon: <QrCodeScannerRoundedIcon />,
        label: 'Check-in Scanner',
        description: 'Scan QR codes at event entrance',
        to: '/admin/checkin',
        permission: 'canUseCheckIn',
        color: '#8b5cf6',
        bg: 'rgba(139,92,246,0.12)',
    },
    {
        key: 'offline',
        icon: <EditNoteRoundedIcon />,
        label: 'Offline Registration',
        description: 'Add walk-in or manual registrations',
        to: '/admin/offline-registration',
        permission: 'canDoOfflineRegistration',
        color: '#f59e0b',
        bg: 'rgba(245,158,11,0.12)',
    },
    {
        key: 'feedback',
        icon: <FeedbackRoundedIcon />,
        label: 'Feedback',
        description: 'View participant feedback and ratings',
        to: '/admin/feedback-dashboard',
        permission: 'canViewFeedback',
        color: '#ec4899',
        bg: 'rgba(236,72,153,0.12)',
    },
    {
        key: 'donations',
        icon: <MonetizationOnRoundedIcon />,
        label: 'Donations',
        description: 'Browse and export donation records',
        to: '/admin/get-all-donations',
        permission: 'canViewDonations',
        color: '#10b981',
        bg: 'rgba(16,185,129,0.12)',
    },
    {
        key: 'config',
        icon: <TuneRoundedIcon />,
        label: 'Event Config',
        description: 'Manage pricing, coupons, and registration settings',
        to: '/admin/event-config',
        permission: null,
        color: '#f97316',
        bg: 'rgba(249,115,22,0.12)',
    },
    {
        key: 'team',
        icon: <GroupsRoundedIcon />,
        label: 'Team Management',
        description: 'Invite team members and manage their access',
        to: '/admin/team',
        permission: null,
        color: '#06b6d4',
        bg: 'rgba(6,182,212,0.12)',
    },
];

function ModuleCard({ module }) {
    return (
        <Card
            component={Link}
            to={module.to}
            elevation={0}
            sx={{
                p: 3,
                bgcolor: CARD_BG,
                border: `1px solid ${BORDER}`,
                borderRadius: 3,
                textDecoration: 'none',
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                height: '100%',
                transition: 'all 0.2s ease',
                '&:hover': {
                    transform: 'translateY(-3px)',
                    borderColor: module.color + '66',
                    boxShadow: `0 8px 32px ${module.color}22`,
                },
            }}
        >
            <Box sx={{
                width: 44, height: 44, borderRadius: 2,
                bgcolor: module.bg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: module.color, flexShrink: 0,
                '& svg': { fontSize: 22 },
            }}>
                {module.icon}
            </Box>
            <Box sx={{ flex: 1 }}>
                <Typography sx={{ color: TEXT_PRI, fontWeight: 600, fontSize: '0.95rem', mb: 0.5 }}>
                    {module.label}
                </Typography>
                <Typography sx={{ color: TEXT_SEC, fontSize: '0.8rem', lineHeight: 1.55 }}>
                    {module.description}
                </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <ArrowForwardRoundedIcon sx={{ color: TEXT_SEC, fontSize: 18 }} />
            </Box>
        </Card>
    );
}

function getGreeting() {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
}

export default function AdminHome() {
    const { user, isSuperAdmin, can } = useAdminAuth();

    const visibleModules = ALL_MODULES.filter(m => {
        if (isSuperAdmin) return true;
        if (!m.permission) return false;
        return can(m.permission);
    });

    const dateStr = new Date().toLocaleDateString('en-IN', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    });

    const initials = user?.name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || '?';

    return (
        <Box sx={{ p: { xs: 2, sm: 3, md: 5 }, maxWidth: 1100, mx: 'auto' }}>
            {/* Welcome header */}
            <Box sx={{ mb: 5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                    <Avatar sx={{ width: 52, height: 52, bgcolor: ACCENT, fontWeight: 700, fontSize: '1.1rem' }}>
                        {initials}
                    </Avatar>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography sx={{ color: TEXT_SEC, fontSize: '0.78rem', mb: 0.25 }}>
                            {dateStr}
                        </Typography>
                        <Typography variant="h5" sx={{ color: TEXT_PRI, fontWeight: 700, lineHeight: 1.25 }}>
                            {getGreeting()}, {user?.name?.split(' ')[0] ?? 'Admin'}
                        </Typography>
                    </Box>
                    <Chip
                        label={isSuperAdmin ? 'Super Admin' : 'Viewer'}
                        size="small"
                        sx={{
                            bgcolor: isSuperAdmin ? 'rgba(47,110,73,0.2)' : 'rgba(99,102,241,0.2)',
                            color: isSuperAdmin ? ACCENT_LT : '#a5b4fc',
                            border: `1px solid ${isSuperAdmin ? 'rgba(47,110,73,0.4)' : 'rgba(99,102,241,0.4)'}`,
                            fontWeight: 600, fontSize: '0.7rem', height: 24,
                        }}
                    />
                </Box>

                <Box sx={{
                    mt: 3, pt: 3,
                    borderTop: '1px solid rgba(255,255,255,0.06)',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                }}>
                    <Typography sx={{ color: TEXT_SEC, fontSize: '0.85rem' }}>
                        {visibleModules.length} module{visibleModules.length !== 1 ? 's' : ''} available
                    </Typography>
                    <Box sx={{
                        display: 'inline-flex', alignItems: 'center', gap: 0.75,
                        bgcolor: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.18)',
                        borderRadius: 2, px: 1.5, py: 0.5,
                    }}>
                        <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: ACCENT_LT }} />
                        <Typography sx={{ color: ACCENT_LT, fontSize: '0.72rem', fontWeight: 600 }}>
                            System Online
                        </Typography>
                    </Box>
                </Box>
            </Box>

            {/* Module grid */}
            {visibleModules.length > 0 ? (
                <Grid container spacing={2.5}>
                    {visibleModules.map(module => (
                        <Grid item xs={12} sm={6} md={4} key={module.key}>
                            <ModuleCard module={module} />
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <Box sx={{ textAlign: 'center', py: 12 }}>
                    <Typography sx={{ color: TEXT_SEC, fontSize: '1rem', mb: 1 }}>
                        No modules are currently enabled for your account.
                    </Typography>
                    <Typography sx={{ color: 'rgba(100,116,139,0.6)', fontSize: '0.85rem' }}>
                        Contact a super admin to request access.
                    </Typography>
                </Box>
            )}
        </Box>
    );
}

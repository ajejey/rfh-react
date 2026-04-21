import React, { useState } from 'react';
import { Navigate, Route, Routes, useLocation, Link } from 'react-router-dom';
import {
    Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText,
    Typography, IconButton, Avatar, Tooltip, CircularProgress,
} from '@mui/material';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded';
import QrCodeScannerRoundedIcon from '@mui/icons-material/QrCodeScannerRounded';
import EditNoteRoundedIcon from '@mui/icons-material/EditNoteRounded';
import FeedbackRoundedIcon from '@mui/icons-material/FeedbackRounded';
import MonetizationOnRoundedIcon from '@mui/icons-material/MonetizationOnRounded';
import ReceiptRoundedIcon from '@mui/icons-material/ReceiptRounded';
import TuneRoundedIcon from '@mui/icons-material/TuneRounded';
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';

import useAdminAuth from '../../CustomHooks/useAdminAuth';
import AdminHome from './AdminHome';
import AdminEventConfig from './AdminEventConfig';
import AdminCheckIn from './AdminCheckIn';
import EventParticipants from './EventParticipents';
import OfflineRegistration from './OfflineRegistration';
import FeedbackDashboard from './FeedbackDashboard';
import GetAllDonations from './GetAllDonations';
import DonationReceipt from './DonationReceipt';
import TeamManagement from './TeamManagement';

const SIDEBAR_WIDTH = 256;
const SIDEBAR_COLLAPSED = 72;

const BG        = '#0c0f1a';
const SURFACE   = '#151929';
const BORDER    = 'rgba(255,255,255,0.06)';
const ACCENT    = '#2f6e49';
const ACCENT_LT = '#4ade80';
const TEXT_PRI  = '#f1f5f9';
const TEXT_SEC  = '#64748b';

function NavItem({ icon, label, to, collapsed, active }) {
    return (
        <Tooltip title={collapsed ? label : ''} placement="right" arrow>
            <ListItem disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                    component={Link}
                    to={to}
                    sx={{
                        borderRadius: 2,
                        mx: 1,
                        py: 1.2,
                        px: collapsed ? 1.5 : 2,
                        justifyContent: collapsed ? 'center' : 'flex-start',
                        bgcolor: active ? 'rgba(47,110,73,0.18)' : 'transparent',
                        border: active ? `1px solid rgba(47,110,73,0.35)` : '1px solid transparent',
                        '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' },
                        transition: 'all 0.15s ease',
                        minHeight: 44,
                    }}
                >
                    <ListItemIcon sx={{
                        minWidth: collapsed ? 0 : 36,
                        color: active ? ACCENT_LT : TEXT_SEC,
                        '& svg': { fontSize: 20 },
                    }}>
                        {icon}
                    </ListItemIcon>
                    {!collapsed && (
                        <ListItemText
                            primary={label}
                            primaryTypographyProps={{
                                fontSize: '0.875rem',
                                fontWeight: active ? 600 : 400,
                                color: active ? TEXT_PRI : TEXT_SEC,
                            }}
                        />
                    )}
                </ListItemButton>
            </ListItem>
        </Tooltip>
    );
}

function Sidebar({ collapsed, onToggle, user, isSuperAdmin, can, onLogout }) {
    const location = useLocation();
    const active = (path) => location.pathname === path || (path !== '/admin' && location.pathname.startsWith(path));

    const navItems = [
        { icon: <DashboardRoundedIcon />,       label: 'Dashboard',          to: '/admin',                     show: true },
        { icon: <PeopleAltRoundedIcon />,       label: 'Registered Runners', to: '/admin/marathon-participants', show: isSuperAdmin || can('canViewRunners') },
        { icon: <QrCodeScannerRoundedIcon />,   label: 'Check-in Scanner',   to: '/admin/checkin',              show: isSuperAdmin || can('canUseCheckIn') },
        { icon: <EditNoteRoundedIcon />,        label: 'Offline Reg',        to: '/admin/offline-registration', show: isSuperAdmin || can('canDoOfflineRegistration') },
        { icon: <FeedbackRoundedIcon />,        label: 'Feedback',           to: '/admin/feedback-dashboard',   show: isSuperAdmin || can('canViewFeedback') },
        { icon: <MonetizationOnRoundedIcon />,  label: 'Donations',          to: '/admin/get-all-donations',    show: isSuperAdmin || can('canViewDonations') },
        { icon: <ReceiptRoundedIcon />,          label: 'Donation Receipt',   to: '/admin/donation-receipt',     show: isSuperAdmin },
        { icon: <TuneRoundedIcon />,            label: 'Event Config',       to: '/admin/event-config',         show: isSuperAdmin },
        { icon: <GroupsRoundedIcon />,          label: 'Team',               to: '/admin/team',                 show: isSuperAdmin },
    ];

    const initials = user?.name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || '?';

    return (
        <Box sx={{
            width: collapsed ? SIDEBAR_COLLAPSED : SIDEBAR_WIDTH,
            flexShrink: 0,
            height: '100vh',
            position: 'sticky',
            top: 0,
            display: 'flex',
            flexDirection: 'column',
            bgcolor: SURFACE,
            borderRight: `1px solid ${BORDER}`,
            transition: 'width 0.25s ease',
            overflow: 'hidden',
        }}>
            {/* Logo + toggle */}
            <Box sx={{
                display: 'flex', alignItems: 'center',
                justifyContent: collapsed ? 'center' : 'space-between',
                px: collapsed ? 1 : 2, py: 2,
                borderBottom: `1px solid ${BORDER}`, minHeight: 64,
            }}>
                {!collapsed && (
                    <Box>
                        <Typography sx={{ color: ACCENT_LT, fontWeight: 800, fontSize: '1rem', lineHeight: 1 }}>
                            RFH
                        </Typography>
                        <Typography sx={{ color: TEXT_SEC, fontSize: '0.65rem', letterSpacing: 1.5 }}>
                            ADMIN PANEL
                        </Typography>
                    </Box>
                )}
                <IconButton onClick={onToggle} size="small" sx={{ color: TEXT_SEC, '&:hover': { color: TEXT_PRI } }}>
                    {collapsed ? <MenuRoundedIcon fontSize="small" /> : <ChevronLeftRoundedIcon fontSize="small" />}
                </IconButton>
            </Box>

            {/* Nav items */}
            <List sx={{ flex: 1, py: 1.5, overflowY: 'auto', overflowX: 'hidden' }}>
                {navItems.filter(n => n.show).map(item => (
                    <NavItem
                        key={item.to}
                        icon={item.icon}
                        label={item.label}
                        to={item.to}
                        collapsed={collapsed}
                        active={active(item.to)}
                    />
                ))}
            </List>

            {/* User profile + logout */}
            <Box sx={{ borderTop: `1px solid ${BORDER}`, p: collapsed ? 1 : 1.5 }}>
                {!collapsed ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 1 }}>
                        <Avatar sx={{ width: 34, height: 34, bgcolor: ACCENT, fontSize: '0.8rem', fontWeight: 700 }}>
                            {initials}
                        </Avatar>
                        <Box sx={{ flex: 1, overflow: 'hidden' }}>
                            <Typography sx={{ color: TEXT_PRI, fontSize: '0.8rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {user?.name}
                            </Typography>
                            <Typography sx={{ color: TEXT_SEC, fontSize: '0.68rem' }}>
                                {user?.role === 'superAdmin' ? 'Super Admin' : 'Viewer'}
                            </Typography>
                        </Box>
                        <Tooltip title="Sign out">
                            <IconButton onClick={onLogout} size="small" sx={{ color: TEXT_SEC, '&:hover': { color: '#f87171' } }}>
                                <LogoutRoundedIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    </Box>
                ) : (
                    <Tooltip title="Sign out" placement="right">
                        <IconButton onClick={onLogout} sx={{ width: '100%', color: TEXT_SEC, '&:hover': { color: '#f87171' } }}>
                            <LogoutRoundedIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                )}
            </Box>
        </Box>
    );
}

export default function AdminMain() {
    const { isAuthenticated, loading, isSuperAdmin, can, user, logout } = useAdminAuth();
    const [collapsed, setCollapsed] = useState(false);

    if (loading) {
        return (
            <Box sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: BG }}>
                <Box sx={{ textAlign: 'center' }}>
                    <CircularProgress sx={{ color: ACCENT_LT }} />
                    <Typography sx={{ mt: 2, color: TEXT_SEC, fontSize: '0.875rem' }}>
                        Verifying credentials…
                    </Typography>
                </Box>
            </Box>
        );
    }

    if (!isAuthenticated) return <Navigate to="/admin/login" replace />;

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: BG }}>
            <Sidebar
                collapsed={collapsed}
                onToggle={() => setCollapsed(c => !c)}
                user={user}
                isSuperAdmin={isSuperAdmin}
                can={can}
                onLogout={logout}
            />
            <Box component="main" sx={{ flex: 1, minWidth: 0, overflow: 'auto' }}>
                <Routes>
                    <Route path="/"                    element={<AdminHome />} />
                    <Route path="/marathon-participants" element={isSuperAdmin || can('canViewRunners') ? <EventParticipants /> : <Navigate to="/admin" replace />} />
                    <Route path="/checkin"              element={isSuperAdmin || can('canUseCheckIn') ? <AdminCheckIn /> : <Navigate to="/admin" replace />} />
                    <Route path="/offline-registration" element={isSuperAdmin || can('canDoOfflineRegistration') ? <OfflineRegistration /> : <Navigate to="/admin" replace />} />
                    <Route path="/feedback-dashboard"   element={isSuperAdmin || can('canViewFeedback') ? <FeedbackDashboard /> : <Navigate to="/admin" replace />} />
                    <Route path="/get-all-donations"    element={isSuperAdmin || can('canViewDonations') ? <GetAllDonations /> : <Navigate to="/admin" replace />} />
                    <Route path="/donation-receipt"     element={isSuperAdmin ? <DonationReceipt /> : <Navigate to="/admin" replace />} />
                    <Route path="/event-config"         element={isSuperAdmin ? <AdminEventConfig /> : <Navigate to="/admin" replace />} />
                    <Route path="/team"                 element={isSuperAdmin ? <TeamManagement /> : <Navigate to="/admin" replace />} />
                </Routes>
            </Box>
        </Box>
    );
}
import React, { useEffect, useState } from 'react';
import {
    Alert, Box, Button, Card, CardContent, Chip, CircularProgress,
    Container, Dialog, DialogActions, DialogContent, DialogTitle,
    Divider, FormControl, InputLabel, MenuItem, Paper, Select,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    TextField, Typography,
} from '@mui/material';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Header from '../Header';

const BASE_URL = process.env.REACT_APP_BACKEND_BASE_URL;

function StatCard({ label, value, color }) {
    return (
        <Card sx={{ flex: 1, minWidth: 120, borderRadius: 2, boxShadow: 2 }}>
            <CardContent sx={{ textAlign: 'center', py: 2, '&:last-child': { pb: 2 } }}>
                <Typography variant="h4" fontWeight="bold" sx={{ color: color || 'text.primary' }}>
                    {value ?? '—'}
                </Typography>
                <Typography variant="caption" color="text.secondary">{label}</Typography>
            </CardContent>
        </Card>
    );
}

export default function AdminCheckIn() {
    const [allEvents, setAllEvents] = useState([]);
    const [selectedSlug, setSelectedSlug] = useState('');
    const [eventsLoading, setEventsLoading] = useState(true);

    const [stats, setStats] = useState(null);
    const [statsLoading, setStatsLoading] = useState(false);

    const [participants, setParticipants] = useState([]);
    const [participantsLoading, setParticipantsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const [actionLoading, setActionLoading] = useState({});

    const [pin, setPin] = useState('');
    const [pinSaving, setPinSaving] = useState(false);
    const [pinSaved, setPinSaved] = useState(false);

    const [resetDialogOpen, setResetDialogOpen] = useState(false);
    const [resetting, setResetting] = useState(false);
    const [resetResult, setResetResult] = useState('');

    // Load events list
    useEffect(() => {
        fetch(`${BASE_URL}/api/event-config`)
            .then(r => r.json())
            .then(data => { setAllEvents(data); setEventsLoading(false); })
            .catch(() => setEventsLoading(false));
    }, []);

    // Load stats + participants when event changes
    useEffect(() => {
        if (!selectedSlug) return;
        loadStats();
        loadParticipants();
        // Reset pin field when event changes
        setPin('');
        setPinSaved(false);
        setResetResult('');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedSlug]);

    async function loadStats() {
        setStatsLoading(true);
        try {
            const res = await fetch(`${BASE_URL}/api/admin-checkin/stats/${selectedSlug}`);
            const data = await res.json();
            setStats(data);
        } catch {
            setStats(null);
        } finally {
            setStatsLoading(false);
        }
    }

    async function loadParticipants() {
        setParticipantsLoading(true);
        try {
            const res = await fetch(`${BASE_URL}/api/admin-checkin/participants/${selectedSlug}`);
            const data = await res.json();
            setParticipants(data.participants || []);
        } catch {
            setParticipants([]);
        } finally {
            setParticipantsLoading(false);
        }
    }

    async function handleCheckIn(regId) {
        setActionLoading(prev => ({ ...prev, [regId]: true }));
        try {
            const res = await fetch(`${BASE_URL}/api/checkin/${encodeURIComponent(regId)}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });
            const data = await res.json();
            if (data.success || data.alreadyCheckedIn) {
                // Update participant in-place
                setParticipants(prev => prev.map(p =>
                    p.registrationId === regId
                        ? { ...p, checkedIn: true, checkedInAt: data.checkedInAt || p.checkedInAt }
                        : p
                ));
                setStats(prev => prev ? { ...prev, checkedIn: prev.checkedIn + (data.success ? 1 : 0) } : prev);
            }
        } catch { /* ignore */ }
        finally { setActionLoading(prev => ({ ...prev, [regId]: false })); }
    }

    async function handleUndo(regId) {
        setActionLoading(prev => ({ ...prev, [regId]: true }));
        try {
            const res = await fetch(`${BASE_URL}/api/checkin/${encodeURIComponent(regId)}`, {
                method: 'DELETE',
            });
            const data = await res.json();
            if (data.success) {
                setParticipants(prev => prev.map(p =>
                    p.registrationId === regId
                        ? { ...p, checkedIn: false, checkedInAt: null }
                        : p
                ));
                setStats(prev => prev ? { ...prev, checkedIn: Math.max(0, prev.checkedIn - 1) } : prev);
            }
        } catch { /* ignore */ }
        finally { setActionLoading(prev => ({ ...prev, [regId]: false })); }
    }

    async function handleSavePin() {
        if (!selectedSlug) return;
        setPinSaving(true);
        setPinSaved(false);
        try {
            const res = await fetch(`${BASE_URL}/api/event-config/${selectedSlug}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ checkinPin: pin }),
            });
            if (res.ok) setPinSaved(true);
        } catch { /* ignore */ }
        finally { setPinSaving(false); }
    }

    async function handleResetAll() {
        setResetting(true);
        setResetResult('');
        try {
            const res = await fetch(`${BASE_URL}/api/admin-checkin/reset/${selectedSlug}`, {
                method: 'POST',
            });
            const data = await res.json();
            if (data.success) {
                setResetResult(`Done — cleared check-ins for ${data.count} registration${data.count !== 1 ? 's' : ''}.`);
                loadStats();
                loadParticipants();
            }
        } catch {
            setResetResult('Failed. Please try again.');
        } finally {
            setResetting(false);
            setResetDialogOpen(false);
        }
    }

    const filteredParticipants = participants.filter(p => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return (
            p.name?.toLowerCase().includes(q) ||
            p.registrationId?.toLowerCase().includes(q) ||
            p.phone?.includes(q) ||
            p.category?.toLowerCase().includes(q)
        );
    });

    const pct = stats ? (stats.total > 0 ? Math.round((stats.checkedIn / stats.total) * 100) : 0) : null;

    function formatTime(iso) {
        if (!iso) return '—';
        return new Date(iso).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
    }

    return (
        <Box sx={{ backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
            <Header />
            <Container maxWidth="lg" sx={{ pt: 3, pb: 8 }}>

                {/* Title */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                    <QrCodeScannerIcon sx={{ fontSize: 32, color: '#040002' }} />
                    <Typography variant="h5" fontWeight="bold">Gate Check-In Dashboard</Typography>
                </Box>

                {/* Event selector */}
                <Paper sx={{ p: 2.5, mb: 3, borderRadius: 2 }}>
                    <FormControl fullWidth>
                        <InputLabel>Select Event</InputLabel>
                        <Select
                            value={selectedSlug}
                            label="Select Event"
                            onChange={e => setSelectedSlug(e.target.value)}
                        >
                            {eventsLoading ? (
                                <MenuItem disabled>Loading…</MenuItem>
                            ) : (
                                allEvents.map(e => (
                                    <MenuItem key={e.eventSlug} value={e.eventSlug}>
                                        {e.eventName}
                                    </MenuItem>
                                ))
                            )}
                        </Select>
                    </FormControl>
                </Paper>

                {!selectedSlug && (
                    <Typography color="text.secondary" sx={{ textAlign: 'center', mt: 6 }}>
                        Select an event above to view check-in data
                    </Typography>
                )}

                {selectedSlug && (
                    <>
                        {/* Stats row */}
                        <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
                            {statsLoading ? (
                                <CircularProgress size={28} />
                            ) : stats ? (
                                <>
                                    <StatCard label="Total Registered" value={stats.total} />
                                    <StatCard label="Checked In" value={stats.checkedIn} color="#27ae60" />
                                    <StatCard label="% Checked In" value={`${pct}%`} color="#3498db" />
                                    <StatCard label="Remaining" value={stats.total - stats.checkedIn} color="#e74c3c" />
                                </>
                            ) : null}
                        </Box>

                        {/* Category breakdown */}
                        {stats?.byCategory?.length > 1 && (
                            <Paper sx={{ p: 2.5, mb: 3, borderRadius: 2 }}>
                                <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                                    By Category
                                </Typography>
                                <TableContainer>
                                    <Table size="small">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell><strong>Category</strong></TableCell>
                                                <TableCell align="right"><strong>Total</strong></TableCell>
                                                <TableCell align="right"><strong>Checked In</strong></TableCell>
                                                <TableCell align="right"><strong>Remaining</strong></TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {stats.byCategory.map(row => (
                                                <TableRow key={row.category}>
                                                    <TableCell>{row.category}</TableCell>
                                                    <TableCell align="right">{row.total}</TableCell>
                                                    <TableCell align="right" sx={{ color: '#27ae60', fontWeight: 'bold' }}>
                                                        {row.checkedIn}
                                                    </TableCell>
                                                    <TableCell align="right" sx={{ color: '#e74c3c' }}>
                                                        {row.total - row.checkedIn}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Paper>
                        )}

                        {/* Participant list */}
                        <Paper sx={{ p: 2.5, mb: 3, borderRadius: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, flexWrap: 'wrap', gap: 1.5 }}>
                                <Typography variant="h6" fontWeight="bold">Participants</Typography>
                                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                    <TextField
                                        size="small"
                                        placeholder="Search name, phone, reg ID…"
                                        value={searchQuery}
                                        onChange={e => setSearchQuery(e.target.value)}
                                        sx={{ minWidth: 240 }}
                                    />
                                    <Button variant="outlined" size="small" onClick={loadParticipants}>
                                        Refresh
                                    </Button>
                                </Box>
                            </Box>

                            {participantsLoading ? (
                                <Box sx={{ textAlign: 'center', py: 4 }}>
                                    <CircularProgress />
                                </Box>
                            ) : (
                                <TableContainer>
                                    <Table size="small">
                                        <TableHead>
                                            <TableRow sx={{ bgcolor: '#f9f9f9' }}>
                                                <TableCell><strong>Name</strong></TableCell>
                                                <TableCell><strong>Reg ID</strong></TableCell>
                                                <TableCell><strong>Category</strong></TableCell>
                                                <TableCell><strong>Phone</strong></TableCell>
                                                <TableCell><strong>Status</strong></TableCell>
                                                <TableCell><strong>Time</strong></TableCell>
                                                <TableCell align="center"><strong>Action</strong></TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {filteredParticipants.length === 0 ? (
                                                <TableRow>
                                                    <TableCell colSpan={7} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                                                        {searchQuery ? 'No results matching your search' : 'No participants found'}
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                filteredParticipants.map(p => (
                                                    <TableRow
                                                        key={p.registrationId}
                                                        sx={{ '&:hover': { bgcolor: '#f5f5f5' } }}
                                                    >
                                                        <TableCell sx={{ fontWeight: 500 }}>{p.name}</TableCell>
                                                        <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
                                                            {p.registrationId}
                                                        </TableCell>
                                                        <TableCell>{p.category}</TableCell>
                                                        <TableCell>{p.phone}</TableCell>
                                                        <TableCell>
                                                            <Chip
                                                                icon={p.checkedIn ? <CheckCircleIcon /> : undefined}
                                                                label={p.checkedIn ? 'Checked In' : 'Pending'}
                                                                size="small"
                                                                sx={{
                                                                    bgcolor: p.checkedIn ? '#e8f5e9' : '#f5f5f5',
                                                                    color: p.checkedIn ? '#27ae60' : '#888',
                                                                    fontWeight: 'bold',
                                                                }}
                                                            />
                                                        </TableCell>
                                                        <TableCell sx={{ color: 'text.secondary', fontSize: '0.82rem' }}>
                                                            {formatTime(p.checkedInAt)}
                                                        </TableCell>
                                                        <TableCell align="center">
                                                            {actionLoading[p.registrationId] ? (
                                                                <CircularProgress size={18} />
                                                            ) : p.checkedIn ? (
                                                                <Button
                                                                    size="small"
                                                                    color="warning"
                                                                    variant="outlined"
                                                                    onClick={() => handleUndo(p.registrationId)}
                                                                    sx={{ fontSize: '0.75rem' }}
                                                                >
                                                                    Undo
                                                                </Button>
                                                            ) : (
                                                                <Button
                                                                    size="small"
                                                                    variant="contained"
                                                                    onClick={() => handleCheckIn(p.registrationId)}
                                                                    sx={{
                                                                        bgcolor: '#27ae60', fontSize: '0.75rem',
                                                                        '&:hover': { bgcolor: '#219a52' },
                                                                    }}
                                                                >
                                                                    Check In
                                                                </Button>
                                                            )}
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            )}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            )}
                        </Paper>

                        {/* Settings */}
                        <Paper sx={{ p: 2.5, borderRadius: 2 }}>
                            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                                Settings
                            </Typography>

                            {/* PIN */}
                            <Box>
                                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                                    Volunteer Check-In PIN
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                                    <TextField
                                        size="small"
                                        type="text"
                                        placeholder="Enter new PIN"
                                        value={pin}
                                        onChange={e => { setPin(e.target.value); setPinSaved(false); }}
                                        sx={{ maxWidth: 200 }}
                                        inputProps={{ style: { letterSpacing: 4, fontFamily: 'monospace' } }}
                                    />
                                    <Button
                                        variant="contained"
                                        size="small"
                                        onClick={handleSavePin}
                                        disabled={pinSaving || !pin.trim()}
                                        sx={{ backgroundColor: '#040002', '&:hover': { backgroundColor: '#333' } }}
                                    >
                                        {pinSaving ? <CircularProgress size={16} color="inherit" /> : 'Save PIN'}
                                    </Button>
                                    {pinSaved && (
                                        <Typography variant="body2" sx={{ color: '#27ae60', fontWeight: 'bold' }}>
                                            ✓ Saved
                                        </Typography>
                                    )}
                                </Box>
                                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                                    Volunteers enter this once when they open the scanner page. Leave blank to disable PIN protection.
                                </Typography>
                            </Box>

                            <Divider sx={{ my: 2.5 }} />

                            {/* Danger zone */}
                            <Box>
                                <Typography variant="subtitle2" color="error" sx={{ mb: 1 }}>
                                    Danger Zone
                                </Typography>
                                <Button
                                    variant="outlined"
                                    color="error"
                                    size="small"
                                    onClick={() => setResetDialogOpen(true)}
                                >
                                    Reset All Check-Ins
                                </Button>
                                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                                    Clears all check-in records for this event. Use for testing or dry-runs only.
                                </Typography>
                                {resetResult && (
                                    <Alert severity={resetResult.startsWith('Done') ? 'success' : 'error'} sx={{ mt: 1.5 }}>
                                        {resetResult}
                                    </Alert>
                                )}
                            </Box>
                        </Paper>
                    </>
                )}
            </Container>

            {/* Reset confirmation dialog */}
            <Dialog open={resetDialogOpen} onClose={() => setResetDialogOpen(false)}>
                <DialogTitle>Reset All Check-Ins?</DialogTitle>
                <DialogContent>
                    <Typography>
                        This will permanently clear all check-in records for this event.
                        All participants will appear as "not checked in" again.
                    </Typography>
                    <Typography sx={{ mt: 1.5, fontWeight: 'bold', color: '#e74c3c' }}>
                        This cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={() => setResetDialogOpen(false)}>Cancel</Button>
                    <Button
                        color="error"
                        variant="contained"
                        onClick={handleResetAll}
                        disabled={resetting}
                    >
                        {resetting ? <CircularProgress size={18} color="inherit" /> : 'Reset All'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

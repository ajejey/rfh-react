import React, { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import {
    Box, Button, Card, CardContent, Chip, CircularProgress,
    Container, Divider, FormControl, InputLabel, MenuItem,
    Select, Tab, Tabs, TextField, Typography
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ErrorIcon from '@mui/icons-material/Error';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import SearchIcon from '@mui/icons-material/Search';
import BackspaceIcon from '@mui/icons-material/Backspace';
import CheckIcon from '@mui/icons-material/Check';

const BASE_URL = process.env.REACT_APP_BACKEND_BASE_URL;
const SESSION_KEY = 'rfh_checkin_session';

const COLORS = {
    valid:   '#27ae60',
    already: '#f39c12',
    invalid: '#e74c3c',
};

function formatTime(isoString) {
    if (!isoString) return '';
    return new Date(isoString).toLocaleTimeString('en-IN', {
        hour: '2-digit', minute: '2-digit', hour12: true,
    });
}

function getSession() {
    try {
        const s = sessionStorage.getItem(SESSION_KEY);
        return s ? JSON.parse(s) : null;
    } catch { return null; }
}

function saveSession(eventSlug, eventName) {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify({ eventSlug, eventName, verified: true }));
}

function clearSession() {
    sessionStorage.removeItem(SESSION_KEY);
}

// ─── Screen 1: Event Selection ───────────────────────────────────────────────

function EventSelectScreen({ onContinue }) {
    const [events, setEvents] = useState([]);
    const [selectedSlug, setSelectedSlug] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${BASE_URL}/api/event-config`)
            .then(r => r.json())
            .then(data => { setEvents(data); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);

    const selectedEvent = events.find(e => e.eventSlug === selectedSlug);

    return (
        <Box sx={{
            minHeight: '100vh', bgcolor: '#f5f5f5',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            p: 3,
        }}>
            <QrCodeScannerIcon sx={{ fontSize: 56, color: '#040002', mb: 2 }} />
            <Typography variant="h5" fontWeight="bold" sx={{ mb: 0.5 }}>RFH Gate Check-In</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                Select your event to begin
            </Typography>

            <Card sx={{ width: '100%', maxWidth: 400, borderRadius: 3, boxShadow: 4 }}>
                <CardContent sx={{ p: 3 }}>
                    {loading ? (
                        <Box sx={{ textAlign: 'center', py: 3 }}>
                            <CircularProgress size={28} />
                        </Box>
                    ) : (
                        <>
                            <FormControl fullWidth>
                                <InputLabel>Event</InputLabel>
                                <Select
                                    value={selectedSlug}
                                    label="Event"
                                    onChange={e => setSelectedSlug(e.target.value)}
                                    sx={{ fontSize: '1rem' }}
                                >
                                    {events.map(e => (
                                        <MenuItem key={e.eventSlug} value={e.eventSlug}>
                                            {e.eventName}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <Button
                                variant="contained"
                                fullWidth
                                size="large"
                                disabled={!selectedSlug}
                                onClick={() => onContinue(selectedSlug, selectedEvent?.eventName)}
                                sx={{
                                    mt: 2.5, py: 1.75, fontSize: '1rem',
                                    backgroundColor: '#040002',
                                    '&:hover': { backgroundColor: '#333' },
                                }}
                            >
                                Continue →
                            </Button>
                        </>
                    )}
                </CardContent>
            </Card>
        </Box>
    );
}

// ─── Screen 2: PIN Entry ──────────────────────────────────────────────────────

function PinScreen({ eventSlug, eventName, onSuccess, onChangeEvent }) {
    const [digits, setDigits] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const MAX_DIGITS = 8;

    function press(d) {
        if (digits.length < MAX_DIGITS) setDigits(prev => prev + d);
        setError('');
    }

    function backspace() {
        setDigits(prev => prev.slice(0, -1));
        setError('');
    }

    async function submit() {
        if (!digits) return;
        setLoading(true);
        try {
            const res = await fetch(`${BASE_URL}/api/checkin/verify-pin`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ eventSlug, pin: digits }),
            });
            const data = await res.json();
            if (data.valid) {
                onSuccess(data.eventName || eventName);
            } else {
                setError(data.message || 'Incorrect PIN');
                setDigits('');
            }
        } catch {
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    }

    const numpadKeys = ['1','2','3','4','5','6','7','8','9','','0',''];

    return (
        <Box sx={{
            minHeight: '100vh', bgcolor: '#040002',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            p: 3,
        }}>
            <Typography variant="body2" sx={{ color: '#aaa', mb: 0.5 }}>{eventName}</Typography>
            <Typography variant="h6" fontWeight="bold" color="white" sx={{ mb: 3 }}>
                Enter Check-In PIN
            </Typography>

            {/* Dot display */}
            <Box sx={{ display: 'flex', gap: 1.5, mb: 2, minHeight: 28 }}>
                {digits.split('').map((_, i) => (
                    <Box key={i} sx={{
                        width: 16, height: 16, borderRadius: '50%',
                        bgcolor: 'white',
                    }} />
                ))}
                {digits.length === 0 && (
                    <Typography color="#666" sx={{ fontSize: '0.85rem', alignSelf: 'center' }}>
                        Enter PIN
                    </Typography>
                )}
            </Box>

            {error && (
                <Typography color="#e74c3c" variant="body2" sx={{ mb: 1.5, textAlign: 'center' }}>
                    {error}
                </Typography>
            )}

            {/* Numpad */}
            <Box sx={{
                display: 'grid', gridTemplateColumns: 'repeat(3, 80px)',
                gap: 1.5, mt: 1,
            }}>
                {numpadKeys.map((key, i) => {
                    if (key === '') {
                        // Backspace (last cell) or empty (10th cell)
                        if (i === 9) return <Box key={i} />;
                        return (
                            <Button
                                key={i}
                                variant="outlined"
                                onClick={backspace}
                                sx={numpadBtnSx}
                            >
                                <BackspaceIcon />
                            </Button>
                        );
                    }
                    return (
                        <Button
                            key={i}
                            variant="outlined"
                            onClick={() => press(key)}
                            sx={numpadBtnSx}
                        >
                            <Typography variant="h5" fontWeight="bold" color="white">
                                {key}
                            </Typography>
                        </Button>
                    );
                })}
            </Box>

            <Button
                variant="contained"
                size="large"
                fullWidth
                onClick={submit}
                disabled={!digits || loading}
                startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <CheckIcon />}
                sx={{
                    mt: 3, maxWidth: 260, py: 1.75, fontSize: '1rem',
                    backgroundColor: COLORS.valid,
                    '&:hover': { backgroundColor: '#219a52' },
                }}
            >
                Unlock
            </Button>

            <Button
                onClick={onChangeEvent}
                sx={{ mt: 2, color: '#666', textTransform: 'none', fontSize: '0.85rem' }}
            >
                ← Change Event
            </Button>
        </Box>
    );
}

const numpadBtnSx = {
    width: 80, height: 72,
    borderColor: '#333', borderRadius: 2,
    '&:hover': { borderColor: '#555', bgcolor: '#111' },
};

// ─── Result Card ──────────────────────────────────────────────────────────────

function ResultCard({ resultState, result, onCheckIn, checkingIn, undoCountdown, onUndo, undoing, onScanNext }) {
    const accentColor = COLORS[resultState] || '#aaa';

    if (!result) return null;

    return (
        <Card sx={{ borderLeft: `6px solid ${accentColor}`, borderRadius: 2, boxShadow: 3 }}>
            <CardContent sx={{ p: 3 }}>
                {/* Status header */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    {resultState === 'valid'   && <CheckCircleIcon sx={{ color: COLORS.valid,   fontSize: 28 }} />}
                    {resultState === 'already' && <WarningAmberIcon sx={{ color: COLORS.already, fontSize: 28 }} />}
                    {resultState === 'invalid' && <ErrorIcon sx={{ color: COLORS.invalid, fontSize: 28 }} />}
                    <Typography variant="h6" fontWeight="bold" sx={{ color: accentColor }}>
                        {resultState === 'valid'   && 'Not Yet Checked In'}
                        {resultState === 'already' && (result.checkedInAt
                            ? `Checked in at ${formatTime(result.checkedInAt)}`
                            : 'Already Checked In')}
                        {resultState === 'invalid' && 'Invalid'}
                    </Typography>
                </Box>

                {resultState === 'invalid' ? (
                    <Typography color="text.secondary">{result.message}</Typography>
                ) : (
                    <>
                        <Typography variant="h4" fontWeight="bold" sx={{ mb: 0.5 }}>
                            {result.name}
                        </Typography>

                        <Chip
                            label={result.type === 'participant' ? 'Registered Participant' : 'Accompanying Person'}
                            size="small"
                            sx={{
                                bgcolor: result.type === 'participant' ? '#040002' : '#6c757d',
                                color: '#fff', mb: 2, borderRadius: 1,
                            }}
                        />

                        <Divider sx={{ my: 1.5 }} />

                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <DetailRow label="Registration ID" value={result.registrationId} mono />
                            <DetailRow label="Event" value={result.event} />

                            {result.type === 'participant' && <>
                                <DetailRow label="Category" value={result.category} />
                                {result.tshirtSize && <DetailRow label="T-shirt" value={result.tshirtSize} />}
                                {result.accompanyingCount > 0 && (
                                    <DetailRow
                                        label="Accompanying"
                                        value={`${result.accompanyingCount} person${result.accompanyingCount > 1 ? 's' : ''} also registered`}
                                    />
                                )}
                            </>}

                            {result.type === 'accompanying' && <>
                                <DetailRow label="Age" value={result.age} />
                                <DetailRow label="Registered under" value={result.parentName} />
                                <DetailRow label="Parent Reg. ID" value={result.parentRegistrationId} mono />
                            </>}
                        </Box>

                        {/* Check In button */}
                        {resultState === 'valid' && (
                            <Button
                                variant="contained"
                                fullWidth
                                size="large"
                                onClick={onCheckIn}
                                disabled={checkingIn}
                                sx={{
                                    mt: 3, py: 1.75, fontSize: '1.1rem', borderRadius: 2,
                                    backgroundColor: COLORS.valid,
                                    '&:hover': { backgroundColor: '#219a52' },
                                }}
                            >
                                {checkingIn
                                    ? <CircularProgress size={24} color="inherit" />
                                    : '✓  CHECK IN'}
                            </Button>
                        )}

                        {/* Undo strip — shown for 30s after volunteer check-in */}
                        {undoCountdown > 0 && (
                            <Box sx={{
                                mt: 2, px: 2, py: 1.25,
                                bgcolor: '#fef9e7', border: '1px solid #f39c12', borderRadius: 2,
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            }}>
                                <Typography variant="body2" color="text.secondary">
                                    Checked in at {formatTime(result.checkedInAt)}
                                </Typography>
                                <Button
                                    size="small"
                                    color="warning"
                                    variant="outlined"
                                    onClick={onUndo}
                                    disabled={undoing}
                                    sx={{ minWidth: 80, fontWeight: 'bold' }}
                                >
                                    {undoing ? <CircularProgress size={14} color="inherit" /> : `Undo ${undoCountdown}s`}
                                </Button>
                            </Box>
                        )}
                    </>
                )}

                <Button
                    variant="outlined"
                    fullWidth
                    size="large"
                    onClick={onScanNext}
                    startIcon={<QrCodeScannerIcon />}
                    sx={{ mt: 2, py: 1.5, fontSize: '1rem', borderRadius: 2 }}
                >
                    Scan Next
                </Button>
            </CardContent>
        </Card>
    );
}

function DetailRow({ label, value, mono }) {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ flexShrink: 0 }}>
                {label}
            </Typography>
            <Typography
                variant="body2"
                sx={{
                    fontFamily: mono ? 'monospace' : 'inherit',
                    fontWeight: mono ? 'normal' : 500,
                    textAlign: 'right',
                }}
            >
                {value}
            </Typography>
        </Box>
    );
}

// ─── Screen 3: Scanner + Manual ──────────────────────────────────────────────

function ScannerScreen({ eventSlug, eventName, onChangeEvent }) {
    const scannerRef = useRef(null);
    const scannerInstanceRef = useRef(null);

    const [activeTab, setActiveTab] = useState(0); // 0=Scan, 1=Manual
    const [scanning, setScanning] = useState(false);

    const [resultState, setResultState] = useState('');
    const [result, setResult] = useState(null);
    const [checkingIn, setCheckingIn] = useState(false);

    const [undoCountdown, setUndoCountdown] = useState(0);
    const [undoing, setUndoing] = useState(false);
    const undoTimerRef = useRef(null);

    // Manual lookup state
    const [manualQuery, setManualQuery] = useState('');
    const [manualResults, setManualResults] = useState(null);
    const [manualSearching, setManualSearching] = useState(false);

    function startScanner() {
        setResultState('');
        setResult(null);
        setUndoCountdown(0);
        clearUndoTimer();
        setScanning(true);
    }

    function stopScanner() {
        if (scannerInstanceRef.current) {
            scannerInstanceRef.current.clear().catch(() => {});
            scannerInstanceRef.current = null;
        }
        setScanning(false);
    }

    function clearUndoTimer() {
        if (undoTimerRef.current) {
            clearInterval(undoTimerRef.current);
            undoTimerRef.current = null;
        }
    }

    // Auto-start scanner when on Scan tab
    useEffect(() => {
        if (activeTab === 0 && resultState === '') {
            startScanner();
        }
        if (activeTab === 1) {
            stopScanner();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeTab]);

    // Mount/unmount camera
    useEffect(() => {
        if (!scanning || !scannerRef.current) return;

        const scanner = new Html5QrcodeScanner(
            'qr-reader',
            { fps: 10, qrbox: { width: 260, height: 260 }, rememberLastUsedCamera: true },
            false
        );

        scanner.render(
            async (decodedText) => {
                scanner.clear().catch(() => {});
                scannerInstanceRef.current = null;
                setScanning(false);
                await handleLookup(decodedText);
            },
            () => {}
        );

        scannerInstanceRef.current = scanner;

        return () => { scanner.clear().catch(() => {}); };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [scanning]);

    // Cleanup on unmount
    useEffect(() => () => clearUndoTimer(), []);

    async function handleLookup(raw) {
        setResultState('loading');
        setResult(null);
        setUndoCountdown(0);
        clearUndoTimer();

        let uid;
        try {
            const parsed = JSON.parse(raw);
            uid = parsed.id;
        } catch {
            uid = raw.trim();
        }

        if (!uid) {
            setResultState('invalid');
            setResult({ message: 'Could not read QR code. Please try again.' });
            return;
        }

        try {
            const res = await fetch(`${BASE_URL}/api/checkin/${encodeURIComponent(uid)}`);
            const data = await res.json();

            if (!res.ok || !data.valid) {
                setResultState('invalid');
                setResult({ message: data.message || 'Registration not found.' });
                return;
            }

            if (data.checkedIn) {
                setResultState('already');
                setResult(data);
            } else {
                setResultState('valid');
                setResult(data);
            }
        } catch {
            setResultState('invalid');
            setResult({ message: 'Network error. Please check connection and try again.' });
        }
    }

    async function handleCheckIn() {
        if (!result) return;
        setCheckingIn(true);
        try {
            const res = await fetch(`${BASE_URL}/api/checkin/${encodeURIComponent(result.registrationId)}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });
            const data = await res.json();

            if (data.alreadyCheckedIn) {
                setResultState('already');
                setResult(prev => ({ ...prev, checkedIn: true, checkedInAt: data.checkedInAt }));
            } else if (data.success) {
                setResultState('already');
                setResult(prev => ({ ...prev, checkedIn: true, checkedInAt: data.checkedInAt }));
                // Start 30-second undo countdown
                setUndoCountdown(30);
                undoTimerRef.current = setInterval(() => {
                    setUndoCountdown(prev => {
                        if (prev <= 1) {
                            clearInterval(undoTimerRef.current);
                            undoTimerRef.current = null;
                            return 0;
                        }
                        return prev - 1;
                    });
                }, 1000);
            } else {
                setResultState('invalid');
                setResult({ message: 'Check-in failed. Please try again.' });
            }
        } catch {
            setResultState('invalid');
            setResult({ message: 'Network error during check-in. Please try again.' });
        } finally {
            setCheckingIn(false);
        }
    }

    async function handleUndo() {
        if (!result) return;
        setUndoing(true);
        try {
            const res = await fetch(`${BASE_URL}/api/checkin/${encodeURIComponent(result.registrationId)}`, {
                method: 'DELETE',
            });
            const data = await res.json();
            if (data.success) {
                clearUndoTimer();
                setUndoCountdown(0);
                setResultState('valid');
                setResult(prev => ({ ...prev, checkedIn: false, checkedInAt: null }));
            }
        } catch {
            // silently fail undo
        } finally {
            setUndoing(false);
        }
    }

    function handleScanNext() {
        setResultState('');
        setResult(null);
        setUndoCountdown(0);
        clearUndoTimer();
        setManualQuery('');
        setManualResults(null);
        if (activeTab === 0) startScanner();
    }

    async function handleManualSearch() {
        if (!manualQuery.trim()) return;
        setManualSearching(true);
        setManualResults(null);
        setResultState('');
        setResult(null);
        try {
            const res = await fetch(
                `${BASE_URL}/api/checkin/search?eventSlug=${encodeURIComponent(eventSlug)}&query=${encodeURIComponent(manualQuery.trim())}`
            );
            const data = await res.json();
            setManualResults(data.results || []);
        } catch {
            setManualResults([]);
        } finally {
            setManualSearching(false);
        }
    }

    function handleSelectManualResult(r) {
        setResult(r);
        setResultState(r.checkedIn ? 'already' : 'valid');
        setManualResults(null);
    }

    const showResultCard = resultState === 'valid' || resultState === 'already' || resultState === 'invalid';

    return (
        <Box sx={{ backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
            {/* Top bar */}
            <Box sx={{
                bgcolor: '#040002', color: 'white', px: 2, py: 1.5,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <QrCodeScannerIcon sx={{ fontSize: 20 }} />
                    <Typography variant="body1" fontWeight="bold" noWrap sx={{ maxWidth: 220 }}>
                        {eventName}
                    </Typography>
                </Box>
                <Button
                    size="small"
                    onClick={onChangeEvent}
                    sx={{ color: '#aaa', textTransform: 'none', fontSize: '0.75rem', minWidth: 0 }}
                >
                    Change
                </Button>
            </Box>

            <Container maxWidth="sm" sx={{ pt: 2, pb: 8 }}>

                {/* Tabs */}
                {!showResultCard && (
                    <Tabs
                        value={activeTab}
                        onChange={(_, v) => { setActiveTab(v); }}
                        variant="fullWidth"
                        sx={{ mb: 2, bgcolor: 'white', borderRadius: 2, boxShadow: 1 }}
                    >
                        <Tab
                            icon={<QrCodeScannerIcon />}
                            label="Scan QR"
                            iconPosition="start"
                            sx={{ fontWeight: 'bold' }}
                        />
                        <Tab
                            icon={<SearchIcon />}
                            label="Manual Lookup"
                            iconPosition="start"
                            sx={{ fontWeight: 'bold' }}
                        />
                    </Tabs>
                )}

                {/* Loading */}
                {resultState === 'loading' && (
                    <Box sx={{ textAlign: 'center', mt: 8 }}>
                        <CircularProgress />
                        <Typography sx={{ mt: 2 }} color="text.secondary">
                            Looking up registration…
                        </Typography>
                    </Box>
                )}

                {/* QR tab content */}
                {activeTab === 0 && resultState === '' && (
                    <Box>
                        {scanning ? (
                            <Box>
                                <div id="qr-reader" ref={scannerRef} style={{ width: '100%' }} />
                                <Button
                                    variant="outlined"
                                    fullWidth
                                    onClick={stopScanner}
                                    sx={{ mt: 2 }}
                                >
                                    Cancel
                                </Button>
                            </Box>
                        ) : (
                            <Box sx={{ textAlign: 'center', mt: 6 }}>
                                <Button
                                    variant="contained"
                                    size="large"
                                    onClick={startScanner}
                                    startIcon={<QrCodeScannerIcon />}
                                    sx={{
                                        backgroundColor: '#040002', px: 4, py: 1.75,
                                        fontSize: '1rem',
                                    }}
                                >
                                    Start Scanning
                                </Button>
                            </Box>
                        )}
                    </Box>
                )}

                {/* Manual tab content */}
                {activeTab === 1 && !showResultCard && (
                    <Box>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <TextField
                                fullWidth
                                autoFocus
                                placeholder="Registration ID or Phone Number"
                                value={manualQuery}
                                onChange={e => setManualQuery(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleManualSearch()}
                                InputProps={{ sx: { fontSize: '1rem', py: 0.5 } }}
                            />
                            <Button
                                variant="contained"
                                onClick={handleManualSearch}
                                disabled={manualSearching || !manualQuery.trim()}
                                sx={{
                                    minWidth: 56, px: 2,
                                    backgroundColor: '#040002',
                                    '&:hover': { backgroundColor: '#333' },
                                }}
                            >
                                {manualSearching
                                    ? <CircularProgress size={20} color="inherit" />
                                    : <SearchIcon />}
                            </Button>
                        </Box>

                        {/* Search results list */}
                        {manualResults !== null && (
                            <Box sx={{ mt: 2 }}>
                                {manualResults.length === 0 ? (
                                    <Typography color="text.secondary" sx={{ textAlign: 'center', mt: 3 }}>
                                        No registrations found
                                    </Typography>
                                ) : (
                                    manualResults.map((r, i) => (
                                        <Card
                                            key={i}
                                            onClick={() => handleSelectManualResult(r)}
                                            sx={{
                                                mb: 1.5, cursor: 'pointer', borderRadius: 2,
                                                borderLeft: `5px solid ${r.checkedIn ? COLORS.already : COLORS.valid}`,
                                                '&:hover': { boxShadow: 4 },
                                            }}
                                        >
                                            <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
                                                <Typography fontWeight="bold">{r.name}</Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {r.registrationId} · {r.category}
                                                </Typography>
                                                <Typography variant="caption" sx={{ color: r.checkedIn ? COLORS.already : COLORS.valid }}>
                                                    {r.checkedIn ? 'Already checked in' : 'Not yet checked in'}
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    ))
                                )}
                            </Box>
                        )}
                    </Box>
                )}

                {/* Result card */}
                {showResultCard && (
                    <ResultCard
                        resultState={resultState}
                        result={result}
                        onCheckIn={handleCheckIn}
                        checkingIn={checkingIn}
                        undoCountdown={undoCountdown}
                        onUndo={handleUndo}
                        undoing={undoing}
                        onScanNext={handleScanNext}
                    />
                )}
            </Container>
        </Box>
    );
}

// ─── Root component ───────────────────────────────────────────────────────────

export default function CheckInScanner() {
    // screen: 'event' | 'pin' | 'scanner'
    const [screen, setScreen] = useState(() => {
        const s = getSession();
        return s?.verified ? 'scanner' : 'event';
    });
    const [eventSlug, setEventSlug] = useState(() => getSession()?.eventSlug || '');
    const [eventName, setEventName] = useState(() => getSession()?.eventName || '');
    // Pending slug/name before PIN verified
    const [pendingSlug, setPendingSlug] = useState('');
    const [pendingName, setPendingName] = useState('');

    function handleEventContinue(slug, name) {
        setPendingSlug(slug);
        setPendingName(name);
        setScreen('pin');
    }

    function handlePinSuccess(verifiedName) {
        const name = verifiedName || pendingName;
        saveSession(pendingSlug, name);
        setEventSlug(pendingSlug);
        setEventName(name);
        setScreen('scanner');
    }

    function handleChangeEvent() {
        clearSession();
        setEventSlug('');
        setEventName('');
        setPendingSlug('');
        setPendingName('');
        setScreen('event');
    }

    if (screen === 'event') {
        return <EventSelectScreen onContinue={handleEventContinue} />;
    }
    if (screen === 'pin') {
        return (
            <PinScreen
                eventSlug={pendingSlug}
                eventName={pendingName}
                onSuccess={handlePinSuccess}
                onChangeEvent={handleChangeEvent}
            />
        );
    }
    return (
        <ScannerScreen
            eventSlug={eventSlug}
            eventName={eventName}
            onChangeEvent={handleChangeEvent}
        />
    );
}

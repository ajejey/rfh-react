import React, { useState, useCallback } from 'react';
import {
    Box, Button, Typography, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, Chip, CircularProgress, LinearProgress,
    TextField, MenuItem, Tooltip, Snackbar, Alert,
} from '@mui/material';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import useAdminAuth from '../../CustomHooks/useAdminAuth';

const BASE = process.env.REACT_APP_BACKEND_BASE_URL;

const SURFACE = '#151929';
const BORDER = 'rgba(255,255,255,0.08)';
const TEXT_PRI = '#f1f5f9';
const TEXT_SEC = '#94a3b8';

// Run async tasks with a small concurrency cap so we never fire 40 requests at once,
// while still being much faster than strict one-at-a-time.
async function runPool(items, worker, concurrency = 4) {
    let i = 0;
    const next = async () => {
        while (i < items.length) {
            const idx = i++;
            await worker(items[idx], idx);
        }
    };
    await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, next));
}

export default function PaymentRecovery() {
    const { token } = useAdminAuth();
    const [days, setDays] = useState(14);
    const [scanning, setScanning] = useState(false);
    const [checkProgress, setCheckProgress] = useState({ done: 0, total: 0 });
    const [rows, setRows] = useState([]); // each: {orderId, merchantTransactionId, name, email, phone, amount, marathonName, dbSuccess, emailSent, check, captured, paymentId, capturedAmount, recover}
    const [onlyPaid, setOnlyPaid] = useState(true);
    const [snack, setSnack] = useState({ open: false, msg: '', sev: 'success' });

    const authHeaders = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };

    const update = useCallback((orderId, patch) => {
        setRows(prev => prev.map(r => (r.orderId === orderId ? { ...r, ...patch } : r)));
    }, []);

    const checkOne = useCallback(async (orderId) => {
        update(orderId, { check: 'checking' });
        try {
            const r = await fetch(`${BASE}/api/marathons/admin/check-order`, {
                method: 'POST', headers: authHeaders, body: JSON.stringify({ orderId }),
            });
            const d = await r.json();
            if (!r.ok) throw new Error(d.error || 'check failed');
            update(orderId, {
                check: d.captured ? 'paid' : 'notPaid',
                captured: d.captured,
                paymentId: d.paymentId,
                capturedAmount: d.amount,
                method: d.method,
            });
        } catch (e) {
            update(orderId, { check: 'error', checkError: e.message });
        }
        setCheckProgress(p => ({ ...p, done: p.done + 1 }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]);

    const scan = useCallback(async () => {
        setScanning(true);
        setRows([]);
        setCheckProgress({ done: 0, total: 0 });
        try {
            const r = await fetch(`${BASE}/api/marathons/admin/unreconciled?days=${days}`, { headers: authHeaders });
            const d = await r.json();
            if (!r.ok) throw new Error(d.error || 'scan failed');
            const initial = (d.rows || []).map(x => ({ ...x, check: 'idle', recover: 'idle' }));
            setRows(initial);
            setCheckProgress({ done: 0, total: initial.length });
            // Auto-check each order against Razorpay (browser-orchestrated, capped concurrency).
            await runPool(initial.map(x => x.orderId), checkOne, 4);
        } catch (e) {
            setSnack({ open: true, msg: e.message, sev: 'error' });
        } finally {
            setScanning(false);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [days, token, checkOne]);

    const recoverOne = useCallback(async (orderId) => {
        update(orderId, { recover: 'recovering' });
        try {
            const r = await fetch(`${BASE}/api/marathons/admin/recover-order`, {
                method: 'POST', headers: authHeaders, body: JSON.stringify({ orderId }),
            });
            const d = await r.json();
            if (!r.ok || !d.recovered) throw new Error(d.error || d.reason || 'recover failed');
            update(orderId, {
                recover: d.emailSent ? 'done' : 'done_no_email',
                dbSuccess: true,
                emailSent: d.emailSent,
                emailIssue: d.emailSent ? null : (d.error || d.reason || 'email not sent'),
            });
            return true;
        } catch (e) {
            update(orderId, { recover: 'failed', recoverError: e.message });
            return false;
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]);

    const recoverAllPaid = useCallback(async () => {
        const targets = rows.filter(r => r.check === 'paid' && r.recover !== 'done').map(r => r.orderId);
        if (!targets.length) return;
        // One order per request, sequential — guarantees each stays under Vercel's 10s limit.
        let ok = 0;
        for (const orderId of targets) {
            const success = await recoverOne(orderId);
            if (success) ok++;
        }
        setSnack({ open: true, msg: `Recovered ${ok}/${targets.length} registrations and emailed receipts.`, sev: ok === targets.length ? 'success' : 'warning' });
    }, [rows, recoverOne]);

    const paidCount = rows.filter(r => r.check === 'paid').length;
    const notPaidCount = rows.filter(r => r.check === 'notPaid').length;
    const recoveredCount = rows.filter(r => r.recover === 'done' || r.recover === 'done_no_email').length;
    const visibleRows = onlyPaid ? rows.filter(r => r.check === 'paid' || r.check === 'checking' || r.check === 'error') : rows;

    const checkChip = (r) => {
        switch (r.check) {
            case 'checking': return <Chip size="small" label="checking…" sx={{ bgcolor: 'rgba(148,163,184,0.15)', color: TEXT_SEC }} />;
            case 'paid': return <Chip size="small" label={`PAID ₹${r.capturedAmount ?? ''}`} sx={{ bgcolor: 'rgba(74,222,128,0.15)', color: '#4ade80', fontWeight: 600 }} />;
            case 'notPaid': return <Chip size="small" label="not charged" sx={{ bgcolor: 'rgba(148,163,184,0.12)', color: TEXT_SEC }} />;
            case 'error': return <Tooltip title={r.checkError || ''}><Chip size="small" label="check error" sx={{ bgcolor: 'rgba(248,113,113,0.15)', color: '#f87171' }} /></Tooltip>;
            default: return <Chip size="small" label="—" sx={{ bgcolor: 'transparent', color: TEXT_SEC }} />;
        }
    };

    const recoverCell = (r) => {
        if (r.check !== 'paid') return <span style={{ color: TEXT_SEC }}>—</span>;
        if (r.recover === 'done') return <Chip size="small" label="✓ Recovered + emailed" sx={{ bgcolor: 'rgba(74,222,128,0.15)', color: '#4ade80' }} />;
        if (r.recover === 'done_no_email') return (
            <Tooltip title={`Marked paid, but receipt email did NOT send: ${r.emailIssue || 'unknown'}. Fix email config, then click Retry.`}>
                <Button size="small" variant="outlined" onClick={() => recoverOne(r.orderId)}
                    sx={{ borderColor: '#facc15', color: '#facc15', textTransform: 'none' }}>
                    ✓ Paid · email failed — Retry
                </Button>
            </Tooltip>
        );
        if (r.recover === 'recovering') return <CircularProgress size={18} sx={{ color: '#4ade80' }} />;
        if (r.recover === 'failed') return (
            <Tooltip title={r.recoverError || ''}>
                <Button size="small" variant="outlined" color="error" onClick={() => recoverOne(r.orderId)}>Retry</Button>
            </Tooltip>
        );
        return (
            <Button size="small" variant="contained" startIcon={<SendRoundedIcon sx={{ fontSize: 16 }} />}
                onClick={() => recoverOne(r.orderId)}
                sx={{ bgcolor: '#2f6e49', '&:hover': { bgcolor: '#256039' }, textTransform: 'none' }}>
                Recover &amp; Email
            </Button>
        );
    };

    return (
        <Box sx={{ p: { xs: 2, md: 4 }, color: TEXT_PRI }}>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>Payment Recovery</Typography>
            <Typography sx={{ color: TEXT_SEC, mb: 3, fontSize: 14 }}>
                Find registrations that were <b>paid in Razorpay but show as failed</b> here, then mark them paid and email the receipt — one safe step at a time.
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap', mb: 3 }}>
                <TextField
                    select size="small" label="Look back" value={days}
                    onChange={e => setDays(Number(e.target.value))} disabled={scanning}
                    sx={{ width: 140, '& .MuiInputBase-root': { color: TEXT_PRI }, '& label': { color: TEXT_SEC }, '& fieldset': { borderColor: BORDER } }}
                >
                    {[3, 7, 14, 30, 60, 90, 120].map(d => <MenuItem key={d} value={d}>{d} days</MenuItem>)}
                </TextField>
                <Button variant="contained" startIcon={<RefreshRoundedIcon />} onClick={scan} disabled={scanning}
                    sx={{ bgcolor: '#2f6e49', '&:hover': { bgcolor: '#256039' }, textTransform: 'none' }}>
                    {scanning ? 'Scanning…' : 'Scan for paid-but-failed'}
                </Button>
                {rows.length > 0 && (
                    <Button variant="outlined" onClick={() => setOnlyPaid(o => !o)}
                        sx={{ borderColor: BORDER, color: TEXT_PRI, textTransform: 'none' }}>
                        {onlyPaid ? 'Show all suspects' : 'Show only paid'}
                    </Button>
                )}
                {paidCount > 0 && (
                    <Button variant="contained" startIcon={<SendRoundedIcon />} onClick={recoverAllPaid} disabled={scanning}
                        sx={{ bgcolor: '#1d4ed8', '&:hover': { bgcolor: '#1742a8' }, textTransform: 'none', ml: 'auto' }}>
                        Recover all paid ({paidCount - recoveredCount} left)
                    </Button>
                )}
            </Box>

            {checkProgress.total > 0 && checkProgress.done < checkProgress.total && (
                <Box sx={{ mb: 2 }}>
                    <Typography sx={{ color: TEXT_SEC, fontSize: 13, mb: 0.5 }}>
                        Checking against Razorpay… {checkProgress.done}/{checkProgress.total}
                    </Typography>
                    <LinearProgress variant="determinate" value={(checkProgress.done / checkProgress.total) * 100}
                        sx={{ height: 6, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.06)', '& .MuiLinearProgress-bar': { bgcolor: '#4ade80' } }} />
                </Box>
            )}

            {rows.length > 0 && checkProgress.done === checkProgress.total && (
                <Box sx={{ display: 'flex', gap: 1.5, mb: 2, flexWrap: 'wrap' }}>
                    <Chip label={`${paidCount} paid but failed`} sx={{ bgcolor: 'rgba(74,222,128,0.15)', color: '#4ade80', fontWeight: 600 }} />
                    <Chip label={`${notPaidCount} never charged`} sx={{ bgcolor: 'rgba(148,163,184,0.12)', color: TEXT_SEC }} />
                    {recoveredCount > 0 && <Chip label={`${recoveredCount} recovered`} sx={{ bgcolor: 'rgba(29,78,216,0.18)', color: '#93c5fd' }} />}
                </Box>
            )}

            <TableContainer component={Paper} sx={{ bgcolor: SURFACE, border: `1px solid ${BORDER}` }}>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            {['Participant', 'Event', 'Amount', 'Transaction ID', 'Phone', 'Razorpay', 'Action'].map(h => (
                                <TableCell key={h} sx={{ color: TEXT_SEC, fontWeight: 600, borderColor: BORDER }}>{h}</TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {visibleRows.map(r => (
                            <TableRow key={r.orderId} hover>
                                <TableCell sx={{ color: TEXT_PRI, borderColor: BORDER }}>
                                    {r.name || '—'}<br /><span style={{ color: TEXT_SEC, fontSize: 12 }}>{r.email}</span>
                                </TableCell>
                                <TableCell sx={{ color: TEXT_SEC, borderColor: BORDER, fontSize: 12 }}>{r.marathonName}</TableCell>
                                <TableCell sx={{ color: TEXT_PRI, borderColor: BORDER }}>₹{r.amount ?? '—'}</TableCell>
                                <TableCell sx={{ color: TEXT_SEC, borderColor: BORDER, fontSize: 12, fontFamily: 'monospace' }}>{r.merchantTransactionId}</TableCell>
                                <TableCell sx={{ color: TEXT_SEC, borderColor: BORDER, fontSize: 12 }}>{r.phone || '—'}</TableCell>
                                <TableCell sx={{ borderColor: BORDER }}>{checkChip(r)}</TableCell>
                                <TableCell sx={{ borderColor: BORDER }}>{recoverCell(r)}</TableCell>
                            </TableRow>
                        ))}
                        {rows.length === 0 && !scanning && (
                            <TableRow><TableCell colSpan={7} sx={{ color: TEXT_SEC, textAlign: 'center', py: 4, borderColor: BORDER }}>
                                Click “Scan for paid-but-failed” to begin.
                            </TableCell></TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <Snackbar open={snack.open} autoHideDuration={6000} onClose={() => setSnack(s => ({ ...s, open: false }))}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
                <Alert severity={snack.sev} variant="filled" onClose={() => setSnack(s => ({ ...s, open: false }))}>{snack.msg}</Alert>
            </Snackbar>
        </Box>
    );
}

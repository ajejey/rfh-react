import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
    Box, Container, Typography, Card, TextField, MenuItem, Button, IconButton,
    Table, TableBody, TableCell, TableHead, TableRow, TablePagination, Chip,
    CircularProgress, Snackbar, Alert, Tooltip, Dialog, DialogTitle, DialogContent,
    DialogActions, useMediaQuery, useTheme,
} from '@mui/material';
import MonetizationOnRoundedIcon from '@mui/icons-material/MonetizationOnRounded';
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import TableViewRoundedIcon from '@mui/icons-material/TableViewRounded';
import useAdminAuth from '../../CustomHooks/useAdminAuth';

const BASE = process.env.REACT_APP_BACKEND_BASE_URL;

const CARD_BG = '#1a2035';
const SURFACE = '#151929';
const BORDER = 'rgba(255,255,255,0.06)';
const ACCENT = '#2f6e49';
const ACCENT_LT = '#4ade80';
const TEXT_PRI = '#f1f5f9';
const TEXT_SEC = '#64748b';

const STATUS_OPTIONS = [
    { value: 'all', label: 'All donations' },
    { value: 'paid', label: 'Paid' },
    { value: 'offline', label: 'Manual / offline' },
    { value: 'unpaid', label: 'Not completed' },
];

const STATUS_CHIP = {
    paid: { label: 'Paid', color: '#4ade80', bg: 'rgba(74,222,128,0.12)' },
    offline: { label: 'Manual', color: '#60a5fa', bg: 'rgba(96,165,250,0.12)' },
    pending: { label: 'Pending', color: '#fbbf24', bg: 'rgba(251,191,36,0.12)' },
    failed: { label: 'Failed', color: '#f87171', bg: 'rgba(248,113,113,0.12)' },
};

const EMAIL_LABEL = {
    sent: { text: 'Sent', color: ACCENT_LT, hint: 'Receipt email was sent by the system' },
    not_sent: { text: 'Not sent', color: '#fbbf24', hint: 'The system has no record of sending this receipt' },
    unknown: { text: '—', color: TEXT_SEC, hint: 'Older record — receipt emails were not tracked back then' },
};

const inputSx = {
    '& .MuiOutlinedInput-root': {
        color: TEXT_PRI,
        '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
        '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
        '&.Mui-focused fieldset': { borderColor: ACCENT_LT },
    },
    '& .MuiInputLabel-root': { color: TEXT_SEC },
};

const cellSx = { color: TEXT_PRI, borderColor: BORDER, fontSize: '0.82rem', whiteSpace: 'nowrap' };
const headSx = { color: TEXT_SEC, borderColor: BORDER, fontSize: '0.72rem', fontWeight: 700, letterSpacing: 0.6, textTransform: 'uppercase', whiteSpace: 'nowrap' };

// Pinned to IST like the receipt PDF, the CSV and the from/to filter — otherwise an
// admin on a non-IST browser sees 10 Feb for a row a From=11 Feb filter returned.
const formatDate = (d) => (d
    ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'Asia/Kolkata' })
    : '—');
const formatAmount = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;

// Pull the server's error message out of a failed response, falling back to the status text.
async function errorMessage(response, fallback) {
    try {
        const data = await response.json();
        if (data?.message) return data.message;
    } catch { /* non-JSON body */ }
    return fallback || `Request failed (${response.status})`;
}

function saveBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    // Firefox and Safari read the blob asynchronously after the click; revoking in the
    // same tick aborts the download and writes a 0-byte file with no error anywhere.
    setTimeout(() => URL.revokeObjectURL(url), 10000);
}

export default function GetAllDonations() {
    const { token } = useAdminAuth();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const [searchInput, setSearchInput] = useState('');
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('all');
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');

    const [page, setPage] = useState(0);       // 0-based for TablePagination
    const [limit, setLimit] = useState(50);
    const [rows, setRows] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [loadError, setLoadError] = useState('');
    const [truncated, setTruncated] = useState(false);
    const latestRequest = useRef(0);

    const [downloading, setDownloading] = useState(null);   // receiptNo being downloaded
    const [csvLoading, setCsvLoading] = useState(false);
    const [resend, setResend] = useState({ open: false, row: null, email: '', busy: false });
    const [snack, setSnack] = useState({ open: false, msg: '', sev: 'success' });

    const notify = (msg, sev = 'success') => setSnack({ open: true, msg, sev });

    // Debounce the search box so typing doesn't fire a request per keystroke.
    useEffect(() => {
        const id = setTimeout(() => { setSearch(searchInput.trim()); setPage(0); }, 400);
        return () => clearTimeout(id);
    }, [searchInput]);

    const filterParams = useCallback(() => {
        const params = new URLSearchParams();
        if (search) params.set('search', search);
        if (status !== 'all') params.set('status', status);
        if (from) params.set('from', from);
        if (to) params.set('to', to);
        return params;
    }, [search, status, from, to]);

    const load = useCallback(async () => {
        if (!token) return;
        // Filters change faster than requests return. Without this, a slow earlier
        // request can land after a newer one and fill the table with rows that don't
        // match the filters currently on screen.
        const requestId = ++latestRequest.current;
        const isStale = () => requestId !== latestRequest.current;

        setLoading(true);
        setLoadError('');
        try {
            const params = filterParams();
            params.set('page', String(page + 1));
            params.set('limit', String(limit));
            const r = await fetch(`${BASE}/api/donations/admin/list?${params.toString()}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!r.ok) throw new Error(await errorMessage(r, 'Could not load donations'));
            const data = await r.json();
            if (isStale()) return;
            setRows(data.rows || []);
            setTotal(data.total || 0);
            setTruncated(data.truncatedSearch === true);
        } catch (e) {
            if (isStale()) return;
            setRows([]);
            setTotal(0);
            setTruncated(false);
            setLoadError(e.message);
        } finally {
            if (!isStale()) setLoading(false);
        }
    }, [token, filterParams, page, limit]);

    useEffect(() => { load(); }, [load]);

    const downloadInvoice = async (row) => {
        setDownloading(row.receiptNo);
        try {
            const r = await fetch(`${BASE}/api/donations/admin/${encodeURIComponent(row.receiptNo)}/invoice`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!r.ok) throw new Error(await errorMessage(r, 'Could not generate the receipt'));
            const blob = await r.blob();
            const safeName = String(row.donorName || 'donor').replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-|-$/g, '') || 'donor';
            saveBlob(blob, `RFH-Receipt-${safeName}-${row.receiptNo}.pdf`);
        } catch (e) {
            notify(e.message, 'error');
        } finally {
            setDownloading(null);
        }
    };

    const downloadCsv = async () => {
        setCsvLoading(true);
        try {
            const r = await fetch(`${BASE}/api/donations/csv?${filterParams().toString()}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!r.ok) throw new Error(await errorMessage(r, 'Could not export CSV'));
            saveBlob(await r.blob(), 'donations.csv');
        } catch (e) {
            notify(e.message, 'error');
        } finally {
            setCsvLoading(false);
        }
    };

    const submitResend = async () => {
        const { row, email } = resend;
        setResend(s => ({ ...s, busy: true }));
        try {
            const r = await fetch(`${BASE}/api/donations/admin/${encodeURIComponent(row.receiptNo)}/resend`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ email: email.trim() }),
            });
            if (!r.ok) throw new Error(await errorMessage(r, 'Could not send the email'));
            const data = await r.json();
            notify(`Receipt emailed to ${data.sentTo}`);
            setResend({ open: false, row: null, email: '', busy: false });
            load();
        } catch (e) {
            notify(e.message, 'error');
            setResend(s => ({ ...s, busy: false }));
        }
    };

    return (
        <Container maxWidth="xl" sx={{ py: { xs: 2, sm: 3, md: 4 } }}>
            {/* Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                <Box sx={{
                    width: 48, height: 48, borderRadius: 2, flexShrink: 0,
                    bgcolor: 'rgba(74,222,128,0.12)', color: ACCENT_LT,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                    <MonetizationOnRoundedIcon />
                </Box>
                <Box>
                    <Typography sx={{ color: TEXT_PRI, fontWeight: 700, fontSize: { xs: '1.05rem', sm: '1.25rem' } }}>
                        Donations &amp; Receipts
                    </Typography>
                    <Typography sx={{ color: TEXT_SEC, fontSize: { xs: '0.75rem', sm: '0.85rem' } }}>
                        Find any past donation and download or re-send its 80G receipt
                    </Typography>
                </Box>
            </Box>

            {/* Filters */}
            <Card elevation={0} sx={{ bgcolor: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: 2, p: { xs: 2, sm: 2.5 }, mb: 2.5 }}>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
                    <TextField
                        size="small"
                        label="Search name, email, phone or receipt no"
                        value={searchInput}
                        onChange={e => setSearchInput(e.target.value)}
                        sx={{ ...inputSx, flex: '1 1 280px', minWidth: 220 }}
                    />
                    <TextField
                        select size="small" label="Status" value={status}
                        onChange={e => { setStatus(e.target.value); setPage(0); }}
                        sx={{ ...inputSx, flex: '0 1 180px', minWidth: 160 }}
                    >
                        {STATUS_OPTIONS.map(o => <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>)}
                    </TextField>
                    <TextField
                        size="small" type="date" label="From" value={from}
                        onChange={e => { setFrom(e.target.value); setPage(0); }}
                        InputLabelProps={{ shrink: true }}
                        sx={{ ...inputSx, flex: '0 1 160px', minWidth: 150 }}
                    />
                    <TextField
                        size="small" type="date" label="To" value={to}
                        onChange={e => { setTo(e.target.value); setPage(0); }}
                        InputLabelProps={{ shrink: true }}
                        sx={{ ...inputSx, flex: '0 1 160px', minWidth: 150 }}
                    />
                    <Box sx={{ display: 'flex', gap: 1, ml: 'auto' }}>
                        <Tooltip title="Reload">
                            <span>
                                <IconButton onClick={load} disabled={loading} sx={{ color: TEXT_SEC, '&:hover': { color: TEXT_PRI } }}>
                                    <RefreshRoundedIcon />
                                </IconButton>
                            </span>
                        </Tooltip>
                        <Button
                            variant="outlined" size="small"
                            startIcon={csvLoading ? <CircularProgress size={15} /> : <TableViewRoundedIcon />}
                            onClick={downloadCsv} disabled={csvLoading}
                            sx={{
                                borderColor: 'rgba(255,255,255,0.12)', color: TEXT_SEC, textTransform: 'none',
                                '&:hover': { borderColor: 'rgba(255,255,255,0.25)' },
                            }}
                        >
                            Export CSV
                        </Button>
                    </Box>
                </Box>
            </Card>

            {loadError && (
                <Alert severity="error" sx={{ mb: 2, bgcolor: 'rgba(239,68,68,0.1)', color: '#fca5a5' }}>
                    {loadError}
                </Alert>
            )}

            {truncated && (
                <Alert severity="warning" sx={{ mb: 2, bgcolor: 'rgba(245,158,11,0.1)', color: '#fbbf24' }}>
                    That search matched too many donors to check them all — some results are missing.
                    Use a fuller name, the exact email, or the phone number.
                </Alert>
            )}

            {/* Results */}
            <Card elevation={0} sx={{ bgcolor: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: 2, overflow: 'hidden' }}>
                <Box sx={{ px: 2.5, py: 1.5, borderBottom: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Typography sx={{ color: TEXT_SEC, fontSize: '0.8rem' }}>
                        {loading ? 'Loading…' : `${total.toLocaleString('en-IN')} donation${total === 1 ? '' : 's'}`}
                    </Typography>
                    {loading && <CircularProgress size={14} sx={{ color: ACCENT_LT }} />}
                </Box>

                <Box sx={{ overflowX: 'auto' }}>
                    <Table size="small" sx={{ minWidth: 900 }}>
                        <TableHead>
                            <TableRow sx={{ bgcolor: SURFACE }}>
                                <TableCell sx={headSx}>Date</TableCell>
                                <TableCell sx={headSx}>Receipt No</TableCell>
                                <TableCell sx={headSx}>Donor</TableCell>
                                <TableCell sx={headSx} align="right">Amount</TableCell>
                                <TableCell sx={headSx}>Cause</TableCell>
                                <TableCell sx={headSx}>Status</TableCell>
                                <TableCell sx={headSx}>Receipt email</TableCell>
                                <TableCell sx={headSx} align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {!loading && rows.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={8} sx={{ ...cellSx, color: TEXT_SEC, textAlign: 'center', py: 5 }}>
                                        No donations match these filters.
                                    </TableCell>
                                </TableRow>
                            )}
                            {rows.map(row => {
                                const chip = STATUS_CHIP[row.status] || STATUS_CHIP.pending;
                                const mail = EMAIL_LABEL[row.emailStatus] || EMAIL_LABEL.unknown;
                                return (
                                    <TableRow key={row.receiptNo} hover sx={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.02)' } }}>
                                        <TableCell sx={cellSx}>{formatDate(row.date)}</TableCell>
                                        <TableCell sx={{ ...cellSx, fontFamily: 'monospace', fontSize: '0.75rem' }}>
                                            {row.receiptNo}
                                        </TableCell>
                                        <TableCell sx={{ ...cellSx, whiteSpace: 'normal', minWidth: 200 }}>
                                            <Typography sx={{ color: TEXT_PRI, fontSize: '0.82rem', fontWeight: 600 }}>
                                                {row.donorName || '—'}
                                            </Typography>
                                            <Typography sx={{ color: TEXT_SEC, fontSize: '0.72rem' }}>
                                                {[row.email, row.mobNo].filter(Boolean).join(' · ') || 'No contact on file'}
                                            </Typography>
                                        </TableCell>
                                        <TableCell sx={{ ...cellSx, fontWeight: 700 }} align="right">
                                            {formatAmount(row.amount)}
                                        </TableCell>
                                        <TableCell sx={{ ...cellSx, whiteSpace: 'normal', maxWidth: 180, color: TEXT_SEC }}>
                                            {row.cause || '—'}
                                        </TableCell>
                                        <TableCell sx={cellSx}>
                                            <Chip
                                                label={chip.label} size="small"
                                                sx={{ bgcolor: chip.bg, color: chip.color, fontWeight: 600, fontSize: '0.68rem', height: 22 }}
                                            />
                                        </TableCell>
                                        <TableCell sx={cellSx}>
                                            <Tooltip title={row.lastResentAt ? `Re-sent ${formatDate(row.lastResentAt)}` : mail.hint}>
                                                <Typography sx={{ color: mail.color, fontSize: '0.75rem' }}>
                                                    {row.lastResentAt ? 'Re-sent' : mail.text}
                                                </Typography>
                                            </Tooltip>
                                        </TableCell>
                                        <TableCell sx={cellSx} align="right">
                                            <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'flex-end' }}>
                                                <Tooltip title={row.hasDonor ? 'Download receipt PDF' : 'No donor record attached'}>
                                                    <span>
                                                        <IconButton
                                                            size="small"
                                                            disabled={!row.hasDonor || downloading === row.receiptNo}
                                                            onClick={() => downloadInvoice(row)}
                                                            sx={{ color: ACCENT_LT, '&.Mui-disabled': { color: 'rgba(255,255,255,0.15)' } }}
                                                        >
                                                            {downloading === row.receiptNo
                                                                ? <CircularProgress size={16} sx={{ color: ACCENT_LT }} />
                                                                : <DownloadRoundedIcon fontSize="small" />}
                                                        </IconButton>
                                                    </span>
                                                </Tooltip>
                                                <Tooltip title={row.hasDonor ? 'Email this receipt to the donor' : 'No donor record attached'}>
                                                    <span>
                                                        <IconButton
                                                            size="small"
                                                            disabled={!row.hasDonor}
                                                            onClick={() => setResend({ open: true, row, email: row.email || '', busy: false })}
                                                            sx={{ color: TEXT_SEC, '&:hover': { color: TEXT_PRI }, '&.Mui-disabled': { color: 'rgba(255,255,255,0.15)' } }}
                                                        >
                                                            <EmailRoundedIcon fontSize="small" />
                                                        </IconButton>
                                                    </span>
                                                </Tooltip>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </Box>

                <TablePagination
                    component="div"
                    count={total}
                    page={page}
                    onPageChange={(e, p) => setPage(p)}
                    rowsPerPage={limit}
                    onRowsPerPageChange={e => { setLimit(Number(e.target.value)); setPage(0); }}
                    rowsPerPageOptions={[25, 50, 100, 200]}
                    labelRowsPerPage={isMobile ? 'Rows' : 'Rows per page'}
                    sx={{
                        color: TEXT_SEC, borderTop: `1px solid ${BORDER}`,
                        '& .MuiSelect-icon, & .MuiTablePagination-actions button': { color: TEXT_SEC },
                    }}
                />
            </Card>

            {/* Re-send dialog */}
            <Dialog
                open={resend.open}
                onClose={() => !resend.busy && setResend({ open: false, row: null, email: '', busy: false })}
                fullWidth maxWidth="xs"
                PaperProps={{ sx: { bgcolor: CARD_BG, border: `1px solid ${BORDER}` } }}
            >
                <DialogTitle sx={{ color: TEXT_PRI, fontSize: '1rem', fontWeight: 700 }}>
                    Re-send donation receipt
                </DialogTitle>
                <DialogContent>
                    <Typography sx={{ color: TEXT_SEC, fontSize: '0.8rem', mb: 2 }}>
                        {resend.row?.donorName} · {formatAmount(resend.row?.amount)} · {resend.row?.receiptNo}
                    </Typography>
                    <TextField
                        fullWidth size="small" label="Send to" type="email"
                        value={resend.email}
                        onChange={e => setResend(s => ({ ...s, email: e.target.value }))}
                        helperText="Correct the address here if the donor gave a wrong one."
                        FormHelperTextProps={{ sx: { color: TEXT_SEC } }}
                        sx={inputSx}
                    />
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button
                        onClick={() => setResend({ open: false, row: null, email: '', busy: false })}
                        disabled={resend.busy}
                        sx={{ color: TEXT_SEC, textTransform: 'none' }}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        onClick={submitResend}
                        disabled={resend.busy || !resend.email.includes('@')}
                        startIcon={resend.busy ? <CircularProgress size={15} /> : <EmailRoundedIcon />}
                        sx={{ bgcolor: ACCENT, '&:hover': { bgcolor: '#3a8a5a' }, textTransform: 'none' }}
                    >
                        {resend.busy ? 'Sending…' : 'Send receipt'}
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={snack.open}
                autoHideDuration={5000}
                onClose={() => setSnack(s => ({ ...s, open: false }))}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert severity={snack.sev} onClose={() => setSnack(s => ({ ...s, open: false }))} sx={{ width: '100%' }}>
                    {snack.msg}
                </Alert>
            </Snackbar>
        </Container>
    );
}

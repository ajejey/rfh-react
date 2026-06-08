import React, { useState, useEffect, useCallback } from 'react';
import {
    Box, Button, Typography, TextField, MenuItem, Paper, CircularProgress,
    IconButton, Divider, Snackbar, Alert, Table, TableBody, TableCell, TableHead, TableRow,
    Dialog, DialogTitle, DialogContent, DialogActions,
} from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import useAdminAuth from '../../CustomHooks/useAdminAuth';

const BASE = process.env.REACT_APP_BACKEND_BASE_URL;
const SURFACE = '#151929';
const BORDER = 'rgba(255,255,255,0.08)';
const TEXT_PRI = '#f1f5f9';
const TEXT_SEC = '#94a3b8';
const ACCENT = '#2f6e49';

// Compose a WhatsApp-ready share-card PNG (QR + name + event + venue + gate note) and download it.
async function downloadShareCard(pass) {
    const W = 620, H = 820;
    const canvas = document.createElement('canvas');
    canvas.width = W; canvas.height = H;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = '#040002'; ctx.fillRect(0, 0, W, 90);
    ctx.fillStyle = '#ffffff'; ctx.font = 'bold 30px Arial'; ctx.textAlign = 'center';
    ctx.fillText('Rupee For Humanity', W / 2, 56);

    const qr = new Image();
    await new Promise((resolve, reject) => { qr.onload = resolve; qr.onerror = reject; qr.src = pass.dataUrl; });
    const qrSize = 380;
    ctx.drawImage(qr, (W - qrSize) / 2, 150, qrSize, qrSize);

    ctx.fillStyle = '#040002'; ctx.textAlign = 'center';
    ctx.font = 'bold 34px Arial'; ctx.fillText(pass.name || '', W / 2, 590);
    ctx.font = '20px Arial'; ctx.fillStyle = '#555';
    ctx.fillText(`${pass.type || 'Entry'} · ${pass.event || ''}`, W / 2, 624);
    if (pass.date || pass.venue) {
        ctx.fillText([pass.date, pass.venue].filter(Boolean).join('  ·  '), W / 2, 654);
    }
    ctx.font = 'bold 18px Arial'; ctx.fillStyle = ACCENT;
    ctx.fillText('Show this QR at the gate to enter', W / 2, 700);
    ctx.font = '14px monospace'; ctx.fillStyle = '#999';
    ctx.fillText(pass.uid || '', W / 2, 740);

    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `gate-pass-${(pass.name || 'guest').replace(/\s+/g, '-')}.png`;
    document.body.appendChild(a); a.click(); a.remove();
}

export default function GatePasses() {
    const { token } = useAdminAuth();
    const authHeaders = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };

    const [events, setEvents] = useState([]);
    const [slug, setSlug] = useState('');
    const [snack, setSnack] = useState({ open: false, msg: '', sev: 'success' });
    const notify = (msg, sev = 'success') => setSnack({ open: true, msg, sev });

    // Section 1 — add companion to a runner
    const [query, setQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [searching, setSearching] = useState(false);
    const [selectedRunner, setSelectedRunner] = useState(null);
    const [companions, setCompanions] = useState([{ name: '', age: '' }]);
    const [addingCompanion, setAddingCompanion] = useState(false);

    // Section 2 — invite guest
    const [guest, setGuest] = useState({ fullName: '', email: '', mobNo: '' });
    const [guestCompanions, setGuestCompanions] = useState([]);
    const [creatingGuest, setCreatingGuest] = useState(false);

    // Section 3 — existing guests
    const [guests, setGuests] = useState([]);
    const [guestsLoading, setGuestsLoading] = useState(false);

    const eventName = events.find(e => e.eventSlug === slug)?.eventName || '';

    useEffect(() => {
        fetch(`${BASE}/api/event-config`)
            .then(r => r.json())
            .then(data => { setEvents(data || []); if (data && data[0]) setSlug(data[0].eventSlug); })
            .catch(() => setEvents([]));
    }, []);

    const loadGuests = useCallback(() => {
        if (!slug) return;
        setGuestsLoading(true);
        fetch(`${BASE}/api/marathons/admin/guests?eventSlug=${encodeURIComponent(slug)}`, { headers: authHeaders })
            .then(r => r.json())
            .then(d => setGuests(d.rows || []))
            .catch(() => setGuests([]))
            .finally(() => setGuestsLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [slug, token]);

    useEffect(() => { loadGuests(); }, [loadGuests]);

    // ---- Section 1 handlers ----
    const runSearch = async () => {
        if (!slug || !query.trim()) return;
        setSearching(true); setSearchResults([]); setSelectedRunner(null);
        try {
            const r = await fetch(`${BASE}/api/checkin/search?eventSlug=${encodeURIComponent(slug)}&query=${encodeURIComponent(query.trim())}`);
            const d = await r.json();
            setSearchResults(d.results || []);
            if (!d.results?.length) notify('No matching runner found.', 'info');
        } catch { notify('Search failed.', 'error'); }
        finally { setSearching(false); }
    };

    const submitCompanions = async (deliver) => {
        if (!selectedRunner) return;
        const persons = companions.filter(c => c.name.trim()).map(c => ({ name: c.name.trim(), age: c.age }));
        if (!persons.length) { notify('Add at least one companion name.', 'error'); return; }
        setAddingCompanion(true);
        try {
            const r = await fetch(`${BASE}/api/marathons/admin/registrations/${encodeURIComponent(selectedRunner.registrationId)}/accompanying`, {
                method: 'POST', headers: authHeaders, body: JSON.stringify({ persons, deliver }),
            });
            const d = await r.json();
            if (!r.ok) throw new Error(d.error || 'Failed');
            if (deliver === 'email') notify(d.emailed ? 'Companions added & QR emailed.' : 'Companions added, but email could not be sent — download instead.', d.emailed ? 'success' : 'warning');
            else { for (const p of d.added) await downloadShareCard({ ...p, event: eventName }); notify('Companions added & passes downloaded.'); }
            setCompanions([{ name: '', age: '' }]);
        } catch (e) { notify(e.message, 'error'); }
        finally { setAddingCompanion(false); }
    };

    // ---- Section 2 handlers ----
    const submitGuest = async (deliver) => {
        if (!guest.fullName.trim()) { notify('Guest name required.', 'error'); return; }
        if (deliver === 'email' && !guest.email.trim()) { notify('No email entered — use Download instead.', 'error'); return; }
        setCreatingGuest(true);
        try {
            const r = await fetch(`${BASE}/api/marathons/admin/guests`, {
                method: 'POST', headers: authHeaders,
                body: JSON.stringify({
                    eventSlug: slug, fullName: guest.fullName, email: guest.email, mobNo: guest.mobNo,
                    companions: guestCompanions.filter(c => c.name.trim()).map(c => ({ name: c.name.trim(), age: c.age })),
                    deliver,
                }),
            });
            const d = await r.json();
            if (!r.ok) throw new Error(d.error || 'Failed');
            if (deliver === 'email') notify(d.emailed ? 'Guest invited & QR emailed.' : 'Guest created, but email failed — download instead.', d.emailed ? 'success' : 'warning');
            else { for (const p of d.passes) await downloadShareCard({ ...p, event: eventName }); notify('Guest created & pass(es) downloaded.'); }
            setGuest({ fullName: '', email: '', mobNo: '' }); setGuestCompanions([]);
            loadGuests();
        } catch (e) { notify(e.message, 'error'); }
        finally { setCreatingGuest(false); }
    };

    // ---- Section 3 handlers ----
    // Edit guest
    const [editing, setEditing] = useState(null); // { merchantTransactionId, fullName, email, mobNo }
    const [savingEdit, setSavingEdit] = useState(false);

    const saveGuestEdit = async () => {
        if (!editing) return;
        if (!editing.fullName.trim()) { notify('Name required.', 'error'); return; }
        setSavingEdit(true);
        try {
            const r = await fetch(`${BASE}/api/marathons/admin/guests/${encodeURIComponent(editing.merchantTransactionId)}`, {
                method: 'PUT', headers: authHeaders,
                body: JSON.stringify({ fullName: editing.fullName, email: editing.email, mobNo: editing.mobNo }),
            });
            const d = await r.json();
            if (!r.ok) throw new Error(d.error || 'Failed');
            setGuests(prev => prev.map(g => g.merchantTransactionId === editing.merchantTransactionId
                ? { ...g, fullName: d.guest.fullName, email: d.guest.email || null, mobNo: d.guest.mobNo || null } : g));
            notify('Guest updated.');
            setEditing(null);
        } catch (e) { notify(e.message, 'error'); }
        finally { setSavingEdit(false); }
    };

    const deleteGuest = async (mtid, name) => {
        if (!window.confirm(`Revoke guest pass for "${name}"? This removes their entry and QR.`)) return;
        try {
            const r = await fetch(`${BASE}/api/marathons/admin/guests/${encodeURIComponent(mtid)}`, {
                method: 'DELETE', headers: authHeaders,
            });
            const d = await r.json();
            if (!r.ok) throw new Error(d.error || 'Failed');
            notify('Guest revoked.');
            setGuests(prev => prev.filter(g => g.merchantTransactionId !== mtid));
        } catch (e) { notify(e.message, 'error'); }
    };

    const reissue = async (uid, action, email) => {
        try {
            const r = await fetch(`${BASE}/api/marathons/admin/qr`, {
                method: 'POST', headers: authHeaders, body: JSON.stringify({ uid, action, email }),
            });
            const d = await r.json();
            if (!r.ok) throw new Error(d.error || 'Failed');
            if (action === 'email') notify(`QR emailed to ${d.to}.`);
            else { await downloadShareCard({ ...d, event: d.event }); }
        } catch (e) { notify(e.message, 'error'); }
    };

    const fieldSx = { '& .MuiInputBase-root': { color: TEXT_PRI }, '& label': { color: TEXT_SEC }, '& fieldset': { borderColor: BORDER } };

    return (
        <Box sx={{ p: { xs: 2, md: 4 }, color: TEXT_PRI }}>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>Gate Passes</Typography>
            <Typography sx={{ color: TEXT_SEC, mb: 3, fontSize: 14 }}>
                Add companions to a runner, or invite guests/visitors. Each person gets a QR to scan at the gate.
            </Typography>

            <TextField select size="small" label="Event" value={slug} onChange={e => setSlug(e.target.value)} sx={{ ...fieldSx, width: 320, mb: 3 }}>
                {events.map(e => <MenuItem key={e.eventSlug} value={e.eventSlug}>{e.eventName}</MenuItem>)}
            </TextField>

            {/* Section 1 */}
            <Paper sx={{ bgcolor: SURFACE, color: TEXT_PRI, border: `1px solid ${BORDER}`, p: 3, mb: 3 }}>
                <Typography sx={{ fontWeight: 600, mb: 2 }}>1 · Add companion(s) to a runner</Typography>
                <Box sx={{ display: 'flex', gap: 1.5, mb: 2 }}>
                    <TextField size="small" placeholder="Reg ID or phone" value={query}
                        onChange={e => setQuery(e.target.value)} onKeyDown={e => e.key === 'Enter' && runSearch()}
                        sx={{ ...fieldSx, flex: 1, maxWidth: 360 }} />
                    <Button variant="outlined" startIcon={<SearchRoundedIcon />} onClick={runSearch} disabled={searching}
                        sx={{ borderColor: BORDER, color: TEXT_PRI, textTransform: 'none' }}>Search</Button>
                </Box>

                {searchResults.map(r => (
                    <Box key={r.registrationId} onClick={() => setSelectedRunner(r)}
                        sx={{ p: 1.5, mb: 1, borderRadius: 1, cursor: 'pointer',
                            border: `1px solid ${selectedRunner?.registrationId === r.registrationId ? ACCENT : BORDER}`,
                            bgcolor: selectedRunner?.registrationId === r.registrationId ? 'rgba(47,110,73,0.15)' : 'transparent' }}>
                        <Typography sx={{ fontSize: 14 }}>{r.name} — <span style={{ color: TEXT_SEC }}>{r.registrationId}</span></Typography>
                    </Box>
                ))}

                {selectedRunner && (
                    <Box sx={{ mt: 2 }}>
                        <Divider sx={{ borderColor: BORDER, mb: 2 }} />
                        <Typography sx={{ fontSize: 13, color: TEXT_SEC, mb: 1 }}>Adding to: <b style={{ color: TEXT_PRI }}>{selectedRunner.name}</b></Typography>
                        {companions.map((c, i) => (
                            <Box key={i} sx={{ display: 'flex', gap: 1, mb: 1 }}>
                                <TextField size="small" placeholder="Companion name" value={c.name}
                                    onChange={e => setCompanions(prev => prev.map((x, k) => k === i ? { ...x, name: e.target.value } : x))} sx={{ ...fieldSx, flex: 1 }} />
                                <TextField size="small" placeholder="Age" value={c.age} sx={{ ...fieldSx, width: 90 }}
                                    onChange={e => setCompanions(prev => prev.map((x, k) => k === i ? { ...x, age: e.target.value } : x))} />
                                <IconButton onClick={() => setCompanions(prev => prev.filter((_, k) => k !== i))} sx={{ color: TEXT_SEC }}><DeleteOutlineRoundedIcon /></IconButton>
                            </Box>
                        ))}
                        <Button size="small" startIcon={<AddRoundedIcon />} onClick={() => setCompanions(prev => [...prev, { name: '', age: '' }])}
                            sx={{ color: TEXT_SEC, textTransform: 'none', mb: 2 }}>Add another</Button>
                        <Box sx={{ display: 'flex', gap: 1.5 }}>
                            <Button variant="contained" startIcon={<DownloadRoundedIcon />} disabled={addingCompanion}
                                onClick={() => submitCompanions('download')} sx={{ bgcolor: ACCENT, textTransform: 'none' }}>Add & Download QR</Button>
                            <Button variant="outlined" startIcon={<SendRoundedIcon />} disabled={addingCompanion}
                                onClick={() => submitCompanions('email')} sx={{ borderColor: BORDER, color: TEXT_PRI, textTransform: 'none' }}>Add & Email runner</Button>
                            {addingCompanion && <CircularProgress size={22} sx={{ color: ACCENT }} />}
                        </Box>
                    </Box>
                )}
            </Paper>

            {/* Section 2 */}
            <Paper sx={{ bgcolor: SURFACE, color: TEXT_PRI, border: `1px solid ${BORDER}`, p: 3, mb: 3 }}>
                <Typography sx={{ fontWeight: 600, mb: 2 }}>2 · Invite a guest / visitor</Typography>
                <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', mb: 2 }}>
                    <TextField size="small" label="Full name" value={guest.fullName} onChange={e => setGuest(g => ({ ...g, fullName: e.target.value }))} sx={{ ...fieldSx, flex: 1, minWidth: 220 }} />
                    <TextField size="small" label="Email (optional)" value={guest.email} onChange={e => setGuest(g => ({ ...g, email: e.target.value }))} sx={{ ...fieldSx, flex: 1, minWidth: 220 }} />
                    <TextField size="small" label="Phone (optional)" value={guest.mobNo} onChange={e => setGuest(g => ({ ...g, mobNo: e.target.value }))} sx={{ ...fieldSx, width: 160 }} />
                </Box>
                {guestCompanions.map((c, i) => (
                    <Box key={i} sx={{ display: 'flex', gap: 1, mb: 1 }}>
                        <TextField size="small" placeholder="Companion name" value={c.name}
                            onChange={e => setGuestCompanions(prev => prev.map((x, k) => k === i ? { ...x, name: e.target.value } : x))} sx={{ ...fieldSx, flex: 1 }} />
                        <TextField size="small" placeholder="Age" value={c.age} sx={{ ...fieldSx, width: 90 }}
                            onChange={e => setGuestCompanions(prev => prev.map((x, k) => k === i ? { ...x, age: e.target.value } : x))} />
                        <IconButton onClick={() => setGuestCompanions(prev => prev.filter((_, k) => k !== i))} sx={{ color: TEXT_SEC }}><DeleteOutlineRoundedIcon /></IconButton>
                    </Box>
                ))}
                <Button size="small" startIcon={<AddRoundedIcon />} onClick={() => setGuestCompanions(prev => [...prev, { name: '', age: '' }])}
                    sx={{ color: TEXT_SEC, textTransform: 'none', mb: 2 }}>Add companion to this guest</Button>
                <Box sx={{ display: 'flex', gap: 1.5 }}>
                    <Button variant="contained" startIcon={<DownloadRoundedIcon />} disabled={creatingGuest}
                        onClick={() => submitGuest('download')} sx={{ bgcolor: ACCENT, textTransform: 'none' }}>Create & Download QR</Button>
                    <Button variant="outlined" startIcon={<SendRoundedIcon />} disabled={creatingGuest}
                        onClick={() => submitGuest('email')} sx={{ borderColor: BORDER, color: TEXT_PRI, textTransform: 'none' }}>Create & Email guest</Button>
                    {creatingGuest && <CircularProgress size={22} sx={{ color: ACCENT }} />}
                </Box>
            </Paper>

            {/* Section 3 */}
            <Paper sx={{ bgcolor: SURFACE, color: TEXT_PRI, border: `1px solid ${BORDER}`, p: 3 }}>
                <Typography sx={{ fontWeight: 600, mb: 2 }}>3 · Invited guests {guestsLoading && <CircularProgress size={16} sx={{ ml: 1, color: TEXT_SEC }} />}</Typography>
                <Table size="small">
                    <TableHead>
                        <TableRow>{['Guest', 'Companions', 'Email', 'Phone', 'Pass'].map(h =>
                            <TableCell key={h} sx={{ color: TEXT_SEC, fontWeight: 600, borderColor: BORDER }}>{h}</TableCell>)}</TableRow>
                    </TableHead>
                    <TableBody>
                        {guests.map(g => (
                            <TableRow key={g.merchantTransactionId} hover>
                                <TableCell sx={{ color: TEXT_PRI, borderColor: BORDER }}>{g.fullName}<br /><span style={{ color: TEXT_SEC, fontSize: 11, fontFamily: 'monospace' }}>{g.merchantTransactionId}</span></TableCell>
                                <TableCell sx={{ color: TEXT_SEC, borderColor: BORDER, fontSize: 12 }}>{g.companions.map(c => c.name).join(', ') || '—'}</TableCell>
                                <TableCell sx={{ color: TEXT_SEC, borderColor: BORDER, fontSize: 12 }}>{g.email || '—'}</TableCell>
                                <TableCell sx={{ color: TEXT_SEC, borderColor: BORDER, fontSize: 12 }}>{g.mobNo || '—'}</TableCell>
                                <TableCell sx={{ borderColor: BORDER }}>
                                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                                        <IconButton size="small" title="Edit guest" onClick={() => setEditing({ merchantTransactionId: g.merchantTransactionId, fullName: g.fullName || '', email: g.email || '', mobNo: g.mobNo || '' })} sx={{ color: TEXT_SEC }}><EditRoundedIcon fontSize="small" /></IconButton>
                                        <IconButton size="small" title="Download QR" onClick={() => reissue(g.merchantTransactionId, 'download')} sx={{ color: '#4ade80' }}><DownloadRoundedIcon fontSize="small" /></IconButton>
                                        {g.email && <IconButton size="small" title="Email QR" onClick={() => reissue(g.merchantTransactionId, 'email')} sx={{ color: '#93c5fd' }}><SendRoundedIcon fontSize="small" /></IconButton>}
                                        <IconButton size="small" title="Revoke guest" onClick={() => deleteGuest(g.merchantTransactionId, g.fullName)} sx={{ color: '#f87171' }}><DeleteOutlineRoundedIcon fontSize="small" /></IconButton>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        ))}
                        {guests.length === 0 && !guestsLoading && (
                            <TableRow><TableCell colSpan={5} sx={{ color: TEXT_SEC, textAlign: 'center', py: 3, borderColor: BORDER }}>No guests invited yet for this event.</TableCell></TableRow>
                        )}
                    </TableBody>
                </Table>
            </Paper>

            <Dialog open={!!editing} onClose={() => setEditing(null)} fullWidth maxWidth="xs"
                PaperProps={{ sx: { bgcolor: SURFACE, color: TEXT_PRI, border: `1px solid ${BORDER}` } }}>
                <DialogTitle>Edit guest</DialogTitle>
                <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '8px !important' }}>
                    <TextField size="small" label="Full name" value={editing?.fullName || ''} sx={fieldSx}
                        onChange={e => setEditing(s => ({ ...s, fullName: e.target.value }))} />
                    <TextField size="small" label="Email" value={editing?.email || ''} sx={fieldSx}
                        onChange={e => setEditing(s => ({ ...s, email: e.target.value }))} />
                    <TextField size="small" label="Phone" value={editing?.mobNo || ''} sx={fieldSx}
                        onChange={e => setEditing(s => ({ ...s, mobNo: e.target.value }))} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditing(null)} sx={{ color: TEXT_SEC, textTransform: 'none' }}>Cancel</Button>
                    <Button onClick={saveGuestEdit} disabled={savingEdit} variant="contained" sx={{ bgcolor: ACCENT, textTransform: 'none' }}>
                        {savingEdit ? 'Saving…' : 'Save'}
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar open={snack.open} autoHideDuration={6000} onClose={() => setSnack(s => ({ ...s, open: false }))} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
                <Alert severity={snack.sev} variant="filled" onClose={() => setSnack(s => ({ ...s, open: false }))}>{snack.msg}</Alert>
            </Snackbar>
        </Box>
    );
}

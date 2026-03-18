import React, { useEffect, useState } from 'react';
import {
    Box, Button, Container, Divider, FormControl, FormControlLabel,
    Grid, IconButton, InputLabel, MenuItem, Paper, Select, Switch,
    TextField, Typography, CircularProgress, Alert, Dialog,
    DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import Header from '../Header';
import { styled } from '@mui/material/styles';

const StyledPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(3),
    marginBottom: theme.spacing(3),
}));

const BASE_URL = process.env.REACT_APP_BACKEND_BASE_URL;


const EMPTY_CONFIG = {
    eventSlug: '',
    eventName: '',
    registrationOpen: true,
    closedMessage: 'Registrations are now closed.',
    maxParticipants: '',
    eventDate: '',
    lastRegistrationDate: '',
    discountDeadline: '',
    venueName: '',
    venueUrl: '',
    price: '',
    discountPrice: '',
    tshirtPrice: '',
    breakfastPrice: '',
    couponsEnabled: false,
    coupons: [],
    brandAmbassadors: [],
};

export default function AdminEventConfig() {
    const [allConfigs, setAllConfigs] = useState([]);
    const [selectedSlug, setSelectedSlug] = useState('');
    const [form, setForm] = useState(null);
    const [loading, setLoading] = useState(false);
    const [configsLoading, setConfigsLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [error, setError] = useState('');

    // Create new config dialog
    const [createOpen, setCreateOpen] = useState(false);
    const [newSlug, setNewSlug] = useState('');
    const [newName, setNewName] = useState('');
    const [creating, setCreating] = useState(false);
    const [createError, setCreateError] = useState('');

    // Fetch list of all configs on mount
    useEffect(() => {
        fetchAllConfigs();
    }, []);

    async function fetchAllConfigs() {
        setConfigsLoading(true);
        try {
            console.log('Fetching configs from:', `${BASE_URL}/api/event-config`);
            const res = await fetch(`${BASE_URL}/api/event-config`, {
                headers: { 'Content-Type': 'application/json' }
            });
            console.log('Response status:', res.status);
            if (!res.ok) throw new Error(`Failed to load configs: ${res.status}`);
            const data = await res.json();
            console.log('Configs loaded:', data);
            setAllConfigs(data || []);
        } catch (err) {
            console.error('Error fetching configs:', err);
            setError(`Could not load event configs: ${err.message}`);
        } finally {
            setConfigsLoading(false);
        }
    }

    async function fetchConfig(slug) {
        setLoading(true);
        setError('');
        setSaveSuccess(false);
        try {
            const res = await fetch(`${BASE_URL}/api/event-config/${slug}`, {
                headers: { 'Content-Type': 'application/json' }
            });
            if (!res.ok) throw new Error('Not found');
            const data = await res.json();
            // Normalise nulls to empty strings for controlled inputs
            setForm({
                ...EMPTY_CONFIG,
                ...data,
                maxParticipants: data.maxParticipants ?? '',
                price: data.price ?? '',
                discountPrice: data.discountPrice ?? '',
                tshirtPrice: data.tshirtPrice ?? '',
                breakfastPrice: data.breakfastPrice ?? '',
                coupons: data.coupons ?? [],
                brandAmbassadors: data.brandAmbassadors ?? [],
            });
        } catch (err) {
            setError('Could not load config for this event.');
            setForm(null);
        } finally {
            setLoading(false);
        }
    }

    function handleSelectEvent(slug) {
        setSelectedSlug(slug);
        if (slug) fetchConfig(slug);
        else setForm(null);
    }

    function set(field, value) {
        setForm(prev => ({ ...prev, [field]: value }));
    }

    // Coupon helpers
    function addCoupon() {
        setForm(prev => ({
            ...prev,
            coupons: [...prev.coupons, { code: '', discount: 5, active: true }]
        }));
    }
    function updateCoupon(index, field, value) {
        setForm(prev => {
            const updated = [...prev.coupons];
            updated[index] = { ...updated[index], [field]: value };
            return { ...prev, coupons: updated };
        });
    }
    function removeCoupon(index) {
        setForm(prev => ({
            ...prev,
            coupons: prev.coupons.filter((_, i) => i !== index)
        }));
    }

    // Brand ambassador helpers
    function addAmbassador() {
        setForm(prev => ({ ...prev, brandAmbassadors: [...prev.brandAmbassadors, ''] }));
    }
    function updateAmbassador(index, value) {
        setForm(prev => {
            const updated = [...prev.brandAmbassadors];
            updated[index] = value;
            return { ...prev, brandAmbassadors: updated };
        });
    }
    function removeAmbassador(index) {
        setForm(prev => ({
            ...prev,
            brandAmbassadors: prev.brandAmbassadors.filter((_, i) => i !== index)
        }));
    }

    async function handleSave() {
        setSaving(true);
        setSaveSuccess(false);
        setError('');
        try {
            const payload = {
                ...form,
                maxParticipants: form.maxParticipants === '' ? null : Number(form.maxParticipants),
                price: form.price === '' ? null : Number(form.price),
                discountPrice: form.discountPrice === '' ? null : Number(form.discountPrice),
                tshirtPrice: form.tshirtPrice === '' ? null : Number(form.tshirtPrice),
                breakfastPrice: form.breakfastPrice === '' ? null : Number(form.breakfastPrice),
                coupons: form.coupons.map(c => ({
                    ...c,
                    discount: Number(c.discount)
                })),
                brandAmbassadors: form.brandAmbassadors.filter(a => a.trim() !== ''),
            };
            const res = await fetch(`${BASE_URL}/api/event-config/${selectedSlug}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });
            if (!res.ok) throw new Error('Save failed');
            setSaveSuccess(true);
            fetchAllConfigs(); // refresh list
        } catch (err) {
            setError('Could not save. Please try again.');
        } finally {
            setSaving(false);
        }
    }

    async function handleCreate() {
        if (!newSlug.trim() || !newName.trim()) {
            setCreateError('Both fields are required.');
            return;
        }
        setCreating(true);
        setCreateError('');
        try {
            const res = await fetch(`${BASE_URL}/api/event-config`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ eventSlug: newSlug.trim(), eventName: newName.trim() }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Create failed');
            setCreateOpen(false);
            setNewSlug('');
            setNewName('');
            await fetchAllConfigs();
            handleSelectEvent(newSlug.trim());
        } catch (err) {
            setCreateError(err.message);
        } finally {
            setCreating(false);
        }
    }

    return (
        <Box>
            <Header />
            <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
                <Typography variant="h4" gutterBottom>Event Config</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Control registration gates, pricing, coupons and display info for each event form.
                </Typography>
                <Divider sx={{ mb: 3 }} />

                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                {/* Show loader while fetching configs */}
                {configsLoading ? (
                    <Box sx={{ textAlign: 'center', py: 8 }}>
                        <CircularProgress size={60} />
                        <Typography variant="body1" sx={{ mt: 2, color: 'text.secondary' }}>
                            Loading event configurations...
                        </Typography>
                    </Box>
                ) : (
                    <>
                        {/* Event selector */}
                        <StyledPaper>
                            <Grid container spacing={2} alignItems="center">
                                <Grid item xs={12} md={6}>
                                    <FormControl fullWidth>
                                        <InputLabel>Select Event</InputLabel>
                                        <Select
                                            value={selectedSlug}
                                            label="Select Event"
                                            onChange={e => handleSelectEvent(e.target.value)}
                                        >
                                            <MenuItem value=""><em>— choose an event —</em></MenuItem>
                                            {allConfigs.map(c => (
                                                <MenuItem key={c.eventSlug} value={c.eventSlug}>
                                                    {c.eventName}
                                                    {!c.registrationOpen && ' (closed)'}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Button
                                        variant="outlined"
                                        startIcon={<AddIcon />}
                                        onClick={() => setCreateOpen(true)}
                                    >
                                        New Event Config
                                    </Button>
                                </Grid>
                            </Grid>
                        </StyledPaper>
                    </>
                )}

                {loading && <Box sx={{ textAlign: 'center', py: 4 }}><CircularProgress /></Box>}

                {form && !loading && (
                    <>
                        {saveSuccess && <Alert severity="success" sx={{ mb: 2 }}>Saved successfully.</Alert>}

                        {/* Registration Gate */}
                        <StyledPaper>
                            <Typography variant="h6" gutterBottom>Registration Gate</Typography>
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={4}>
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={form.registrationOpen}
                                                onChange={e => set('registrationOpen', e.target.checked)}
                                                color="success"
                                            />
                                        }
                                        label={form.registrationOpen ? 'Registrations OPEN' : 'Registrations CLOSED'}
                                    />
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <TextField
                                        fullWidth
                                        label="Max Participants"
                                        type="number"
                                        value={form.maxParticipants}
                                        onChange={e => set('maxParticipants', e.target.value)}
                                        helperText="Leave blank for no limit"
                                        inputProps={{ min: 0 }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Closed Message"
                                        value={form.closedMessage}
                                        onChange={e => set('closedMessage', e.target.value)}
                                        helperText="Shown to users when registrations are closed"
                                    />
                                </Grid>
                            </Grid>
                        </StyledPaper>

                        {/* Dates & Venue */}
                        <StyledPaper>
                            <Typography variant="h6" gutterBottom>Dates & Venue</Typography>
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={4}>
                                    <TextField
                                        fullWidth
                                        label="Event Date"
                                        type="date"
                                        value={form.eventDate ? form.eventDate.split('T')[0] : ''}
                                        onChange={e => set('eventDate', e.target.value)}
                                        InputLabelProps={{ shrink: true }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <TextField
                                        fullWidth
                                        label="Last Registration Date"
                                        type="date"
                                        value={form.lastRegistrationDate ? form.lastRegistrationDate.split('T')[0] : ''}
                                        onChange={e => set('lastRegistrationDate', e.target.value)}
                                        InputLabelProps={{ shrink: true }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <TextField
                                        fullWidth
                                        label="Early Bird Deadline"
                                        type="date"
                                        value={form.discountDeadline ? form.discountDeadline.split('T')[0] : ''}
                                        onChange={e => set('discountDeadline', e.target.value)}
                                        InputLabelProps={{ shrink: true }}
                                        helperText="Last date for discount price"
                                    />
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <TextField
                                        fullWidth
                                        label="Venue Name"
                                        value={form.venueName}
                                        onChange={e => set('venueName', e.target.value)}
                                    />
                                </Grid>
                                <Grid item xs={12} md={8}>
                                    <TextField
                                        fullWidth
                                        label="Venue URL (Google Maps)"
                                        value={form.venueUrl}
                                        onChange={e => set('venueUrl', e.target.value)}
                                    />
                                </Grid>
                            </Grid>
                        </StyledPaper>

                        {/* Pricing */}
                        <StyledPaper>
                            <Typography variant="h6" gutterBottom>Pricing</Typography>
                            <Grid container spacing={3}>
                                <Grid item xs={6} md={3}>
                                    <TextField
                                        fullWidth
                                        label="Regular Price (₹)"
                                        type="number"
                                        value={form.price}
                                        onChange={e => set('price', e.target.value)}
                                        inputProps={{ min: 0 }}
                                    />
                                </Grid>
                                <Grid item xs={6} md={3}>
                                    <TextField
                                        fullWidth
                                        label="Early Bird Price (₹)"
                                        type="number"
                                        value={form.discountPrice}
                                        onChange={e => set('discountPrice', e.target.value)}
                                        inputProps={{ min: 0 }}
                                    />
                                </Grid>
                                <Grid item xs={6} md={3}>
                                    <TextField
                                        fullWidth
                                        label="Extra T-shirt (₹)"
                                        type="number"
                                        value={form.tshirtPrice}
                                        onChange={e => set('tshirtPrice', e.target.value)}
                                        inputProps={{ min: 0 }}
                                    />
                                </Grid>
                                <Grid item xs={6} md={3}>
                                    <TextField
                                        fullWidth
                                        label="Breakfast (₹)"
                                        type="number"
                                        value={form.breakfastPrice}
                                        onChange={e => set('breakfastPrice', e.target.value)}
                                        inputProps={{ min: 0 }}
                                    />
                                </Grid>
                            </Grid>
                        </StyledPaper>

                        {/* Coupons */}
                        <StyledPaper>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Typography variant="h6">Coupon Codes</Typography>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={form.couponsEnabled}
                                            onChange={e => set('couponsEnabled', e.target.checked)}
                                        />
                                    }
                                    label={form.couponsEnabled ? 'Coupons enabled on form' : 'Coupons hidden on form'}
                                />
                            </Box>
                            {form.coupons.map((coupon, i) => (
                                <Grid container spacing={2} alignItems="center" key={i} sx={{ mb: 1 }}>
                                    <Grid item xs={12} md={4}>
                                        <TextField
                                            fullWidth
                                            label="Coupon Code"
                                            value={coupon.code}
                                            onChange={e => updateCoupon(i, 'code', e.target.value)}
                                            inputProps={{ style: { textTransform: 'uppercase' } }}
                                        />
                                    </Grid>
                                    <Grid item xs={6} md={3}>
                                        <TextField
                                            fullWidth
                                            label="Discount %"
                                            type="number"
                                            value={coupon.discount}
                                            onChange={e => updateCoupon(i, 'discount', e.target.value)}
                                            inputProps={{ min: 1, max: 100 }}
                                        />
                                    </Grid>
                                    <Grid item xs={4} md={3}>
                                        <FormControlLabel
                                            control={
                                                <Switch
                                                    checked={coupon.active}
                                                    onChange={e => updateCoupon(i, 'active', e.target.checked)}
                                                    size="small"
                                                />
                                            }
                                            label={coupon.active ? 'Active' : 'Inactive'}
                                        />
                                    </Grid>
                                    <Grid item xs={2} md={2}>
                                        <IconButton onClick={() => removeCoupon(i)} color="error" size="small">
                                            <DeleteIcon />
                                        </IconButton>
                                    </Grid>
                                </Grid>
                            ))}
                            <Button
                                variant="outlined"
                                startIcon={<AddIcon />}
                                onClick={addCoupon}
                                size="small"
                                sx={{ mt: 1 }}
                            >
                                Add Coupon
                            </Button>
                        </StyledPaper>

                        {/* Brand Ambassadors */}
                        <StyledPaper>
                            <Typography variant="h6" gutterBottom>Brand Ambassadors</Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                Names appear in the "How did you hear about us?" dropdown on the registration form.
                            </Typography>
                            {form.brandAmbassadors.map((name, i) => (
                                <Grid container spacing={2} alignItems="center" key={i} sx={{ mb: 1 }}>
                                    <Grid item xs={10} md={6}>
                                        <TextField
                                            fullWidth
                                            label={`Ambassador ${i + 1}`}
                                            value={name}
                                            onChange={e => updateAmbassador(i, e.target.value)}
                                        />
                                    </Grid>
                                    <Grid item xs={2}>
                                        <IconButton onClick={() => removeAmbassador(i)} color="error" size="small">
                                            <DeleteIcon />
                                        </IconButton>
                                    </Grid>
                                </Grid>
                            ))}
                            <Button
                                variant="outlined"
                                startIcon={<AddIcon />}
                                onClick={addAmbassador}
                                size="small"
                                sx={{ mt: 1 }}
                            >
                                Add Ambassador
                            </Button>
                        </StyledPaper>

                        {/* Save */}
                        <Box sx={{ textAlign: 'right' }}>
                            <Button
                                variant="contained"
                                size="large"
                                onClick={handleSave}
                                disabled={saving}
                            >
                                {saving ? <CircularProgress size={22} color="inherit" /> : 'Save Changes'}
                            </Button>
                        </Box>
                    </>
                )}
            </Container>

            {/* Create New Config Dialog */}
            <Dialog open={createOpen} onClose={() => setCreateOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>New Event Config</DialogTitle>
                <DialogContent>
                    {createError && <Alert severity="error" sx={{ mb: 2 }}>{createError}</Alert>}
                    <TextField
                        fullWidth
                        label="Event Slug"
                        value={newSlug}
                        onChange={e => setNewSlug(e.target.value)}
                        sx={{ mt: 1, mb: 2 }}
                        helperText="Must match the route path, e.g. rfh-juniors-run-2026"
                    />
                    <TextField
                        fullWidth
                        label="Event Name"
                        value={newName}
                        onChange={e => setNewName(e.target.value)}
                        helperText="Display name, e.g. RFH Juniors Run 2026"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setCreateOpen(false)}>Cancel</Button>
                    <Button variant="contained" onClick={handleCreate} disabled={creating}>
                        {creating ? <CircularProgress size={20} color="inherit" /> : 'Create'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

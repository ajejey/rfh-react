import React, { useState, useEffect, useRef } from 'react';
import {
    Box, Typography, Card, Grid, TextField, Button, Alert, CircularProgress,
    Container, useMediaQuery, useTheme
} from '@mui/material';
import { useForm } from 'react-hook-form';
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';
import ReceiptRoundedIcon from '@mui/icons-material/ReceiptRounded';

const CARD_BG = '#1a2035';
const BORDER = 'rgba(255,255,255,0.06)';
const ACCENT = '#2f6e49';
const ACCENT_LT = '#4ade80';
const TEXT_PRI = '#f1f5f9';
const TEXT_SEC = '#64748b';

const DONATION_FIELDS = [
    { name: 'email', label: 'Email', type: 'email' },
    { name: 'mobNo', label: 'Mobile Number', type: 'text' },
    { name: 'fullName', label: 'Full Name', type: 'text' },
    { name: 'PANno', label: 'PAN Number', type: 'text' },
    { name: 'cause', label: 'Cause', type: 'text' },
    { name: 'transactionNo', label: 'Transaction Number', type: 'text' },
    { name: 'paymentMode', label: 'Payment Mode', type: 'text' },
    { name: 'donationAmount', label: 'Donation Amount', type: 'number' },
];

export default function DonationReceipt() {
    const { handleSubmit, register, reset, setValue, getValues } = useForm();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const [loading, setLoading] = useState(false);
    const [downloadLink, setDownloadLink] = useState(null);
    const [emailData, setEmailData] = useState(null);
    const [apiError, setApiError] = useState('');
    const [donorLookupLoading, setDonorLookupLoading] = useState(false);
    const [donorLookupError, setDonorLookupError] = useState('');
    const [csvLoading, setCsvLoading] = useState(false);
    const [csvLink, setCsvLink] = useState(null);
    const [copySuccess, setCopySuccess] = useState('');
    const receiptRef = useRef(null);

    const today = new Date().toISOString().split('T')[0];

    const handleDonationFormSubmit = async (data) => {
        setLoading(true);
        setApiError('');
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/create-receipt`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!response.ok) throw new Error('Failed to create receipt');
            const responseData = await response.json();
            const { downloadLink: dl, emailData: ed } = responseData;
            const parser = new DOMParser();
            const doc = parser.parseFromString(dl, 'text/html');
            const linkEl = doc.querySelector('a');
            const pdfDataUrl = linkEl?.href || '';
            setDownloadLink(pdfDataUrl);
            setEmailData(ed);
            reset();
        } catch (error) {
            console.error(error);
            setApiError('Failed to create receipt. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const lookupAndAutofillDonor = async () => {
        const email = (getValues('email') || '').toString().trim();
        const mobNo = (getValues('mobNo') || '').toString().trim();
        const hasValidEmail = email.includes('@') && email.includes('.');
        const hasValidMobNo = mobNo.length >= 8;
        if (!hasValidEmail && !hasValidMobNo) return;
        setDonorLookupError('');
        setDonorLookupLoading(true);
        try {
            const params = new URLSearchParams();
            if (hasValidEmail) params.set('email', email);
            if (hasValidMobNo) params.set('mobNo', mobNo);
            const url = `${process.env.REACT_APP_BACKEND_BASE_URL}/api/donations/donor-lookup?${params.toString()}`;
            const response = await fetch(url);
            if (!response.ok) {
                if (response.status === 404) {
                    setDonorLookupError('No existing donor found for the given email/phone');
                    return;
                }
                throw new Error('Failed to lookup donor');
            }
            const data = await response.json();
            const donor = data?.user;
            if (!donor) return;
            const current = {
                fullName: (getValues('fullName') || '').toString().trim(),
                email: (getValues('email') || '').toString().trim(),
                mobNo: (getValues('mobNo') || '').toString().trim(),
                PANno: (getValues('PANno') || '').toString().trim(),
            };
            if (!current.fullName && donor.fullName) setValue('fullName', donor.fullName);
            if (!current.email && donor.email) setValue('email', donor.email);
            if (!current.mobNo && donor.mobNo) setValue('mobNo', donor.mobNo);
            if (!current.PANno && donor.PANno) setValue('PANno', donor.PANno);
        } catch (error) {
            console.error(error);
            setDonorLookupError('Could not lookup donor details');
        } finally {
            setDonorLookupLoading(false);
        }
    };

    const downloadCsv = async () => {
        try {
            setCsvLoading(true);
            const response = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/donations/csv`);
            const blob = await response.blob();
            setCsvLink(URL.createObjectURL(blob));
        } catch (error) {
            console.error(error);
        } finally {
            setCsvLoading(false);
        }
    };

    const copyEmailBody = () => {
        if (!emailData) return;
        navigator.clipboard.writeText(emailData.body).then(() => {
            setCopySuccess('Email body copied! Paste it into Gmail.');
            setTimeout(() => setCopySuccess(''), 3000);
        }).catch(() => setCopySuccess('Failed to copy'));
    };

    const openGmailCompose = () => {
        if (!emailData) return;
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = emailData.body;
        const plainTextBody = tempDiv.textContent || tempDiv.innerText || '';
        const mailtoLink = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(emailData.to)}&su=${encodeURIComponent(emailData.subject)}&body=${encodeURIComponent(plainTextBody)}`;
        window.open(mailtoLink, '_blank');
    };

    useEffect(() => {
        if (downloadLink && receiptRef.current) {
            receiptRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [downloadLink]);

    return (
        <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 3, md: 4 } }}>
            {/* Header */}
            <Box sx={{ mb: { xs: 3, sm: 4 } }}>
                <Box sx={{
                    display: 'flex', alignItems: 'center', gap: 1.5,
                    flexDirection: isMobile ? 'column' : 'row',
                    textAlign: isMobile ? 'center' : 'left'
                }}>
                    <Box sx={{
                        width: 48, height: 48, borderRadius: 2,
                        bgcolor: 'rgba(16,185,129,0.12)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#10b981',
                    }}>
                        <ReceiptRoundedIcon />
                    </Box>
                    <Box>
                        <Typography sx={{ color: TEXT_PRI, fontWeight: 700, fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
                            Generate Offline Donation Receipt
                        </Typography>
                        <Typography sx={{ color: TEXT_SEC, fontSize: { xs: '0.75rem', sm: '0.85rem' } }}>
                            Create and email donation receipts for offline payments
                        </Typography>
                    </Box>
                </Box>
            </Box>

            {/* CSV Download Section */}
            <Card elevation={0} sx={{
                bgcolor: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: 2,
                p: { xs: 2, sm: 3 }, mb: 3
            }}>
                <Box sx={{
                    display: 'flex', alignItems: 'center', gap: 2,
                    flexDirection: isMobile ? 'column' : 'row',
                    justifyContent: isMobile ? 'center' : 'flex-start'
                }}>
                    <Button
                        variant="outlined"
                        size="small"
                        startIcon={csvLoading ? <CircularProgress size={16} /> : <DownloadRoundedIcon />}
                        onClick={downloadCsv}
                        disabled={csvLoading}
                        sx={{
                            borderColor: 'rgba(255,255,255,0.12)', color: TEXT_SEC,
                            '&:hover': { borderColor: 'rgba(255,255,255,0.25)' },
                            minWidth: isMobile ? '100%' : 'auto'
                        }}
                        fullWidth={isMobile}
                    >
                        {csvLoading ? 'Generating...' : 'Download Donations CSV'}
                    </Button>
                    {csvLink && (
                        <Button
                            variant="text"
                            size="small"
                            startIcon={<DownloadRoundedIcon />}
                            href={csvLink}
                            download="donations.csv"
                            sx={{ color: ACCENT_LT }}
                            fullWidth={isMobile}
                        >
                            Save CSV File
                        </Button>
                    )}
                </Box>
            </Card>

            {/* Donation Form */}
            <Card elevation={0} sx={{
                bgcolor: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: 2,
                p: { xs: 2, sm: 3 }, mb: 3
            }}>
                <form onSubmit={handleSubmit(handleDonationFormSubmit)}>
                    <Grid container spacing={{ xs: 2, sm: 2.5 }}>
                        {DONATION_FIELDS.map(field => (
                            <Grid item xs={12} sm={6} md={4} key={field.name}>
                                <TextField
                                    fullWidth
                                    label={field.label}
                                    type={field.type}
                                    size={isMobile ? 'small' : 'medium'}
                                    {...register(field.name)}
                                    onBlur={field.name === 'email' || field.name === 'mobNo' ? lookupAndAutofillDonor : undefined}
                                    InputLabelProps={{ sx: { color: TEXT_SEC } }}
                                    InputProps={{ sx: { color: TEXT_PRI } }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
                                            '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                                            '&.Mui-focused fieldset': { borderColor: ACCENT_LT },
                                        },
                                    }}
                                />
                            </Grid>
                        ))}
                        <Grid item xs={12} sm={6} md={4}>
                            <TextField
                                fullWidth
                                label="Date"
                                type="date"
                                size={isMobile ? 'small' : 'medium'}
                                defaultValue={today}
                                {...register('date')}
                                InputLabelProps={{ sx: { color: TEXT_SEC } }}
                                InputProps={{ sx: { color: TEXT_PRI } }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
                                        '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                                        '&.Mui-focused fieldset': { borderColor: ACCENT_LT },
                                    },
                                }}
                            />
                        </Grid>
                    </Grid>

                    {donorLookupLoading && (
                        <Alert severity="info" sx={{ mt: 2, bgcolor: 'rgba(59,130,246,0.1)', color: '#93c5fd' }}>
                            Looking up donor details...
                        </Alert>
                    )}
                    {donorLookupError && !donorLookupLoading && (
                        <Alert severity="warning" sx={{ mt: 2, bgcolor: 'rgba(245,158,11,0.1)', color: '#fbbf24' }}>
                            {donorLookupError}
                        </Alert>
                    )}

                    {apiError && (
                        <Alert severity="error" sx={{ mt: 2, bgcolor: 'rgba(239,68,68,0.1)', color: '#fca5a5' }}>
                            {apiError}
                        </Alert>
                    )}

                    <Box sx={{ mt: 3, display: 'flex', justifyContent: isMobile ? 'stretch' : 'flex-end' }}>
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={loading}
                            startIcon={loading ? <CircularProgress size={18} /> : null}
                            fullWidth={isMobile}
                            sx={{
                                bgcolor: ACCENT, '&:hover': { bgcolor: '#3a8a5a' },
                                textTransform: 'none', fontWeight: 600, py: isMobile ? 1.5 : 1
                            }}
                        >
                            {loading ? 'Generating...' : 'Generate Receipt'}
                        </Button>
                    </Box>
                </form>
            </Card>

            {/* Receipt Result Card */}
            {downloadLink && emailData && (
                <Card ref={receiptRef} elevation={0} sx={{
                    bgcolor: 'rgba(47,110,73,0.08)', border: '1px solid rgba(47,110,73,0.25)',
                    borderRadius: 2, overflow: 'hidden'
                }}>
                    <Box sx={{
                        bgcolor: 'rgba(47,110,73,0.2)', px: { xs: 2, sm: 3 }, py: 1.5,
                        display: 'flex', alignItems: 'center', gap: 1
                    }}>
                        <Typography sx={{ color: ACCENT_LT, fontWeight: 700, fontSize: { xs: '0.85rem', sm: '0.95rem' } }}>
                            Receipt Generated Successfully
                        </Typography>
                    </Box>
                    <Box sx={{ p: { xs: 2, sm: 3 } }}>
                        <Alert severity="info" sx={{
                            mb: 2, bgcolor: 'rgba(59,130,246,0.08)', color: '#93c5fd',
                            '& .MuiAlert-message': { width: '100%' }
                        }}>
                            <strong>Email Status:</strong> Being sent automatically in the background.<br />
                            <strong>If email fails:</strong> Use the quick tools below to send manually.
                        </Alert>

                        <Box sx={{ mb: 2 }}>
                            <Typography sx={{ color: TEXT_SEC, fontSize: { xs: '0.75rem', sm: '0.85rem' } }}>
                                <strong>Receipt No:</strong> {emailData.receiptNo}<br />
                                <strong>Recipient:</strong> {emailData.to}<br />
                                <strong>Filename:</strong> {emailData.receiptFilename}
                            </Typography>
                        </Box>

                        <Box sx={{
                            display: 'flex', gap: 1.5, flexWrap: 'wrap', mb: 2,
                            flexDirection: isMobile ? 'column' : 'row'
                        }}>
                            <Button
                                variant="contained"
                                size="small"
                                startIcon={<DownloadRoundedIcon />}
                                href={downloadLink}
                                download={emailData.receiptFilename}
                                fullWidth={isMobile}
                                sx={{
                                    bgcolor: ACCENT, '&:hover': { bgcolor: '#3a8a5a' },
                                    textTransform: 'none'
                                }}
                            >
                                Download Receipt
                            </Button>
                            <Button
                                variant="outlined"
                                size="small"
                                startIcon={<EmailRoundedIcon />}
                                onClick={openGmailCompose}
                                fullWidth={isMobile}
                                sx={{
                                    borderColor: 'rgba(255,255,255,0.15)', color: TEXT_PRI,
                                    '&:hover': { borderColor: 'rgba(255,255,255,0.3)' },
                                    textTransform: 'none'
                                }}
                            >
                                Open in Gmail
                            </Button>
                            <Button
                                variant="outlined"
                                size="small"
                                startIcon={<ContentCopyRoundedIcon />}
                                onClick={copyEmailBody}
                                fullWidth={isMobile}
                                sx={{
                                    borderColor: 'rgba(255,255,255,0.15)', color: TEXT_PRI,
                                    '&:hover': { borderColor: 'rgba(255,255,255,0.3)' },
                                    textTransform: 'none'
                                }}
                            >
                                Copy Email Body
                            </Button>
                        </Box>

                        {copySuccess && (
                            <Alert severity="success" sx={{ mb: 2, bgcolor: 'rgba(74,222,128,0.08)', color: ACCENT_LT }}>
                                {copySuccess}
                            </Alert>
                        )}

                        <Box sx={{ bgcolor: 'rgba(255,255,255,0.03)', borderRadius: 2, p: 2 }}>
                            <Typography sx={{ color: TEXT_SEC, fontSize: '0.75rem', fontWeight: 600, mb: 1 }}>
                                Quick Send Instructions:
                            </Typography>
                            <ol style={{
                                margin: 0, paddingLeft: 20, color: TEXT_SEC,
                                fontSize: '0.75rem', lineHeight: 1.6
                            }}>
                                <li>Click <strong>&quot;Download Receipt&quot;</strong> above (saves as {emailData.receiptFilename})</li>
                                <li>Click <strong>&quot;Open in Gmail&quot;</strong> — Opens Gmail with recipient, subject, and body pre-filled</li>
                                <li><strong>Attach the downloaded PDF</strong> to the Gmail compose window</li>
                                <li>Click <strong>Send</strong> in Gmail</li>
                            </ol>
                            <Typography sx={{ color: 'rgba(100,116,139,0.6)', fontSize: '0.7rem', mt: 1 }}>
                                Note: Gmail doesn&apos;t allow auto-attaching files for security reasons, so you&apos;ll need to attach the PDF manually.
                            </Typography>
                        </Box>
                    </Box>
                </Card>
            )}
        </Container>
    );
}

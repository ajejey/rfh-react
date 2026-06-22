import React, { useEffect, useState, useMemo } from 'react';
import {
    CircularProgress,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Box,
    Grid,
    Paper,
    Typography,
    Divider,
    Card,
    CardContent,
    IconButton,
    Chip,
    Tooltip,
    Tab,
    Tabs,
    Button,
    TextField,
    TableContainer,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    TablePagination,
    Snackbar,
    Alert,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from '@mui/material';
import { styled } from '@mui/material/styles';
import useSWR from 'swr';
import { convertCamelCase } from '../../Constants/commonFunctions';
import Papa from 'papaparse';
// Icons
import DownloadIcon from '@mui/icons-material/Download';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import TshirtIcon from '@mui/icons-material/Checkroom';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import FilterListIcon from '@mui/icons-material/FilterList';
import EmailIcon from '@mui/icons-material/Email';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import useAdminAuth from '../../CustomHooks/useAdminAuth';

const StyledFormControl = styled(FormControl)(({ theme }) => ({
    minWidth: 200,
}));

const StyledCard = styled(Card)(({ theme }) => ({
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    transition: 'transform 0.3s, box-shadow 0.3s',
    '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0 12px 20px rgba(0, 0, 0, 0.1)',
    },
}));

const StatsIcon = styled(Box)(({ theme, color }) => ({
    backgroundColor: color || theme.palette.primary.main,
    borderRadius: '50%',
    width: 48,
    height: 48,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing(2),
    color: '#fff',
}));

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
    maxHeight: 'calc(100vh - 350px)',
    marginTop: theme.spacing(2),
}));

const SearchBar = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    backgroundColor: theme.palette.background.paper,
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
    padding: '2px 8px',
    marginBottom: theme.spacing(2),
    width: '100%',
}));

const fetcher = async (url) => {
    const response = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/${url}`);
    if (!response.ok) {
        throw new Error('Failed to fetch data');
    }
    const data = await response.json();
    return data;
};

const sampleRazorpayData = { 
    "_id": { "$oid": "67e793dd40fc168bca3fcca4" },
     "user": { "$oid": "640dbcf04dd2c258706920be" }, 
     "marathonName": "RFH She Run 2025", 
     "userDetails": { 
        "fullName": "Ajey", 
        "gender": "female", 
        "bloodGroup": "B+", 
        "address": "rr nagar", 
        "city": "Bengaluru", 
        "state": "Karnataka", 
        "country": "India", 
        "nationality": "Indian", 
        "mobNo": "9884299308", 
        "email": "ajejey@gmail.com",
        "dob": "1988-06-06", 
        "category": "Chennamma-Run", 
        "TshirtSize": "XS", 
        "additionalTshirt": "No", 
        "donation": "", 
        "emergencyName": "DD", 
        "emergencyNo": "9887455896", 
        "reference": "friend", 
        "AgreeTnC": "Sure!", 
        "additionalBreakfast": "0", 
        "additionalTshirtQuantity": "0", 
        "additionalTshirtSize": "", 
        "totalPrice": { "$numberInt": "1" }, 
        "marathonName": "RFH She Run 2025" }, 
        "date": { "$date": { "$numberLong": "1743229917038" } }, 
        "merchantTransactionId": "RFH-SHE-RUN-2025-00044", 
        "__v": { "$numberInt": "0" }, 
        "paymentDetails": { 
            "orderId": "order_QCVZWIdS9MEKsa", 
            "amount": { "$numberInt": "100" }, 
            "status": "paid", 
            "data": { 
                "amount": { "$numberInt": "100" }, 
                "amount_due": { "$numberInt": "100" }, 
                "amount_paid": { "$numberInt": "0" }, 
                "attempts": { "$numberInt": "0" }, 
                "created_at": { "$numberInt": "1743229919" }, 
                "currency": "INR", 
                "entity": "order", 
                "id": "order_QCVZWIdS9MEKsa", 
                "notes": { "marathonName": "RFH She Run 2025", "userEmail": "ajejey@gmail.com" }, 
                "offer_id": null, 
                "receipt": "RFH-SHE-RUN-2025-00044", 
                "status": "created" 
            }, 
            "code": "PAYMENT_SUCCESS", 
            "paymentGateway": "Razorpay", 
            "paymentId": "pay_QCVaRLjA1v593X", 
            "success": true, 
            "verifiedAt": { "$date": { "$numberLong": "1743229987599" } }, 
            "emailSent": true 
        } 
    }

// Configuration for the participant details view/edit modal.
// `editable: false` means the field is shown read-only even in edit mode (e.g. price/coupon).
const PARTICIPANT_FIELD_GROUPS = [
    {
        title: 'Personal Info',
        fields: [
            { key: 'fullName', label: 'Full Name', editable: true },
            { key: 'gender', label: 'Gender', editable: true, type: 'select', options: ['Male', 'Female', 'Other'] },
            { key: 'dob', label: 'Date of Birth', editable: true, type: 'date' },
            { key: 'bloodGroup', label: 'Blood Group', editable: true },
            { key: 'nationality', label: 'Nationality', editable: true },
        ],
    },
    {
        title: 'Contact',
        fields: [
            { key: 'email', label: 'Email', editable: true },
            { key: 'mobNo', label: 'Phone', editable: true },
            { key: 'address', label: 'Address', editable: true, multiline: true },
            { key: 'city', label: 'City', editable: true },
            { key: 'state', label: 'State', editable: true },
            { key: 'country', label: 'Country', editable: true },
        ],
    },
    {
        title: 'Event',
        fields: [
            { key: 'category', label: 'Category', editable: true },
            { key: 'TshirtSize', label: 'T-shirt Size', editable: true },
            { key: 'additionalTshirt', label: 'Additional T-shirt?', editable: true, type: 'select', options: ['Yes', 'No'] },
            { key: 'additionalTshirtSize', label: 'Additional T-shirt Size(s)', editable: true },
            { key: 'additionalTshirtQuantity', label: 'Additional T-shirt Qty', editable: true, type: 'number' },
            { key: 'additionalBreakfast', label: 'Additional Breakfast', editable: true, type: 'number' },
        ],
    },
    {
        title: 'Emergency Contact',
        fields: [
            { key: 'emergencyName', label: 'Emergency Contact Name', editable: true },
            { key: 'emergencyNo', label: 'Emergency Contact Number', editable: true },
        ],
    },
    {
        title: 'Accompanying Persons',
        fields: [
            { key: 'accompanyingCount', label: 'Accompanying Count', editable: true, type: 'number' },
            { key: 'accompanyingPerson1Name', label: 'Person 1 Name', editable: true },
            { key: 'accompanyingPerson1Age', label: 'Person 1 Age', editable: true, type: 'number' },
            { key: 'accompanyingPerson2Name', label: 'Person 2 Name', editable: true },
            { key: 'accompanyingPerson2Age', label: 'Person 2 Age', editable: true, type: 'number' },
            { key: 'accompanyingPerson3Name', label: 'Person 3 Name', editable: true },
            { key: 'accompanyingPerson3Age', label: 'Person 3 Age', editable: true, type: 'number' },
        ],
    },
    {
        title: 'Other',
        fields: [
            { key: 'reference', label: 'Reference', editable: true },
            { key: 'brandAmbassador', label: 'Brand Ambassador', editable: true },
            { key: 'donation', label: 'Donation Amount (₹)', editable: false },
            { key: 'totalPrice', label: 'Total Price (₹)', editable: false },
            { key: 'couponCode', label: 'Coupon Code', editable: false },
            { key: 'couponDiscount', label: 'Coupon Discount %', editable: false },
        ],
    },
];

function ParticipantDetailsBody({ row, editMode, editForm, onChange }) {
    const ud = row?.userDetails || {};
    const lastEditedAt = ud.lastEditedAt ? new Date(ud.lastEditedAt) : null;

    return (
        <Box>
            {/* Read-only registration meta */}
            <Box sx={{ mb: 2, p: 1.5, bgcolor: 'rgba(0,0,0,0.03)', borderRadius: 1 }}>
                <Grid container spacing={1}>
                    <Grid item xs={6} sm={4}>
                        <Typography variant="caption" color="text.secondary">Registered On</Typography>
                        <Typography variant="body2">{row?.date ? new Date(row.date).toLocaleString() : '—'}</Typography>
                    </Grid>
                    <Grid item xs={6} sm={4}>
                        <Typography variant="caption" color="text.secondary">Marathon</Typography>
                        <Typography variant="body2">{row?.marathonName || ud.marathonName || '—'}</Typography>
                    </Grid>
                    <Grid item xs={6} sm={4}>
                        <Typography variant="caption" color="text.secondary">Payment</Typography>
                        <Typography variant="body2">
                            {row?.paymentDetails?.success ? '✅ Success' : '❌ Failed'}
                            {row?.paymentDetails?.paymentGateway ? ` · ${row.paymentDetails.paymentGateway}` : ''}
                        </Typography>
                    </Grid>
                    {lastEditedAt && (
                        <Grid item xs={12}>
                            <Typography variant="caption" color="text.secondary">
                                Last edited {lastEditedAt.toLocaleString()}
                                {ud.lastEditedBy ? ` by ${ud.lastEditedBy}` : ''}
                                {Array.isArray(ud.lastEditedFields) && ud.lastEditedFields.length
                                    ? ` (changed: ${ud.lastEditedFields.join(', ')})`
                                    : ''}
                            </Typography>
                        </Grid>
                    )}
                </Grid>
            </Box>

            {PARTICIPANT_FIELD_GROUPS.map(group => (
                <Box key={group.title} sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" sx={{ mb: 1, color: 'primary.main', fontWeight: 600 }}>
                        {group.title}
                    </Typography>
                    <Grid container spacing={2}>
                        {group.fields.map(f => {
                            const rawValue = editMode ? (editForm[f.key] ?? '') : (ud[f.key] ?? '');
                            const displayValue = (rawValue === '' || rawValue == null) ? '—' : String(rawValue);
                            const isEditable = editMode && f.editable;
                            const fullWidth = f.multiline;
                            return (
                                <Grid item xs={12} sm={fullWidth ? 12 : 6} md={fullWidth ? 12 : 4} key={f.key}>
                                    {isEditable ? (
                                        f.type === 'select' ? (
                                            <FormControl fullWidth size="small">
                                                <InputLabel>{f.label}</InputLabel>
                                                <Select
                                                    label={f.label}
                                                    value={editForm[f.key] ?? ''}
                                                    onChange={e => onChange(f.key, e.target.value)}
                                                >
                                                    {(f.options || []).map(opt => (
                                                        <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        ) : (
                                            <TextField
                                                fullWidth
                                                size="small"
                                                label={f.label}
                                                type={f.type || 'text'}
                                                multiline={!!f.multiline}
                                                minRows={f.multiline ? 2 : undefined}
                                                value={editForm[f.key] ?? ''}
                                                onChange={e => onChange(f.key, e.target.value)}
                                                InputLabelProps={f.type === 'date' ? { shrink: true } : undefined}
                                            />
                                        )
                                    ) : (
                                        <Box>
                                            <Typography variant="caption" color="text.secondary">{f.label}</Typography>
                                            <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
                                                {displayValue}
                                            </Typography>
                                        </Box>
                                    )}
                                </Grid>
                            );
                        })}
                    </Grid>
                </Box>
            ))}
        </Box>
    );
}

function EventParticipants() {
    // Function to download CSV data
    const downloadCSV = (data) => {
        // Largest number of accompanying persons across the rows, so every row
        // emits the same Person-N columns (added this year; was missing from export).
        const maxAccompanying = data.reduce((max, item) => {
            const u = item?.userDetails || {};
            let n = parseInt(u.accompanyingCount || 0) || 0;
            for (let i = 1; i <= 50; i++) { if (u[`accompanyingPerson${i}Name`]) n = Math.max(n, i); }
            return Math.max(max, n);
        }, 0);

        // Format the data for CSV export
        const csvData = data.map((item) => {
            // Get payment amount in a readable format
            let amount = 0;
            if (item.paymentDetails?.data?.amount) {
                amount = item.paymentDetails.data.amount / 100;
            } else if (item.paymentDetails?.amount) {
                amount = item.paymentDetails.amount / 100;
            }

            // Flatten accompanying persons into Person N Name/Age columns (consistent across rows).
            const u = item?.userDetails || {};
            const accompanying = { 'Accompanying Count': u.accompanyingCount || '0' };
            for (let i = 1; i <= maxAccompanying; i++) {
                accompanying[`Accompanying ${i} Name`] = u[`accompanyingPerson${i}Name`] || '';
                accompanying[`Accompanying ${i} Age`] = u[`accompanyingPerson${i}Age`] || '';
            }

            // Create a comprehensive data object with all relevant fields
            return {
                'Date': new Date(item.date).toLocaleString(),
                'Transaction ID': item?.merchantTransactionId || '',
                'PhonePe Transaction ID': item?.paymentDetails?.data?.transactionId || '',
                'Full Name': item?.userDetails?.fullName || '',
                'Email': item?.userDetails?.email || '',
                'Phone': item?.userDetails?.mobNo || '',
                'Gender': item?.userDetails?.gender || '',
                'Category': item?.userDetails?.category || '',
                'T-shirt Size': item?.userDetails?.TshirtSize || '',
                'Additional T-shirt': item?.userDetails?.additionalTshirt || 'No',
                'Additional T-shirt Size': item?.userDetails?.additionalTshirtSize || '',
                'Additional T-shirt Quantity': item?.userDetails?.additionalTshirtQuantity || '0',
                'Additional Breakfast': item?.userDetails?.additionalBreakfast || '0',
                'Total Breakfast Count': (Number(item?.userDetails?.additionalBreakfast || 0) + 1).toString(),
                ...accompanying,
                'Blood Group': item?.userDetails?.bloodGroup || '',
                'Address': item?.userDetails?.address || '',
                'City': item?.userDetails?.city || '',
                'State': item?.userDetails?.state || '',
                'Country': item?.userDetails?.country || '',
                'Nationality': item?.userDetails?.nationality || '',
                'Date of Birth': item?.userDetails?.dob || '',
                'Emergency Contact Name': item?.userDetails?.emergencyName || '',
                'Emergency Contact Number': item?.userDetails?.emergencyNo || '',
                'Reference': item?.userDetails?.reference || '',
                'Donation Amount': item?.userDetails?.donation || '0',
                'Coupon Code': item?.userDetails?.couponCode || '',
                'Coupon Discount %': item?.userDetails?.couponDiscount || '',
                'Total Amount (₹)': amount.toFixed(2),
                'Payment Status': item?.paymentDetails?.success ? 'Success' : 'Failed',
                'Payment Gateway': item?.paymentDetails?.paymentGateway || (item?.paymentDetails?.success ? 'PhonePe' : 'N/A')
            };
        });

        // Convert to CSV
        const csv = Papa.unparse(csvData);

        // Create a Blob
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });

        // Create a download link
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.href = url;
        link.setAttribute('download', `${marathonName}_participants_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);

        // Trigger download
        link.click();

        // Clean up
        document.body.removeChild(link);
        
        // Show success notification
        setSnackbar({
            open: true,
            message: 'CSV file downloaded successfully!',
            severity: 'success'
        });
    };
    const { data: marathonNames, error, isLoading } = useSWR('api/payments/all-marathon-names', fetcher);
    const [marathonName, setMarathonName] = useState('');
    const { data: participantsData, error: participantsError, isLoading: participantsLoading, mutate } = useSWR(
        marathonName ? `api/payments/marathon/${marathonName}` : null,
        fetcher
    );
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterCoupon, setFilterCoupon] = useState('all');
    const [tabValue, setTabValue] = useState(0);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'info'
    });
    const [resendDialogOpen, setResendDialogOpen] = useState(false);
    const [selectedReceiptRow, setSelectedReceiptRow] = useState(null);
    const [sendingReceiptId, setSendingReceiptId] = useState('');

    // View/Edit modal state
    const { isSuperAdmin, can, token } = useAdminAuth();
    const canEdit = isSuperAdmin || can('canEditRunners');
    const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
    const [detailsRow, setDetailsRow] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [editForm, setEditForm] = useState({});
    const [savingEdit, setSavingEdit] = useState(false);

    // Filtered data based on search, filtering and test transaction exclusion
    const filteredData = useMemo(() => {
        if (!participantsData || participantsData.length === 0) return [];

        // First filter out test transactions (amount = 100 paise = 1 rupee)
        const nonTestTransactions = participantsData.filter(item => {
            if (item.paymentDetails &&
                item.paymentDetails.success &&
                item.paymentDetails.data &&
                (item.paymentDetails?.data?.amount || item.paymentDetails?.amount)) {
                // Filter out transactions with amount = 100 (1 rupee)
                const amount = item.paymentDetails?.data?.amount || item.paymentDetails?.amount;
                return Number(amount) !== 100;
            }
            return true; // Keep items without payment details or failed payments
        });

        // Then apply search and status filters
        return nonTestTransactions.filter(item => {
            // Filter based on payment status
            if (filterStatus === 'success' && (!item.paymentDetails || !item.paymentDetails.success)) return false;
            if (filterStatus === 'failed' && item.paymentDetails && item.paymentDetails.success) return false;

            // Filter based on coupon code
            if (filterCoupon && filterCoupon !== 'all') {
                const itemCoupon = (item?.userDetails?.couponCode || '').toUpperCase();
                if (filterCoupon === 'none') {
                    if (itemCoupon) return false;
                } else if (itemCoupon !== filterCoupon) {
                    return false;
                }
            }

            // Filter based on search term
            if (searchTerm) {
                const searchTermLower = searchTerm.toLowerCase();
                const userDetails = item.userDetails || {};
                const paymentDetails = item.paymentDetails || {};

                return (
                    (userDetails.fullName && userDetails.fullName.toLowerCase().includes(searchTermLower)) ||
                    (userDetails.email && userDetails.email.toLowerCase().includes(searchTermLower)) ||
                    (userDetails.phone && userDetails.phone.includes(searchTerm)) ||
                    (userDetails.mobNo && userDetails.mobNo.includes(searchTerm)) ||
                    (userDetails.couponCode && userDetails.couponCode.toLowerCase().includes(searchTermLower)) ||
                    (item.merchantTransactionId && item.merchantTransactionId.toLowerCase().includes(searchTermLower)) ||
                    (paymentDetails.data && paymentDetails.data.transactionId &&
                        paymentDetails.data.transactionId.toLowerCase().includes(searchTermLower))
                );
            }

            return true;
        });
    }, [participantsData, searchTerm, filterStatus, filterCoupon]);

    // List of unique coupon codes used in this event
    const availableCoupons = useMemo(() => {
        if (!participantsData) return [];
        const set = new Set();
        participantsData.forEach(item => {
            const c = item?.userDetails?.couponCode;
            if (c) set.add(String(c).toUpperCase());
        });
        return Array.from(set).sort();
    }, [participantsData]);

    // Per-coupon performance (volunteer conversion analytics)
    const couponStats = useMemo(() => {
        if (!participantsData) return [];
        const map = new Map();
        participantsData.forEach(item => {
            const rawCode = item?.userDetails?.couponCode;
            if (!rawCode) return; // only count attempts that used a coupon
            const code = String(rawCode).toUpperCase();
            const discount = Number(item?.userDetails?.couponDiscount || 0);
            const isSuccess = !!(item?.paymentDetails && item.paymentDetails.success);
            let amount = 0;
            if (item.paymentDetails?.data?.amount) amount = item.paymentDetails.data.amount / 100;
            else if (item.paymentDetails?.amount) amount = item.paymentDetails.amount / 100;

            if (!map.has(code)) {
                map.set(code, {
                    code,
                    discount,
                    total: 0,
                    successful: 0,
                    failed: 0,
                    revenue: 0
                });
            }
            const row = map.get(code);
            row.total += 1;
            if (isSuccess) {
                row.successful += 1;
                row.revenue += amount;
            } else {
                row.failed += 1;
            }
            // Keep the most recently seen discount value (in case of mixed records)
            if (discount) row.discount = discount;
        });
        return Array.from(map.values())
            .map(r => ({
                ...r,
                conversionRate: r.total > 0 ? (r.successful / r.total) * 100 : 0
            }))
            .sort((a, b) => b.successful - a.successful);
    }, [participantsData]);

    const handleMarathonNameChange = (event) => {
        setMarathonName(event.target.value);
    };

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
        setPage(0);
    };

    const handleFilterChange = (status) => {
        setFilterStatus(status);
        setPage(0);
    };

    const handleCouponFilterChange = (event) => {
        setFilterCoupon(event.target.value);
        setPage(0);
    };

    // Open the participant details modal in view mode
    const handleOpenDetails = (item) => {
        setDetailsRow(item);
        setEditMode(false);
        setEditForm({ ...(item?.userDetails || {}) });
        setDetailsDialogOpen(true);
    };

    const handleCloseDetails = () => {
        if (savingEdit) return;
        setDetailsDialogOpen(false);
        setDetailsRow(null);
        setEditMode(false);
        setEditForm({});
    };

    const handleEditFieldChange = (field, value) => {
        setEditForm(prev => ({ ...prev, [field]: value }));
    };

    const handleSaveEdit = async () => {
        if (!detailsRow?.merchantTransactionId) return;
        try {
            setSavingEdit(true);
            const response = await fetch(
                `${process.env.REACT_APP_BACKEND_BASE_URL}/api/payments/${encodeURIComponent(detailsRow.merchantTransactionId)}/details`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(editForm),
                }
            );
            const result = await response.json();
            if (!response.ok || !result.success) {
                throw new Error(result.message || 'Failed to update participant');
            }
            setSnackbar({
                open: true,
                message: result.message || 'Participant details updated',
                severity: 'success',
            });
            setEditMode(false);
            setDetailsRow(prev => prev ? { ...prev, userDetails: result.payment?.userDetails || prev.userDetails } : prev);
            mutate();
        } catch (err) {
            console.error('Edit save error:', err);
            setSnackbar({
                open: true,
                message: err.message || 'Could not update participant',
                severity: 'error',
            });
        } finally {
            setSavingEdit(false);
        }
    };

    const handleSnackbarClose = () => {
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    const handleOpenResendDialog = (item) => {
        setSelectedReceiptRow(item);
        setResendDialogOpen(true);
    };

    const handleCloseResendDialog = () => {
        if (sendingReceiptId) return;
        setResendDialogOpen(false);
        setSelectedReceiptRow(null);
    };

    const sendEmailReceipt = async () => {
        if (!selectedReceiptRow?.merchantTransactionId) {
            return;
        }

        try {
            setSendingReceiptId(selectedReceiptRow.merchantTransactionId);
            // Show loading notification
            setSnackbar({
                open: true,
                message: 'Sending receipt email...',
                severity: 'info'
            });

            const response = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/marathons/payment/send-receipt`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    merchantTransactionId: selectedReceiptRow.merchantTransactionId,
                    forceResend: true,
                    formData: {
                        merchantTransactionId: selectedReceiptRow.merchantTransactionId,
                        cause: selectedReceiptRow.marathonName || marathonName
                    }
                })
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Failed to send email');
            }

            if (result.success) {
                setResendDialogOpen(false);
                setSelectedReceiptRow(null);
                setSnackbar({
                    open: true,
                    message: `Receipt email sent to ${selectedReceiptRow?.userDetails?.email || 'participant'} successfully!`,
                    severity: 'success'
                });

                mutate();
            } else {
                throw new Error(result.message || 'Failed to send email');
            }
        } catch (error) {
            console.error('Error sending email:', error);
            setSnackbar({
                open: true,
                message: error.message || 'Error sending email',
                severity: 'error'
            });
        } finally {
            setSendingReceiptId('');
        }
    };

    // Utility functions for calculating statistics
    const calculateStats = (data) => {
        if (!data || data.length === 0) return {
            totalParticipants: 0,
            successfulPayments: 0,
            failedPayments: 0,
            totalAmount: 0,
            tshirtCount: {
                total: 0,
                sizes: {}
            },
            additionalTshirtCount: {
                total: 0,
                sizes: {}
            },
            breakfastCount: {
                included: 0,
                additional: 0
            },
            revenue: {
                registration: 0,
                tshirts: 0,
                breakfast: 0,
                donation: 0,
                total: 0
            }
        };

        const filteredData = data.filter(item => {
            if (item.paymentDetails &&
                item.paymentDetails.success &&
                item.paymentDetails.data &&
                item.paymentDetails?.data?.amount || item?.paymentDetails?.amount) {
                // Check if amount is 100 (1 rupee)
                const amount = item.paymentDetails?.data?.amount || item.paymentDetails?.amount;
                return Number(amount) !== 100;
            }
            return true; // Keep items without payment details or failed payments
        });

        const successfulParticipants = filteredData.filter(item => item.paymentDetails && item.paymentDetails.success);
       const noAmount = filteredData.filter(item => {
           return item.paymentDetails && 
                  item.paymentDetails.success && 
                  !item.paymentDetails.data;
       });
       console.log("noAmount", noAmount);
        let stats = {
            totalParticipants: successfulParticipants.length,
            successfulPayments: successfulParticipants.length,
            failedPayments: data.length - successfulParticipants.length,
            totalAmount: successfulParticipants.reduce((sum, item) => {
                if (item.paymentDetails?.data?.amount) {
                    return sum + (item.paymentDetails?.data?.amount / 100);
                } else if (item.paymentDetails?.amount) {
                    return sum + (item.paymentDetails?.amount / 100);
                }
                return sum;
            }, 0),
            tshirtCount: {
                total: 0,
                sizes: {}
            },
            additionalTshirtCount: {
                total: 0,
                sizes: {}
            },
            breakfastCount: {
                included: 0,
                additional: 0
            },
            revenue: {
                registration: 0,
                tshirts: 0,
                breakfast: 0,
                donation: 0,
                total: 0
            }
        };

        successfulParticipants.forEach(item => {
            // T-shirt counts
            if (item.userDetails && item.userDetails.TshirtSize) {
                stats.tshirtCount.total++;
                const size = item.userDetails.TshirtSize.trim();
                stats.tshirtCount.sizes[size] = (stats.tshirtCount.sizes[size] || 0) + 1;
            }

            // Additional T-shirts
            if (item.userDetails && item.userDetails.additionalTshirt === "Yes" && item.userDetails.additionalTshirtQuantity) {
                const additionalQuantity = Number(item.userDetails.additionalTshirtQuantity) || 0;
                stats.additionalTshirtCount.total += additionalQuantity;

                if (item.userDetails.additionalTshirtSize) {
                    // Handle comma-separated sizes
                    const additionalSizes = item.userDetails.additionalTshirtSize.split(',');

                    // If we have just one size but multiple quantities, apply all quantities to that size
                    if (additionalSizes.length === 1) {
                        const size = additionalSizes[0].trim();
                        stats.additionalTshirtCount.sizes[size] = (stats.additionalTshirtCount.sizes[size] || 0) + additionalQuantity;
                    }
                    // If we have multiple sizes, distribute quantities evenly or based on additional logic if needed
                    else {
                        // For now, we'll assume equal distribution among sizes
                        const quantityPerSize = additionalQuantity / additionalSizes.length;

                        additionalSizes.forEach(sizeItem => {
                            const size = sizeItem.trim();
                            stats.additionalTshirtCount.sizes[size] = (stats.additionalTshirtCount.sizes[size] || 0) + quantityPerSize;
                        });
                    }
                }
            }

            // Breakfast counts
            stats.breakfastCount.included += 1; // Each participant gets included breakfast

            if (item.userDetails && item.userDetails.additionalBreakfast) {
                const additionalBreakfastCount = Number(item.userDetails.additionalBreakfast) || 0;
                stats.breakfastCount.additional += additionalBreakfastCount;
            }

            // Revenue breakdown (if we have pricing info)
            if (item.userDetails && item.userDetails.totalPrice) {
                const totalPrice = Number(item.userDetails.totalPrice) || 0;
                stats.revenue.total += totalPrice;
            }

            if (item.userDetails && item.userDetails.donation) {
                const donation = Number(item.userDetails.donation) || 0;
                stats.revenue.donation += donation;
            }
        });

        // Round any fractional t-shirt counts that might have resulted from distribution
        Object.keys(stats.additionalTshirtCount.sizes).forEach(size => {
            stats.additionalTshirtCount.sizes[size] = Math.round(stats.additionalTshirtCount.sizes[size]);
        });

        return stats;
    };

    const stats = calculateStats(participantsData);

    // For pagination
    const paginatedData = filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

return (
    <Box sx={{ maxWidth: '100%' }}>
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" component="h1" gutterBottom sx={{ color: '#f1f5f9' }}>
                Marathon Dashboard
            </Typography>

            <Box sx={{ mb: 3 }}>
                <StyledFormControl fullWidth>
                    <InputLabel id="marathon-names-label" sx={{ color: '#94a3b8', '&.Mui-focused': { color: '#4ade80' } }}>Select Marathon</InputLabel>
                    <Select
                        labelId="marathon-names-label"
                        id="marathonNames"
                        value={marathonName}
                        label="Select Marathon"
                        onChange={handleMarathonNameChange}
                        sx={{
                            color: '#f1f5f9',
                            bgcolor: 'rgba(255,255,255,0.05)',
                            '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.15)' },
                            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.3)' },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#2f6e49' },
                            '& .MuiSvgIcon-root': { color: '#94a3b8' },
                        }}
                    >
                        <MenuItem value="">
                            <em>None</em>
                        </MenuItem>
                        {marathonNames?.marathonNames?.map((item) => (
                            <MenuItem key={item} value={item}>
                                {item}
                            </MenuItem>
                        ))}
                    </Select>
                    </StyledFormControl>
                </Box>

                {participantsData ? (
                    <>
                        {/* Dashboard Stats Summary */}
                        <Grid container spacing={3} sx={{ mb: 4 }}>
                            <Grid item xs={12} sm={6} md={3}>
                                <StyledCard>
                                    <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
                                        <StatsIcon color="#4CAF50">
                                            <PeopleAltIcon />
                                        </StatsIcon>
                                        <Box>
                                            <Typography variant="h5" component="div">
                                                {stats.totalParticipants}
                                            </Typography>
                                            <Typography color="text.secondary" variant="subtitle2">
                                                Total Participants
                                            </Typography>
                                        </Box>
                                    </CardContent>
                                </StyledCard>
                            </Grid>

                            <Grid item xs={12} sm={6} md={3}>
                                <StyledCard>
                                    <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
                                        <StatsIcon color="#2196F3">
                                            <CheckCircleIcon />
                                        </StatsIcon>
                                        <Box>
                                            <Typography variant="h5" component="div">
                                                {stats.successfulPayments}
                                            </Typography>
                                            <Typography color="text.secondary" variant="subtitle2">
                                                Successful Payments
                                            </Typography>
                                        </Box>
                                    </CardContent>
                                </StyledCard>
                            </Grid>

                            <Grid item xs={12} sm={6} md={3}>
                                <StyledCard>
                                    <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
                                        <StatsIcon color="#F44336">
                                            <CancelIcon />
                                        </StatsIcon>
                                        <Box>
                                            <Typography variant="h5" component="div">
                                                {stats.failedPayments}
                                            </Typography>
                                            <Typography color="text.secondary" variant="subtitle2">
                                                Failed Payments
                                            </Typography>
                                        </Box>
                                    </CardContent>
                                </StyledCard>
                            </Grid>

                            <Grid item xs={12} sm={6} md={3}>
                                <StyledCard>
                                    <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
                                        <StatsIcon color="#FF9800">
                                            <MonetizationOnIcon />
                                        </StatsIcon>
                                        <Box>
                                            <Typography variant="h5" component="div">
                                                ₹{stats.totalAmount.toLocaleString()}
                                            </Typography>
                                            <Typography color="text.secondary" variant="subtitle2">
                                                Total Revenue
                                            </Typography>
                                        </Box>
                                    </CardContent>
                                </StyledCard>
                            </Grid>
                        </Grid>

                        {/* T-shirt and Breakfast Stats Cards */}
                        <Grid container spacing={3} sx={{ mb: 4 }}>
                            {/* T-shirt Card */}
                            <Grid item xs={12} md={6}>
                                <StyledCard>
                                    <CardContent>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                            <StatsIcon color="#9C27B0">
                                                <TshirtIcon />
                                            </StatsIcon>
                                            <Box>
                                                <Typography variant="h5" component="div">
                                                    {stats.tshirtCount.total + stats.additionalTshirtCount.total}
                                                </Typography>
                                                <Typography color="text.secondary" variant="subtitle2">
                                                    Total T-shirts ({stats.tshirtCount.total} regular + {stats.additionalTshirtCount.total} additional)
                                                </Typography>
                                            </Box>
                                        </Box>

                                        <Divider sx={{ mb: 2 }} />

                                        <Typography variant="subtitle1" gutterBottom>
                                            Size Breakdown:
                                        </Typography>

                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                            {/* Combine regular and additional sizes */}
                                            {Object.entries({
                                                ...stats.tshirtCount.sizes,
                                                ...Object.fromEntries(
                                                    Object.entries(stats.additionalTshirtCount.sizes).map(
                                                        ([size, count]) => [size, (stats.tshirtCount.sizes[size] || 0) + count]
                                                    )
                                                )
                                            }).map(([size, count]) => (
                                                <Chip
                                                    key={size}
                                                    label={`${size}: ${count}`}
                                                    sx={{
                                                        bgcolor: '#9C27B0',
                                                        color: 'white',
                                                        fontWeight: 'bold',
                                                        m: 0.5
                                                    }}
                                                />
                                            ))}
                                        </Box>
                                    </CardContent>
                                </StyledCard>
                            </Grid>

                            {/* Breakfast Card */}
                            <Grid item xs={12} md={6}>
                                <StyledCard>
                                    <CardContent>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                            <StatsIcon color="#FF5722">
                                                <RestaurantIcon />
                                            </StatsIcon>
                                            <Box>
                                                <Typography variant="h5" component="div">
                                                    {stats.breakfastCount.included + stats.breakfastCount.additional}
                                                </Typography>
                                                <Typography color="text.secondary" variant="subtitle2">
                                                    Total Breakfast Count
                                                </Typography>
                                            </Box>
                                        </Box>

                                        <Divider sx={{ mb: 2 }} />

                                        <Grid container spacing={2}>
                                            <Grid item xs={12} md={6}>
                                                <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'rgba(255, 87, 34, 0.1)' }}>
                                                    <Typography variant="h6" color="#FF5722">
                                                        {stats.breakfastCount.included}
                                                    </Typography>
                                                    <Typography variant="body2">
                                                        Included with Registration
                                                    </Typography>
                                                </Paper>
                                            </Grid>

                                            <Grid item xs={12} md={6}>
                                                <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'rgba(255, 87, 34, 0.1)' }}>
                                                    <Typography variant="h6" color="#FF5722">
                                                        {stats.breakfastCount.additional}
                                                    </Typography>
                                                    <Typography variant="body2">
                                                        Additional Orders
                                                    </Typography>
                                                </Paper>
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </StyledCard>
                            </Grid>
                        </Grid>

                        {/* Search, Filter, and Actions Bar */}
                        <Paper sx={{ p: 2, mb: 3 }}>
                            <Grid container spacing={2} alignItems="center">
                                <Grid item xs={12} md={5}>
                                    <SearchBar>
                                        <SearchIcon sx={{ color: 'action.active', mr: 1 }} />
                                        <TextField
                                            variant="standard"
                                            placeholder="Search by name, email, phone or transaction ID..."
                                            fullWidth
                                            value={searchTerm}
                                            onChange={handleSearchChange}
                                            InputProps={{ disableUnderline: true }}
                                        />
                                        {searchTerm && (
                                            <IconButton size="small" onClick={() => setSearchTerm('')}>
                                                <CancelIcon fontSize="small" />
                                            </IconButton>
                                        )}
                                    </SearchBar>
                                </Grid>

                                <Grid item xs={12} md={7}>
                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
                                        <FormControl size="small" sx={{ minWidth: 180 }}>
                                            <InputLabel id="coupon-filter-label">Coupon</InputLabel>
                                            <Select
                                                labelId="coupon-filter-label"
                                                label="Coupon"
                                                value={filterCoupon}
                                                onChange={handleCouponFilterChange}
                                            >
                                                <MenuItem value="all">All coupons</MenuItem>
                                                <MenuItem value="none">No coupon used</MenuItem>
                                                {availableCoupons.map(code => (
                                                    <MenuItem key={code} value={code}>{code}</MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                        <Button
                                            variant={filterStatus === 'all' ? 'contained' : 'outlined'}
                                            size="small"
                                            onClick={() => handleFilterChange('all')}
                                        >
                                            All
                                        </Button>
                                        <Button
                                            variant={filterStatus === 'success' ? 'contained' : 'outlined'}
                                            color="success"
                                            size="small"
                                            onClick={() => handleFilterChange('success')}
                                            startIcon={<CheckCircleIcon />}
                                        >
                                            Success
                                        </Button>
                                        <Button
                                            variant={filterStatus === 'failed' ? 'contained' : 'outlined'}
                                            color="error"
                                            size="small"
                                            onClick={() => handleFilterChange('failed')}
                                            startIcon={<CancelIcon />}
                                        >
                                            Failed
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            startIcon={<DownloadIcon />}
                                            onClick={() => {
                                                // Trigger the CSV download function directly
                                                if (filteredData && filteredData.length > 0) {
                                                    downloadCSV(filteredData);
                                                }
                                            }}
                                        >
                                            Export CSV
                                        </Button>
                                        <IconButton onClick={() => window.location.reload()}>
                                            <RefreshIcon />
                                        </IconButton>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Paper>

                        {/* Tabs for different views */}
                        <Box sx={{ mb: 2, borderBottom: 1, borderColor: 'divider' }}>
                            <Tabs value={tabValue} onChange={handleTabChange} aria-label="dashboard tabs" variant="scrollable" scrollButtons="auto">
                                <Tab label="Participants List" />
                                <Tab label="Payment Details" />
                                <Tab label="T-Shirt Orders" />
                                <Tab label="Breakfast Orders" />
                                <Tab label={`Coupon Performance${couponStats.length ? ` (${couponStats.length})` : ''}`} />
                            </Tabs>
                        </Box>

                        {/* We'll use our own CSV download function instead of the hidden component */}

                        {/* Tab Panels */}
                        {tabValue === 0 && (
                            <StyledTableContainer component={Paper}>
                                <Table stickyHeader>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Transaction ID</TableCell>
                                            <TableCell>Full Name</TableCell>
                                            <TableCell>Email</TableCell>
                                            <TableCell>Phone</TableCell>
                                            <TableCell>Category</TableCell>
                                            <TableCell>Gender</TableCell>
                                            <TableCell>T-shirt Size</TableCell>
                                            <TableCell>Coupon</TableCell>
                                            <TableCell>Discount</TableCell>
                                            <TableCell>Payment Status</TableCell>
                                            <TableCell>Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {paginatedData.map((item) => (
                                            <TableRow
                                                key={item._id}
                                                sx={{
                                                    backgroundColor: item?.paymentDetails?.success ? 'rgba(76, 175, 80, 0.08)' : 'rgba(244, 67, 54, 0.08)'
                                                }}
                                            >
                                                <TableCell>{item?.merchantTransactionId}</TableCell>
                                                <TableCell>{item?.userDetails?.fullName}</TableCell>
                                                <TableCell>{item?.userDetails?.email}</TableCell>
                                                <TableCell>{item?.userDetails?.mobNo}</TableCell>
                                                <TableCell>{item?.userDetails?.category}</TableCell>
                                                <TableCell>{item?.userDetails?.gender}</TableCell>
                                                <TableCell>{item?.userDetails?.TshirtSize}</TableCell>
                                                <TableCell>
                                                    {item?.userDetails?.couponCode ? (
                                                        <Chip
                                                            label={String(item.userDetails.couponCode).toUpperCase()}
                                                            size="small"
                                                            color="info"
                                                            variant="outlined"
                                                        />
                                                    ) : (
                                                        <Typography variant="caption" color="text.secondary">—</Typography>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    {item?.userDetails?.couponDiscount
                                                        ? `${item.userDetails.couponDiscount}%`
                                                        : '—'}
                                                </TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={item?.paymentDetails?.success ? "Success" : "Failed"}
                                                        color={item?.paymentDetails?.success ? "success" : "error"}
                                                        size="small"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Tooltip title={canEdit ? 'View / Edit Details' : 'View Details'}>
                                                        <IconButton size="small" onClick={() => handleOpenDetails(item)}>
                                                            <VisibilityIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                    {item?.paymentDetails?.success && (
                                                        <Tooltip title="Send/Resend Email Receipt">
                                                            <IconButton
                                                                size="small"
                                                                onClick={() => handleOpenResendDialog(item)}
                                                                color="primary"
                                                                disabled={sendingReceiptId === item?.merchantTransactionId}
                                                            >
                                                                {sendingReceiptId === item?.merchantTransactionId ? (
                                                                    <CircularProgress size={16} color="inherit" />
                                                                ) : (
                                                                    <EmailIcon fontSize="small" />
                                                                )}
                                                            </IconButton>
                                                        </Tooltip>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                                <TablePagination
                                    rowsPerPageOptions={[10, 25, 50, 100]}
                                    component="div"
                                    count={filteredData.length}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    onPageChange={handleChangePage}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                />
                            </StyledTableContainer>
                        )}

                        {tabValue === 1 && (
                            <StyledTableContainer component={Paper}>
                                <Table stickyHeader>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Transaction ID</TableCell>
                                            <TableCell>Full Name</TableCell>
                                            <TableCell>Date</TableCell>
                                            <TableCell>Payment Status</TableCell>
                                            <TableCell>Amount (₹)</TableCell>
                                            <TableCell>Payment Method</TableCell>
                                            <TableCell>Payment Gateway</TableCell>
                                            <TableCell>PhonePe Transaction ID</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {paginatedData.map((item) => (
                                            <TableRow
                                                key={item._id}
                                                sx={{
                                                    backgroundColor: item?.paymentDetails?.success ? 'rgba(76, 175, 80, 0.08)' : 'rgba(244, 67, 54, 0.08)'
                                                }}
                                            >
                                                <TableCell>{item?.merchantTransactionId}</TableCell>
                                                <TableCell>{item?.userDetails?.fullName}</TableCell>
                                                <TableCell>{new Date(item?.date).toLocaleString()}</TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={item?.paymentDetails?.code || "N/A"}
                                                        color={item?.paymentDetails?.success ? "success" : "error"}
                                                        size="small"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    {item?.paymentDetails?.data?.amount
                                                        ? (Number(item.paymentDetails?.data?.amount) / 100).toLocaleString()
                                                        : item?.paymentDetails?.amount
                                                            ? (Number(item.paymentDetails?.amount) / 100).toLocaleString()
                                                            : item?.userDetails?.totalPrice || "N/A"}
                                                </TableCell>
                                                <TableCell>
                                                    {item?.paymentDetails?.data?.paymentInstrument?.type || "N/A"}
                                                </TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={item?.paymentDetails?.paymentGateway || (item?.paymentDetails?.success ? "PhonePe" : "N/A")}
                                                        color={item?.paymentDetails?.paymentGateway === "OFFLINE" ? "secondary" : "primary"}
                                                        size="small"
                                                        variant="outlined"
                                                    />
                                                </TableCell>
                                                <TableCell>{item?.paymentDetails?.data?.transactionId || "N/A"}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                                <TablePagination
                                    rowsPerPageOptions={[10, 25, 50, 100]}
                                    component="div"
                                    count={filteredData.length}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    onPageChange={handleChangePage}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                />
                            </StyledTableContainer>
                        )}

                        {tabValue === 2 && (
                            <StyledTableContainer component={Paper}>
                                <Table stickyHeader>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Full Name</TableCell>
                                            <TableCell>T-shirt Size</TableCell>
                                            <TableCell>Additional T-shirt</TableCell>
                                            <TableCell>Additional T-shirt Size</TableCell>
                                            <TableCell>Additional Quantity</TableCell>
                                            <TableCell>Payment Status</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {paginatedData
                                            .filter(item => item?.paymentDetails?.success) // Only show successful payments
                                            .map((item) => {
                                                // Process additional t-shirt sizes for display
                                                const additionalSizes = item?.userDetails?.additionalTshirtSize || "N/A";
                                                const hasMultipleSizes = additionalSizes !== "N/A" && additionalSizes.includes(',');

                                                return (
                                                    <TableRow key={item._id}>
                                                        <TableCell>{item?.userDetails?.fullName}</TableCell>
                                                        <TableCell>{item?.userDetails?.TshirtSize || "N/A"}</TableCell>
                                                        <TableCell>{item?.userDetails?.additionalTshirt || "No"}</TableCell>
                                                        <TableCell>
                                                            {hasMultipleSizes ? (
                                                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                                    {additionalSizes.split(',').map((size, index) => (
                                                                        <Chip
                                                                            key={index}
                                                                            label={size.trim()}
                                                                            size="small"
                                                                            color="secondary"
                                                                        />
                                                                    ))}
                                                                </Box>
                                                            ) : additionalSizes}
                                                        </TableCell>
                                                        <TableCell>{item?.userDetails?.additionalTshirtQuantity || "0"}</TableCell>
                                                        <TableCell>
                                                            <Chip
                                                                label="Success"
                                                                color="success"
                                                                size="small"
                                                            />
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            })}
                                    </TableBody>
                                </Table>
                                <TablePagination
                                    rowsPerPageOptions={[10, 25, 50, 100]}
                                    component="div"
                                    count={filteredData.filter(item => item?.paymentDetails?.success).length}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    onPageChange={handleChangePage}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                />
                            </StyledTableContainer>
                        )}

                        {tabValue === 4 && (
                            <StyledTableContainer component={Paper}>
                                <Box sx={{ p: 2 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        Per-coupon conversion analytics. Each coupon code typically corresponds to a single volunteer/ambassador.
                                        Conversion rate = Successful registrations ÷ Total registration attempts using that code.
                                    </Typography>
                                </Box>
                                <Table stickyHeader>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Coupon Code</TableCell>
                                            <TableCell align="right">Discount %</TableCell>
                                            <TableCell align="right">Total Attempts</TableCell>
                                            <TableCell align="right">Successful</TableCell>
                                            <TableCell align="right">Failed</TableCell>
                                            <TableCell align="right">Conversion Rate</TableCell>
                                            <TableCell align="right">Revenue (₹)</TableCell>
                                            <TableCell align="center">Action</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {couponStats.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={8} align="center">
                                                    <Typography variant="body2" color="text.secondary" sx={{ py: 3 }}>
                                                        No coupon codes have been used for this event yet.
                                                    </Typography>
                                                </TableCell>
                                            </TableRow>
                                        ) : couponStats.map(row => (
                                            <TableRow key={row.code} hover>
                                                <TableCell>
                                                    <Chip label={row.code} color="info" size="small" />
                                                </TableCell>
                                                <TableCell align="right">{row.discount || '—'}</TableCell>
                                                <TableCell align="right">{row.total}</TableCell>
                                                <TableCell align="right">
                                                    <Chip label={row.successful} color="success" size="small" />
                                                </TableCell>
                                                <TableCell align="right">
                                                    <Chip label={row.failed} color={row.failed > 0 ? 'error' : 'default'} size="small" />
                                                </TableCell>
                                                <TableCell align="right">
                                                    <strong style={{
                                                        color: row.conversionRate >= 75 ? '#2e7d32'
                                                            : row.conversionRate >= 50 ? '#ed6c02'
                                                            : '#d32f2f'
                                                    }}>
                                                        {row.conversionRate.toFixed(1)}%
                                                    </strong>
                                                </TableCell>
                                                <TableCell align="right">
                                                    ₹{row.revenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Tooltip title="View participants who used this coupon">
                                                        <Button
                                                            size="small"
                                                            variant="outlined"
                                                            onClick={() => {
                                                                setFilterCoupon(row.code);
                                                                setTabValue(0);
                                                                setPage(0);
                                                            }}
                                                        >
                                                            View
                                                        </Button>
                                                    </Tooltip>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </StyledTableContainer>
                        )}

                        {tabValue === 3 && (
                            <StyledTableContainer component={Paper}>
                                <Table stickyHeader>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Full Name</TableCell>
                                            <TableCell>Additional Breakfast</TableCell>
                                            <TableCell>Total Breakfast Count</TableCell>
                                            <TableCell>Payment Status</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {paginatedData
                                            .filter(item => item?.paymentDetails?.success) // Only show successful payments
                                            .map((item) => (
                                                <TableRow key={item._id}>
                                                    <TableCell>{item?.userDetails?.fullName}</TableCell>
                                                    <TableCell>{item?.userDetails?.additionalBreakfast || "0"}</TableCell>
                                                    <TableCell>{(Number(item?.userDetails?.additionalBreakfast || 0) + 1).toString()}</TableCell>
                                                    <TableCell>
                                                        <Chip
                                                            label="Success"
                                                            color="success"
                                                            size="small"
                                                        />
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                    </TableBody>
                                </Table>
                                <TablePagination
                                    rowsPerPageOptions={[10, 25, 50, 100]}
                                    component="div"
                                    count={filteredData.filter(item => item?.paymentDetails?.success).length}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    onPageChange={handleChangePage}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                />
                            </StyledTableContainer>
                        )}

                    </>
                ) : marathonName ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <Paper sx={{ p: 4, textAlign: 'center' }}>
                        <Typography variant="h6" gutterBottom>
                            Select a marathon to view data
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Please choose a marathon from the dropdown menu above to load participant data and analytics.
                        </Typography>
                    </Paper>
                )}
            </Box>
            {/* View / Edit Participant Details Dialog */}
            <Dialog
                open={detailsDialogOpen}
                onClose={handleCloseDetails}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                        <Typography variant="h6" component="div">
                            {editMode ? 'Edit Participant Details' : 'Participant Details'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            {detailsRow?.merchantTransactionId}
                        </Typography>
                    </Box>
                    {!editMode && canEdit && (
                        <Button
                            startIcon={<EditIcon />}
                            variant="outlined"
                            size="small"
                            onClick={() => setEditMode(true)}
                        >
                            Edit
                        </Button>
                    )}
                </DialogTitle>
                <DialogContent dividers>
                    {detailsRow ? (
                        <ParticipantDetailsBody
                            row={detailsRow}
                            editMode={editMode}
                            editForm={editForm}
                            onChange={handleEditFieldChange}
                        />
                    ) : null}
                </DialogContent>
                <DialogActions>
                    {editMode ? (
                        <>
                            <Button onClick={() => { setEditMode(false); setEditForm({ ...(detailsRow?.userDetails || {}) }); }} disabled={savingEdit}>
                                Cancel
                            </Button>
                            <Button
                                variant="contained"
                                onClick={handleSaveEdit}
                                disabled={savingEdit}
                                startIcon={savingEdit ? <CircularProgress size={16} color="inherit" /> : null}
                            >
                                {savingEdit ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </>
                    ) : (
                        <Button onClick={handleCloseDetails}>Close</Button>
                    )}
                </DialogActions>
            </Dialog>

            <Dialog open={resendDialogOpen} onClose={handleCloseResendDialog} maxWidth="xs" fullWidth>
                <DialogTitle>Resend registration receipt?</DialogTitle>
                <DialogContent>
                    <Typography variant="body2" color="text.secondary">
                        This will resend the same registration receipt email to{' '}
                        <strong>{selectedReceiptRow?.userDetails?.fullName || 'this participant'}</strong>
                        {selectedReceiptRow?.userDetails?.email ? ` at ${selectedReceiptRow.userDetails.email}` : ''}.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseResendDialog} disabled={Boolean(sendingReceiptId)}>
                        Cancel
                    </Button>
                    <Button
                        onClick={sendEmailReceipt}
                        variant="contained"
                        disabled={Boolean(sendingReceiptId)}
                    >
                        {sendingReceiptId ? 'Sending...' : 'Send Again'}
                    </Button>
                </DialogActions>
            </Dialog>
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}

export default EventParticipants;

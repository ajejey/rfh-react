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
    Alert
} from '@mui/material';
import { styled } from '@mui/material/styles';
import useSWR from 'swr';
import Header from '../Header';
import { convertCamelCase } from '../../Constants/commonFunctions';
import CSVDownloader from '../CSVDownloader';
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

function EventParticipants() {
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
    const [tabValue, setTabValue] = useState(0);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'info'
    });

    // Filtered data based on search, filtering and test transaction exclusion
    const filteredData = useMemo(() => {
        if (!participantsData || participantsData.length === 0) return [];

        // First filter out test transactions (amount = 100 paise = 1 rupee)
        const nonTestTransactions = participantsData.filter(item => {
            if (item.paymentDetails &&
                item.paymentDetails.success &&
                item.paymentDetails.data &&
                item.paymentDetails.data.amount) {
                // Filter out transactions with amount = 100 (1 rupee)
                return Number(item.paymentDetails.data.amount) !== 100;
            }
            return true; // Keep items without payment details or failed payments
        });

        // Then apply search and status filters
        return nonTestTransactions.filter(item => {
            // Filter based on payment status
            if (filterStatus === 'success' && (!item.paymentDetails || !item.paymentDetails.success)) return false;
            if (filterStatus === 'failed' && item.paymentDetails && item.paymentDetails.success) return false;

            // Filter based on search term
            if (searchTerm) {
                const searchTermLower = searchTerm.toLowerCase();
                const userDetails = item.userDetails || {};
                const paymentDetails = item.paymentDetails || {};

                return (
                    (userDetails.fullName && userDetails.fullName.toLowerCase().includes(searchTermLower)) ||
                    (userDetails.email && userDetails.email.toLowerCase().includes(searchTermLower)) ||
                    (userDetails.phone && userDetails.phone.includes(searchTerm)) ||
                    (paymentDetails.data && paymentDetails.data.transactionId &&
                        paymentDetails.data.transactionId.toLowerCase().includes(searchTermLower))
                );
            }

            return true;
        });
    }, [participantsData, searchTerm, filterStatus]);

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

    const handleSnackbarClose = () => {
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    const sendEmailReceipt = async (item) => {
        try {
            // Show loading notification
            setSnackbar({
                open: true,
                message: 'Sending email...',
                severity: 'info'
            });

            const response = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/marathons/payment/send-receipt`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    merchantTransactionId: item.merchantTransactionId,
                    formData: {
                        merchantTransactionId: item.merchantTransactionId,
                        cause: item.marathonName || marathonName
                    }
                })
            });

            const result = await response.json();
            console.log("result ", result);

            if (result.success) {
                // Show success notification
                setSnackbar({
                    open: true,
                    message: 'Email sent successfully!',
                    severity: 'success'
                });

                // Refresh data
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
                item.paymentDetails.data.amount) {
                // Check if amount is 100 (1 rupee)
                return Number(item.paymentDetails.data.amount) !== 100;
            }
            return true; // Keep items without payment details or failed payments
        });

        const successfulParticipants = filteredData.filter(item => item.paymentDetails && item.paymentDetails.success);

        let stats = {
            totalParticipants: successfulParticipants.length,
            successfulPayments: successfulParticipants.length,
            failedPayments: data.length - successfulParticipants.length,
            totalAmount: successfulParticipants.reduce((sum, item) => sum + (item.paymentDetails.data.amount ? item.paymentDetails.data.amount / 100 : 0), 0),
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
        <Box sx={{ maxWidth: '100%', overflow: 'hidden' }}>
            <Header />

            <Box sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h4" component="h1" gutterBottom>
                        Marathon Dashboard
                    </Typography>

                    <StyledFormControl>
                        <InputLabel id="marathon-names-label">Select Marathon</InputLabel>
                        <Select
                            labelId="marathon-names-label"
                            id="marathonNames"
                            value={marathonName}
                            label="Select Marathon"
                            onChange={handleMarathonNameChange}
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
                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
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
                                                // The CSV download button already exists
                                                document.querySelector('button[aria-label="Download CSV"]')?.click();
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
                            <Tabs value={tabValue} onChange={handleTabChange} aria-label="dashboard tabs">
                                <Tab label="Participants List" />
                                <Tab label="Payment Details" />
                                <Tab label="T-Shirt Orders" />
                                <Tab label="Breakfast Orders" />
                            </Tabs>
                        </Box>

                        {/* Hide the CSV Downloader but keep it functional */}
                        <Box sx={{ display: 'none' }}>
                            <CSVDownloader
                                data={participantsData.map((item) => {
                                    return {
                                        date: new Date(item.date).toLocaleString(),
                                        merchantTransactionId: item?.merchantTransactionId,
                                        ...item?.userDetails,
                                        paymentStatus: item?.paymentDetails?.code,
                                        phonePeTransactionId: item?.paymentDetails?.data?.transactionId,
                                        paymentGateway: item?.paymentDetails?.paymentGateway || (item?.paymentDetails?.success ? "PhonePe" : "Offline")
                                    }
                                })}
                                filename={`${marathonName}_participants`}
                            />
                        </Box>

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
                                                    <Chip
                                                        label={item?.paymentDetails?.success ? "Success" : "Failed"}
                                                        color={item?.paymentDetails?.success ? "success" : "error"}
                                                        size="small"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Tooltip title="View Complete Details">
                                                        <IconButton size="small" onClick={() => {
                                                            // This would show a detailed modal in a full implementation
                                                            alert(`Details for ${item?.userDetails?.fullName}`);
                                                        }}>
                                                            <SearchIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                    {item?.paymentDetails?.success && (
                                                        <Tooltip title="Send/Resend Email Receipt">
                                                            <IconButton
                                                                size="small"
                                                                onClick={() => sendEmailReceipt(item)}
                                                                color="primary"
                                                            >
                                                                <EmailIcon fontSize="small" />
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
                                                        ? (Number(item.paymentDetails.data.amount) / 100).toLocaleString()
                                                        : item?.userDetails?.totalPrice || "N/A"}
                                                </TableCell>
                                                <TableCell>
                                                    {item?.paymentDetails?.data?.paymentInstrument?.type || "N/A"}
                                                </TableCell>
                                                <TableCell>
                                                    {item?.paymentDetails?.paymentGateway || (item?.paymentDetails?.success ? "PhonePe" : "N/A")}
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
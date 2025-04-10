import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
    Box,
    Button,
    Container,
    FormControl,
    FormHelperText,
    Grid,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    TextField,
    Typography,
    Snackbar,
    Alert,
    Divider,
    Card,
    CardContent
} from '@mui/material';
import { styled } from '@mui/material/styles';
import Header from '../Header';
import { countries, indianStates } from '../../Constants/constants';

const StyledPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(4),
    marginBottom: theme.spacing(3),
}));

function OfflineRegistration() {
    const { register, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm();
    const [marathonName, setMarathonName] = useState('');
    const [category, setCategory] = useState('');
    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });
    const [totalPrice, setTotalPrice] = useState(0);
    const [tshirtSizes, setTshirtSizes] = useState([]);
    const [additionalTshirtQuantity, setAdditionalTshirtQuantity] = useState(0);

    // Constants for pricing
    const PRICE_MAP = {
        'RFH She Run 2025': 800,
        'RFH Juniors Run 2025': 599
    };
    const ADDITIONAL_TSHIRT_PRICE = 225;
    const BREAKFAST_PRICE = 80;

    // T-shirt size options based on marathon
    const TSHIRT_SIZE_OPTIONS = {
        'RFH She Run 2025': [
            { value: 'XS', label: 'Extra Small (XS)' },
            { value: 'S', label: 'Small (S)' },
            { value: 'M', label: 'Medium (M)' },
            { value: 'L', label: 'Large (L)' },
            { value: 'XL', label: 'Extra Large (XL)' },
            { value: 'XXL', label: 'Double XL (XXL)' }
        ],
        'RFH Juniors Run 2025': [
            { value: '24', label: 'Size 24' },
            { value: '26', label: 'Size 26' },
            { value: '28', label: 'Size 28' },
            { value: '30', label: 'Size 30' },
            { value: '32', label: 'Size 32' },
            { value: '34', label: 'Size 34' },
            { value: '36', label: 'Size 36' },
            { value: '38', label: 'Size 38' },
            { value: '40', label: 'Size 40' },
            { value: '42', label: 'Size 42' },
            { value: '44', label: 'Size 44' },
            { value: '46', label: 'Size 46' }
        ]
    };

    // Categories based on marathon
    const CATEGORIES = {
        'RFH She Run 2025': [
            { value: 'Kittur-Rani-Chennamma', label: 'Kittur Rani Chennamma (5K)' },
            { value: 'Onake-Obavva', label: 'Onake Obavva (10K)' },
            { value: 'Chennamma-Run', label: 'Chennamma Run (3K)' }
        ],
        'RFH Juniors Run 2025': [
            { value: 'Champs-Run', label: 'Champs Run (Ages 3-6, 800m)' },
            { value: 'Power-Run', label: 'Power Run (Ages 7-13, 1.5K)' },
            { value: 'Bolts-Run', label: 'Bolts Run (Ages 14-18, 2.5K)' }
        ]
    };

    // Watch for changes to calculate total price
    const watchAdditionalTshirt = watch('additionalTshirt', 'No');
    const watchAdditionalTshirtQuantity = watch('additionalTshirtQuantity', '0');
    const watchAdditionalBreakfast = watch('additionalBreakfast', '0');
    const watchDonation = watch('donation', '');

    useEffect(() => {
        if (marathonName) {
            calculateTotalPrice();
        }
    }, [marathonName, category, watchAdditionalTshirt, watchAdditionalTshirtQuantity, watchAdditionalBreakfast, watchDonation]);

    const handleMarathonChange = (event) => {
        const selectedMarathon = event.target.value;
        setMarathonName(selectedMarathon);
        setCategory('');
        setValue('category', '');
        setValue('TshirtSize', '');
        
        // Reset additional t-shirt sizes when marathon changes
        setTshirtSizes([]);
        setAdditionalTshirtQuantity(0);
        setValue('additionalTshirtQuantity', '0');
    };

    const handleCategoryChange = (event) => {
        setCategory(event.target.value);
    };

    const handleTshirtQuantityChange = (e) => {
        const quantity = parseInt(e.target.value) || 0;
        setAdditionalTshirtQuantity(quantity);
        
        // Update tshirt sizes array
        const newSizes = [...tshirtSizes];
        if (quantity > newSizes.length) {
            // Add new empty sizes
            for (let i = newSizes.length; i < quantity; i++) {
                newSizes.push('');
            }
        } else if (quantity < newSizes.length) {
            // Remove extra sizes
            newSizes.splice(quantity);
        }
        setTshirtSizes(newSizes);
    };

    const handleSizeChange = (index, size) => {
        const newSizes = [...tshirtSizes];
        newSizes[index] = size;
        setTshirtSizes(newSizes);
    };

    const calculateTotalPrice = () => {
        if (!marathonName) return;

        let price = PRICE_MAP[marathonName] || 0;
        
        // Add additional t-shirts cost
        if (watchAdditionalTshirt === 'Yes') {
            const additionalTshirtQuantity = parseInt(watchAdditionalTshirtQuantity) || 0;
            price += additionalTshirtQuantity * ADDITIONAL_TSHIRT_PRICE;
        }
        
        // Add additional breakfast cost
        const additionalBreakfast = parseInt(watchAdditionalBreakfast) || 0;
        price += additionalBreakfast * BREAKFAST_PRICE;
        
        // Add donation
        const donation = parseInt(watchDonation) || 0;
        price += donation;
        
        setTotalPrice(price);
    };

    const handleSnackbarClose = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const onSubmit = async (data) => {
        setLoading(true);
        
        try {
            // Add additional fields
            const formData = {
                ...data,
                totalPrice,
                additionalTshirtSize: tshirtSizes.join(','),
                date: new Date().toISOString(),
            };

            // Create a payment object similar to what would be created by Razorpay/PhonePe
            const paymentDetails = {
                success: true,
                code: 'PAYMENT_SUCCESS',
                amount: totalPrice * 100, // In paise/cents
                paymentGateway: 'OFFLINE', // This is the key field to identify offline payments
                paymentMethod: data.paymentMethodType || 'cash',
                receiptNumber: data.receiptNumber || '',
                notes: data.paymentNotes || ''
            };

            // Prepare the final data object
            const finalData = {
                marathonName: marathonName,
                userDetails: formData,
                paymentDetails: paymentDetails,
                isOfflineRegistration: true
            };

            // Send to server
            const response = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/marathons/add-offline-registration`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(finalData),
            });

            if (!response.ok) {
                throw new Error('Failed to add offline registration');
            }

            const result = await response.json();
            
            setSnackbar({
                open: true,
                message: 'Offline registration added successfully!',
                severity: 'success'
            });
            
            // Reset form
            reset();
            setMarathonName('');
            setCategory('');
            setTshirtSizes([]);
            setAdditionalTshirtQuantity(0);
            setTotalPrice(0);
            
        } catch (error) {
            console.error('Error adding offline registration:', error);
            setSnackbar({
                open: true,
                message: `Error: ${error.message}`,
                severity: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box>
            <Header />
            <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
                <Typography variant="h4" gutterBottom>
                    Add Offline Registration
                </Typography>
                <Divider sx={{ mb: 4 }} />
                
                <form onSubmit={handleSubmit(onSubmit)}>
                    <StyledPaper>
                        <Typography variant="h5" gutterBottom>
                            Event Details
                        </Typography>
                        
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth required error={!!errors.marathonName}>
                                    <InputLabel>Marathon</InputLabel>
                                    <Select
                                        value={marathonName}
                                        onChange={handleMarathonChange}
                                        label="Marathon"
                                        {...register('marathonName', { required: 'Marathon is required' })}
                                    >
                                        <MenuItem value="RFH She Run 2025">RFH She Run 2025</MenuItem>
                                        <MenuItem value="RFH Juniors Run 2025">RFH Juniors Run 2025</MenuItem>
                                    </Select>
                                    {errors.marathonName && <FormHelperText>{errors.marathonName.message}</FormHelperText>}
                                </FormControl>
                            </Grid>
                            
                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth required disabled={!marathonName} error={!!errors.category}>
                                    <InputLabel>Category</InputLabel>
                                    <Select
                                        value={category}
                                        onChange={handleCategoryChange}
                                        label="Category"
                                        {...register('category', { required: 'Category is required' })}
                                    >
                                        {marathonName && CATEGORIES[marathonName]?.map((option) => (
                                            <MenuItem key={option.value} value={option.value}>
                                                {option.label}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    {errors.category && <FormHelperText>{errors.category.message}</FormHelperText>}
                                </FormControl>
                            </Grid>
                        </Grid>
                    </StyledPaper>
                    
                    <StyledPaper>
                        <Typography variant="h5" gutterBottom>
                            Personal Information
                        </Typography>
                        
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Full Name"
                                    {...register('fullName', { required: 'Full name is required' })}
                                    error={!!errors.fullName}
                                    helperText={errors.fullName?.message}
                                />
                            </Grid>
                            
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Email"
                                    type="email"
                                    {...register('email', { 
                                        required: 'Email is required',
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: 'Invalid email address'
                                        }
                                    })}
                                    error={!!errors.email}
                                    helperText={errors.email?.message}
                                />
                            </Grid>
                            
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Mobile Number"
                                    {...register('mobNo', { 
                                        required: 'Mobile number is required',
                                        pattern: {
                                            value: /^[0-9]{10}$/,
                                            message: 'Mobile number must be 10 digits'
                                        }
                                    })}
                                    error={!!errors.mobNo}
                                    helperText={errors.mobNo?.message}
                                />
                            </Grid>
                            
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Date of Birth"
                                    type="date"
                                    InputLabelProps={{ shrink: true }}
                                    {...register('dob', { required: 'Date of birth is required' })}
                                    error={!!errors.dob}
                                    helperText={errors.dob?.message}
                                />
                            </Grid>
                            
                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth required error={!!errors.gender}>
                                    <InputLabel>Gender</InputLabel>
                                    <Select
                                        label="Gender"
                                        defaultValue=""
                                        {...register('gender', { required: 'Gender is required' })}
                                    >
                                        <MenuItem value="male">Male</MenuItem>
                                        <MenuItem value="female">Female</MenuItem>
                                        <MenuItem value="other">Other</MenuItem>
                                    </Select>
                                    {errors.gender && <FormHelperText>{errors.gender.message}</FormHelperText>}
                                </FormControl>
                            </Grid>
                            
                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth required error={!!errors.bloodGroup}>
                                    <InputLabel>Blood Group</InputLabel>
                                    <Select
                                        label="Blood Group"
                                        defaultValue=""
                                        {...register('bloodGroup', { required: 'Blood group is required' })}
                                    >
                                        <MenuItem value="A+">A+</MenuItem>
                                        <MenuItem value="A-">A-</MenuItem>
                                        <MenuItem value="B+">B+</MenuItem>
                                        <MenuItem value="B-">B-</MenuItem>
                                        <MenuItem value="AB+">AB+</MenuItem>
                                        <MenuItem value="AB-">AB-</MenuItem>
                                        <MenuItem value="O+">O+</MenuItem>
                                        <MenuItem value="O-">O-</MenuItem>
                                    </Select>
                                    {errors.bloodGroup && <FormHelperText>{errors.bloodGroup.message}</FormHelperText>}
                                </FormControl>
                            </Grid>
                        </Grid>
                    </StyledPaper>
                    
                    <StyledPaper>
                        <Typography variant="h5" gutterBottom>
                            Address
                        </Typography>
                        
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Address"
                                    multiline
                                    rows={2}
                                    {...register('address', { required: 'Address is required' })}
                                    error={!!errors.address}
                                    helperText={errors.address?.message}
                                />
                            </Grid>
                            
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="City"
                                    {...register('city', { required: 'City is required' })}
                                    error={!!errors.city}
                                    helperText={errors.city?.message}
                                />
                            </Grid>
                            
                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth required error={!!errors.state}>
                                    <InputLabel>State</InputLabel>
                                    <Select
                                        label="State"
                                        defaultValue=""
                                        {...register('state', { required: 'State is required' })}
                                    >
                                        {indianStates.map((state) => (
                                            <MenuItem key={state} value={state}>
                                                {state}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    {errors.state && <FormHelperText>{errors.state.message}</FormHelperText>}
                                </FormControl>
                            </Grid>
                            
                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth required error={!!errors.country}>
                                    <InputLabel>Country</InputLabel>
                                    <Select
                                        label="Country"
                                        defaultValue="India"
                                        {...register('country', { required: 'Country is required' })}
                                    >
                                        {countries.map((country) => (
                                            <MenuItem key={country} value={country}>
                                                {country}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    {errors.country && <FormHelperText>{errors.country.message}</FormHelperText>}
                                </FormControl>
                            </Grid>
                            
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Nationality"
                                    defaultValue="Indian"
                                    {...register('nationality', { required: 'Nationality is required' })}
                                    error={!!errors.nationality}
                                    helperText={errors.nationality?.message}
                                />
                            </Grid>
                        </Grid>
                    </StyledPaper>
                    
                    <StyledPaper>
                        <Typography variant="h5" gutterBottom>
                            T-Shirt & Add-ons
                        </Typography>
                        
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth required disabled={!marathonName} error={!!errors.TshirtSize}>
                                    <InputLabel>T-Shirt Size</InputLabel>
                                    <Select
                                        label="T-Shirt Size"
                                        defaultValue=""
                                        {...register('TshirtSize', { required: 'T-shirt size is required' })}
                                    >
                                        {marathonName && TSHIRT_SIZE_OPTIONS[marathonName]?.map((option) => (
                                            <MenuItem key={option.value} value={option.value}>
                                                {option.label}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    {errors.TshirtSize && <FormHelperText>{errors.TshirtSize.message}</FormHelperText>}
                                </FormControl>
                            </Grid>
                            
                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth>
                                    <InputLabel>Additional T-Shirt</InputLabel>
                                    <Select
                                        label="Additional T-Shirt"
                                        defaultValue="No"
                                        {...register('additionalTshirt')}
                                    >
                                        <MenuItem value="Yes">Yes</MenuItem>
                                        <MenuItem value="No">No</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            
                            {watchAdditionalTshirt === 'Yes' && (
                                <>
                                    <Grid item xs={12} md={6}>
                                        <FormControl fullWidth>
                                            <InputLabel>Additional T-Shirt Quantity</InputLabel>
                                            <Select
                                                label="Additional T-Shirt Quantity"
                                                value={additionalTshirtQuantity.toString()}
                                                onChange={handleTshirtQuantityChange}
                                                {...register('additionalTshirtQuantity')}
                                            >
                                                {[0, 1, 2, 3, 4, 5].map((num) => (
                                                    <MenuItem key={num} value={num.toString()}>
                                                        {num}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    
                                    {additionalTshirtQuantity > 0 && (
                                        <Grid item xs={12}>
                                            <Typography variant="subtitle1" gutterBottom>
                                                Additional T-Shirt Sizes
                                            </Typography>
                                            <Grid container spacing={2}>
                                                {Array.from({ length: additionalTshirtQuantity }).map((_, index) => (
                                                    <Grid item xs={12} sm={6} md={4} key={index}>
                                                        <FormControl fullWidth>
                                                            <InputLabel>Size {index + 1}</InputLabel>
                                                            <Select
                                                                label={`Size ${index + 1}`}
                                                                value={tshirtSizes[index] || ''}
                                                                onChange={(e) => handleSizeChange(index, e.target.value)}
                                                            >
                                                                {marathonName && TSHIRT_SIZE_OPTIONS[marathonName]?.map((option) => (
                                                                    <MenuItem key={option.value} value={option.value}>
                                                                        {option.label}
                                                                    </MenuItem>
                                                                ))}
                                                            </Select>
                                                        </FormControl>
                                                    </Grid>
                                                ))}
                                            </Grid>
                                        </Grid>
                                    )}
                                </>
                            )}
                            
                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth>
                                    <InputLabel>Additional Breakfast</InputLabel>
                                    <Select
                                        label="Additional Breakfast"
                                        defaultValue="0"
                                        {...register('additionalBreakfast')}
                                    >
                                        {[0, 1, 2, 3, 4, 5].map((num) => (
                                            <MenuItem key={num} value={num.toString()}>
                                                {num}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    <FormHelperText>₹80 per additional breakfast</FormHelperText>
                                </FormControl>
                            </Grid>
                            
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Donation (Optional)"
                                    type="number"
                                    InputProps={{ inputProps: { min: 0 } }}
                                    {...register('donation')}
                                />
                            </Grid>
                        </Grid>
                    </StyledPaper>
                    
                    <StyledPaper>
                        <Typography variant="h5" gutterBottom>
                            Emergency Contact
                        </Typography>
                        
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Emergency Contact Name"
                                    {...register('emergencyName', { required: 'Emergency contact name is required' })}
                                    error={!!errors.emergencyName}
                                    helperText={errors.emergencyName?.message}
                                />
                            </Grid>
                            
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Emergency Contact Number"
                                    {...register('emergencyNo', { 
                                        required: 'Emergency contact number is required',
                                        pattern: {
                                            value: /^[0-9]{10}$/,
                                            message: 'Emergency contact number must be 10 digits'
                                        }
                                    })}
                                    error={!!errors.emergencyNo}
                                    helperText={errors.emergencyNo?.message}
                                />
                            </Grid>
                        </Grid>
                    </StyledPaper>
                    
                    <StyledPaper>
                        <Typography variant="h5" gutterBottom>
                            Payment Information
                        </Typography>
                        
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth required error={!!errors.paymentMethodType}>
                                    <InputLabel>Payment Method</InputLabel>
                                    <Select
                                        label="Payment Method"
                                        defaultValue=""
                                        {...register('paymentMethodType', { required: 'Payment method is required' })}
                                    >
                                        <MenuItem value="cash">Cash</MenuItem>
                                        <MenuItem value="upi">UPI</MenuItem>
                                        <MenuItem value="bank_transfer">Bank Transfer</MenuItem>
                                        <MenuItem value="cheque">Cheque</MenuItem>
                                        <MenuItem value="other">Other</MenuItem>
                                    </Select>
                                    {errors.paymentMethodType && <FormHelperText>{errors.paymentMethodType.message}</FormHelperText>}
                                </FormControl>
                            </Grid>
                            
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Receipt/Reference Number"
                                    {...register('receiptNumber')}
                                />
                            </Grid>
                            
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Payment Notes"
                                    multiline
                                    rows={2}
                                    {...register('paymentNotes')}
                                />
                            </Grid>
                        </Grid>
                    </StyledPaper>
                    
                    <Card sx={{ mb: 4 }}>
                        <CardContent>
                            <Typography variant="h5" gutterBottom>
                                Order Summary
                            </Typography>
                            <Divider sx={{ mb: 2 }} />
                            
                            <Grid container spacing={2}>
                                <Grid item xs={8}>
                                    <Typography>Registration Fee:</Typography>
                                </Grid>
                                <Grid item xs={4}>
                                    <Typography align="right">₹{marathonName ? PRICE_MAP[marathonName] : 0}</Typography>
                                </Grid>
                                
                                {watchAdditionalTshirt === 'Yes' && parseInt(watchAdditionalTshirtQuantity) > 0 && (
                                    <>
                                        <Grid item xs={8}>
                                            <Typography>Additional T-shirts ({watchAdditionalTshirtQuantity} × ₹{ADDITIONAL_TSHIRT_PRICE}):</Typography>
                                        </Grid>
                                        <Grid item xs={4}>
                                            <Typography align="right">₹{parseInt(watchAdditionalTshirtQuantity) * ADDITIONAL_TSHIRT_PRICE}</Typography>
                                        </Grid>
                                    </>
                                )}
                                
                                {parseInt(watchAdditionalBreakfast) > 0 && (
                                    <>
                                        <Grid item xs={8}>
                                            <Typography>Additional Breakfast ({watchAdditionalBreakfast} × ₹{BREAKFAST_PRICE}):</Typography>
                                        </Grid>
                                        <Grid item xs={4}>
                                            <Typography align="right">₹{parseInt(watchAdditionalBreakfast) * BREAKFAST_PRICE}</Typography>
                                        </Grid>
                                    </>
                                )}
                                
                                {watchDonation && parseInt(watchDonation) > 0 && (
                                    <>
                                        <Grid item xs={8}>
                                            <Typography>Donation:</Typography>
                                        </Grid>
                                        <Grid item xs={4}>
                                            <Typography align="right">₹{watchDonation}</Typography>
                                        </Grid>
                                    </>
                                )}
                                
                                <Grid item xs={12}>
                                    <Divider sx={{ my: 1 }} />
                                </Grid>
                                
                                <Grid item xs={8}>
                                    <Typography variant="h6">Total:</Typography>
                                </Grid>
                                <Grid item xs={4}>
                                    <Typography variant="h6" align="right">₹{totalPrice}</Typography>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            size="large"
                            disabled={loading}
                        >
                            {loading ? 'Submitting...' : 'Add Registration'}
                        </Button>
                    </Box>
                </form>
                
                <Snackbar
                    open={snackbar.open}
                    autoHideDuration={6000}
                    onClose={handleSnackbarClose}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                >
                    <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
                        {snackbar.message}
                    </Alert>
                </Snackbar>
            </Container>
        </Box>
    );
}

export default OfflineRegistration;

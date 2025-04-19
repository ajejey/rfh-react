import React, { useCallback, useEffect, useRef, useState } from 'react'
import Header from '../Header'
import { useForm, useWatch, watch } from "react-hook-form";
import { countries, dateOptions, indianStates } from '../../Constants/constants';
import Dropzone from 'react-dropzone'
import EventTwoToneIcon from '@mui/icons-material/EventTwoTone';
import AccessTimeTwoToneIcon from '@mui/icons-material/AccessTimeTwoTone';
import PlaceTwoToneIcon from '@mui/icons-material/PlaceTwoTone';
import MilitaryTechTwoToneIcon from '@mui/icons-material/MilitaryTechTwoTone';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import { Button, Dialog } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import tShirtGuide from '../../assets/images/tShirtGuide.jpeg'
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const EVENT_DETAILS = {
    name: "RFH She Run 2025",
    date: new Date("2025-05-25T23:59:00+05:30"),
    lastDate: new Date("2025-04-28T23:59:00+05:30"),
    time: "7:00 AM IST",
    venue: "https://www.google.com/maps/place/Bal+Bhavan+Auditorium/@12.9766439,77.5952091,17z/data=!3m1!4b1!4m6!3m5!1s0x3bae1671b1cd3b1f:0xb72fa25e5df4598d!8m2!3d12.9766439!4d77.597784!16s%2Fg%2F11csqwx6mm?entry=ttu&g_ep=EgoyMDI1MDIxMi4wIKXMDSoASAFQAw%3D%3D",
    venueName: "Cubbon Park, Bengaluru",
}

const TSHIRT_SIZE_OPTIONS = [
    { value: 'XS', label: 'Extra Small (XS)' },
    { value: 'S', label: 'Small (S)' },
    { value: 'M', label: 'Medium (M)' },
    { value: 'L', label: 'Large (L)' },
    { value: 'XL', label: 'Extra Large (XL)' },
    { value: 'XXL', label: 'Double XL (XXL)' }
];

const requiredChanges = `
She Run : 
1. Remove early bird offer
2. Remove 1re payment and update the actual payment cost.`

function RfhSheRun2025() {
    const { register, control, handleSubmit, getValues, setValue, formState: { errors }, watch } = useForm();
    const myRef = useRef(null)
    const [submitted, setSubmitted] = useState(false)
    const [totalPrice, setTotalPrice] = useState(0)
    const [needTee, setNeedTee] = useState("no")
    const [willPickUp, setWillPickUp] = useState("no")
    const [selectedCity, setSelectedCity] = useState("others")
    const [seeMore, setSeeMore] = useState(false)
    const [selectedCategory, setSelectedCategory] = useState('');
    const [openTshirtGuide, setOpenTshirtGuide] = useState(false)
    const [disablePaymentButton, setDisablePaymentButton] = useState(false)
    const [paymentLoading, setPaymentLoading] = useState(false)
    const [paymentStatus, setPaymentStatus] = useState("")
    const [showPaymentSuccessDialog, setShowPaymentSuccessDialog] = useState(false)
    const [paymentDetails, setPaymentDetails] = useState(null)
    const [tshirtSizes, setTshirtSizes] = useState([]);
    const [tshirtValidationError, setTshirtValidationError] = useState("");
    const [additionalBreakfast, setAdditionalBreakfast] = useState(0);
    const category = watch('category');
    const navigate = useNavigate()

    const DISCOUNT_PRICE = 800
    const PRICE = 800
    // const DISCOUNT_PRICE = 1
    // const PRICE = 1
    const ADDITIONAL_TSHIRT_PRICE = 225
    const DISCOUNT_DATE = new Date("2025-03-28T23:59:00+05:30");

    const executeScroll = () => myRef.current.scrollIntoView()

    const onDrop = useCallback((acceptedFiles) => {
        acceptedFiles.forEach((file) => {
            const reader = new FileReader()

            reader.onabort = () => console.log('file reading was aborted')
            reader.onerror = () => console.log('file reading has failed')
            reader.onload = () => {
                // Do whatever you want with the file contents
                const binaryStr = reader.result
                console.log(binaryStr)
            }
            reader.readAsArrayBuffer(file)
        })

    }, [])

    const calculateAge = (dob) => {
        const today = new Date();
        const birthDate = new Date(dob);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        return age;
    };

    const handleDateChange = () => {
        const dob = watch('dob');
        const age = calculateAge(dob);

        // Update the category based on the age
        if (age >= 0 && age <= 8) {
            setSelectedCategory('Champs-Run');
        } else if (age >= 9 && age <= 15) {
            setSelectedCategory('Power-Run');
        } else if (age >= 16 && age <= 21) {
            setSelectedCategory('Bolts-Run');
        } else {
            setSelectedCategory('');
        }
    };

    // Watch for changes in the 'dob' field
    const dob = watch('dob');
    const donation = watch('donation');
    const categoryWatch = watch('category');

    const handleDonationChange = (e) => {
        const enteredValue = e.target.value;
        setValue('donation', enteredValue);

        // Clear the other input field when one is entered
        setValue('customDonation', '');
    };

    useEffect(() => {
        // Update the category whenever 'dob' changes
        handleDateChange();
    }, [dob]);

    useEffect(() => {
        setValue("category", selectedCategory)
    }, [selectedCategory])

    const handleCategoryChange = () => {
        console.log("selectedCategory ", selectedCategory)
    }

    const handleTshirtQuantityChange = (e) => {
        const quantity = parseInt(e.target.value, 10) || 0;
        setTshirtSizes(Array(quantity).fill(''));
        setValue('additionalTshirtQuantity', quantity);
    };

    const handleSizeChange = (index, size) => {
        const newSizes = [...tshirtSizes];
        newSizes[index] = size;
        setTshirtSizes(newSizes);
        setValue('additionalTshirtSize', newSizes.join(','));
    };

    const validateTshirtSizes = (data) => {
        if (data.additionalTshirt === 'Yes' && data.additionalTshirtQuantity > 0) {
            const quantity = Number(data.additionalTshirtQuantity);
            const sizes = tshirtSizes.filter(size => size !== '');

            if (sizes.length < quantity) {
                setTshirtValidationError('Please select sizes for all additional T-shirts');
                return false;
            }
        }
        setTshirtValidationError('');
        return true;
    };

    const AdditionalTshirtSection = () => (
        <>
            {watch('additionalTshirt') === 'Yes' && (
                <div className="additional-tshirt-section">
                    <div className="row mb-4">
                        <div className="col-md-4">
                            <div className="form-group">
                                <label htmlFor="additionalTshirtQuantity">Number of Additional T-shirts</label>
                                <select
                                    {...register("additionalTshirtQuantity")}
                                    className="form-select"
                                    onChange={handleTshirtQuantityChange}
                                >
                                    <option value="0">Select quantity</option>
                                    <option value="1">1 T-shirt</option>
                                    <option value="2">2 T-shirts</option>
                                    <option value="3">3 T-shirts</option>
                                    <option value="4">4 T-shirts</option>
                                    <option value="5">5 T-shirts</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {tshirtSizes.length > 0 && (
                        <div className="row">
                            <div className="col-12">
                                <label className="mb-3">Select sizes for additional T-shirts:</label>
                                {/* <div className="alert alert-info mb-3">
                                    <small>
                                        <i className="fas fa-info-circle me-2"></i>
                                        Available sizes: XS (Extra Small), S (Small), M (Medium), 
                                        L (Large), XL (Extra Large), XXL (Double XL)
                                    </small>
                                </div> */}
                                <div className="tshirt-sizes-grid">
                                    {tshirtSizes.map((size, index) => (
                                        <div key={index} className="tshirt-size-item">
                                            <div className="size-selector">
                                                <span className="tshirt-number">T-shirt {index + 1}</span>
                                                <select
                                                    className="form-select"
                                                    value={size}
                                                    onChange={(e) => handleSizeChange(index, e.target.value)}
                                                >
                                                    <option value="">Select Size</option>
                                                    {TSHIRT_SIZE_OPTIONS.map(option => (
                                                        <option key={option.value} value={option.value}>
                                                            {option.label}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                {tshirtValidationError && (
                                    <div className="alert alert-danger mt-3">
                                        {tshirtValidationError}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </>
    );

    const AdditionalBreakfastSection = () => (
        <div className="row mb-4">
            <div className="col-md-4">
                <div className="form-group">
                    <label htmlFor="additionalBreakfast">Additional Breakfast</label>
                    <select
                        {...register("additionalBreakfast")}
                        className="form-select"
                        onChange={(e) => {
                            const value = Number(e.target.value);
                            setAdditionalBreakfast(value);
                            setValue('additionalBreakfast', value);
                        }}
                        value={additionalBreakfast}
                    >
                        <option value="0">No additional breakfast</option>
                        <option value="1">1 person (₹80)</option>
                        <option value="2">2 persons (₹160)</option>
                        <option value="3">3 persons (₹240)</option>
                        <option value="4">4 persons (₹320)</option>
                        <option value="5">5 persons (₹400)</option>
                    </select>
                    <small className="form-text" style={{ color: 'whitesmoke' }}>Breakfast is already included for the participant</small>
                </div>
            </div>
        </div>
    );

    const InformationSection = () => (
        <div className="col-md-12">
            <div className="card bg-dark text-light mb-4">
                <div className="card-body">
                    <h5 className="card-title">Information</h5>
                    <ul>
                        <li><strong>Registration Cost:</strong> Regular - ₹{PRICE}</li>
                        <li><strong>Additional T-shirt:</strong> ₹{ADDITIONAL_TSHIRT_PRICE} per T-shirt</li>
                        <li><strong>Breakfast:</strong> Included for participants. Additional breakfast available at ₹80 per person.</li>
                    </ul>
                </div>
            </div>
        </div>
    );

    const onSubmit = (data) => {
        if (data.donation === 'custom') {
            data.donation = data.customDonation;
            setValue("donation", data.customDonation)
        }
        delete data.customDonation;
        if (data.additionalTshirt === 'No') {
            setValue("additionalTshirtQuantity", "0")
            data.additionalTshirtQuantity = "0"
            setValue("additionalTshirtSize", "")
            data.additionalTshirtSize = ""
        }
        if (!validateTshirtSizes(data)) {
            return;
        }
        console.log(data);
        setSubmitted(!submitted)
        const totalPrice = calculateTotalPrice(data);
        setTotalPrice(totalPrice)
    }

    const calculateTotalPrice = (formData) => {
        // Get the current date
        const currentDate = new Date();

        // Set the registration fee based on the current date
        const registrationFee = currentDate < new Date(DISCOUNT_DATE) ? DISCOUNT_PRICE : PRICE;

        // Calculate the total price
        let totalPrice = registrationFee;

        // Add cost for additional T-shirts
        if (formData.additionalTshirt === 'Yes' && formData.additionalTshirtQuantity) {
            const additionalTshirtCost = Number(formData.additionalTshirtQuantity) * ADDITIONAL_TSHIRT_PRICE;
            totalPrice += additionalTshirtCost;
        }

        // Add cost for additional breakfast
        if (formData.additionalBreakfast) {
            const breakfastCost = Number(formData.additionalBreakfast) * 80;
            totalPrice += breakfastCost;
        }

        // Add the donation amount
        if (formData.donation) {
            totalPrice += parseInt(formData.donation, 10);
        }

        return totalPrice;
    }

    useEffect(() => {
        // Clear any stale payment data on component mount
        localStorage.removeItem('merchantTransactionId');
        localStorage.removeItem('cause');
        setDisablePaymentButton(false);
        setPaymentLoading(false);
        setPaymentStatus("");
    }, []);

    const handlePaymentClick = async () => {
        // Clear any existing payment data
        localStorage.removeItem('merchantTransactionId');
        localStorage.removeItem('cause');

        setValue("totalPrice", totalPrice)
        // setValue("totalPrice", 1) // 1 rupee for testing
        setValue("marathonName", "RFH She run 2025")
        try {
            setPaymentLoading(true);
            setDisablePaymentButton(true);
            setPaymentStatus("Initiating payment...");

            const response = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/marathons/initiate-payment`, {
                method: "POST",
                timeout: 1200000,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(getValues()),
            });

            const data = await response.json();
            if (data.success === false) {
                setPaymentStatus("");
                setDisablePaymentButton(false);
                setPaymentLoading(false);
                toast.error('There was an error. Please try later or Contact Raghu @ +91-9164358027 ', { duration: 50000 });
                return;
            }

            localStorage.setItem('merchantTransactionId', data?.data?.merchantTransactionId);
            localStorage.setItem('cause', "RFH She Run 2025");

            // Detect if user is on iOS/Safari
            const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) ||
                (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
            const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

            const paymentUrl = data?.data?.instrumentResponse?.redirectInfo?.url;
            console.log("Payment URL:", paymentUrl);

            if (paymentUrl) {
                if (isIOS || isSafari) {
                    // For iOS devices, use a form submission approach which works better
                    const form = document.createElement('form');
                    form.method = 'GET';
                    form.action = paymentUrl;
                    form.target = '_self';
                    document.body.appendChild(form);
                    form.submit();
                } else {
                    // For non-iOS devices, use the standard approach
                    window.location.href = paymentUrl;
                }
            } else {
                console.error("Payment URL was not provided in the response");
                setPaymentLoading(false);
                setDisablePaymentButton(false);
                setPaymentStatus("");
                toast.error('Payment gateway error. Please try again or contact support.');
            }
        } catch (error) {
            console.error("Payment error:", error);
            setPaymentLoading(false);
            setDisablePaymentButton(false);
            setPaymentStatus("");
            localStorage.removeItem('merchantTransactionId');
            localStorage.removeItem('cause');
            toast.error('Something went wrong. Please try later or contact Raghu @ +91-91643 58027');
        }
    };

    const handleRazorpayClick = async () => {
        try {
            setPaymentLoading(true);
            setDisablePaymentButton(true);
            setPaymentStatus("Initiating Razorpay payment...");
            // setValue("totalPrice", totalPrice)
            setValue("totalPrice", 1) // make 1 rupee for testing
            setValue("marathonName", "RFH She run 2025")

            const response = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/marathons/initiate-razorpay-payment`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(getValues()),
            });

            const data = await response.json();
            if (!data.orderId) {
                throw new Error('Failed to create order');
            }

            const options = {
                key: data.keyId,
                amount: data.amount,
                currency: data.currency,
                name: "Rupee For Humanity",
                description: "RFH She Run 2025 Registration",
                order_id: data.orderId,
                handler: async function (response) {
                    try {
                        const verifyResponse = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/marathons/razorpay-webhook`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_signature: response.razorpay_signature,
                            }),
                        });

                        const verifyData = await verifyResponse.json();
                        console.log('Razorpay verification response:', verifyData);

                        if (verifyData.status === 'success') {
                            localStorage.setItem('merchantTransactionId', data.merchantTransactionId);
                            localStorage.setItem('cause', "RFH She Run 2025");

                            // Show success dialog with payment details
                            console.log('Payment details for dialog:', verifyData.payment);
                            setPaymentDetails(verifyData.payment);
                            setShowPaymentSuccessDialog(true);
                            setPaymentLoading(false);
                            setDisablePaymentButton(false);
                        } else {
                            toast.error('Payment verification failed. Please contact support.');
                        }
                    } catch (error) {
                        console.error('Verification error:', error);
                        toast.error('Payment verification failed. Please contact support.');
                    }
                },
                prefill: {
                    name: getValues().fullName,
                    email: getValues().email,
                    contact: getValues().mobNo,
                },
                theme: {
                    color: "#e84393",
                },
            };

            const rzp = new window.Razorpay(options);
            rzp.on('payment.failed', function (response) {
                toast.error('Payment failed. Please try again.');
                setPaymentLoading(false);
                setDisablePaymentButton(false);
                setPaymentStatus("");
            });

            rzp.open();
        } catch (error) {
            console.error("Razorpay error:", error);
            setPaymentLoading(false);
            setDisablePaymentButton(false);
            setPaymentStatus("");
            toast.error('Failed to initialize Razorpay. Please try again or contact support.');
        }
    };

    const handleSelfPickupChange = (e) => {
        console.log("selfPickUp e.target.value ", e.target.value)
        setWillPickUp(e.target.value)
    }

    const handleCityChange = (e) => {
        setSelectedCity(e.target.value)
        if (e.target.value !== "others") {
            setValue("country", 'India')
            if (e.target.value === "Bengaluru") {
                setValue("state", "Karnataka")
            }
            if (e.target.value === "Hyderabad") {
                setValue("state", "Telangana")
            }
            if (e.target.value === "Chennai") {
                setValue("state", "Tamil Nadu")
            }
        } else {
            setValue("country", "")
            setValue("state", "")
        }

    }

    const handleNeedTee = (e) => {
        setNeedTee(e.target.value)
        if (e.target.value === "no") {
            setValue("TshirtSize", "")
            setValue("selfPickUp", "")
        }
    }

    const handleSeeMore = () => {
        setSeeMore(!seeMore)
    }

    console.log("price total ", totalPrice)
    console.log("getValues() ", getValues())

    const handleEditClick = () => {
        setSubmitted(!submitted)
    }

    const expandedText = () => {
        return (
            <div>
                <p>
                    RFH provides :
                    <ul>
                        <li>Right to education for every child</li>
                        <li>Food, medical care and healthy atmosphere for the poor and needy.</li>
                    </ul>
                </p>
                <p>
                    For more information about our NGO, please visit the below link: <a
                        href="https://www.facebook.com/RupeeForHumanity/" target="_blank" rel='noreferrer'>RupeeForHumanity</a>

                </p>
                <p>
                    RFH has initiated a program - "Shikshakaar - Shikshan ka Adhikaar", a step to eradicate illiteracy
                    in India. We believe education is the backbone of any developing country. Driven by this belief, we
                    provide free education for meritorious, poor, needy and orphaned children from NGOs, Government
                    schools and various other sources.
                </p>
                <p>
                    As a part of this initiative, we conducted ‘RFH 10K Run - Run for Literacy’ Literacy’ from 2014-2019 at Cubbon
                    park, Bangalore and from the contributions of kind hearts like you, we were able to sponsor
                    education for ~280 underprivileged kids from various places including stationary, books and school
                    uniforms.
                </p>

            </div>
        )
    }

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    return (
        <div style={{ backgroundColor: "#040002", color: "lightgray", minHeight: "100vh" }}>
            <Helmet>
                <title>RFH She Run 2025 | Rupee For Humanity</title>
                <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
                <style>
                    {`
                        .form-control, .form-select {
                            background-color: #1a1a1a;
                            color: #fff;
                            border: 1px solid #333;
                        }

                        .tshirt-sizes-grid {
                            display: grid;
                            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
                            gap: 1rem;
                            margin-bottom: 1rem;
                        }

                        .tshirt-size-item {
                            background: rgba(255, 255, 255, 0.05);
                            padding: 1rem;
                            border-radius: 8px;
                            transition: all 0.3s ease;
                        }

                        .tshirt-size-item:hover {
                            background: rgba(255, 255, 255, 0.1);
                        }

                        .size-selector {
                            display: flex;
                            flex-direction: column;
                            gap: 0.5rem;
                        }

                        .tshirt-number {
                            font-size: 0.9rem;
                            color: #f39c12;
                            font-weight: 500;
                        }

                        .form-select:focus {
                            background-color: #1a1a1a;
                            color: #fff;
                            border-color: #f39c12;
                            box-shadow: 0 0 0 0.2rem rgba(243, 156, 18, 0.25);
                        }
                    `}
                </style>
            </Helmet>
            <Header />
            <main>
                {(submitted === false) ?
                    <section id="registration-form">
                        <div className="container-md">
                            <h1 className="h1" style={{ fontWeight: "800" }}>
                                RFH She run 2025 <br />
                                {/* <span className='highlight' style={{ cursor: "pointer" }} onClick={executeScroll}>Virtual Run</span> */}
                            </h1>
                            <div className="row">
                                <div className="col-md-4">
                                    <span><strong><EventTwoToneIcon /> Date:</strong> {EVENT_DETAILS.date.toLocaleDateString('en-US', dateOptions)}</span>
                                </div>
                                <div className="col-md-4">
                                    <span><strong> <AccessTimeTwoToneIcon /> Time:</strong>  {EVENT_DETAILS.time} </span>
                                </div>
                                <div className="col-md-4">
                                    <span><strong> <PlaceTwoToneIcon /> Venue: </strong><a style={{ color: "lightgray" }} href={EVENT_DETAILS.venue} target="_blank" rel="noopener noreferrer">{EVENT_DETAILS.venueName} </a> </span>
                                </div>
                            </div>


                            <span ><small style={{ color: "#ff7675" }}> <strong>Last Date to Register: {EVENT_DETAILS.lastDate.toLocaleDateString('en-US', dateOptions)}</strong> </small></span><br />
                            <br />

                            {/* <div className="container d-flex justify-content-center align-items-center my-4">
                                    <div className="p-4 rounded shadow" style={{ background: "linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)", border: "2px solid #f39c12" }}>
                                        <h3 className="mb-3 font-weight-bold text-center" style={{ color: "#5d4037" }}>Women's Day Special Offer! 🎉</h3>
                                        <p className="lead text-center mb-2" style={{ color: "#5d4037" }}>
                                            Celebrate International Women's Day with us and enjoy a special price of{' '}
                                            <span className="font-weight-bold" style={{ fontSize: "1.2em", color: "#d81b60" }}>INR 700/-</span>
                                        </p>
                                        <p className="text-center mb-0" style={{ color: "#5d4037", fontStyle: "italic" }}>
                                            Limited time offer to honor the strength and spirit of women everywhere!
                                        </p>
                                    </div>
                                </div> */}

                            <p>
                                "Rupee For Humanity" is thrilled to present "RFH She Run 2025"—a celebration of passion, purpose, and the power of giving! After the resounding success of seven incredible running events in Bengaluru, we are now gearing up for an even more meaningful journey.                            </p>
                            <p>
                                This isn’t just a run; it’s a movement! RFH She Run 2025 is a women’s run dedicated to empowerment, equality, and the spirit of sisterhood. Whether you're running for yourself, for the women who inspire you, or for the next generation, every step you take lights the path of education for underprivileged and deserving children.
                            </p>
                            <p>What could be more fulfilling than running for a cause that transforms lives?
                            </p>
                            <p>Join us, celebrate the strength of women, and be a part of something truly extraordinary! </p>

                            {seeMore === true && expandedText()}
                            <div style={{ paddingBottom: "16px" }}>
                                <span style={{ textDecoration: "underline", cursor: "pointer", color: "lightblue" }} onClick={handleSeeMore}>See {seeMore ? "less" : "more"} </span>
                            </div>

                            <h2 className="h2">
                                Information
                            </h2>
                            <div className="info-table">
                                <table className="table" style={{ backgroundColor: "#040002", color: "lightgray" }}>
                                    <thead>
                                        <tr>
                                            <th className="fs-6" scope="col">Run Name</th>
                                            <th scope="col">Distance</th>
                                            <th scope="col">Price</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className="fs-6">Chennamma Run</td>
                                            <td>2.5 km </td>
                                            <td>INR 800/-</td>
                                        </tr>
                                        <tr>
                                            <td className="fs-6">Jhansi Run</td>
                                            <td>5 km</td>
                                            <td>INR 800/-</td>
                                        </tr>

                                    </tbody>
                                </table>
                                <div className="mt-4">
                                    <p>
                                        Each participant receives T-shirt, Medal, Certificate, Breakfast and witnesses the noble cause of Rupee For Humanity.
                                    </p>
                                    <ul>
                                        <li><strong>Registration Cost:</strong> Regular - ₹{PRICE}</li>
                                        <li><strong>Additional T-shirt:</strong> ₹{ADDITIONAL_TSHIRT_PRICE} per T-shirt</li>
                                        <li><strong>Breakfast:</strong> Included for participants. Additional breakfast available at ₹80 per person.</li>
                                    </ul>
                                </div>

                                <div className="mt-4">
                                    <p>
                                        For any more information about sponsorship / registration / queries, you can reach out to the below organizers:
                                    </p>
                                    <ul>
                                        <li>Deepthi @ <a href="tel:+91-9986387435" style={{ color: "#f39c12" }}>+91-99863 87435</a></li>
                                        <li>Deekshith @ <a href="tel:+91-8147775122" style={{ color: "#f39c12" }}>+91-81477 75122</a></li>
                                        <li>Raghu @ <a href="tel:+91-9164358027" style={{ color: "#f39c12" }}>+91-91643 58027</a></li>
                                    </ul>
                                </div>

                                <div className="mt-4">
                                    <p>Please check out our work at:</p>
                                    <ul>
                                        <li><a href="https://www.facebook.com/RupeeForHumanity/" target="_blank" rel="noopener noreferrer" style={{ color: "#f39c12" }}>Facebook</a></li>
                                        <li><a href="https://www.instagram.com/rupeeforhumanity/" target="_blank" rel="noopener noreferrer" style={{ color: "#f39c12" }}>Instagram</a></li>
                                    </ul>
                                    <p>Visit our website: <a href="https://www.rupeeforhumanity.org/" target="_blank" rel="noopener noreferrer" style={{ color: "#f39c12" }}>www.rupeeforhumanity.org</a></p>
                                </div>


                                {/* <div className="container d-flex justify-content-center align-items-center ">
                                    <div className="bg-dark text-light p-4 rounded border border-warning shadow">
                                        <h4 className="mb-3 font-weight-bold">Special Early Bird Offer!</h4>

                                        {new Date() < new Date(DISCOUNT_DATE) ? (
                                            <p className="lead">
                                                Registration Fee: INR{' '}
                                                <span className="text-decoration-line-through" style={{ color: "#999", textDecorationThickness: "2px" }}>{PRICE}/-</span>{' '}
                                                <span className="text-warning">{DISCOUNT_PRICE}/-</span>
                                            </p>
                                        ) : (
                                            <p className="lead">Registration Fee:  <span className="text-warning">INR {PRICE}/-</span> </p>
                                        )}
                                        <p className="font-italic">Early Bird offer: Lasts till {new Date(DISCOUNT_DATE).toLocaleDateString(undefined, dateOptions)}</p>
                                    </div>
                                </div> */}




                            </div>

                            <div ref={myRef} className="regestration-form">

                                <form onSubmit={handleSubmit(onSubmit)}>
                                    <h2 className="form-header">Registration Form</h2>

                                    {/* <div className="row">
                                        <div className="col-md-12">
                                            <div className="form-group">
                                                <label htmlFor="need-tee">Do you want to pick up yout T-Shirt yourself? (Only in Bengaluru, Hyderabad, and Chennai)  {needTee === "no" ? <span></span> : <span style={{ color: "red" }}>*</span>}
                                                </label>
                                                <select disabled={needTee === "no"} {...register("selfPickUp", { required: needTee === "no" ? false : true, onChange: (e) => handleSelfPickupChange(e) })} id="self-pickup" className="form-select"
                                                    aria-label="Do you want to pick up yout T-Shirt yourself?">
                                                    <option value="">select</option>
                                                    <option value="yes">Yes</option>
                                                    <option value="no">No</option>
                                                </select>
                                                {errors.selfPickUp && <p style={{ color: "red" }}>This field is mandatory</p>}
                                            </div>
                                        </div>
                                    </div> */}
                                    <div className="row">
                                        <div className="col-md-12">
                                            <div className="form-group">
                                                <label htmlFor="fullName">Full Name <span style={{ color: "red" }}>*</span></label>
                                                <input {...register("fullName", { required: true })} type="text" className="form-control" placeholder="" id="fullName" />
                                                {errors.fullName && <p style={{ color: "red" }}>This field is mandatory</p>}
                                            </div>
                                        </div>
                                    </div>


                                    <div className="row">
                                        <div className="col-md-4">
                                            <div className="form-group">
                                                <label htmlFor="gender">Gender <span style={{ color: "red" }}>*</span></label>
                                                <select {...register("gender", { required: true })} id="gender" className="form-select" aria-label="Default select example">
                                                    <option value="">select</option>
                                                    <option value="female">Female</option>
                                                    {/* <option value="male">Male</option> */}
                                                    <option value="transGender">Transgender</option>
                                                    <option value="nonBinary">Non-binary/non-conforming</option>
                                                    <option value="noResponse">Prefer not to respond</option>
                                                </select>
                                                {errors.gender && <p style={{ color: "red" }}>This field is mandatory</p>}
                                            </div>
                                        </div>

                                        {/* <div className="col-md-4">
                                            <div className="form-group">
                                                <label htmlFor="bloodGroup">Blood Group <span style={{ color: "red" }}>*</span></label>
                                                <input {...register("bloodGroup", { required: true })} type="text" className="form-control" id="bloodGroup" placeholder="Blood Group" />
                                                {errors.bloodGroup && <p style={{ color: "red" }}>This field is mandatory</p>}
                                            </div>
                                        </div> */}
                                        <div className="col-md-4">
                                            <div className="form-group">
                                                <label htmlFor="bloodGroup">Blood Group <span style={{ color: "red" }}>*</span></label>
                                                <select {...register("bloodGroup", { required: true })} className="form-select" id="bloodGroup" aria-label="Blood Group">
                                                    <option value="">Select</option>
                                                    <option value="A+">A+</option>
                                                    <option value="A-">A-</option>
                                                    <option value="B+">B+</option>
                                                    <option value="B-">B-</option>
                                                    <option value="AB+">AB+</option>
                                                    <option value="AB-">AB-</option>
                                                    <option value="O+">O+</option>
                                                    <option value="O-">O-</option>
                                                </select>
                                                {errors.bloodGroup && <p style={{ color: "red" }}>This field is mandatory</p>}
                                            </div>
                                        </div>


                                    </div>

                                    <div className="row">
                                        <div className="form-group">
                                            <label htmlFor="address">Full Address {willPickUp === "no" ? <span style={{ color: "red" }}>*</span> : <span></span>} </label>
                                            <textarea placeholder={willPickUp === "yes" ? "Adress not needed if picking up T-shirt by yourself" : ""} disabled={willPickUp === "yes"} {...register("address", { required: willPickUp === "yes" ? false : true })} className="form-control" id="address" rows="3" />
                                            {errors.address && <p style={{ color: "red" }}>This field is mandatory</p>}
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-4">
                                            <div className="form-group">
                                                <label htmlFor="city">City <span style={{ color: "red" }}>*</span></label>
                                                {/* <input {...register("city", { required: true })} className="form-control" type="text" name="city" id="city" /> */}
                                                <select {...register("city", { required: true, onChange: (e) => handleCityChange(e) })} id="city" className="form-select" aria-label="city select">
                                                    <option value="">select</option>
                                                    <option value="Bengaluru">Bengaluru</option>
                                                    <option value="Hyderabad">Hyderabad</option>
                                                    <option value="Chennai">Chennai</option>
                                                    <option value="others">Others</option>
                                                </select>
                                                {errors.city && <p style={{ color: "red" }}>This field is mandatory</p>}
                                            </div>
                                        </div>
                                        {watch("city") === "others" &&
                                            <div className="col-md-4">
                                                <div className="form-group">
                                                    <label htmlFor="otherCity">Other City Name <span style={{ color: "red" }}>*</span></label>
                                                    <input {...register("otherCity", { required: selectedCity === "others" ? true : false })} className="form-control" type="text" name="Other City" id="otherCity" />
                                                    {errors.pincode && <p style={{ color: "red" }}>This field is mandatory</p>}
                                                </div>
                                            </div>
                                        }


                                    </div>
                                    <div className="row">
                                        <div className="col-md-4">
                                            <div className="form-group">
                                                <label htmlFor="state">State <span style={{ color: "red" }}>*</span></label>
                                                {/* <input {...register("state", { required: true })} className="form-control" type="text" name="state" id="state" /> */}
                                                <select {...register("state", { required: true })} id="state" className="form-select" aria-label="State select">
                                                    <option value="">select</option>
                                                    {indianStates.map((item, index) => (
                                                        <option key={index} value={item.name}> {item.name} </option>
                                                    ))}
                                                </select>
                                                {errors.state && <p style={{ color: "red" }}>This field is mandatory</p>}
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="form-group">
                                                <label htmlFor="country">Country <span style={{ color: "red" }}>*</span></label>
                                                {/* <input {...register("country", { required: true })} className="form-control" type="text" name="country" id="country" /> */}
                                                <select {...register("country", { required: true })} id="country" className="form-select" aria-label="Countries select">
                                                    <option value="">select</option>
                                                    {countries.map((item, index) => (
                                                        <option key={index} value={item.name}> {item.name} </option>
                                                    ))}
                                                </select>
                                                {errors.country && <p style={{ color: "red" }}>This field is mandatory</p>}
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="form-group">
                                                <label htmlFor="nationality">Nationality <span style={{ color: "red" }}>*</span></label>
                                                <input {...register("nationality", { required: true })} className="form-control" type="text" name="nationality" id="nationality" />
                                                {errors.nationality && <p style={{ color: "red" }}>This field is mandatory</p>}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-4">
                                            <div className="form-group">
                                                <label htmlFor="mobile">Mobile No. <small>(10 digit number)</small> <span style={{ color: "red" }}>*</span></label>
                                                <input {...register("mobNo", {
                                                    required: true, pattern: {
                                                        value: /^[0-9]{10}$/, // Allows exactly 10 numeric characters
                                                        message: "Invalid mobile number",
                                                    },
                                                })} className="form-control" type="tel" id="mobile" />
                                                {errors.mobNo && <p style={{ color: "red" }}>{errors.mobNo.message}</p>}
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="form-group">
                                                <label htmlFor="email">Email <span style={{ color: "red" }}>*</span></label>
                                                <input {...register("email", { required: true })} className="form-control" type="email" name="email" id="email" />
                                                {errors.email && <p style={{ color: "red" }}>This field is mandatory</p>}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label htmlFor="date">
                                                    Date of Birth
                                                    <span style={{ color: "red" }}>*</span>
                                                </label>
                                                <input
                                                    {...register("dob", { required: true })}
                                                    type="date"
                                                    className="form-control"
                                                    id="date"
                                                    placeholder="date"
                                                    max={new Date().toISOString().split("T")[0]} // Set max date to today
                                                />
                                                {errors.dob && <p style={{ color: "red" }}>This field is mandatory</p>}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label htmlFor="category">Select Category <span style={{ color: "red" }}>*</span></label>
                                                <select {...register("category", { required: true })} id="category" className="form-select" aria-label="Select Category">
                                                    <option value="">select</option>
                                                    <option value="Chennamma-Run">Chennamma Run</option>
                                                    <option value="Jhansi-Run">Jhansi Run</option>
                                                </select>
                                                {errors.category && <p style={{ color: "red" }}>This field is mandatory</p>}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        {/* <div className="col-md-6">
                                            <div className="form-group">
                                                <label htmlFor="need-tee">Do you want to opt for T-Shirt?  <span style={{ color: "red" }}>*</span>
                                                </label>
                                                <select {...register("needTShirt", { required: true, onChange: (e) => handleNeedTee(e) })} id="need-tee" className="form-select"
                                                    aria-label="do you want to opt for T-Shirt">
                                                    <option value="">select</option>
                                                    <option value="yes">Yes</option>
                                                    <option value="no">No</option>
                                                </select>
                                                {errors.needTShirt && <p style={{ color: "red" }}>This field is mandatory</p>}
                                            </div>
                                        </div> */}
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label htmlFor="tee-size">T-Shirt Size  <span style={{ color: "red" }}>*</span></label>
                                                <select {...register("TshirtSize", { required: false })} id="tee-size" className="form-select" aria-label="T-Shirt Size">
                                                    <option value="">select</option>
                                                    <option value="XS">XS</option>
                                                    <option value="S">S</option>
                                                    <option value="M">M</option>
                                                    <option value="L">L</option>
                                                    <option value="XL">XL</option>
                                                    <option value="XXL">XXL</option>
                                                </select>
                                                {errors.TshirtSize && <p style={{ color: "red" }}>This field is mandatory</p>}
                                            </div>
                                        </div>
                                        {/* <div onClick={() => setOpenTshirtGuide(true)} className="col-md-6" style={{ display: 'flex', alignItems: "flex-end", textDecoration: "underline", cursor: "pointer" }}>
                                            T-shirt size guide
                                        </div>
                                        <Dialog open={openTshirtGuide} onClose={() => setOpenTshirtGuide(false)} >
                                            <img src={tShirtGuide} alt="RFH Tshirt Guide" />
                                        </Dialog> */}
                                    </div>
                                    {/* New row for additional T-shirt question */}
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label htmlFor="additionalTshirt">Twin in Style: Match with Your Bestie, Cousin, or Spouse! (additional T-shirt) <span style={{ color: "red" }}>*</span></label>
                                                <select {...register("additionalTshirt", { required: false })} id="additionalTshirt" className="form-select" aria-label="Additional T-shirt">
                                                    <option value="">select</option>
                                                    <option value="Yes">Yes</option>
                                                    <option value="No">No</option>
                                                </select>
                                                {errors.additionalTshirt && <p style={{ color: "red" }}>This field is mandatory</p>}
                                            </div>
                                        </div>
                                        {/* Dropdown for quantity if Yes is selected */}
                                        {watch('additionalTshirt') === 'Yes' && (
                                            <AdditionalTshirtSection />
                                        )}
                                    </div>

                                    {/* New row for additional breakfast */}
                                    <AdditionalBreakfastSection />

                                    {/* New row for donation question */}
                                    <div className="row">
                                        <div className="form-group">
                                            <label htmlFor="donation">Do you wish to donate for Rupee For Humanity for a noble cause?</label>
                                            <select id="donation" {...register("donation", { required: false })} value={getValues("donation")} className="form-select" aria-label="Select Donation" >
                                                <option value="">select</option>
                                                <option value="1">1</option>
                                                <option value="10">10</option>
                                                <option value="50">50</option>
                                                <option value="100">100</option>
                                                <option value="200">200</option>
                                                <option value="500">500</option>
                                                <option value="custom">Other</option>
                                            </select>
                                            {errors.donation && <p style={{ color: "red" }}>This field is mandatory</p>}
                                        </div>
                                        {donation === 'custom' && (
                                            <div className="form-group">
                                                <label htmlFor='customDonation'>Enter other Donation Amount</label>
                                                <input {...register("customDonation", { required: true })} className="form-control" type="number" name="customDonation" id="customDonation" />
                                                {errors.customDonation && <p style={{ color: "red" }}>This field is mandatory</p>}
                                            </div>
                                        )}
                                    </div>

                                    <br />
                                    <hr />
                                    <br />

                                    <h2 className="form-header">Other information</h2>

                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label htmlFor="emergencyName">Emergency Contact Name <span style={{ color: "red" }}>*</span></label>
                                                <input {...register("emergencyName", { required: true })} className="form-control" type="text"
                                                    id="emergencyName" />
                                                {errors.emergencyNo && <p style={{ color: "red" }}>This field is mandatory</p>}
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label htmlFor="emergencyNo">Emergency Contact Number <span style={{ color: "red" }}>*</span></label>
                                                <input {...register("emergencyNo", { required: true })} className="form-control" type="text"
                                                    id="emergencyNo" />
                                                {errors.emergencyNo && <p style={{ color: "red" }}>This field is mandatory</p>}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-md-12">
                                            <div className="form-group">
                                                <label htmlFor="reference">How did you come to know about this event? <span style={{ color: "red" }}>*</span></label>
                                                <textarea rows={2} {...register("reference", { required: true })} className="form-control" type="text-field" id="reference" />
                                                {errors.reference && <p style={{ color: "red" }}>This field is mandatory</p>}
                                            </div>
                                        </div>
                                    </div>
                                    {/* <div className="row">
                                        <div className="col-md-12">
                                            <div className="form-group">
                                                <label htmlFor="idNumber">Please enter a valid Govt ID Number (Eg: Aadhar, pancard) <br /> <small>Your data is safe with us</small> <span style={{ color: "red" }}>*</span></label>
                                                <input {...register("idNumber", { required: true })} className="form-control" type="text" id="idNumber" />
                                                {errors.idNumber && <p style={{ color: "red" }}>This field is mandatory</p>}
                                            </div>
                                        </div>
                                    </div> */}


                                    {/* <div className="row">
                                        <div className="col-md-12">
                                            <div className="form-group">
                                                <label htmlFor="inputFile">Please upload an ID proof (Aadhar Card or Pan Card)<span style={{ color: "red" }}>*</span></label>
                                                <Dropzone onDrop={acceptedFiles => console.log(acceptedFiles)}>
                                                    {({ getRootProps, getInputProps }) => (
                                                        <section style={{ height: "100px", border: "dashed #F6F0E3", display: "flex", justifyContent: "center", alignItems: "center" }}>
                                                            <div {...getRootProps()}>
                                                                <input className="form-control" id="inputFile" {...getInputProps()} />
                                                                <p>Drag 'n' drop ID Proof here, or click to select files</p>
                                                            </div>
                                                        </section>
                                                    )}
                                                </Dropzone>
                                            </div>
                                        </div>
                                    </div> */}
                                    <br />
                                    <hr />
                                    <br />
                                    <h2 className="form-header">Terms and Conditions</h2>
                                    <br />
                                    <div className="form-group">
                                        <textarea
                                            defaultValue="&#x2022; All registrations are non-refundable, non-transferable, and cannot be modified. 
                                            &#x2022; Please provide a valid mobile number &amp; email address that you check regularly, as these will be our primary means of communication leading up to the event.
                                            &#x2022; By registering, you acknowledge that participating in this event involves physical exertion and potential health risks. You take full responsibility for participating in the RFH She Run 2025 and do not hold the organizing committee, Rupee For Humanity, or any associated persons or entities liable for any injury, accident, or health-related issues.
                                            &#x2022; You also assume all risks associated with participation, including but not limited to falls, contact with other participants, weather conditions (such as high heat or humidity), traffic, road conditions, and unforeseen incidents (such as arson or security threats).
                                            &#x2022; RFH volunteers will be present throughout the course to ensure safety and fairness. Their decisions will be final on event day.
                                            &#x2022; You agree that the organizing committee, Rupee For Humanity, and associated companies/entities shall not be liable for any loss, damage, illness, or injury resulting from your participation in the event.
                                            &#x2022; In case of adverse weather conditions, security concerns, or any unforeseen incidents, the organizers reserve the right to cancel, postpone, or stop the event for safety reasons.
                                            &#x2022; Confirmed registrations and merchandise orders are non-refundable, non-transferable, and cannot be modified. However, if an application is rejected, the collected amount will be refunded in full (excluding bank charges, if applicable).
                                            &#x2022; The organizers will only contact participants via email &amp; text message. Any notice sent to the registered email or mobile number shall be deemed as received by the participant.
                                            &#x2022; Please remember: RFH She Run 2025 is a celebration of women's strength, empowerment, and giving back to society. Enjoy the run, support fellow participants, and embrace the joy of running for a cause!"
                                            className="form-control"
                                            style={{ fontSize: "0.8rem" }}
                                            id="address"
                                            rows="6"
                                            readOnly />
                                    </div>

                                    <br />
                                    <p style={{ fontWeight: "700" }}>
                                        I declare that I am medically fit and am participating in the event, perfectly aware of the
                                        risks involved. I further declare that RFH or any persons authorized by the above-mentioned
                                        organization in this behalf shall not in any way be liable to me or to my dependents, from
                                        my participation in the above mentioned event, no compensation will be claimed of legal
                                        action taken against Rupee For Humanity.
                                    </p>

                                    <div className="checkbox">
                                        <label>
                                            <input {...register("AgreeTnC", { required: true })} type="checkbox" value="Sure!" id="newsletter" /> Agree to terms and conditions.
                                        </label>
                                        {errors.AgreeTnC && <p style={{ color: "red" }}>This field is mandatory</p>}
                                    </div>

                                    <div className="d-grid gap-2">
                                        <button
                                            className="btn btn-primary"
                                            type="submit"
                                        // disabled={new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }) > new Date("2025-02-10T23:59:00+05:30").toLocaleString("en-US", { timeZone: "Asia/Kolkata" })}
                                        >
                                            Submit
                                        </button>
                                    </div>
                                </form>

                            </div>

                        </div>

                    </section>
                    :
                    <section className="container-md">
                        <div>
                            <h3 style={{ marginTop: "2%" }}>Your details</h3>
                            <table className="table" style={{ backgroundColor: "#040002", color: "lightgray" }}>

                                <tbody>
                                    <tr>
                                        <td className="fs-6"> Name</td>
                                        <td> {getValues("fullName")}</td>
                                    </tr>
                                    <tr>
                                        <td className="fs-6">Email</td>
                                        <td> {getValues("email")} </td>
                                    </tr>
                                    <tr>
                                        <td className="fs-6">Phone No.</td>
                                        <td>{getValues("mobNo")}</td>
                                    </tr>
                                    <tr>
                                        <td className="fs-6">T-shirt Size </td>
                                        <td> {getValues("TshirtSize")}  </td>
                                    </tr>
                                    <tr>
                                        <td className="fs-6">Need additional T-shirt </td>
                                        <td> {getValues("additionalTshirtQuantity")}  </td>
                                    </tr>
                                    <tr>
                                        <td className="fs-6">Additional Breakfast </td>
                                        <td> {getValues("additionalBreakfast")}  </td>
                                    </tr>
                                    <tr>
                                        <td className="fs-6">Total Price </td>
                                        <td> <b>INR {totalPrice}/-</b>   </td>
                                    </tr>
                                </tbody>
                            </table>
                            <div style={{ display: "flex", flexDirection: "column", gap: "16px", width: "100%" }} className="mb-4">
                                <div className="d-flex justify-content-between">
                                    <button
                                        className="btn btn-secondary"
                                        onClick={handleEditClick}
                                        style={{ width: "100px" }}
                                    >
                                        Edit
                                    </button>
                                </div>
                                <div className="d-flex flex-column flex-md-row gap-3 w-100">
                                    <button
                                        className="btn btn-primary w-100"
                                        onClick={handleSubmit(handlePaymentClick)}
                                        disabled={disablePaymentButton || paymentLoading}
                                    >
                                        {paymentLoading ? "Processing..." : "Pay with PhonePe"}
                                    </button>
                                    <button
                                        className="btn btn-primary w-100"
                                        onClick={handleSubmit(handleRazorpayClick)}
                                        disabled={disablePaymentButton || paymentLoading}
                                    >
                                        {paymentLoading ? "Processing..." : "Pay with Razorpay"}
                                    </button>
                                </div>
                            </div>

                            <div className="row justify-content-center mt-3">
                                <div className="col-md-8">
                                    {paymentStatus && (
                                        <div className="alert alert-info text-center">
                                            <i className="fas fa-info-circle me-2"></i>
                                            {paymentStatus}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div>
                            <div className="row m-3">
                                <div className="card bg-dark mb-4 rounded-3 shadow-sm">
                                    <div className="card-header py-3 text-center">
                                        <h4 className="my-0 fw-normal">Price Breakup</h4>
                                    </div>
                                    <div className="card-body">
                                        <table className="table" style={{ color: "lightgray" }}>

                                            <tbody>
                                                <tr>
                                                    <td> {getValues("category")} </td>
                                                    <td className="fs-6"> INR {new Date() < new Date(DISCOUNT_DATE) ? DISCOUNT_PRICE : PRICE}</td>
                                                </tr>
                                                <tr>
                                                    <td className="fs-6">Additional T-shirt</td>
                                                    <td> INR {getValues("additionalTshirt") === "Yes" ? getValues("additionalTshirtQuantity") * ADDITIONAL_TSHIRT_PRICE : 0} </td>
                                                </tr>
                                                <tr>
                                                    <td className="fs-6">Additional Breakfast</td>
                                                    <td> INR {getValues("additionalBreakfast") * 80} </td>
                                                </tr>
                                                <tr>
                                                    <td className="fs-6">Donation</td>
                                                    <td> INR {getValues("donation") === "" ? 0 : getValues("donation")}</td>
                                                </tr>
                                                <tr>
                                                    <td className="fs-6"><strong>Total</strong></td>
                                                    <td><strong>{`INR ${totalPrice}`}</strong></td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        {/* <button onClick={handleSubmit(handlePaymentClick)} disabled={disablePaymentButton || paymentLoading} type="button" className="w-100 btn btn-lg btn-primary">Pay with PhonePe</button>
                                        <button onClick={handleSubmit(handleRazorpayClick)} disabled={disablePaymentButton || paymentLoading} type="button" className="w-100 btn btn-lg btn-primary mt-2">Pay with Razorpay</button> */}
                                    </div>
                                </div>
                            </div>
                        </div>

                    </section>
                }

            </main>
            <style>
                {`
                    .payment-success-dialog {
                        position: fixed;
                        top: 0;
                        left: 0;
                        right: 0;
                        bottom: 0;
                        background-color: rgba(0, 0, 0, 0.7);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        z-index: 1050;
                    }
                    
                    .payment-success-content {
                        background-color: white;
                        border-radius: 8px;
                        padding: 2rem;
                        width: 90%;
                        max-width: 500px;
                        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
                    }
                    
                    .success-header {
                        text-align: center;
                        margin-bottom: 1.5rem;
                    }
                    
                    .success-header i {
                        font-size: 3rem;
                        margin-bottom: 1rem;
                    }
                    
                    .payment-details {
                        background-color: #f8f9fa;
                        border-radius: 8px;
                        padding: 1rem;
                        margin-bottom: 1.5rem;
                    }
                    
                    .detail-row {
                        display: flex;
                        justify-content: space-between;
                        margin-bottom: 0.5rem;
                    }
                    
                    .detail-row:last-child {
                        margin-bottom: 0;
                    }
                    
                    .receipt-note {
                        display: flex;
                        align-items: center;
                        gap: 0.5rem;
                        margin-bottom: 1.5rem;
                        color: #6c757d;
                        font-size: 0.9rem;
                    }
                    
                    .action-buttons {
                        display: flex;
                        justify-content: center;
                        gap: 1rem;
                    }
                    
                    @media (max-width: 576px) {
                        .action-buttons {
                            flex-direction: column;
                        }
                    }
                `}
            </style>
            {showPaymentSuccessDialog && (
                <div style={{ color: "#000" }} className="payment-success-dialog">
                    <div className="payment-success-content">
                        <div className="success-header">
                            <i className="fas fa-check-circle text-success"></i>
                            <h3>Payment Successful!</h3>
                        </div>

                        <div className="payment-details">
                            <div className="detail-row">
                                <span style={{ color: "#000" }}>Amount:</span>
                                <strong style={{ color: "#000" }}>₹{paymentDetails?.amount / 100}</strong>
                            </div>
                            <div className="detail-row">
                                <span style={{ color: "#000" }}>Transaction ID:</span>
                                <code style={{ color: "#000" }}>{paymentDetails?.transactionId}</code>
                            </div>
                            <div className="detail-row">
                                <span style={{ color: "#000" }}>Reference ID:</span>
                                <code>{paymentDetails?.merchantTransactionId}</code>
                            </div>
                        </div>

                        <div className="receipt-note">
                            <i className="fas fa-envelope"></i>
                            <span style={{ color: "#000" }}>A receipt has been sent to {paymentDetails?.email}</span>
                        </div>

                        <div className="action-buttons">
                            {paymentDetails?.downloadLink && (
                                <a
                                    href={paymentDetails.downloadLink}
                                    download="RFH_Receipt.pdf"
                                    className="btn btn-success"
                                >
                                    <i className="fas fa-download"></i> Download Receipt
                                </a>
                            )}
                            <button
                                className="btn btn-primary"
                                onClick={() => {
                                    setShowPaymentSuccessDialog(false);
                                    navigate('/');
                                }}
                            >
                                <i className="fas fa-home"></i> Return to Home
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default RfhSheRun2025
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
import { Button, Dialog, Box, Typography, Skeleton } from '@mui/material';
import RegistrationDetailsDialog from './RegistrationDetailsDialog';
import { Helmet } from 'react-helmet-async';
import tShirtGuide from '../../assets/images/tShirtGuide.jpeg'
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import FeedbackCard from './FeedbackCard';
import { track, identify } from '../../lib/track';

const EVENT_SLUG = 'rfh-akshara-run-2026';
const MARATHON_NAME = 'RFH Akshara Run 2026';



function AksharaRun2026() {
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
    const [additionalBreakfast, setAdditionalBreakfast] = useState(0)
    const [tshirtValidationError, setTshirtValidationError] = useState("")
    const [tshirtSizes, setTshirtSizes] = useState([]);
    const [showExtensionAlert, setShowExtensionAlert] = useState(false);
    const [openRegistrationDialog, setOpenRegistrationDialog] = useState(false);
    const [couponCode, setCouponCode] = useState("")
    const [couponApplied, setCouponApplied] = useState(false)
    const [couponError, setCouponError] = useState("")
    const [couponValidating, setCouponValidating] = useState(false)
    const [accompanyingCount, setAccompanyingCount] = useState(0)
    const [accompanyingPeople, setAccompanyingPeople] = useState([])
    const [eventConfig, setEventConfig] = useState(null)
    const [configLoading, setConfigLoading] = useState(true)
    const category = watch('category');
    const navigate = useNavigate()

    useEffect(() => {
        fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/event-config/${EVENT_SLUG}`)
            .then(r => r.ok ? r.json() : null)
            .then(data => { setEventConfig(data); setConfigLoading(false); })
            .catch(() => setConfigLoading(false));
    }, []);

    // Config-backed constants (fall back to hardcoded values if config not loaded)
    const DISCOUNT_PRICE = eventConfig?.discountPrice ?? 749
    const PRICE = eventConfig?.price ?? 849
    const ADDITIONAL_TSHIRT_PRICE = eventConfig?.tshirtPrice ?? 250
    const ADDITIONAL_BREAKFAST_PRICE = eventConfig?.breakfastPrice ?? 100
    const DISCOUNT_DATE = new Date(eventConfig?.discountDeadline ?? "2026-06-01T23:59:00+05:30")
    const VALID_COUPONS = (eventConfig?.coupons ?? []).filter(c => c.active)
    const BRAND_AMBASSADORS = eventConfig?.brandAmbassadors ?? []

    const EVENT_DETAILS = {
        name: eventConfig?.eventName ?? "RFH Akshara Run 2026",
        date: new Date(eventConfig?.eventDate ?? "2026-06-14T00:00:00+05:30"),
        lastDate: new Date(eventConfig?.lastRegistrationDate ?? "2026-06-01T23:59:00+05:30"),
        time: "6:30 AM IST",
        venue: eventConfig?.venueUrl ?? "https://www.google.com/maps/place/Indian+Institute+Of+Management%E2%80%93Bangalore+(IIM%E2%80%93Bangalore)/data=!4m2!3m1!1s0x0:0x25bdb9da743f9bdd?sa=X&ved=1t:2428&ictx=111",
        venueName: eventConfig?.venueName ?? "IIM-B, Bengaluru",
    }

    const TSHIRT_SIZE_OPTIONS = [
        { value: 'XS', label: 'Extra Small (XS)' },
        { value: 'S', label: 'Small (S)' },
        { value: 'M', label: 'Medium (M)' },
        { value: 'L', label: 'Large (L)' },
        { value: 'XL', label: 'Extra Large (XL)' },
        { value: 'XXL', label: 'Double XL (XXL)' }
    ];

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

    // Watch for changes in form fields
    const dob = watch('dob');
    const donation = watch('donation');

    const handleDonationChange = (e) => {
        const enteredValue = e.target.value;
        if (enteredValue === "" || /^\d+$/.test(enteredValue)) {
            setValue("donation", enteredValue);
        }
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

    console.log("submitted ", submitted)

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
    }

    function calculateTotalPrice(formData) {
        const currentDate = new Date();
        let registrationFee = currentDate < new Date(DISCOUNT_DATE) ? DISCOUNT_PRICE : PRICE;

        // Apply coupon discount ONLY to the marathon registration fee
        if (couponApplied) {
            const matched = VALID_COUPONS.find(c => c.code.toUpperCase() === couponCode.trim().toUpperCase())
            const discountPct = matched?.discount ?? 5
            registrationFee = Math.round(registrationFee * (1 - discountPct / 100));
        }

        let totalPrice = registrationFee;

        if (formData.additionalTshirtQuantity) {
            const additionalTshirtCost = Number(formData.additionalTshirtQuantity) * ADDITIONAL_TSHIRT_PRICE;
            totalPrice += additionalTshirtCost;
        }

        if (formData.additionalBreakfast) {
            totalPrice += Number(formData.additionalBreakfast) * ADDITIONAL_BREAKFAST_PRICE;
        }

        // Donation is added at the end
        if (formData.donation) {
            totalPrice += parseInt(formData.donation, 10);
        }

        return totalPrice;
    }

    const onSubmit = (data) => {
        if (!validateTshirtSizes(data)) {
            return;
        }

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

        console.log(data);
        setSubmitted(!submitted)
        const totalPrice = calculateTotalPrice(data);
        setTotalPrice(totalPrice)
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
        setValue("marathonName", MARATHON_NAME)
        try {
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
            localStorage.setItem('cause', MARATHON_NAME);

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
            console.log("error ", error);
            setPaymentLoading(false);
            setDisablePaymentButton(false);
            setPaymentStatus("");
            localStorage.removeItem('merchantTransactionId');
            localStorage.removeItem('cause');
            toast.error('Something went wrong. Please try later or Raghu @ +91-91643 58027');
        }
    };

    const handleRazorpayClick = async () => {
        const resetPaymentUI = () => {
            setPaymentLoading(false);
            setDisablePaymentButton(false);
            setPaymentStatus("");
        };
        try {
            setPaymentLoading(true);
            setDisablePaymentButton(true);
            setPaymentStatus("Initiating Razorpay payment...");
            setValue("totalPrice", totalPrice)
            setValue("marathonName", MARATHON_NAME)
            setValue("eventSlug", EVENT_SLUG)
            // Coupon — store code and discount % so the backend can validate and the receipt can show it
            if (couponApplied && couponCode.trim()) {
                const matched = VALID_COUPONS.find(c => c.code.toUpperCase() === couponCode.trim().toUpperCase())
                setValue("couponCode", couponCode.trim().toUpperCase())
                setValue("couponDiscount", matched?.discount ?? 5)
            } else {
                setValue("couponCode", "")
                setValue("couponDiscount", 0)
            }

            const formVals = getValues();
            try {
                if (formVals.email) identify(formVals.email, { email: formVals.email, name: formVals.fullName, phone: formVals.mobNo });
            } catch (_) {}
            track('payment_initiated', { eventSlug: EVENT_SLUG, marathonName: MARATHON_NAME, totalPrice, couponCode: formVals.couponCode || null });

            // Order create with 25s timeout — Vercel cold-start + Mongo cold-start can stack to ~15s
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 25000);
            let response;
            try {
                response = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/marathons/initiate-razorpay-payment`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(formVals),
                    signal: controller.signal,
                });
            } catch (fetchErr) {
                clearTimeout(timeoutId);
                track('order_create_failed', { reason: fetchErr.name === 'AbortError' ? 'timeout' : 'network', message: fetchErr.message });
                throw new Error(fetchErr.name === 'AbortError'
                    ? 'Server took too long to respond. Please try again — your details are still filled in.'
                    : 'Network issue. Please check your connection and try again.');
            }
            clearTimeout(timeoutId);

            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                console.error('Razorpay order creation failed:', response.status, errData);
                track('order_create_failed', { reason: 'http_' + response.status, error: errData.error });
                throw new Error(errData.error || `Payment server error (${response.status}). Please try again.`);
            }

            const data = await response.json();
            if (!data.orderId) {
                track('order_create_failed', { reason: 'no_orderId' });
                throw new Error('Payment server did not return order details. Please try again.');
            }
            track('order_created', { orderId: data.orderId, merchantTransactionId: data.merchantTransactionId, amount: data.amount });

            const options = {
                key: data.keyId,
                amount: data.amount,
                currency: data.currency,
                name: "Rupee For Humanity",
                description: `${MARATHON_NAME} Registration`,
                order_id: data.orderId,
                handler: async function (response) {
                    setPaymentStatus("Verifying payment...");
                    track('verify_started', { orderId: response.razorpay_order_id, paymentId: response.razorpay_payment_id });
                    try {
                        const verifyResponse = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/marathons/razorpay-webhook`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_signature: response.razorpay_signature,
                            }),
                        });

                        const verifyData = await verifyResponse.json();
                        console.log('Razorpay verification response:', verifyData);

                        if (verifyData.status === 'success') {
                            track('verify_success', { merchantTransactionId: data.merchantTransactionId, paymentId: response.razorpay_payment_id });
                            localStorage.setItem('merchantTransactionId', data.merchantTransactionId);
                            localStorage.setItem('cause', MARATHON_NAME);

                            setPaymentDetails(verifyData.payment);
                            setShowPaymentSuccessDialog(true);
                            resetPaymentUI();
                        } else {
                            // Payment likely succeeded at Razorpay — verify endpoint failed. Be reassuring, not alarming.
                            track('verify_failed', { merchantTransactionId: data.merchantTransactionId, paymentId: response.razorpay_payment_id, verifyData });
                            setPaymentDetails({
                                merchantTransactionId: data.merchantTransactionId,
                                transactionId: response.razorpay_payment_id,
                                email: formVals.email,
                                name: formVals.fullName,
                                amount: data.amount,
                                pending: true
                            });
                            setShowPaymentSuccessDialog(true);
                            resetPaymentUI();
                            toast.message('Payment received. We are finalising your receipt — if you do not get the email in 1 hour, WhatsApp Raghu (+91 91643 58027) with your phone number.');
                        }
                    } catch (error) {
                        console.error('Verification error:', error);
                        track('verify_failed', { merchantTransactionId: data.merchantTransactionId, paymentId: response.razorpay_payment_id, error: error.message });
                        setPaymentDetails({
                            merchantTransactionId: data.merchantTransactionId,
                            transactionId: response.razorpay_payment_id,
                            email: formVals.email,
                            name: formVals.fullName,
                            amount: data.amount,
                            pending: true
                        });
                        setShowPaymentSuccessDialog(true);
                        resetPaymentUI();
                        toast.message('Payment received. Receipt may be delayed — WhatsApp Raghu (+91 91643 58027) if you do not get the email in 1 hour.');
                    }
                },
                modal: {
                    ondismiss: function () {
                        track('checkout_dismissed', { orderId: data.orderId });
                        resetPaymentUI();
                        toast.info('Payment cancelled. You can try again any time.');
                    }
                },
                prefill: {
                    name: formVals.fullName,
                    email: formVals.email,
                    contact: formVals.mobNo,
                },
                theme: { color: "#040002" },
            };

            // Razorpay SDK is preloaded in public/index.html. This is a safety net.
            if (!window.Razorpay) {
                toast.info('Loading payment gateway, please wait...');
                await new Promise((resolve, reject) => {
                    let attempts = 0;
                    const check = () => {
                        attempts++;
                        if (window.Razorpay) { resolve(); return; }
                        if (attempts > 30) { reject(new Error('Payment gateway could not load. Please disable ad blockers / VPN, refresh, and try again. Or WhatsApp Raghu at +91 91643 58027.')); return; }
                        setTimeout(check, 300);
                    };
                    check();
                });
            }

            const rzp = new window.Razorpay(options);
            rzp.on('payment.failed', function (response) {
                const reason = response && response.error && response.error.description;
                track('payment_failed', { orderId: data.orderId, reason, code: response?.error?.code, source: response?.error?.source });
                toast.error(reason ? `Payment failed: ${reason}. Please try again.` : 'Payment failed. Please try again.');
                resetPaymentUI();
            });

            track('checkout_opened', { orderId: data.orderId });
            rzp.open();
        } catch (error) {
            console.error("Razorpay error:", error);
            track('payment_error', { message: error.message });
            resetPaymentUI();
            toast.error(error.message || 'Failed to initialize Razorpay. Please try again or WhatsApp Raghu at +91 91643 58027.');
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

    const handleCouponApply = async () => {
        if (!couponCode.trim()) {
            setCouponError("Please enter a coupon code")
            setCouponApplied(false)
            return
        }
        setCouponValidating(true)
        setCouponError("")
        setCouponApplied(false)
        try {
            const res = await fetch(
                `${process.env.REACT_APP_BACKEND_BASE_URL}/api/event-config/${EVENT_SLUG}/validate-coupon`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ couponCode: couponCode.trim() }),
                }
            )
            const data = await res.json()
            if (data.valid) {
                setCouponApplied(true)
                setCouponError("")
            } else {
                setCouponApplied(false)
                setCouponError(data.message || "Invalid coupon code")
            }
        } catch (err) {
            setCouponApplied(false)
            setCouponError("Could not validate coupon. Please check your connection and try again.")
        } finally {
            setCouponValidating(false)
        }
    }

    const handleAccompanyingCountChange = (count) => {
        setAccompanyingCount(count)
        setAccompanyingPeople(Array(count).fill({ name: '', age: '' }))
    }

    const handleAccompanyingPersonChange = (index, field, value) => {
        const updated = [...accompanyingPeople]
        updated[index] = { ...updated[index], [field]: value }
        setAccompanyingPeople(updated)
        setValue(`accompanyingPerson${index + 1}${field.charAt(0).toUpperCase() + field.slice(1)}`, value)
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

    const additionalBreakfastSection = (
        <div className="row">
            <div className="col-md-4">
                <div className="form-group">
                    <label htmlFor="additionalBreakfast">Additional Breakfast</label>
                    <select
                        {...register("additionalBreakfast")}
                        className="form-select"
                        onChange={(e) => setAdditionalBreakfast(Number(e.target.value))}
                    >
                        <option value="0">No additional breakfast</option>
                        <option value="1">1 person (₹100)</option>
                        <option value="2">2 persons (₹200)</option>
                        <option value="3">3 persons (₹300)</option>
                        <option value="4">4 persons (₹400)</option>
                        <option value="5">5 persons (₹500)</option>
                    </select>
                    <small className="form-text" style={{ color: '#e0e0e0' }}>Breakfast is already included for the participant</small>
                </div>
            </div>
        </div>
    );

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
                                        T-shirt sizes are in inches. For reference: Size 24-28 (Kids 4-8 yrs), 
                                        Size 30-34 (Kids 9-14 yrs), Size 36-40 (Adults S-L), 
                                        Size 42-46 (Adults XL-XXL)
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

    const additionalStyles = `
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

        .form-select {
            background-color: #1a1a1a;
            color: #fff;
            border: 1px solid #333;
        }

        .form-select:focus {
            background-color: #1a1a1a;
            color: #fff;
            border-color: #f39c12;
            box-shadow: 0 0 0 0.2rem rgba(243, 156, 18, 0.25);
        }
    `;

    // Config loading — skeleton layout
    if (configLoading) {
        return (
            <div style={{ backgroundColor: "#040002", minHeight: "100vh" }}>
                <Header />

                {/* Hero skeleton — mimics the dark event info banner */}
                <Box sx={{ backgroundColor: "#040002", px: { xs: 2, md: 8 }, pt: 5, pb: 4 }}>
                    <Skeleton variant="text" width={320} height={48} sx={{ bgcolor: '#1a1a1a', mb: 1, mx: 'auto' }} />
                    <Skeleton variant="text" width={200} height={28} sx={{ bgcolor: '#1a1a1a', mb: 3, mx: 'auto' }} />

                    {/* Event info chips row */}
                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap', mb: 4 }}>
                        {[160, 140, 180].map((w, i) => (
                            <Skeleton key={i} variant="rounded" width={w} height={36} sx={{ bgcolor: '#1a1a1a' }} />
                        ))}
                    </Box>

                    {/* Category table skeleton */}
                    <Box sx={{ maxWidth: 680, mx: 'auto', mb: 2 }}>
                        <Skeleton variant="rounded" width="100%" height={44} sx={{ bgcolor: '#1a1a1a', mb: 1 }} />
                        {[1, 2, 3, 4].map(i => (
                            <Skeleton key={i} variant="rounded" width="100%" height={40} sx={{ bgcolor: '#151515', mb: 0.75 }} />
                        ))}
                    </Box>
                </Box>

                {/* Form section skeleton — mimics the light registration form area */}
                <Box sx={{ backgroundColor: '#f8f4ef', px: { xs: 2, md: 8 }, py: 5 }}>
                    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
                        <Skeleton variant="text" width={260} height={36} sx={{ mb: 3 }} />

                        {/* Two-column form rows */}
                        {[1, 2, 3].map(i => (
                            <Box key={i} sx={{ display: 'flex', gap: 2, mb: 2.5 }}>
                                <Skeleton variant="rounded" width="50%" height={52} />
                                <Skeleton variant="rounded" width="50%" height={52} />
                            </Box>
                        ))}
                        {/* Full-width rows */}
                        <Skeleton variant="rounded" width="100%" height={52} sx={{ mb: 2.5 }} />
                        <Skeleton variant="rounded" width="100%" height={52} sx={{ mb: 2.5 }} />

                        {/* Submit button skeleton */}
                        <Box sx={{ textAlign: 'center', mt: 4 }}>
                            <Skeleton variant="rounded" width={200} height={48} sx={{ mx: 'auto' }} />
                        </Box>
                    </Box>
                </Box>
            </div>
        )
    }

    // Registration gate — admin can close registrations from admin panel
    if (eventConfig && !eventConfig.registrationOpen) {
        return (
            <div style={{ backgroundColor: "#040002", color: "lightgray", minHeight: "100vh" }}>
                <Header />
                <div className="container text-center" style={{ marginTop: '6rem' }}>
                    <h2 style={{ color: "lightgray" }}>
                        {eventConfig.closedMessage || "Registrations are now closed."}
                    </h2>
                    <p style={{ color: "#aaa", marginTop: "1rem" }}>Thank you for your interest in {eventConfig.eventName ?? "this event"}.</p>
                </div>
            </div>
        )
    }

    return (
        <div style={{ backgroundColor: "#040002", color: "lightgray", minHeight: "100vh" }}>
            <Helmet>
                <title>RFH Akshara Run 2026</title>
                <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
                <style>
                    {`
                        .registration-extension {
                            margin: 1rem auto 2rem;
                            width: 95%;
                            max-width: 800px;
                            box-shadow: 0 8px 20px rgba(40,167,69,0.35);
                            border-radius: 10px;
                            border-left: 5px solid #28a745;
                            background: linear-gradient(135deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.85) 100%);
                            transform-origin: center;
                            animation: bounce 2.5s infinite;
                            overflow: hidden;
                            position: relative;
                        }
                        
                        @keyframes bounce {
                            0%, 100% { transform: translateY(0); }
                            50% { transform: translateY(-8px); }
                        }
                        
                        .registration-extension::before {
                            content: '';
                            position: absolute;
                            top: 0;
                            left: 0;
                            width: 100%;
                            height: 100%;
                            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
                            animation: shimmer 3s infinite;
                        }
                        
                        @keyframes shimmer {
                            0% { transform: translateX(-100%); }
                            100% { transform: translateX(100%); }
                        }
                        
                        .registration-extension .alert-text {
                            color: #ffffff;
                            font-weight: 500;
                        }
                        
                        .registration-extension .highlight-date {
                            background-color: #f39c12;
                            color: #000000;
                            font-weight: 700;
                            padding: 0.25rem 0.5rem;
                            border-radius: 4px;
                            display: inline-block;
                            margin: 0 0.3rem;
                        }
                        
                        .form-control, .form-select {
                            background-color: #1a1a1a;
                            color: #fff;
                            border: 1px solid #333;
                        }
                        
                        @media (max-width: 576px) {
                            .registration-extension {
                                margin: 0.5rem auto 1.5rem;
                                padding: 0.75rem;
                            }
                            .registration-extension .d-flex {
                                flex-direction: column;
                                align-items: flex-start !important;
                            }
                            .registration-extension .fa-spin {
                                margin-bottom: 0.5rem;
                            }
                        }
                        ${additionalStyles}
                    `}
                </style>
            </Helmet>
            <Header />
            {/* <FeedbackCard eventId={EVENT_DETAILS.name} eventName={EVENT_DETAILS.name} /> */}
            {showExtensionAlert && (
                <div className="alert alert-danger alert-dismissible fade show registration-extension" role="alert">
                    <div className="d-flex align-items-center">
                        <i className="fas fa-ban me-3"></i>
                        <div className="alert-text">
                            <strong className="me-2">🚫 Oops, you just missed it!</strong>
                            <p>Registrations are officially CLOSED for this year. 😬<br/>
                            The ship has sailed, the gates are shut, and the confetti's already flying without you! 🎉😅</p>
                            <p>But hey — better luck next time!</p>
                            <p>Already registered? Check your registration details below:</p>
                            <Button 
                                variant="contained" 
                                color="primary"
                                size="small"
                                onClick={() => setOpenRegistrationDialog(true)}
                                sx={{ mt: 1, mb: 2 }}
                            >
                                View My Registration
                            </Button>
                            <p>Got questions or already planning for next year? Reach out to our awesome team below. 👇📞<br/>
                            Deekshith : +91 8147775122<br/>
                            Raghu : +91 9164358027<br/>
                            Deepthi : +91 9986387435</p>
                        </div>
                    </div>
                    <button type="button" className="btn-close" onClick={() => setShowExtensionAlert(false)} aria-label="Close"></button>
                </div>
            )}
            <main>
                {(submitted === false) ?
                    <section id="registration-form">
                        <div className="container-md">
                            <h1 className="h1" style={{ fontWeight: "800" }}>
                                RFH Akshara Run 2026 <br />
                                {/* <span className='highlight' style={{ cursor: "pointer" }} onClick={executeScroll}>Virtual Run</span> */}
                            </h1>
                            <div className="row">
                                <div className="col-md-4">
                                    <span> <strong><EventTwoToneIcon /> Date:</strong>
                                        {/* {EVENT_DETAILS.date.toLocaleDateString('en-US', dateOptions)}  */}
                                        {EVENT_DETAILS.date.toLocaleDateString('en-US', dateOptions)}
                                    </span>
                                </div>
                                <div className="col-md-4">
                                    <span><strong> <AccessTimeTwoToneIcon /> Time:</strong>  {EVENT_DETAILS.time} </span>
                                </div>
                                <div className="col-md-4">
                                    <span><strong> <PlaceTwoToneIcon /> Venue: </strong><a style={{ color: "lightgray" }} href={EVENT_DETAILS.venue} target="_blank" rel="noopener noreferrer">{EVENT_DETAILS.venueName}</a> </span>
                                </div>
                            </div>


                            <span ><small style={{ color: "#ff7675" }}> <strong>Last Date to Register: {EVENT_DETAILS.lastDate.toLocaleDateString('en-US', dateOptions)}</strong> </small></span><br />
                            <br />

                            <p>
                                Rupee For Humanity (RFH) is a government-registered online NGO founded by a group of passionate engineers dedicated to the nation's progress. As a non-profit organization, its mission is to eliminate illiteracy at its core and contribute to India's advancement as a developed nation.
                            </p>
                            <p>
                                We are proud to host the event again this year <b>"RFH Akshara Run 2026"!</b>
                            </p>

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
                                            <th scope="col">Age Group</th>
                                            <th scope="col">Distance</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className="fs-6">Fun Run</td>
                                            <td>All ages</td>
                                            <td>2.5 kms</td>
                                        </tr>
                                        <tr>
                                            <td className="fs-6">Challenge Run</td>
                                            <td>All ages</td>
                                            <td>5 kms</td>
                                        </tr>
                                    </tbody>
                                </table>

                                <div className="mt-4">
                                    <h3 style={{ color: '#f39c12', marginBottom: '12px', fontSize: '1.2rem' }}>
                                        RACE INCLUSIONS / GIVEAWAYS
                                    </h3>
                                    <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 16px 0' }}>
                                        <li>Dry-fit T-shirt</li>
                                        <li>BIB</li>
                                        <li>Pre, During & Post Race Hydration</li>
                                        <li>Finishers Medal</li>
                                        <li>Post Race Hot Breakfast</li>
                                        <li>Medical Support</li>
                                        <li>Certificate</li>
                                        <li>Free Race Images</li>
                                    </ul>
                                    <p>
                                        Each participant receives the above and witnesses the noble cause of Rupee For Humanity.
                                    </p>
                                    <ul>
                                        <li><strong>Registration Cost:</strong> Early Bird (till offer lasts) - ₹{DISCOUNT_PRICE}, Regular - ₹{PRICE}</li>
                                        <li><strong>Additional T-shirt:</strong> ₹{ADDITIONAL_TSHIRT_PRICE} per T-shirt</li>
                                        <li><strong>Breakfast:</strong> Included for participants. Additional breakfast available at ₹{ADDITIONAL_BREAKFAST_PRICE} per person.</li>
                                    </ul>
                                </div>

                                <div className="mt-4">
                                    <p>
                                        For any more information about sponsorship / registration / queries, you can reach out to the below organizers:
                                    </p>
                                    <ul>
                                        <li>Deekshith : +91-81477 75122</li>
                                        <li>Deepthi @ +91-99863 87435</li>
                                        <li>Raghu @ +91-91643 58027</li>
                                    </ul>
                                </div>

                            </div>

                            <RegistrationDetailsDialog open={openRegistrationDialog} onClose={() => setOpenRegistrationDialog(false)} eventName="RFH Akshara Run 2026" />

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
                                                    <option value="Male">Male</option>
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
                                        {watch("city") === "others" && (
                                            <div className="col-md-4">
                                                <div className="form-group">
                                                    <label htmlFor="otherCity">Other City Name <span style={{ color: "red" }}>*</span></label>
                                                    <input {...register("otherCity", { required: watch("city") === "others" })} type="text" className="form-control" id="otherCity" />
                                                    {errors.otherCity && <p style={{ color: "red" }}>This field is mandatory</p>}
                                                </div>
                                            </div>
                                        )}
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
                                                    Date of Birth <span style={{ color: "red" }}>*</span>
                                                    <small>
                                                        <i> (Minimum age: 16 years)</i>
                                                    </small>
                                                </label>
                                                <input
                                                    {...register("dob", { 
                                                        required: "Date of birth is required",
                                                        validate: {
                                                            minAge: (value) => {
                                                                const today = new Date();
                                                                const birthDate = new Date(value);
                                                                const age = today.getFullYear() - birthDate.getFullYear();
                                                                const monthDiff = today.getMonth() - birthDate.getMonth();
                                                                const actualAge = monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate()) ? age - 1 : age;
                                                                return actualAge >= 16 || "Participant must be at least 16 years old";
                                                            }
                                                        }
                                                    })}
                                                    type="date"
                                                    className="form-control"
                                                    id="date"
                                                    placeholder="date"
                                                    max={new Date().toISOString().split("T")[0]}
                                                />
                                                {errors.dob && <p style={{ color: "red" }}>{errors.dob.message || "This field is mandatory"}</p>}
                                            </div>
                                        </div>

                                    </div>

                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label htmlFor="category">Select Category <span style={{ color: "red" }}>*</span></label>
                                                <select id="category" {...register("category", { required: true })} className="form-select" aria-label="Select Category">
                                                    <option value="">-- Select Category --</option>
                                                    <option value="Fun-Run">Fun Run (2.5 kms)</option>
                                                    <option value="Challenge-Run">Challenge Run (5 kms)</option>
                                                </select>
                                                {errors.category && <p><span style={{ color: "red" }}>This field is mandatory.</span></p>}
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label htmlFor='brandAmbassador'>How did you hear about this event?</label>
                                                <select id="brandAmbassador" {...register("brandAmbassador")} className="form-select">
                                                    <option value="">-- Select --</option>
                                                    {BRAND_AMBASSADORS && BRAND_AMBASSADORS.length > 0 ? (
                                                        BRAND_AMBASSADORS.map((ambassador, idx) => (
                                                            <option key={idx} value={ambassador}>{ambassador}</option>
                                                        ))
                                                    ) : (
                                                        <>
                                                            <option value="Social Media">Social Media</option>
                                                            <option value="Friends/Family">Friends/Family</option>
                                                            <option value="RFH Website">RFH Website</option>
                                                            <option value="Event Poster">Event Poster</option>
                                                            <option value="Other">Other</option>
                                                        </>
                                                    )}
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Accompanying People — IIM-B security requirement */}
                                    {selectedCategory && (
                                        <div className="row">
                                            <div className="col-md-12">
                                                <div className="form-group">
                                                    <label>
                                                        Number of Accompanying People
                                                        <small className="d-block mt-1" style={{ color: "#f39c12" }}>
                                                            ⚠️ These details must exactly match at IIM-B entrance (mandatory as per security protocol).
                                                            Maximum 2 accompanying persons allowed.
                                                        </small>
                                                    </label>
                                                    <select
                                                        {...register("accompanyingCount")}
                                                        className="form-select"
                                                        onChange={(e) => handleAccompanyingCountChange(parseInt(e.target.value))}
                                                    >
                                                        <option value="0">0 (No accompanying person)</option>
                                                        <option value="1">+1 person</option>
                                                        <option value="2">+2 persons</option>
                                                    </select>
                                                </div>
                                            </div>

                                            {accompanyingPeople.map((person, index) => (
                                                <div key={index} className="col-md-12 mb-3">
                                                    <div className="row">
                                                        <div className="col-md-6">
                                                            <div className="form-group">
                                                                <label>Accompanying Person {index + 1} — Full Name <span style={{ color: "red" }}>*</span></label>
                                                                <input
                                                                    {...register(`accompanyingPerson${index + 1}Name`, { required: accompanyingCount > 0 })}
                                                                    className="form-control"
                                                                    type="text"
                                                                    placeholder="Full Name"
                                                                    onChange={(e) => handleAccompanyingPersonChange(index, 'name', e.target.value)}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-3">
                                                            <div className="form-group">
                                                                <label>Age <span style={{ color: "red" }}>*</span></label>
                                                                <input
                                                                    {...register(`accompanyingPerson${index + 1}Age`, { required: accompanyingCount > 0 })}
                                                                    className="form-control"
                                                                    type="number"
                                                                    placeholder="Age"
                                                                    min="1"
                                                                    max="100"
                                                                    onChange={(e) => handleAccompanyingPersonChange(index, 'age', e.target.value)}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

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
                                                    <option value="XS">Extra Small (XS)</option>
                                                    <option value="S">Small (S)</option>
                                                    <option value="M">Medium (M)</option>
                                                    <option value="L">Large (L)</option>
                                                    <option value="XL">Extra Large (XL)</option>
                                                    <option value="XXL">Double XL (XXL)</option>
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
                                                <label htmlFor="additionalTshirt">Do you need additional T-shirt? <span style={{ color: "red" }}>*</span></label>
                                                <select {...register("additionalTshirt", { required: false })} id="additionalTshirt" className="form-select" aria-label="Additional T-shirt">
                                                    <option value="">select</option>
                                                    <option value="Yes">Yes</option>
                                                    <option value="No">No</option>
                                                </select>
                                                {errors.additionalTshirt && <p style={{ color: "red" }}>This field is mandatory</p>}
                                            </div>
                                        </div>
                                    </div>
                                    <AdditionalTshirtSection />
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

                                    {additionalBreakfastSection}

                                    {/* Coupon Code — shown only when admin has enabled coupons */}
                                    {eventConfig?.couponsEnabled && (
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label htmlFor="couponCode">Coupon Code (if any)</label>
                                                <div className="d-flex gap-2">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="couponCode"
                                                        value={couponCode}
                                                        onChange={(e) => { setCouponCode(e.target.value); setCouponApplied(false); setCouponError("") }}
                                                        placeholder="Enter coupon code"
                                                        style={{ textTransform: "uppercase" }}
                                                        disabled={couponValidating}
                                                    />
                                                    <button
                                                        type="button"
                                                        className="btn btn-outline-warning"
                                                        onClick={handleCouponApply}
                                                        disabled={couponValidating}
                                                        style={{ minWidth: "80px" }}
                                                    >
                                                        {couponValidating
                                                            ? <span className="spinner-border spinner-border-sm" role="status" />
                                                            : "Apply"
                                                        }
                                                    </button>
                                                </div>
                                                {couponApplied && (() => {
                                                    const matched = VALID_COUPONS.find(c => c.code.toUpperCase() === couponCode.trim().toUpperCase())
                                                    const discountPct = matched?.discount ?? 5
                                                    return <p style={{ color: "#28a745" }}>Coupon applied! {discountPct}% discount on registration cost.</p>
                                                })()}
                                                {couponError && <p style={{ color: "red" }}>{couponError}</p>}
                                            </div>
                                        </div>
                                    </div>
                                    )}

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

                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label htmlFor="brandAmbassador">Brand Ambassador through whom you came to know about this event?</label>
                                                <select {...register("brandAmbassador")} className="form-select" id="brandAmbassador">
                                                    <option value="">Select (if applicable)</option>
                                                    {(eventConfig?.brandAmbassadors ?? []).map(name => (
                                                        <option key={name} value={name}>{name}</option>
                                                    ))}
                                                    <option value="other">Other</option>
                                                </select>
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
                                            defaultValue="&#x2022; Registration Policy: All registrations are non-refundable, non-transferable, and cannot be modified.
&#x2022; Contact Information: Participants must provide a valid mobile number and email address for event-related communication.
&#x2022; Participation Risk: By registering, participants acknowledge that running involves physical activity and possible risks of injury and agree to participate at their own responsibility.
&#x2022; Liability Waiver: Participants agree not to hold the RFH Akshara Run organizing committee, Rupee for Humanity, sponsors, or volunteers liable for any injury, loss, or damage resulting from participation in the event.
&#x2022; Event Monitoring: RFH volunteers will monitor the entire track, and their decision will be final on the event day.
&#x2022; Event Changes: The organizers reserve the right to cancel, postpone, or stop the event due to adverse weather or unforeseen circumstances.
&#x2022; Event Spirit: This is a fun run for a noble cause. Participants are encouraged to run safely and enjoy the event."
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
                                        <td className="fs-6">Total Price </td>
                                        <td> <b>INR {totalPrice}/-</b>   </td>
                                    </tr>
                                </tbody>
                            </table>
                            <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3 mt-3">
                                <button className="btn btn-secondary" onClick={handleEditClick}>Edit</button>
                                {/* <div className="d-flex flex-column flex-sm-row justify-content-center gap-2 gap-sm-3 w-100 w-md-auto">
                                    <button
                                        className="btn btn-primary w-100"
                                        onClick={handlePaymentClick}
                                        disabled={disablePaymentButton || paymentLoading}
                                    >
                                        {paymentLoading ? "Processing..." : "Pay with PhonePe"}
                                    </button>
                                    <button
                                        className="btn btn-primary w-100"
                                        onClick={handleRazorpayClick}
                                        disabled={disablePaymentButton || paymentLoading}
                                    >
                                        {paymentLoading ? "Processing..." : "Pay with Razorpay"}
                                    </button>
                                </div> */}
                            </div>

                            {/* <div className="row justify-content-center mt-3">
                                <div className="col-md-8">
                                    {paymentStatus && (
                                        <div className="alert alert-info text-center">
                                            <i className="fas fa-info-circle me-2"></i>
                                            {paymentStatus}
                                            {disablePaymentButton && (
                                                <div className="mt-2">
                                                    <small>
                                                        <i className="fas fa-exclamation-circle me-1"></i>
                                                        If you accidentally closed the payment tab, 
                                                        <button 
                                                            className="btn btn-link btn-sm p-0 ms-1" 
                                                            onClick={() => window.location.reload()}
                                                        >
                                                            click here to try again
                                                        </button>
                                                        <span style={{ display: 'block', marginTop: '6px' }}>
                                                            Still stuck? <a href="https://wa.me/919164358027" target="_blank" rel="noreferrer" style={{ color: '#25D366', fontWeight: 600 }}>WhatsApp Raghu</a> for help.
                                                        </span>
                                                    </small>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div> */}

                            {/* Razorpay Payment Success Dialog */}
                            {showPaymentSuccessDialog && (
                                <div style={{ color: "#000" }} className="payment-success-dialog">
                                    <div className="payment-success-content">
                                        <div className="success-header">
                                            <i className="fas fa-check-circle text-success"></i>
                                            <h3 style={{ color: "#000" }}>Payment Successful!</h3>
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

                                        <div style={{ textAlign: "center", marginTop: "1rem", color: "#000", fontWeight: "500" }}>
                                            Thank you for supporting this noble cause.
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

                            <div className="row justify-content-center mt-3">
                                <div className="col-md-8">
                                    {paymentStatus && (
                                        <div className="alert alert-info text-center">
                                            <i className="fas fa-info-circle me-2"></i>
                                            {paymentStatus}
                                            {disablePaymentButton && (
                                                <div className="mt-2">
                                                    <small>
                                                        <i className="fas fa-exclamation-circle me-1"></i>
                                                        If you accidentally closed the payment tab,
                                                        <button
                                                            className="btn btn-link btn-sm p-0 ms-1"
                                                            onClick={() => window.location.reload()}
                                                        >
                                                            click here to try again
                                                        </button>
                                                        <span style={{ display: 'block', marginTop: '6px' }}>
                                                            Still stuck? <a href="https://wa.me/919164358027" target="_blank" rel="noreferrer" style={{ color: '#25D366', fontWeight: 600 }}>WhatsApp Raghu</a> for help.
                                                        </span>
                                                    </small>
                                                </div>
                                            )}
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
                                                {couponApplied && (() => {
                                                    const matched = VALID_COUPONS.find(c => c.code.toUpperCase() === couponCode.trim().toUpperCase())
                                                    const discountPct = matched?.discount ?? 5
                                                    const basePrice = new Date() < new Date(DISCOUNT_DATE) ? DISCOUNT_PRICE : PRICE
                                                    return (
                                                        <tr>
                                                            <td className="fs-6" style={{ color: "#28a745" }}>Coupon Discount ({discountPct}%)</td>
                                                            <td style={{ color: "#28a745" }}>- INR {Math.round(basePrice * discountPct / 100)}</td>
                                                        </tr>
                                                    )
                                                })()}
                                                <tr>
                                                    <td className="fs-6">Donation</td>
                                                    <td> INR {getValues("donation") === "" ? 0 : getValues("donation")}</td>
                                                </tr>
                                                <tr>
                                                    <td className="fs-6">Additional Breakfast</td>
                                                    <td> INR {getValues("additionalBreakfast") * ADDITIONAL_BREAKFAST_PRICE} </td>
                                                </tr>
                                                <tr>
                                                    <td className="fs-6"><strong>Total</strong></td>
                                                    <td><strong>{`INR ${totalPrice}`}</strong></td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        {/* <button onClick={handlePaymentClick} disabled={disablePaymentButton} type="button" className="w-100 btn btn-lg btn-primary">Pay with PhonePe</button> */}
                                        <button onClick={handleRazorpayClick} disabled={disablePaymentButton || paymentLoading} type="button" className="w-100 btn btn-lg btn-primary mt-4">{paymentLoading ? "Processing..." : "Pay with Razorpay"}</button>
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
            
        </div>
    )
}

export default AksharaRun2026
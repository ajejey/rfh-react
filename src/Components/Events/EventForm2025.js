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

const EVENT_DETAILS = {
    name: "RFH Juniors Run 2025",
    date: new Date("2025-05-25T00:00:00+05:30"), // May 25th, 2025
    lastDate: new Date("2025-04-28T23:59:00+05:30"),
    time: "7:00 AM IST",
    venue: "https://www.google.com/maps/place/Bal+Bhavan+Auditorium/@12.9766439,77.5952091,17z/data=!3m1!4b1!4m6!3m5!1s0x3bae1671b1cd3b1f:0xb72fa25e5df4598d!8m2!3d12.9766439!4d77.597784!16s%2Fg%2F11csqwx6mm?entry=ttu&g_ep=EgoyMDI1MDIxMi4wIKXMDSoASAFQAw%3D%3D",
    venueName: "Cubbon Park, Bengaluru",
}


function EventForm2025() {
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
    const category = watch('category');

    const DISCOUNT_PRICE = 599
    const PRICE = 599
    // const DISCOUNT_PRICE = 1
    // const PRICE = 1
    const ADDITIONAL_TSHIRT_PRICE = 225
    const DISCOUNT_DATE = new Date("2025-01-21T23:59:00+05:30");

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
        if (age >= 3 && age <= 6) {
            setSelectedCategory('Champs-Run');
        } else if (age >= 7 && age <= 13) {
            setSelectedCategory('Power-Run');
        } else if (age >= 14 && age <= 18) {
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


    console.log("submitted ", submitted)

    function calculateTotalPrice(formData) {
        // Get the current date
        const currentDate = new Date();

        // Set the registration fee based on the current date
        const registrationFee = currentDate < new Date(DISCOUNT_DATE) ? DISCOUNT_PRICE : PRICE;
        console.log("registrationFee ", registrationFee)
        // Calculate the total price
        let totalPrice = registrationFee;

        // Add INR ADDITIONAL_TSHIRT_PRICE for every additional T-shirt
        if (formData.additionalTshirtQuantity) {
            console.log("formData.additionalTshirtQuantity ", formData.additionalTshirtQuantity)
            const additionalTshirtCost = Number(formData.additionalTshirtQuantity) * ADDITIONAL_TSHIRT_PRICE;
            totalPrice += additionalTshirtCost;
        }

        console.log("totalPrice ", totalPrice)

        // Add the donation amount
        if (formData.donation) {
            totalPrice += parseInt(formData.donation, 10);
        }

        console.log("totalPrice ", totalPrice)

        return totalPrice;
    }

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

        console.log(data);
        setSubmitted(!submitted)
        const totalPrice = calculateTotalPrice(data);
        setTotalPrice(totalPrice)
    }

    const handlePaymentClick = async () => {

        // setValue("totalPrice", totalPrice)
        setValue("totalPrice", 1) // 1 rupee for testing
        setValue("marathonName", "RFH Juniors run 2025")
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/marathons/initiate-payment`, {
                method: "POST",
                timeout: 1200000,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(getValues()),
            });
            const data = await response.json();
            console.log("data ", data)
            console.log("data.message", data, data.message);
            if (data.success === false) {
                toast.error('There was an error. Please try later or Contact Raghu @ +91-9164358027 ', { duration: 50000 });
                return
            }
            console.log("merchantTransactionId from backend ", data?.data?.merchantTransactionId)
            localStorage.setItem('merchantTransactionId', data?.data?.merchantTransactionId
            );
            localStorage.setItem('cause', "RFH Juniors run 2025");
            // setPaymentStatus(data.message)
            // setPaymentLink(data?.data?.instrumentResponse?.redirectInfo?.url)
            // window.location.href = data?.data?.instrumentResponse?.redirectInfo?.url;
            setDisablePaymentButton(true)
            setPaymentLoading(true)
            window.open(
                data?.data?.instrumentResponse?.redirectInfo?.url
            );

        } catch (error) {
            console.log("error ", error)
            setPaymentLoading(false)
            setDisablePaymentButton(false)
            toast.error('Something went wrong. Please try later or Raghu @ +91-91643 58027');
        }

    }

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
                <title>RFH Juniors run 2025 | Rupee For Humanity</title>
            </Helmet>
            <Header />
            <main>
                {(submitted === false) ?
                    <section id="registration-form">
                        <div className="container-md">
                            <h1 className="h1" style={{ fontWeight: "800" }}>
                                RFH Juniors run 2025 <br />
                                {/* <span className='highlight' style={{ cursor: "pointer" }} onClick={executeScroll}>Virtual Run</span> */}
                            </h1>
                            <div className="row">
                                <div className="col-md-4">
                                    <span> <strong><EventTwoToneIcon /> Date:</strong>  {EVENT_DETAILS.date.toLocaleDateString('en-US', dateOptions)}   </span>
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
                                Rupee For Humanity (RFH) is an online NGO registered with the Government, started by a bunch of
                                engineers having passion to work for the country and its development. It is a non-profit
                                organization aimed at eradicating illiteracy from the roots and making India rise up high in the
                                ladder of developed nations.
                            </p>
                            <p>
                                We are proud to host the event again this year <b>“RFH Juniors run 2025”!</b>
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
                                            <td className="fs-6">Champs Run</td>
                                            <td>3-6 years</td>
                                            <td>800 meters</td>
                                        </tr>
                                        <tr>
                                            <td className="fs-6">Power Run</td>
                                            <td>7-13 years</td>
                                            <td>1.5 kms</td>
                                        </tr>
                                        <tr>
                                            <td className="fs-6">Bolts Run</td>
                                            <td>14-18 years</td>
                                            <td>2.5 kms</td>
                                        </tr>
                                    </tbody>
                                </table>

                                {/* <div style={{ display: "flex", justifyContent: "space-between" }}>
                                    <div>
                                        <b>T-shirt</b> : INR 210/- <br />
                                        <b>Courier charges anywhere in India</b> : INR 150/- <br />
                                        <b>Self Pickup available only in Bengaluru, Hyderabad, Chennai</b> <br />
                                        <small>Above items are optional and are not applicable for runners outside India</small><br />
                                        <small style={{ color: "red" }}>* Upon upload of the screenshot of your running activity in portal</small>
                                    </div>
                                </div> */}
                                <div className="mt-4">
                                    <p>
                                        Each participant receives Medal, Bib, Finisher certificate, Breakfast and witnesses the noble cause of Rupee For Humanity.
                                    </p>
                                    <ul>
                                        <li><strong>Champs run:</strong> Should be accompanied by a parent/guardian.</li>
                                        {/* <li><strong>Parents:</strong> Can opt for T-shirt for them with an additional price of {ADDITIONAL_TSHIRT_PRICE}/- INR per T-shirt.</li> */}
                                        <li><strong>Breakfast:</strong> Only for participants. Parents can buy from the food vendor on the venue.</li>
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
                                                    <option value="male">Male</option>
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
                                        {selectedCity === "others" &&
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
                                                    <small>
                                                        <i>(eligible only if born after 2002)</i>
                                                    </small>{" "}
                                                    <span style={{ color: "red" }}>*</span>
                                                </label>
                                                <input
                                                    {...register("dob", { required: true })}
                                                    type="date"
                                                    className="form-control"
                                                    id="date"
                                                    placeholder="date"
                                                    max={new Date().toISOString().split("T")[0]} // Set max date to today
                                                    min="2002-01-01" // Set min date to January 1, 2002
                                                />
                                                {errors.dob && <p style={{ color: "red" }}>This field is mandatory</p>}
                                            </div>
                                        </div>

                                    </div>

                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label htmlFor="category">Select Category <small> <i>(Auto-populated based on your age)</i> </small> <span style={{ color: "red" }}>*</span></label>
                                                <input type='text' id="category" {...register("category", { required: true })} value={getValues("category")} className="form-select" aria-label="Select Category" readOnly />
                                                {/* <option value="">select</option>
                                                    <option value="Champs-Run">Champs Run</option>
                                                    <option value="Power-Run">Power Run</option>
                                                    <option value="Bolts-Run">Bolts Run</option>
                                                </select> */}
                                                {errors.category && <p><span style={{ color: "red" }}>This field is mandatory.</span> <span style={{ color: "#f39c12" }}>Make sure your age is less than 21 to be eligible</span>  </p>}
                                            </div>
                                        </div>
                                        {category === 'Champs-Run' && (
                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    <label htmlFor='parentName'>Accompanying parent name <span style={{ color: "red" }}>*</span></label>
                                                    <input {...register("parentName", { required: true })} className="form-control" type="text" name="parentName" id="parentName" />
                                                    {errors.parentName && <p style={{ color: "red" }}>This field is mandatory</p>}
                                                </div>
                                            </div>
                                        )}
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
                                                    <option value="24">24</option>
                                                    <option value="26">26</option>
                                                    <option value="28">28</option>
                                                    <option value="30">30</option>
                                                    <option value="32">32</option>
                                                    <option value="34">34</option>
                                                    <option value="36">36</option>
                                                    <option value="38">38</option>
                                                    <option value="40">40</option>
                                                    <option value="42">42</option>
                                                    <option value="44">44</option>
                                                    <option value="46">46</option>
                                                </select>
                                                {errors.TshirtSize && <p style={{ color: "red" }}>This field is mandatory</p>}
                                            </div>
                                        </div>
                                        <div onClick={() => setOpenTshirtGuide(true)} className="col-md-6" style={{ display: 'flex', alignItems: "flex-end", textDecoration: "underline", cursor: "pointer" }}>
                                            T-shirt size guide
                                        </div>
                                        <Dialog open={openTshirtGuide} onClose={() => setOpenTshirtGuide(false)} >
                                            <img src={tShirtGuide} alt="RFH Tshirt Guide" />
                                        </Dialog>
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
                                        {/* Dropdown for quantity if Yes is selected */}
                                        {watch('additionalTshirt') === 'Yes' && (
                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    <label htmlFor="additionalTshirtQuantity">Quantity <span style={{ color: "red" }}>*</span></label>
                                                    <select {...register("additionalTshirtQuantity", { required: false })} id="additionalTshirtQuantity" className="form-select" aria-label="additionalTshirtQuantity">
                                                        <option value="">select</option>
                                                        <option value="1">1</option>
                                                        <option value="2">2</option>
                                                        <option value="3">3</option>
                                                        <option value="4">4</option>
                                                        <option value="5">5</option>
                                                        <option value="6">6</option>
                                                    </select>
                                                    {errors.additionalTshirtQuantity && <p style={{ color: "red" }}>This field is mandatory</p>}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* New row for T-shirt sizes if additional T-shirts are selected */}
                                    {watch('additionalTshirt') === 'Yes' && (
                                        <div className="row">
                                            <div className="col-md-12">
                                                <div className="form-group">
                                                    <label htmlFor="additionalTshirtSize">Please write T-Shirt Sizes for Additional T-shirts with comma seperation <span style={{ color: "red" }}>*</span></label>
                                                    <textarea {...register("additionalTshirtSize", { required: false })} id="additionalTshirtSize" className="form-control" aria-label="Additional T-shirt Size"></textarea>

                                                    {errors.additionalTshirtSize && <p style={{ color: "red" }}>This field is mandatory</p>}
                                                </div>
                                            </div>
                                        </div>
                                    )}

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
                                            defaultValue="&#x2022; All registration are non-refundable, nontransferable and cannot be modified. 
                                            &#x2022; Provide us correct mobile number &amp; email address that you can assess regularly, as this will be our primary resources of contacting you during the run up to the event.
                                            &#x2022; By registering you agree that participating is an extreme sport and can be injures to body and health. You take full responsibility for participating in the RFH Juniors Run and do not hold the organizing committee of RFH 10K Run, Rupee for Humanity or other organizing person or entities responsible of any injury or accident. 
                                            &#x2022; For Champs run, parent/guardian holds complete responsbility for safery measurements of your own kids.  You take full responsibility for participating in the RFH Juniors Run and do not hold the organizing committee of RFH 10K Run, Rupee for Humanity or other organizing person or entities responsible of any injury or accident. 
                                            &#x2022; You also assume all risks associated with participating in this event including, but not limited to falls, contact with other participants, the effects of the weather, including high heat or humidity, traffic and the condition of the road, arson or terrorist threats and all others risks associated with public event. Atleast one parent/guardinan must accompany for kids participating in Champs run. You cannot carry the kid while running and if happens, you are not eligible for trophies but can complete the run and collect medal for the kids. RFH volunteers will monitor in the entire track and there words will be final on the event day.                 
                                            &#x2022; You agree that organizing committee, Rupee for Humanity and associated companies or entities that organize the run shall not be liable for any loss, damage, illness or injury that might occur as a result of participating in the event.
                                            &#x2022; You confirm that, in the event of adverse weather conditions, major incidents or threats on the day, the organizers reserve the right to stop/ cancel/ postpone the Event.
                                            &#x2022; You understand that confirmed registrations and merchandise order are non-refundable, non-transferable and cannot be modified. The organizers reserve the right to reject any application without providing reasons. Any amount collected from rejected applications alone will be refundable in full (excluding bank charges wherever applicable).
                                            &#x2022; The organizer will contact the participant only by email &amp; text msg. Any notice or message sent to the email or mobile number registered with the organizers shell be deemed as received by the participants.
                                            &#x2022; Please remember you are participating for fun + noble cause run. So do not rush or panic and enjoy every moment of the event."
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
                                        <td className="fs-6">Total Price </td>
                                        <td> <b>INR {totalPrice}/-</b>   </td>
                                    </tr>
                                </tbody>
                            </table>
                            <div style={{ display: "flex", justifyContent: "flex-end", gap: "16px" }}>
                                <button className="btn btn-secondary" onClick={handleEditClick}>Edit</button>
                                <button className="btn btn-primary" onClick={handlePaymentClick} disabled={disablePaymentButton} >Make Payment</button>
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
                                                    <td className="fs-6">T-shirt</td>
                                                    <td> INR {getValues("additionalTshirt") === "Yes" ? getValues("additionalTshirtQuantity") * ADDITIONAL_TSHIRT_PRICE : 0} </td>
                                                </tr>
                                                <tr>
                                                    <td className="fs-6">Donation</td>
                                                    <td> INR {getValues("donation") === "" ? 0 : getValues("donation")}</td>
                                                </tr>
                                                <tr>
                                                    <td className="fs-6">Total </td>
                                                    <td> {`INR ${totalPrice}`}  </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        <button onClick={handlePaymentClick} disabled={disablePaymentButton} type="button" className="w-100 btn btn-lg btn-primary">Make Payment</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </section>
                }

            </main>
        </div>
    )
}

export default EventForm2025
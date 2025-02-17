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
    name: "RFH SHE Run 2025",
    date: new Date("2025-05-25T23:59:00+05:30"),
    lastDate: new Date("2025-04-28T23:59:00+05:30"),
    time: "7:00 AM IST",
    venue: "https://www.google.com/maps/place/Bal+Bhavan+Auditorium/@12.9766439,77.5952091,17z/data=!3m1!4b1!4m6!3m5!1s0x3bae1671b1cd3b1f:0xb72fa25e5df4598d!8m2!3d12.9766439!4d77.597784!16s%2Fg%2F11csqwx6mm?entry=ttu&g_ep=EgoyMDI1MDIxMi4wIKXMDSoASAFQAw%3D%3D",
    venueName: "Cubbon Park, Bengaluru",
}


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
    const category = watch('category');

    const DISCOUNT_PRICE = 800
    const PRICE = 800
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
        setValue("marathonName", "RFH SHE run 2025")
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
            localStorage.setItem('cause', "RFH SHE run 2025");
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
                <title>RFH SHE run 2025 | Rupee For Humanity</title>
            </Helmet>
            <Header />
            <main>
                {(submitted === false) ?
                    <section id="registration-form">
                        <div className="container-md">
                            <h1 className="h1" style={{ fontWeight: "800" }}>
                                RFH SHE run 2025 <br />
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

                            <p>
                                "Rupee For Humanity" is thrilled to present "RFH SHE Run 2025"—a celebration of passion, purpose, and the power of giving! After the resounding success of seven incredible running events in Bengaluru, we are now gearing up for an even more meaningful journey.                            </p>
                            <p>
                                This isn’t just a run; it’s a movement! RFH SHE Run 2025 is a women’s run dedicated to empowerment, equality, and the spirit of sisterhood. Whether you're running for yourself, for the women who inspire you, or for the next generation, every step you take lights the path of education for underprivileged and deserving children.
                            </p>
                            <p>What could be more fulfilling than running for a cause that transforms lives?
                            </p>
                            <p>Join us, celebrate the strength of women, and be a part of something truly extraordinary! </p>

                            {/* {seeMore === true && expandedText()} */}
                            {/* <div style={{ paddingBottom: "16px" }}>
                                <span style={{ textDecoration: "underline", cursor: "pointer", color: "lightblue" }} onClick={handleSeeMore}>See {seeMore ? "less" : "more"} </span>
                            </div> */}

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
                                </div>

                                <div className="mt-4">
                                    <p>
                                        For any more information about sponsorship / registration / queries, you can reach out to the below organizers:
                                    </p>
                                    <ul>
                                        <li>Deepthi @ <a href="tel:+91-9986387435" style={{ color: "#f39c12" }}>+91-99863 87435</a></li>
                                        <li>Sripada @ <a href="tel:+91-9964046022" style={{ color: "#f39c12" }}>+91-99640 46022</a></li>
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
                                            defaultValue="&#x2022; All registrations are non-refundable, non-transferable, and cannot be modified. 
                                            &#x2022; Please provide a valid mobile number &amp; email address that you check regularly, as these will be our primary means of communication leading up to the event.
                                            &#x2022; By registering, you acknowledge that participating in this event involves physical exertion and potential health risks. You take full responsibility for participating in the RFH SHE Run 2025 and do not hold the organizing committee, Rupee For Humanity, or any associated persons or entities liable for any injury, accident, or health-related issues.
                                            &#x2022; You also assume all risks associated with participation, including but not limited to falls, contact with other participants, weather conditions (such as high heat or humidity), traffic, road conditions, and unforeseen incidents (such as arson or security threats).
                                            &#x2022; RFH volunteers will be present throughout the course to ensure safety and fairness. Their decisions will be final on event day.
                                            &#x2022; You agree that the organizing committee, Rupee For Humanity, and associated companies/entities shall not be liable for any loss, damage, illness, or injury resulting from your participation in the event.
                                            &#x2022; In case of adverse weather conditions, security concerns, or any unforeseen incidents, the organizers reserve the right to cancel, postpone, or stop the event for safety reasons.
                                            &#x2022; Confirmed registrations and merchandise orders are non-refundable, non-transferable, and cannot be modified. However, if an application is rejected, the collected amount will be refunded in full (excluding bank charges, if applicable).
                                            &#x2022; The organizers will only contact participants via email &amp; text message. Any notice sent to the registered email or mobile number shall be deemed as received by the participant.
                                            &#x2022; Please remember: RFH SHE Run 2025 is a celebration of women's strength, empowerment, and giving back to society. Enjoy the run, support fellow participants, and embrace the joy of running for a cause!"
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

export default RfhSheRun2025
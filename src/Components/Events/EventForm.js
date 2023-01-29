import React, { useCallback, useEffect, useState } from 'react'
import Header from '../Header'
import { useForm } from "react-hook-form";
import { countries, indianStates } from '../../Constants/constants';
import Dropzone from 'react-dropzone'
import EventTwoToneIcon from '@mui/icons-material/EventTwoTone';
import AccessTimeTwoToneIcon from '@mui/icons-material/AccessTimeTwoTone';
import PlaceTwoToneIcon from '@mui/icons-material/PlaceTwoTone';
import MilitaryTechTwoToneIcon from '@mui/icons-material/MilitaryTechTwoTone';
import { Button } from '@mui/material';

function EventForm() {
    const { register, handleSubmit, getValues, setValue, formState: { errors } } = useForm();
    const [submitted, setSubmitted] = useState(false)
    const [totalPrice, setTotalPrice] = useState(0)
    const [needTee, setNeedTee] = useState("no")
    const [willPickUp, setWillPickUp] = useState("no")
    const [selectedCity, setSelectedCity] = useState("others")
    const [seeMore, setSeeMore] = useState(false)

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

    console.log("submitted ", submitted)
    const onSubmit = (data) => {
        console.log(data);
        setSubmitted(!submitted)
        let price = 250;
        if (getValues("needTShirt") === "yes") {
            price = 210 + price
        }
        if (getValues("selfPickUp") === "no") {
            price = 150 + price
        }
        setTotalPrice(price)
    }

    const handleSelfPickupChange = (e) => {
        console.log("selfPickUp e.target.value ", e.target.value)
        setWillPickUp(e.target.value)
    }

    // "Bengaluru">Bengaluru</option>
    //                                                 <option value="Hyderabad">Hyderabad</option>
    //                                                 <option value="Chennai"

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
                    As a part of this initiative, we conducted ‘RFH 10K Run - Run for Literacy’ last 5 years at Cubbon
                    park, Bangalore and from the contributions of kind hearts like you, we were able to sponsor
                    education for ~180 underprivileged kids from various places including stationary, books and school
                    uniforms.
                </p>
                <p>
                    We are proud to host the event again this year “RFH 10K Run - Run for Literacy 2023” – this time its
                    virtual run but the excitement and cause is solid as always.
                </p>
            </div>
        )
    }

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    return (
        <div style={{ backgroundColor: "#040002", color: "lightgray", minHeight: "100vh" }}>
            <Header />
            <main>
                {(submitted === false) ?
                    <section id="registration-form">
                        <div className="container-md">
                            <h1 className="h1">
                                RFH 10K Run - Run for Literacy 2023
                            </h1>
                            <div className="row">
                                <div className="col-md-4">
                                    <span> <strong><EventTwoToneIcon /> Date:</strong>  April 29th & 30th  (Saturday & Sunday)  </span>
                                </div>
                                <div className="col-md-4">
                                    <span><strong> <AccessTimeTwoToneIcon /> Time:</strong>  Run anytime during the above dates</span>
                                </div>
                                <div className="col-md-4">
                                    <span><strong> <PlaceTwoToneIcon /> Venue:</strong>  Run anywhere as per your comfort</span>
                                </div>
                            </div>

                            <span> <MilitaryTechTwoToneIcon /> Virtual Marathon consisting of various catagories for the run.</span><br />

                            <span ><small style={{ color: "red" }}> <strong>Last Date to Register: March 25th</strong> </small></span><br />
                            <br />

                            <p>
                                Rupee For Humanity (RFH) is an online NGO registered with the Government, started by a bunch of
                                engineers having passion to work for the country and its development. It is a non-profit
                                organization aimed at eradicating illiteracy from the roots and making India rise up high in the
                                ladder of developed nations.
                            </p>
                            <p>
                                RFH provides :
                                <ul>
                                    <li>Right to education for every child</li>
                                    <li>Food, medical care and healthy atmosphere for the poor and needy.</li>
                                </ul>
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
                                            <th className="fs-6" scope="col">Run Category</th>
                                            <th scope="col">Racer Kit</th>
                                            <th scope="col">Price</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className="fs-6">3k - Fun Run</td>
                                            <td>E-Certificate <span style={{ color: "red" }}>*</span> </td>
                                            <td>INR 250</td>
                                        </tr>
                                        <tr>
                                            <td className="fs-6">5k - Super Run</td>
                                            <td>E-Certificate <span style={{ color: "red" }}>*</span> </td>
                                            <td>INR 250</td>
                                        </tr>
                                        <tr>
                                            <td className="fs-6">10k - Challenge Run</td>
                                            <td>E-Certificate <span style={{ color: "red" }}>*</span> </td>
                                            <td>INR 250</td>
                                        </tr>
                                    </tbody>
                                </table>
                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                    <div>
                                        {/* <b>T-shirt</b> : INR 210/- <br />
                                        <b>Courier charges anywhere in India</b> : INR 150/- <br />
                                        <b>Self Pickup available only in Bengaluru, Hyderabad, Chennai</b> <br />
                                        <small>Above items are optional and are not applicable for runners outside India</small><br /> */}
                                        <small style={{ color: "red" }}>* Upon upload of the screenshot of your running activity in portal</small>
                                    </div>
                                </div>
                                <div className="row mt-4">
                                    <div className="col-md-6">
                                        <table className="table" style={{ backgroundColor: "#040002", color: "lightgray" }}>
                                            <tbody>
                                                <tr>
                                                    <td>T-Shirt Price</td>
                                                    <td>INR 210/-</td>
                                                </tr>
                                                <tr>
                                                    <td>Courier charges anywere in India</td>
                                                    <td>INR 150/-</td>
                                                </tr>
                                                <tr>
                                                    <td>Self Pickup available only in Bengaluru, Hyderabad, Chennai</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        <small>Above items are optional and are not applicable for runners outside India</small><br />
                                    </div>
                                </div>

                            </div>

                            <div className="regestration-form">

                                <form onSubmit={handleSubmit(onSubmit)}>
                                    <h2 className="form-header">Registration Form</h2>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label htmlFor="first">Select Category<span style={{ color: "red" }}>*</span></label>
                                                <select {...register("category", { required: true })} className="form-select" aria-label="Default select example">
                                                    <option value="">select</option>
                                                    <option value="3k - Fun Run">3k - Fun Run</option>
                                                    <option value="5k - Super Run">5k - Super Run</option>
                                                    <option value="10k - Challenge Run">10k - Challenge Run</option>
                                                </select>
                                                {errors.category && <p style={{ color: "red" }}>This field is mandatory</p>}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6">
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
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label htmlFor="tee-size">T-Shirt Size {needTee === "no" ? <span></span> : <span style={{ color: "red" }}>*</span>}</label>
                                                <select disabled={needTee === "no"} {...register("TshirtSize", { required: needTee === "no" ? false : true })} id="tee-size" className="form-select" aria-label="T-Shirt Size">
                                                    <option value="">select</option>
                                                    <option value="XSmall">X-Small</option>
                                                    <option value="Small">Small</option>
                                                    <option value="Medium">Medium</option>
                                                    <option value="Large">Large</option>
                                                    <option value="X-Large">X-Large</option>
                                                    <option value="XX-Large">XX-Large</option>
                                                </select>
                                                {errors.TshirtSize && <p style={{ color: "red" }}>This field is mandatory</p>}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
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
                                    </div>
                                    <div className="row">
                                        <div className="col-md-12">
                                            <div className="form-group">
                                                <label htmlFor="fullName">Full Name <span style={{ color: "red" }}>*</span></label>
                                                <input {...register("fullName", { required: true })} type="text" className="form-control" placeholder="" id="fullName" />
                                                {errors.fullName && <p style={{ color: "red" }}>This field is mandatory</p>}
                                            </div>
                                        </div>

                                        {/* <div className="col-md-6">
                                            <div className="form-group">
                                                <label htmlFor="last">Last Name <span style={{ color: "red" }}>*</span></label>
                                                <input {...register("lastName", { required: true })} type="text" className="form-control" placeholder="" id="last" />
                                                {errors.lastName && <p style={{ color: "red" }}>This field is mandatory</p>}
                                            </div>
                                        </div> */}

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
                                        <div className="col-md-4">
                                            <div className="form-group">
                                                <label htmlFor="date">Date of Birth <span style={{ color: "red" }}>*</span></label>
                                                <input {...register("dob", { required: true })} type="date" className="form-control" id="date" placeholder="date" />
                                                {errors.dob && <p style={{ color: "red" }}>This field is mandatory</p>}
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="form-group">
                                                <label htmlFor="bloodGroup">Blood Group <span style={{ color: "red" }}>*</span></label>
                                                <input {...register("bloodGroup", { required: true })} type="text" className="form-control" id="bloodGroup" placeholder="Blood Group" />
                                                {errors.dob && <p style={{ color: "red" }}>This field is mandatory</p>}
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
                                                <label htmlFor="mobile">Mobile No. <span style={{ color: "red" }}>*</span></label>
                                                <input {...register("mobNo", { required: true })} className="form-control" type="tel" id="mobile" />
                                                {errors.mobNo && <p style={{ color: "red" }}>This field is mandatory</p>}
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
                                    <br />
                                    <hr />
                                    <br />

                                    <h2 className="form-header">Other information</h2>

                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label htmlFor="emergency-number">Emergency Contact Number <span style={{ color: "red" }}>*</span></label>
                                                <input {...register("emergencyNo", { required: true })} className="form-control" type="text"
                                                    id="emergency-number" />
                                                {errors.emergencyNo && <p style={{ color: "red" }}>This field is mandatory</p>}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="form-group">
                                            <label htmlFor="illness">Please describe if you have any health issues <span style={{ color: "red" }}>*</span></label>
                                            <textarea {...register("illness", { required: true })} className="form-control" id="illness" rows="3" />
                                            {errors.illness && <p style={{ color: "red" }}>This field is mandatory</p>}
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-12">
                                            <div className="form-group">
                                                <label htmlFor="reference">How did you come to know about this event? <span style={{ color: "red" }}>*</span></label>
                                                <input {...register("reference", { required: true })} className="form-control" type="text" id="reference" />
                                                {errors.reference && <p style={{ color: "red" }}>This field is mandatory</p>}
                                            </div>
                                        </div>
                                    </div>
                                    <br />
                                    <hr />
                                    <br />
                                    <div className="row">
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
                                    </div>
                                    <br />
                                    <hr />
                                    <br />
                                    <h2 className="form-header">Terms and Conditions</h2>
                                    <br />
                                    <div className="form-group">
                                        <textarea
                                            defaultValue="&#x2022; Please choose category carefully, confirmed registration are non-refundable, nontransferable and cannot be modified.
                                        &#x2022; Provide us correct mobile number &amp; email address that you can assess regularly, as this will be our primary resources of contacting you during the run up to the event.
                                        &#x2022; By registering you agree that running 10K is an extreme sport and can be injures to body and health. You take full responsibility for participating in the RFH 10k Run and do not hold the organizing committee of RFH 10K Run, Rupee for Humanity or other organizing person or entities responsible of any injury or accident.
                                        &#x2022; You also assume all risks associated with participating in this event including, but not limited to falls, contact with other participants, the effects of the weather, including high heat or humidity, traffic and the condition of the road, arson or terrorist threats and all others risks associated with public event.
                                        &#x2022; You agree that organizing committee, Rupee for Humanity and associated companies or entities that organize the run shall not be liable for any loss, damage, illness or injury that might occur as a result of participating in the event.
                                        &#x2022; You confirm that, in the event of adverse weather conditions, major incidents or threats on the day, the organizers reserve the right to stop/ cancel/ postpone the Event.
                                        &#x2022; You understand that confirmed registrations and merchandise order are non-refundable, non-transferable and cannot be modified. The organizers reserve the right to reject any application without providing reasons. Any amount collected from rejected applications alone will be refundable in full (excluding bank charges wherever applicable).
                                        &#x2022; The organizer will contact the participant only by email &amp; text msg. Any notice or msg sent to the email or mobile number registered with the organizers shell be deemed as received by the participants."
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
                                        <button className="btn btn-dark" type="submit">Submit</button>
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
                                        <td className="fs-6">Need T-shirt </td>
                                        <td> {getValues("needTShirt")}  </td>
                                    </tr>
                                    <tr>
                                        <td className="fs-6">T-shirt Size </td>
                                        <td> {getValues("TshirtSize")}  </td>
                                    </tr>
                                    <tr>
                                        <td className="fs-6">Total Cost </td>
                                        <td> <b>INR {totalPrice}/-</b>   </td>
                                    </tr>
                                </tbody>
                            </table>
                            <div style={{ display: "flex", justifyContent: "flex-end", gap: "16px" }}>
                                <button className="btn btn-secondary" onClick={handleEditClick}>Edit</button>
                                <button className="btn btn-dark">Make Payment</button>
                            </div>

                        </div>

                        <div>
                            <div className="row m-3">
                                <div className="card bg-dark mb-4 rounded-3 shadow-sm">
                                    <div className="card-header py-3 text-center">
                                        <h4 className="my-0 fw-normal">Cost Breakup</h4>
                                    </div>
                                    <div className="card-body">
                                        <table className="table" style={{ color: "lightgray" }}>

                                            <tbody>
                                                <tr>
                                                    <td> {getValues("category")} </td>
                                                    <td className="fs-6"> INR 250</td>
                                                </tr>
                                                <tr>
                                                    <td className="fs-6">T-shirt</td>
                                                    <td> {getValues("needTShirt") === "yes" ? "INR 210" : 0} </td>
                                                </tr>
                                                <tr>
                                                    <td className="fs-6">Courier charges</td>
                                                    <td>{getValues("selfPickUp") !== "no" ? 0 : " INR 150"}</td>
                                                </tr>
                                                <tr>
                                                    <td className="fs-6">Total </td>
                                                    <td> {`INR ${totalPrice}`}  </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        <button type="button" className="w-100 btn btn-dark btn-lg btn-outline-primary">Make Payment</button>
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

export default EventForm
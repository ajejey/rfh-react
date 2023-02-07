import { Checkbox, FormControl, ListItemText, MenuItem, Select } from '@mui/material';
import React, { useState } from 'react'
import Dropzone from 'react-dropzone';
import { useForm } from 'react-hook-form';
import Header from './Header'

function VolunteerForm() {
    const { register, handleSubmit, getValues, setValue, formState: { errors } } = useForm();
    const [submitted, setSubmitted] = useState(false)
    const [totalPrice, setTotalPrice] = useState(0)
    const [needTee, setNeedTee] = useState("no")
    const [willPickUp, setWillPickUp] = useState("no")
    const [selectedCity, setSelectedCity] = useState("others")
    const [seeMore, setSeeMore] = useState(false)
    const [personName, setPersonName] = useState([])
    const [bloodDonor, setBloodDonor] = useState("no")
    const [regularAmountDonor, setRegularAmountDonor] = useState("no")

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

    const handleBloodDonor = (e) => {
        setBloodDonor(e.target.value)
        if (e.target.value === "no") {
            setValue("bloodGroup", "")
        }
    }

    const handleRegularAmountDonor = (e) => {
        setRegularAmountDonor(e.target.value)
        if (e.target.value === "no") {
            setValue("donationAmount", "")
        }

    }
    const handleNeedTee = () => {

    }

    const onSubmit = (data) => {
        console.log(data);

    }

    return (
        <div className='volunteer-container'>
            <Header />
            <div className="container-md volunteer-form">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <h2>Registration Form</h2>

                    {/* <div className="row">
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
                    </div> */}

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
                        <div className="col-md-6">
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
                        <div className="col-md-6">
                            <div className="form-group">
                                <label htmlFor="date">Date of Birth <span style={{ color: "red" }}>*</span></label>
                                <input {...register("dob", { required: true })} type="date" className="form-control" id="date" placeholder="date" />
                                {errors.dob && <p style={{ color: "red" }}>This field is mandatory</p>}
                            </div>
                        </div>


                    </div>

                    <div className="row">
                        <div className="form-group">
                            <label htmlFor="address">Your Current Location {willPickUp === "no" ? <span style={{ color: "red" }}>*</span> : <span></span>} </label>
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

                    {/* <h2 className="form-header">Other information</h2> */}

                    <div className="row">
                        <div className="col-md-6">
                            <div className="form-group">
                                <label htmlFor="volunteerCatagory">What Catagory do you belong to? <span style={{ color: "red" }}>*</span></label>
                                <select {...register("volunteerCatagory", { required: true, onChange: (e) => handleNeedTee(e) })} id="volunteerCatagory" className="form-select" aria-label="city select">
                                    <option value="">select</option>
                                    <option value="Support remotely in all possibilities">Support remotely in all possibilities</option>
                                    <option value="Attend and organize events in Bengaluru and other cities.">Support remotely in all possibilities</option>

                                </select>
                                {errors.volunteerCatagory && <p style={{ color: "red" }}>This field is mandatory</p>}
                            </div>
                        </div>
                    </div>
                    <br />
                    <div className="row">
                        <div className="form-group">
                            <label htmlFor="supportAreas">What are the areas you would like to support? <span style={{ color: "red" }}>*</span></label>
                            <br />
                            <input {...register("supportAreas", { required: true })} type="checkbox" name='supportAreas' value="Organizing the Events" id="newsletter" /> Organizing the Events.
                            <br />
                            <input {...register("supportAreas", { required: true })} type="checkbox" name='supportAreas' value="Promotion activities" id="newsletter" /> Promotion activities.
                            <br />
                            <input {...register("supportAreas", { required: true })} type="checkbox" name='supportAreas' value="Content creation" id="newsletter" /> Content creation.
                            <br />
                            <input {...register("supportAreas", { required: true })} type="checkbox" name='supportAreas' value="Image designing" id="newsletter" /> Image designing.
                            <br />
                            <input {...register("supportAreas", { required: true })} type="checkbox" name='supportAreas' value="Maintaining the expenses of the Event and perform Auditing" id="newsletter" /> Maintaining the expenses of the Event and perform Auditing.
                            <br />
                            <input {...register("supportAreas", { required: true })} type="checkbox" name='supportAreas' value="Find sponsors" id="newsletter" /> Find sponsors.
                            <br />
                            <input {...register("supportAreas", { required: true })} type="checkbox" name='supportAreas' value="Collaboration with CSR groups/other groups" id="newsletter" /> Collaboration with CSR groups/other groups.
                            <br />
                            <input {...register("supportAreas", { required: true })} type="checkbox" name='supportAreas' value="Ready to perform field work for the event" id="newsletter" /> Ready to perform field work for the event.
                            <br />
                            <input {...register("supportAreas", { required: true })} type="checkbox" name='supportAreas' value="Find the needy people with all required background information" id="newsletter" /> Find the needy people with all required background information.
                            <br />
                            <input {...register("supportAreas", { required: true })} type="checkbox" name='supportAreas' value="Be a part of event and take any responsibility" id="newsletter" /> Be a part of event and take any responsibility.

                            {errors.supportAreas && <p style={{ color: "red" }}>This field is mandatory</p>}
                        </div>
                    </div>
                    <br />
                    <div className="row">
                        <div className="col-md-6">
                            <div className="form-group">
                                <label htmlFor="dedicationTime">On an average, how much time can you dedicate for RFH in a year? <span style={{ color: "red" }}>*</span></label>
                                <select {...register("dedicationTime", { required: true, onChange: (e) => handleNeedTee(e) })} id="dedicationTime" className="form-select" aria-label="city select">
                                    <option value="">select</option>
                                    <option value="2-5 hours a week">2-5 hours a week</option>
                                    <option value="5-8 hours a week">5-8 hours a week</option>
                                    <option value="8-12 hours a week">8-12 hours a week</option>
                                    <option value="12-20 hours a week">12-20 hours a week.</option>
                                    <option value="20 hours a week">20 hours a week.</option>
                                    <option value="Anytime requested by RFH">Anytime requested by RFH</option>
                                </select>
                                {errors.dedicationTime && <p style={{ color: "red" }}>This field is mandatory</p>}
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group">
                                <label htmlFor="currentOccupation">What is your current occupation?<span style={{ color: "red" }}>*</span></label>
                                <select {...register("currentOccupation", { required: true, onChange: (e) => handleNeedTee(e) })} id="currentOccupation" className="form-select" aria-label="city select">
                                    <option value="">select</option>
                                    <option value="Studying">Studying</option>
                                    <option value="Housemaker">Housemaker</option>
                                    <option value="Working Professional">Working Professional</option>
                                    <option value="Others">Others.</option>
                                </select>
                                {errors.currentOccupation && <p style={{ color: "red" }}>This field is mandatory</p>}
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6">
                            <div className="form-group">
                                <label htmlFor="bloodDonor">Would you like to sign-up as Blood donor?<span style={{ color: "red" }}>*</span></label>
                                <select {...register("bloodDonor", { required: true, onChange: (e) => handleBloodDonor(e) })} id="bloodDonor" className="form-select" aria-label="city select">
                                    <option value="">select</option>
                                    <option value="yes">yes</option>
                                    <option value="no">no</option>
                                </select>
                                {errors.bloodDonor && <p style={{ color: "red" }}>This field is mandatory</p>}
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group">
                                <label htmlFor="bloodGroup">If above selection is yes, please share your Blood group? {bloodDonor === "yes" ? <span style={{ color: "red" }}>*</span> : <span> </span>} </label>
                                <input disabled={bloodDonor === "no" ? true : false} {...register("bloodGroup", { required: bloodDonor === "no" ? false : true })} type="text" className="form-control" id="bloodGroup" placeholder="Blood Group" />
                                {errors.bloodGroup && <p style={{ color: "red" }}>This field is mandatory</p>}
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6">
                            <div className="form-group">
                                <label htmlFor="regularAmountDonor">Would you like to donate small amount to RFH every month/year?<span style={{ color: "red" }}>*</span></label>
                                <select {...register("regularAmountDonor", { required: true, onChange: (e) => handleRegularAmountDonor(e) })} id="regularAmountDonor" className="form-select" aria-label="city select">
                                    <option value="">select</option>
                                    <option value="yes">yes</option>
                                    <option value="no">no</option>
                                </select>
                                {errors.regularAmountDonor && <p style={{ color: "red" }}>This field is mandatory</p>}
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group">
                                <label htmlFor="donationAmount">If above selection is yes, what is the amount you would like to sign up for? {regularAmountDonor === "yes" ? <span style={{ color: "red" }}>*</span> : <span> </span>} </label>
                                <input disabled={regularAmountDonor === "no" ? true : false} {...register("donationAmount", { required: regularAmountDonor === 'yes' ? true : false })} type="text" className="form-control" id="donationAmount" />
                                {errors.donationAmount && <p style={{ color: "red" }}>This field is mandatory</p>}
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12">
                            <div className="form-group">
                                <label htmlFor="volunteeringReason">Why do you wish to be a volunteer?  <span style={{ color: "red" }}>*</span> </label>
                                <textarea {...register("volunteeringReason", { required: willPickUp === "yes" ? false : true })} className="form-control" id="volunteeringReason" rows="3" />
                                {errors.volunteeringReason && <p style={{ color: "red" }}>This field is mandatory</p>}
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12">
                            <div className="form-group">
                                <label htmlFor="aquisitionSource">How did you come to know about RFH ?  <span style={{ color: "red" }}>*</span> </label>
                                <textarea {...register("aquisitionSource", { required: willPickUp === "yes" ? false : true })} className="form-control" id="aquisitionSource" rows="3" />
                                {errors.aquisitionSource && <p style={{ color: "red" }}>This field is mandatory</p>}
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12">
                            <div className="form-group">
                                <label htmlFor="volunteeredForNGOorCSR">Have you volunteered before for any NGO or CSR activity?   <span style={{ color: "red" }}>*</span> </label> <br />
                                <small>If yes, please share details. Mention your roles and responsibilities, what you did, where
                                    you did</small>
                                <textarea {...register("volunteeredForNGOorCSR", { required: willPickUp === "yes" ? false : true })} className="form-control" id="volunteeredForNGOorCSR" rows="3" />
                                {errors.volunteeredForNGOorCSR && <p style={{ color: "red" }}>This field is mandatory</p>}
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6">
                            <div className="form-group">
                                <label htmlFor="tee-size">T-Shirt Size  <span style={{ color: "red" }}>*</span></label>
                                <select {...register("TshirtSize", { required: true })} id="tee-size" className="form-select" aria-label="T-Shirt Size">
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
                    <h2>By Signing Up: </h2>
                    {/* <div className="form-group">
                        <textarea
                            defaultValue="You promise and commit your time to “Rupee For Humanity” for next 1 year. 
                            You will not mis-use the organization name for any of the personal benefits.
                            Respect every individual during the event and maintain the decorum of the group.
                            Every volunteer would get authorized certificate, T-shirt, momentous etc. based on the contribution
                            towards society."
                            className="form-control"
                            style={{ fontSize: "0.8rem" }}
                            id="address"
                            rows="6"
                            readOnly />
                    </div> */}
                    <br />
                    <p style={{ fontWeight: "700" }}>
                        You promise and commit your time to “Rupee For Humanity” for next 1 year.
                        You will not mis-use the organization name for any of the personal benefits.
                        Respect every individual during the event and maintain the decorum of the group.
                        Every volunteer would get authorized certificate, T-shirt, momentous etc. based on the contribution
                        towards society.
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
    )
}

export default VolunteerForm
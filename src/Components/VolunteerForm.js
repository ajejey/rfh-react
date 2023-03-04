import { Checkbox, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, ListItemText, MenuItem, Select } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react'
import Dropzone from 'react-dropzone';
import { useForm } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Header from './Header'
import ReCAPTCHA from "react-google-recaptcha";
import Login from './AuthComponent/Login';


function VolunteerForm() {
    const { register, handleSubmit, getValues, setValue, reset, formState: { errors } } = useForm();
    const navigate = useNavigate()
    const captchaRef = useRef(null)
    let [searchParams, setSearchParams] = useSearchParams();
    const [submitted, setSubmitted] = useState(false)
    const [formValues, setFormValues] = useState({})
    const [bloodDonor, setBloodDonor] = useState("no")
    const [regularAmountDonor, setRegularAmountDonor] = useState("no")
    const [loading, setLoading] = useState(false)
    const [dataSavedInDB, setDataSavedInDB] = useState(false)
    const [dbMessage, setDbMessage] = useState({ message: "", color: "" })
    const [loginDialogOpen, setLoginDialogOpen] = useState(false)
    const [authenticated, setAuthenticated] = useState(false);
    const [user, setUser] = useState({});
    const [authToken, setAuthToken] = useState("")
    const [submitDialogOpen, setSubmitDialogOpen] = useState(false)

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

    const handleEditClick = () => {
        setSubmitted(!submitted)
        setSearchParams({ form: "form" })
    }

    const handleHomeClick = () => {
        navigate('/')
    }

    const handleLoginDialogClose = () => {
        setLoginDialogOpen(!loginDialogOpen)
    }



    const onSubmit = async (formData, submitted) => {
        formData.email = formData.email.trim();
        formData.mobNo = formData.mobNo.trim();

        console.log(formData);
        setSearchParams({ form: "final-submit" })
        localStorage.setItem('volunteerDetails', JSON.stringify(formData));
        setFormValues(formData)
        setSubmitted(true)


    }

    const handleFinalSubmit = async () => {
        console.log("formValues ", formValues)
        let formValuesCopy = JSON.parse(JSON.stringify(formValues))
        // formValuesCopy = { ...formValuesCopy, Uid: user.uid, role: "volunteer" }
        formValuesCopy = { ...formValuesCopy, role: "volunteer" }

        setLoading(true)
        const token = captchaRef.current.getValue();
        // console.log("token ", token)
        // captchaRef.current.reset();


        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/check-human`, {
                method: "POST",
                timeout: 1200000,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ token: token }),
            });
            const data = await response.json();
            console.log("captcha response ", data)

            if (data?.data?.success === true) {
                try {
                    const response = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/volunteer-form-submit`, {
                        method: "POST",
                        timeout: 1200000,
                        headers: {
                            "Content-Type": "application/json",
                            'Authorization': `Bearer ${authToken}`
                        },
                        body: JSON.stringify(formValuesCopy),
                    });
                    const data = await response.json();
                    console.log("data.message", data, data.message);
                    if (data?.message === 'Unauthorized') {
                        setLoginDialogOpen(!loginDialogOpen)
                        setLoading(false)
                    } else if (data.message.includes("mobNo:") || data.message.includes("email:")) {
                        setDbMessage({ message: "Volunteer with this email or phone number already exists!", color: "red" })
                        setDataSavedInDB(false)
                        setLoading(false)
                        return
                        // captchaRef.current.reset();
                    } else {
                        setDbMessage({ message: data.message, color: data.color })
                        setLoading(false)
                        setDataSavedInDB(true)
                        localStorage.removeItem('volunteerDetails');
                        // setSubmitDialogOpen(true)
                        // captchaRef.current.reset();
                    }

                    // setDbMessage({ message: data.message, color: data.color })
                    // setLoading(false)
                    // setDataSavedInDB(true)


                } catch (error) {
                    console.error(error);
                    if (error?.message?.includes("mobNo:") || error?.message?.includes("email:")) {
                        setDbMessage({ message: "Volunteer with this email or phone number already exists!", color: "red" })
                    } else {
                        setDbMessage({ message: error.message, color: 'red' })
                    }
                    // captchaRef.current.reset();
                    setDataSavedInDB(false)
                    setLoading(false)
                }
            } else {
                throw { message: "Looks like you are not human!" }
            }
        } catch (error) {
            console.error(error);
            setDataSavedInDB(false)
            setLoading(false)
            if (error?.message?.includes("mobNo:") || error?.message?.includes("email:")) {
                setDbMessage({ message: "Volunteer with this email or phone number already exists!", color: "red" })
            } else {
                setDbMessage({ message: error.message, color: 'red' })
            }

        }



    }

    // useEffect(() => {
    //     if (authenticated === true) {
    //         setLoginDialogOpen(false)
    //     }
    // }, [authenticated])

    useEffect(() => {
        if (localStorage.getItem('volunteerDetails')) {
            console.log("details available")
            reset(JSON.parse(localStorage.getItem('volunteerDetails')))
        } else {
            setSearchParams({ form: "form" })
        }
    }, [])

    return (
        <div className='volunteer-container'>
            <Header />
            {(Object.fromEntries([...searchParams])?.form !== 'final-submit') &&
                <div className="container-md volunteer-form">
                    <form onSubmit={handleSubmit((formData) => onSubmit(formData, false))}>
                        <h2>Volunteering Registration Form</h2>
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
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label htmlFor="gender">Gender <span style={{ color: "red" }}>*</span></label>
                                    <select {...register("gender", { required: true })} id="gender" className="form-select" aria-label="Gender Select">
                                        <option value="">select</option>
                                        <option value="female">Female</option>
                                        <option value="male">Male</option>
                                        <option value="transGender">Transgender</option>
                                        <option value="nonBinary">Non-binary/Non-conforming</option>
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
                                <label htmlFor="address">Residing City <span style={{ color: "red" }}>*</span> </label>
                                <textarea {...register("address", { required: true })} className="form-control" id="address" rows="3" />
                                {errors.address && <p style={{ color: "red" }}>This field is mandatory</p>}
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-4">
                                <div className="form-group">
                                    <label htmlFor="mobile">Mobile No. <span style={{ color: "red" }}>*</span></label>
                                    <input {...register("mobNo", { required: true })} className="form-control" type="tel" id="mobile" />
                                    {/* <small>Format: +91-9887766554</small><br></br> */}
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
                        <div className="row">
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label htmlFor="volunteerCategory">What category do you belong to? <span style={{ color: "red" }}>*</span></label>
                                    <select {...register("volunteerCategory", { required: true })} id="volunteerCategory" className="form-select" aria-label="city select">
                                        <option value="">select</option>
                                        <option value="Support remotely in all possibilities">Support remotely in all possibilities</option>
                                        <option value="Attend and organize events in Bengaluru and other cities.">Attend and organize events in Bengaluru and other cities</option>

                                    </select>
                                    {errors.volunteerCategory && <p style={{ color: "red" }}>This field is mandatory</p>}
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
                                    <select {...register("dedicationTime", { required: true })} id="dedicationTime" className="form-select" aria-label="city select">
                                        <option value="">select</option>
                                        <option value="2-5 hours a week">2-5 hours a week</option>
                                        <option value="5-8 hours a week">5-8 hours a week</option>
                                        <option value="8-12 hours a week">8-12 hours a week</option>
                                        <option value="12-20 hours a week">12-20 hours a week</option>
                                        <option value="20 hours a week">More than 20 hours a week</option>
                                        <option value="Anytime requested by RFH">Anytime requested by RFH</option>
                                    </select>
                                    {errors.dedicationTime && <p style={{ color: "red" }}>This field is mandatory</p>}
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label htmlFor="currentOccupation">What is your current occupation?<span style={{ color: "red" }}>*</span></label>
                                    <select {...register("currentOccupation", { required: true })} id="currentOccupation" className="form-select" aria-label="city select">
                                        <option value="">select</option>
                                        <option value="Studying">Studying</option>
                                        <option value="Homemaker">Homemaker</option>
                                        <option value="Working Professional">Working Professional</option>
                                        <option value="Others">Others</option>
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
                            {bloodDonor === 'yes' &&
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label htmlFor="bloodGroup">Please share your Blood group? {bloodDonor === "yes" ? <span style={{ color: "red" }}>*</span> : <span> </span>} </label>
                                        <input disabled={bloodDonor === "no" ? true : false} {...register("bloodGroup", { required: bloodDonor === "no" ? false : true })} type="text" className="form-control" id="bloodGroup" placeholder="Blood Group" />
                                        {errors.bloodGroup && <p style={{ color: "red" }}>This field is mandatory</p>}
                                    </div>
                                </div>
                            }
                        </div>
                        <div className="row">
                            <div className="col-md-12">
                                <div className="form-group">
                                    <label htmlFor="regularAmountDonor">Would you like to donate small amount to RFH every month/year?<span style={{ color: "red" }}>*</span></label>
                                    <select {...register("regularAmountDonor", { required: true, onChange: (e) => handleRegularAmountDonor(e) })} id="regularAmountDonor" className="form-select" aria-label="regular amount donor select">
                                        <option value="">select</option>
                                        <option value="yes">yes</option>
                                        <option value="no">no</option>
                                    </select>
                                    {errors.regularAmountDonor && <p style={{ color: "red" }}>This field is mandatory</p>}
                                </div>
                            </div>
                        </div>
                        {regularAmountDonor === 'yes' &&
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="row">
                                        <div className="col-sm-9">
                                            <div className="form-group">
                                                <label htmlFor="donationAmount">What is the amount you would like to sign up for? {regularAmountDonor === "yes" ? <span style={{ color: "red" }}>*</span> : <span> </span>} </label>
                                                <input disabled={regularAmountDonor === "no" ? true : false} {...register("donationAmount", { required: regularAmountDonor === 'yes' ? true : false })} type="text" className="form-control" id="donationAmount" />
                                                {errors.donationAmount && <p style={{ color: "red" }}>This field is mandatory</p>}
                                            </div>
                                        </div>
                                        <div className="col-sm-3">
                                            <div className="form-group">
                                                <label htmlFor="donationFrequency">Frequency of Donation {regularAmountDonor === "yes" ? <span style={{ color: "red" }}>*</span> : <span> </span>} </label>
                                                <select disabled={regularAmountDonor === "no" ? true : false} {...register("donationFrequency", { required: regularAmountDonor === 'yes' ? true : false })} id="donationFrequency" className="form-select" aria-label="donation frequency select">
                                                    <option value="">select</option>
                                                    <option value="monthly">Monthly</option>
                                                    <option value="yearly">Yearly</option>
                                                </select>
                                                {errors.donationFrequency && <p style={{ color: "red" }}>This field is mandatory</p>}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        }

                        <div className="row">
                            <div className="col-md-12">
                                <div className="form-group">
                                    <label htmlFor="volunteeringReason">Why do you wish to be a volunteer?  </label>
                                    <textarea {...register("volunteeringReason", { required: false })} className="form-control" id="volunteeringReason" rows="3" />
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-12">
                                <div className="form-group">
                                    <label htmlFor="aquisitionSource">How did you come to know about RFH ?  </label>
                                    <textarea {...register("aquisitionSource", { required: false })} className="form-control" id="aquisitionSource" rows="3" />

                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-12">
                                <div className="form-group">
                                    <label htmlFor="volunteeredForNGOorCSR">Have you volunteered before for any NGO or CSR activity?    </label> <br />
                                    <small>If yes, please share details. Mention your roles and responsibilities, what/where/when you did</small>
                                    <textarea {...register("volunteeredForNGOorCSR", { required: false })} className="form-control" id="volunteeredForNGOorCSR" rows="3" />
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

                        <hr />
                        <br />
                        <h2>By Signing Up: </h2>
                        <br />
                        <p style={{ fontWeight: "700" }}>
                            You promise and commit your time to “Rupee For Humanity” for next 1 year.
                            You will not mis-use the organization name for any of the personal benefits.
                            Respect every individual during the event and maintain the decorum of the group.
                            Every volunteer would get authorized certificate, T-shirt, momentous and many more, based on the contribution
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
            }
            {Object.fromEntries([...searchParams])?.form === 'final-submit' &&
                <div className="container-md volunteer-form" style={{ minHeight: "100vh" }}>
                    <h3 style={{ marginTop: "2%" }}>Your details</h3>
                    <table className="table"
                        style={{ backgroundColor: "#040002", color: "lightgray", borderRadius: "10px" }}
                    >

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
                                <td className="fs-6">Date of Birth</td>
                                <td>
                                    <span>
                                        {JSON.stringify(new Date(getValues("dob")).toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' }))}
                                    </span>

                                </td>
                                {console.log("DOB ", new Date(getValues("dob")))}
                            </tr>
                            <tr>
                                <td className="fs-6">Residing City</td>
                                <td>{getValues("address")}</td>
                            </tr>
                            <tr>
                                <td className="fs-6">T-shirt Size </td>
                                <td> {getValues("TshirtSize")}  </td>
                            </tr>
                        </tbody>
                    </table>
                    <span style={{ fontWeight: "bold", color: dbMessage.color }}>
                        {dbMessage.message.split(". ").map((item) => (
                            <small> {item}. <br /></small>
                        ))}
                    </span>

                    <div style={{ padding: "2%" }}>
                        <ReCAPTCHA ref={captchaRef} sitekey={process.env.REACT_APP_SITE_KEY} />
                    </div>


                    <div style={{ display: "flex", justifyContent: "flex-end", gap: "16px" }}>
                        {dataSavedInDB === false &&
                            <>
                                <button disabled={dataSavedInDB === true} className="btn btn-outline-dark" onClick={handleEditClick}>Edit</button>
                                <button disabled={dataSavedInDB === true} className="btn btn-dark" onClick={handleFinalSubmit}>
                                    {loading === true ?
                                        <div class="spinner-border text-light spinner-border-sm m-1" role="status">
                                            <span class="visually-hidden">Loading...</span>
                                        </div> :
                                        <span></span>}
                                    Confirm & Submit
                                </button>
                            </>
                        }
                        {dataSavedInDB && <button className="btn btn-outline-dark" onClick={handleHomeClick}>Go back Home</button>}


                    </div>

                </div>
            }

            {/* <Dialog
                open={loginDialogOpen}
                onClose={handleLoginDialogClose}
                aria-labelledby="Login-Dialog"
                aria-describedby="Login-with-google-or-passowrd"
            >
                <DialogTitle id="login-dialog-title">
                    {"Register"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="Login-dialog-description">
                        Please Register yourself with Rupee For Humanity before we proceed.
                        <br />
                        <br />
                        <Login
                            setAuthenticated={setAuthenticated}
                            setUser={setUser}
                            authToken={authToken}
                            setAuthToken={setAuthToken}
                        />
                    </DialogContentText>
                </DialogContent>

            </Dialog> */}

            <Dialog fullWidth={false} maxWidth='xs' open={submitDialogOpen}>
                <DialogTitle id="Thank-you-dialog-title">
                    Thank you
                </DialogTitle>
                <DialogContent>
                    <div className="container-sm">
                        <p>Thank you for becoming a volunteer with Rupee for Humanity</p>
                        <p>Please Verify your email by clicking the link sent to you. It expires in 30 minutes.</p>
                        <small>Check your spam folder too.</small>
                    </div>

                </DialogContent>
                <DialogActions>
                    <button onClick={handleHomeClick} type="button" className="btn btn-dark download-button">
                        Go Back Home
                    </button>
                </DialogActions>
            </Dialog>

        </div>
    )
}

export default VolunteerForm
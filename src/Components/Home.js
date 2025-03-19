import React, { useContext, useEffect, useRef, useState } from 'react'
import Header from './Header'
import cheque1 from '../assets/images/cheque1.webp'
import cheque4 from '../assets/images/cheque4.webp'
import cheque5 from '../assets/images/cheque5.webp'
import cheque6 from '../assets/images/cheque6.webp'
import cheque7 from '../assets/images/cheque7.webp'
import cheque8 from '../assets/images/cheque8.webp'
import heart from '../assets/images/heart.png'
import team from '../assets/images/team.png'
import kidsCouple from '../assets/images/kids-couple.png'
import events from '../assets/images/events.png'
import family from '../assets/images/family.png'
import growth from '../assets/images/growth.png'
import logo from '../assets/images/Logo.jpg'
import CountUp from 'react-countup';
import VisibilitySensor from 'react-visibility-sensor';
import { Dialog, Button, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Fab, IconButton } from '@mui/material'
import { useForm } from 'react-hook-form'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { GlobalContext } from '../context/Provider'
import CallIcon from '@mui/icons-material/Call';
import { Helmet } from 'react-helmet-async';
import InstallMobileApp from './InstallMobileApp'

import CloseIcon from '@mui/icons-material/Close';
import { toast } from 'sonner'

function Home() {
    const abortController = new AbortController();
    const signal = abortController.signal;
    const { register, handleSubmit, getValues, setValue, formState: { errors } } = useForm();
    const myRef = useRef(null)
    const navigate = useNavigate()
    let [searchParams, setSearchParams] = useSearchParams();
    const { transaction, setTransaction } = useContext(GlobalContext)
    const [open, setOpen] = React.useState(false);
    const [paymentStatus, setPaymentStatus] = useState("")
    const [paymentLink, setPaymentLink] = useState("")
    const [loading, setLoading] = useState(false)
    const [status, setStatus] = useState({});
    const [openAppDownloadDialog, setOpenAppDownloadDialog] = useState(false);
    const [showInstallMessage, setShowInstallMessage] = useState(false);

    function generateTransactionId() {
        let id = "RFH";
        // let characters = "0123456789";

        // for (let i = 0; i < 14; i++) {
        //     id += characters.charAt(Math.floor(Math.random() * characters.length));
        // }
        let date = Date.now()
        id = id + date

        return id;
    }

    // console.log("unique id", generateTransactionId())

    const handleDonateClick = () => {
        let params = { donate: true };
        setSearchParams(params);
        setOpen(true);
        // navigate('/donate')
    };

    console.log("searchParams, ", Object.fromEntries([...searchParams]))

    const handleClose = () => {
        abortController.abort();
        let params = {};
        setSearchParams(params);
        setOpen(false);
    };

    const handleVolunteerClick = () => {
        navigate('/volunteer-register?form=form')
    }

    const onSubmit = async (formData) => {
        console.log("donate data ", formData)
        // setValue("merchantTransactionId", generateTransactionId())
        // setOpen(false);
        setLoading(true)
        let formDataCopy = JSON.parse(JSON.stringify(formData))
        // formDataCopy = { ...formDataCopy, merchantTransactionId: generateTransactionId() }
        formDataCopy = { ...formDataCopy }

        // favDispatch({ type: "SET_TRANSACTION_ID", payload: formDataCopy })
        setTransaction({ ...formDataCopy })
        // localStorage.setItem('transactionID', formDataCopy.merchantTransactionId);

        try {
            // const response = await fetch("https://rfh-backend.up.railway.app/api/initiate-payment", {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/initiate-payment`, {
                method: "POST",
                timeout: 1200000,
                signal: signal,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formDataCopy),
            });
            const data = await response.json();
            console.log("data.message", data, data.message);
            console.log("merchantTransactionId from backend ", data?.data?.merchantTransactionId)
            localStorage.setItem('merchantTransactionId', data?.data?.merchantTransactionId
            );
            setPaymentStatus(data.message)
            setPaymentLink(data?.data?.instrumentResponse?.redirectInfo?.url)
            // window.location.href = data?.data?.instrumentResponse?.redirectInfo?.url;

            // window.open(
            //     data?.data?.instrumentResponse?.redirectInfo?.url,
            //     '_blank' // <- This is what makes it open in a new window.
            // );

            // Detect if user is on iOS/Safari
            const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
            (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
            const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

            const paymentUrl = data?.data?.instrumentResponse?.redirectInfo?.url

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
                setPaymentStatus("");
                toast.error('Payment gateway error. Please try again or contact support.');
            }

            const callCheckAPI = async () => {
                let merchantTransactionId = localStorage.getItem('merchantTransactionId')
                // let transactionID = formDataCopy.merchantTransactionId
                let body = { merchantTransactionId: merchantTransactionId }
                try {
                    const res = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/app/payment-status`, {
                        method: 'POST',
                        timeout: 1200000,
                        signal: signal,
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(body)
                    });
                    const data = await res.json();
                    console.log("data ", data)

                    setStatus(data);
                    setLoading(false)

                    // navigate('/payment-redirect')

                    // Check if payment is still pending
                    // if (data.success === true && data.data.state === 'PENDING') {
                    //     setTimeout(fetchStatus, 3000);
                    // }
                } catch (error) {
                    console.error(error);
                    setLoading(false)
                    setPaymentStatus(error)
                }
            }

            // setTimeout(callCheckAPI, 20000)


        } catch (error) {
            console.error(error);
            setLoading(false);
            setPaymentStatus(error)
        }

    }
    console.log("paymentstatus ", paymentStatus)
    console.log("payment Link ", paymentLink)

    const executeScroll = () => myRef.current.scrollIntoView()



    useEffect(() => {
        if ([...searchParams].length) {
            console.log("search params are ", Object.fromEntries([...searchParams]))
            if (Object.fromEntries([...searchParams])?.donate === 'true') {
                setOpen(true)
            }
            if (Object.fromEntries([...searchParams])?.source === 'qr') {
                setOpenAppDownloadDialog(true)
            }
        } else {
            console.log("No Search Params")
        }

        return () => {
            abortController.abort();
        }

    }, [])

    return (
        <div>
            <Helmet>
                <title>Rupee For Humanity</title>
            </Helmet>
            {/* <div class="banner">
                <p>New marathon event for Juniors. <a href="https://www.rupeeforhumanity.org/rfh-juniors-run-2024">Register now!</a></p>
            </div> */}
            
            <div class="banner">
                <p>Install the Rupee For Humanity App now! <InstallMobileApp /></p>
            </div>
            
            <Dialog maxWidth="sm" fullWidth open={openAppDownloadDialog} onClose={() => setOpenAppDownloadDialog(false)}>
                <DialogTitle>Install App</DialogTitle>
                <IconButton
                    aria-label="close"
                    onClick={() => setOpenAppDownloadDialog(false)}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                ><CloseIcon /></IconButton>
                <DialogContent>
                    <DialogContentText>
                        Install the Rupee For Humanity App now!
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button variant='text' onClick={() => setOpenAppDownloadDialog(false)} >
                        Close
                    </Button>
                        <InstallMobileApp  type="button" />
                </DialogActions>
            </Dialog>
            <Header />
            <section id="title">
                <div className="hero-text background">
                    <h1 className="display-1">Invest in the Future of the country</h1>
                    <h2 className="display-5">Help Underprivileged Children Thrive</h2>
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "24px", flexWrap: "wrap" }}>
                        <button onClick={handleDonateClick} type="button" className="btn btn-dark btn-lg download-button">
                            Donate Today
                        </button>
                        <button onClick={handleVolunteerClick} type="button" className="btn btn-dark btn-outline btn-lg download-button">
                            Volunteer Today
                        </button>
                        <Link to="/rfh-juniors-run-2025" className="btn btn-dark btn-lg download-button">
                            RFH Juniors Run 2025
                        </Link>
                        <Link to="/rfh-she-run-2025" className="btn btn-dark btn-lg download-button">
                            RFH She Run 2025
                        </Link>
                    </div>
                </div>
                <Fab onClick={executeScroll} aria-label="contact-us" style={{ position: "fixed", bottom: "2%", right: "2%", backgroundColor: "#efb442" }}>
                    <CallIcon />
                </Fab>
            </section>
            <section id="about">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12 col-lg-4 torn-paper">
                            <h2 className="h2 about-heading">Our Mission</h2>
                            <p>
                                Our mission at Rupee for Humanity is to provide education, equal opportunities, and
                                necessary resources such as food, medical care, and a healthy environment to those in need.
                                We are committed to serving the large and deserving section of society, particularly those
                                in rural areas, in an effort to promote development and uplift our nation. We believe that
                                every individual has the power to make a difference through even the smallest of
                                contributions. Join us in our mission to create a more equal and prosperous society for all.
                            </p>

                        </div>
                        <div className="col-md-12 col-lg-8">
                            <div className="row m-4">
                                <h2 className="sub-heading">Your donation directly goes to the education of the needy</h2>
                                <div className="col-md-4">
                                    <img src={cheque1} className="img-fluid" alt="Rupee for humanity donating to a student" />
                                </div>
                                <div className="col-md-4">
                                    <img src={cheque4} className="img-fluid" alt="Rupee for humanity donating to a student" />
                                </div>
                                <div className="col-md-4">
                                    <img src={cheque5} className="img-fluid" alt="Rupee for humanity donating to a student" />
                                </div>
                            </div>
                            <div className="row m-4">
                                <div className="col-md-12">
                                    {/* <p className="paragraph">
                                        Team <b>Rupee for Humanity (RFH)</b> has a long history of working to improve the
                                        lives of
                                        those in need. In 2013, we visited the <b>Courtesy Foundation</b> in Bangalore,
                                        where we
                                        donated funds to support the education of nearly 100 students attending nearby
                                        government schools. In 2012, we visited the <b>Sri Sai Old Age Home</b> in
                                        Bangalore,
                                        providing meals and a donation to support the development of the facility. That same
                                        year, we also visited the <b>Sri Satya Sai Mahila Charitable Trust</b>, sponsoring
                                        meals
                                        for nearly 100 children and donating funds to provide basic necessities such as
                                        shelter and clothing. Prior to the founding of RFH, in 2008, we provided computer
                                        training to 35 children at the <b>Sri Akkamahadevi Seva Samstha</b>. Our efforts
                                        have been
                                        focused on supporting education and providing resources such as food, shelter, and
                                        medical care to those in need, and we remain committed to continuing this important
                                        work.
                                    </p> */}
                                    <p className="paragraph">
                                        Our course of action at Rupee For Humanity (RFH) is centered on providing basic necessities like food, shelter, clothing, and education to children. To make this happen, we collaborate with nearby schools and hospitals and directly connect with food caterers and NGOs to guarantee that the money is used effectively. Our next step is to offer health care facilities and a healthy environment for the elderly. Additionally, we aim to enhance rural areas by providing basic necessities such as electricity, food, health care, and hygiene centers. We ensure transparency in all transactions so that individuals can track how their donations are being utilized.
                                    </p>
                                </div>
                            </div>
                            <div className="row m-4" >
                                <div className="col-md-4 text-center">
                                    <img style={{ maxHeight: "210px" }} src={cheque6} className="img-fluid" alt="Rupee for humanity volunteer donating to a student" />
                                </div>
                                <div className="col-md-4 text-center">
                                    <img style={{ maxHeight: "210px" }} src={cheque7} className="img-fluid" alt="Rupee for humanity volunteer donating to a student" />
                                </div>
                                <div className="col-md-4 text-center">
                                    <img style={{ maxHeight: "210px" }} src={cheque8} className="img-fluid" alt="Rupee for humanity volunteer donating to a student" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* .animate {
  --num: 3458;
}

.animate-1 {
  --num: 56;
}

.animate-2 {
  --num: 205;
}

.animate-3 {
  --num: 40;
}

.animate-4 {
  --num: 1200;
} */}

            <section className="section-3">
                <div className="cards-component">
                    <div className="my-card">
                        <p><img src={heart} alt="" height="100" /></p>
                        {/* <div className="counter"></div> */}
                        <CountUp end={3458}>
                            {({ countUpRef, start }) => (
                                <VisibilitySensor onChange={start}>
                                    <span style={{ fontSize: "2rem", fontWeight: "800" }} ref={countUpRef} />
                                </VisibilitySensor>
                            )}
                        </CountUp>
                        <p>Number of Donors</p>
                    </div>
                    <div className="my-card">
                        <p><img src={team} alt="" height="100" /></p>
                        <CountUp end={56}>
                            {({ countUpRef, start }) => (
                                <VisibilitySensor onChange={start}>
                                    <span style={{ fontSize: "2rem", fontWeight: "800" }} ref={countUpRef} />
                                </VisibilitySensor>
                            )}
                        </CountUp>
                        <p>Number of volunteers </p>
                    </div>
                    <div className="my-card">
                        <p><img src={kidsCouple} alt="" height="100" /></p>
                        <CountUp end={205}>
                            {({ countUpRef, start }) => (
                                <VisibilitySensor onChange={start}>
                                    <span style={{ fontSize: "2rem", fontWeight: "800" }} ref={countUpRef} />
                                </VisibilitySensor>
                            )}
                        </CountUp>
                        <p>Number of Children helped!</p>
                    </div>
                    <div className="my-card">
                        <p><img src={events} alt="" height="100" /></p>
                        <span><CountUp end={40}>
                            {({ countUpRef, start }) => (
                                <VisibilitySensor onChange={start}>
                                    <span style={{ fontSize: "2rem", fontWeight: "800" }} ref={countUpRef} />
                                </VisibilitySensor>
                            )}
                        </CountUp>+</span>
                        <p>Number of Events conducted</p>
                    </div>
                    <div className="my-card">
                        <p><img src={family} alt="" height="100" /></p>
                        <span><CountUp end={1200}>
                            {({ countUpRef, start }) => (
                                <VisibilitySensor onChange={start}>
                                    <span style={{ fontSize: "2rem", fontWeight: "800" }} ref={countUpRef} />
                                </VisibilitySensor>
                            )}
                        </CountUp>+</span>
                        <p>Number of Families supported</p>
                    </div>
                    <div className="my-card">
                        <p><img src={growth} alt="" height="100" /></p>
                        <span>INR <CountUp end={25}>
                            {({ countUpRef, start }) => (
                                <VisibilitySensor onChange={start}>
                                    <span style={{ fontSize: "2rem", fontWeight: "800" }} ref={countUpRef} />
                                </VisibilitySensor>
                            )}
                        </CountUp> Lakhs+</span>
                        <p>Total Funds Raised and Donated</p>
                    </div>

                </div>
            </section>

            <section id="testimonial">
                <div id="carouselExample" className="carousel slide">
                    <div className="carousel-inner">
                        <div className="container">
                            <div className="carousel-item active" style={{ padding: "100px 40px" }}>
                                <div>
                                    <iframe width="320" height="300" src="https://www.youtube.com/embed/TZDn4-FeAHY"
                                        title="YouTube video player" frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                        allowFullScreen></iframe>
                                </div>
                            </div>
                            <div className="carousel-item">
                                <h2 className="display-3">You are the reason fr smiles!!
                                    Happy to see people happy!!!
                                    All the very best!!!!</h2>
                                <em> - Akshatha Bagdai, Bengaluru</em>
                            </div>
                            <div className="carousel-item">
                                <h2 className="display-3">Raghu your doing good work keep it up. All the best for your future
                                    asignment.</h2>
                                <em> - Anil Kumar Channaiah, Bengaluru</em>
                            </div>
                            <div className="carousel-item">
                                <h2 className="display-3">Raghu your doing great work... It's super </h2>
                                <em>- Anil Kumar Channaiah, Bengaluru</em>
                            </div>
                        </div>

                    </div>
                    <button className="carousel-control-prev" type="button" data-bs-target="#carouselExample"
                        data-bs-slide="prev">
                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Previous</span>
                    </button>
                    <button className="carousel-control-next" type="button" data-bs-target="#carouselExample"
                        data-bs-slide="next">
                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Next</span>
                    </button>
                </div>
            </section>

            <section id="cta">
                <h3 className="cta-heading mb-5">Even a Rupee Donated will help build the Future of India</h3>
                <div style={{ display: "flex", justifyContent: "center", gap: "10px" }} >
                    <button onClick={handleDonateClick} type="button" className="btn btn-dark btn-lg download-button">
                        Donate
                    </button>
                    {/* <button onClick={executeScroll} type="button" className="btn btn-outline-light btn-lg download-button">
                        Contact us
                    </button> */}
                </div>

            </section>

            <section id="contact">
                <div>
                    <div className="contact-us" ref={myRef}>
                        <div>
                            <img className="logo1" src={logo} alt="RFH logo" />
                            {/* <h3 style={{ margin: "0" }}>Rupee For Humanity</h3>
                            <p><i>Responsible Indian Thought</i></p> */}
                        </div>
                        <div>
                            <h3 className="contact-heading">Contact Us</h3>

                            <p style={{ margin: "0" }}><b>Address: Bangalore, India</b></p>
                            {/* <p style={{ margin: "0" }}>Email: rupee4humanity@gmail.com </p> */}
                            <span>Email: </span><a style={{ color: "#fff" }} href="mailto:rupee4humanity@gmail.com"> rupee4humanity@gmail.com </a>
                            <p style={{ margin: "0" }}>website: www.rupeeforhumanity.org</p>
                            {/* <p style={{ margin: "0" }}>Mob: +91 9164358027</p> */}
                            <span>Mob: </span> <a style={{ color: "#fff" }} href="tel:+919164358027">+91 9164358027</a>
                            <div>
                                <a href="https://www.facebook.com/RupeeForHumanity/" className="social-media-icons" style={{ color: "#fff" }}>Facebook Page</a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Dialog open={open}>
                <DialogTitle>Donate to Rupee For Humanity</DialogTitle>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <DialogContent>
                        <DialogContentText>
                            To donate to Rupee For Humanity, please enter the following details:
                        </DialogContentText>
                        <div className="form-group">
                            <label htmlFor="fullName">Full Name <span style={{ color: "red" }}>*</span></label>
                            <input {...register("fullName", { required: true })} type="text" className="form-control" placeholder="" id="fullName" />
                            {errors.fullName && <p style={{ color: "red" }}>This field is mandatory</p>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Email <span style={{ color: "red" }}>*</span></label>
                            <input {...register("email", { required: true })} className="form-control" type="email" name="email" id="email" />
                            {errors.email && <p style={{ color: "red" }}>This field is mandatory</p>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="mobile">Mobile No. <small>(include country code (+91 for India))</small>  <span style={{ color: "red" }}>*</span></label>
                            <input {...register("mobNo", { required: true })} className="form-control" type="tel" id="mobile" />
                            {errors.mobNo && <p style={{ color: "red" }}>This field is mandatory</p>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="PANno">PAN Number <small>(write NA if not available)</small>  <span style={{ color: "red" }}>*</span></label>
                            <input {...register("PANno", { required: true })} type="text" className="form-control" id="PANno" />
                            {errors.PANno && <p style={{ color: "red" }}>This field is mandatory</p>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="donationAmount">Amount you would like to Donate <span style={{ color: "red" }}>*</span></label>
                            <input {...register("donationAmount", { required: true })} type="number" className="form-control" id="donationAmount" />
                            {errors.donationAmount && <p style={{ color: "red" }}>This field is mandatory</p>}
                        </div>
                        <small style={{ color: "green", fontWeight: "600" }}> {paymentStatus} </small>
                        {paymentStatus === "Payment Initiated" && <a href={paymentLink} target="_blank" rel='noreferrer' > Payment Link</a>}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button type='submit' variant='filled' style={{ backgroundColor: "#040002", color: "lightgray" }} >
                            {loading === true ?
                                <div class="spinner-border text-light spinner-border-sm m-1" role="status">
                                    <span class="visually-hidden">Loading...</span>
                                </div> :
                                <span></span>}
                            Donate
                        </Button>
                    </DialogActions>
                </form>

            </Dialog>

            {/* footer */}

            <footer id="footer">
                <p>© Copyright 2023 Rupee for Humanity</p>
                <div style={{ display: "flex", justifyContent: "center", gap: "16px" }}>
                    <Link to="/refund-policy" >Refund Policy</Link>
                    <Link to="/terms-and-conditions" >Terms and Conditions</Link>
                </div>
            </footer>

        </div>
    )
}

export default Home
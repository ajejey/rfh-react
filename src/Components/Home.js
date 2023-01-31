import React, { useRef } from 'react'
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
import { Dialog, Button, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material'
import { useForm } from 'react-hook-form'

function Home() {
    const { register, handleSubmit, getValues, setValue, formState: { errors } } = useForm();
    const myRef = useRef(null)
    const [open, setOpen] = React.useState(false);

    const handleDonateClick = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const onSubmit = (data) => {
        console.log("donate data ", data)
        setOpen(false);
    }

    const executeScroll = () => myRef.current.scrollIntoView()

    return (
        <div>
            <Header />
            <section id="title">
                <div className="hero-text background">
                    <h1 className="display-1">Invest in the Future of the country</h1>
                    <h2 className="display-5">Help Underprivileged Children Thrive</h2>
                    <button onClick={handleDonateClick} type="button" className="btn btn-dark btn-lg download-button">
                        Donate Today
                    </button>
                </div>
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
                                        title="YouTube video player" frameborder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                        allowfullscreen></iframe>
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
                    <button onClick={executeScroll} type="button" className="btn btn-outline-light btn-lg download-button">
                        Contact us
                    </button>
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
                            <p style={{ margin: "0" }}>Email: rupee4humanity@gmail.com </p>
                            <p style={{ margin: "0" }}>website: www.rupeeforhumanity.org</p>
                            <p style={{ margin: "0" }}>Mob: +91 9164358027</p>
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
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button type='submit' variant='filled' style={{ backgroundColor: "#040002", color: "lightgray" }} >Donate</Button>
                    </DialogActions>
                </form>

            </Dialog>

            {/* footer */}

            <footer id="footer">
                <p>© Copyright 2023 Rupee for Humanity</p>
            </footer>

        </div>
    )
}

export default Home
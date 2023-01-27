import React from 'react'
import Header from '../Header'
import runner from '../../assets/images/runner-min.png'
import marathon from '../../assets/images/marathon.jpg'
import { useNavigate } from 'react-router-dom'

function Events() {
    const navigate = useNavigate()

    const handleRegisterClick = () => {
        console.log("register clicked to navigate")
        navigate('/events/runforliteracy-2023')
    }
    return (
        <div className='events-page'>
            <Header />
            <div className="container-md" style={{ paddingTop: "18px" }}>
                <div className="row">

                    {/* <div className="col-md-6 flex-center" >
                        <div className="blob flex-center">
                            <img className='runner-img' src={runner} alt="RFH Runner" />
                        </div>
                    </div> */}
                    <div className='col-md-12'>
                        <h2 className="h2" style={{ color: "#fff4de", padding: "16px 0" }}>
                            <b>Welcome to Rupee For Humanity!</b>
                        </h2>

                        <p className="paragraph events-p">
                            We are a non-profit organization that has been raising funds for the last decade through the power of events. Every event we host brings us one step closer to our mission – to make a difference in the lives of individuals and families in need.
                        </p>
                        <p className="paragraph events-p">
                            Through the 40+ events we have hosted, we have raised considerable amounts of money that has gone on to help over 1,200 families and to educate over 200 children in India.
                        </p>
                        <p className="paragraph events-p">
                            Our events are centered around fun activities and involve everyone – from runners to fitness enthusiasts and sports-lovers to those who simply want to lend a helping hand.
                        </p>

                    </div>
                    <div style={{ padding: "3%", textAlign: "center" }}>
                        <p className="paragraph">
                            <b>We invite everyone to join us in this beautiful journey and look forward to an incredible experience together!</b>
                        </p>
                    </div>

                </div>

            </div>

            <section id="current-events">
                <div className="container-md">
                    <h2 className="h2" style={{ color: "#2f6e49", fontWeight: "700", paddingBottom: "2%" }}>Current Events</h2>


                    <div className="card mb-3" style={{ maxWidth: "840px" }}>
                        <div className="row g-3">
                            <div className="col-md-4">
                                <img src={marathon} className="img-fluid rounded-start" alt="RFH Marathon" />
                            </div>
                            <div className="col-md-8">
                                <div className="card-body">
                                    <h5 className="card-title h2">RFH 10K Run - Run for Literacy 2023</h5>
                                    <span> <strong>Date:</strong>  April 29th & 30th  (Saturday & Sunday)</span><br />
                                    <span><strong>Time:</strong>  Run anytime during the above dates</span><br />
                                    <span><strong>Venue:</strong>  Run anywhere as per your comfort</span><br />

                                    <p className="card-text">Virtual Marathon consisting of various catagories for the run.</p><br />
                                    <span className="card-text"><small style={{ color: "red" }}> <strong>Currently Live!</strong> </small></span><br />
                                    <span className="card-text"><small style={{ color: "red" }}> <strong>Last Date to Register: March 25th</strong> </small></span><br />
                                    <button onClick={handleRegisterClick} type="button"
                                        className="btn btn-dark btn-lg download-button">Register</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </section>

            <section id="past-events" >
                <div className="container-md">
                    <h2 className="h2" style={{ color: "#fff4de", fontWeight: "700", paddingBottom: "2%" }}>Past Events</h2>

                    <div className="card mb-3" style={{ maxWidth: "640px" }}>
                        <div className="row g-3">
                            <div className="col-md-4">
                                <img src={marathon} className="img-fluid rounded-start" alt="RFH Marathon" />
                            </div>
                            <div className="col-md-8">
                                <div className="card-body">
                                    <h5 className="card-title h2">10K Marathon</h5>
                                    <p className="card-text">Rupee For Humanity 10k, 5k, 3k, and Charity Run 2021</p>
                                    <p className="card-text"><small className="text-muted">Last updated 2 years ago</small></p>
                                    <button type="button" className="btn btn-dark btn-lg download-button" disabled>
                                        Register
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Events
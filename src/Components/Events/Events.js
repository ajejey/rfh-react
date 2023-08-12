import React, { useRef } from 'react'
import Header from '../Header'
import runner from '../../assets/images/runner-min.png'
import marathon from '../../assets/images/marathon.jpg'
import runnersVector from '../../assets/images/RunnersVectors.svg'
import { useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { Badge, Box, Button, CardActions, CardHeader } from '@mui/material'
import { Grid, Card, CardMedia, CardContent, Typography, Skeleton } from '@mui/material';
import useSWR from 'swr';
import useAuthStatus from '../../CustomHooks/useAuthStatus'

const fetcher = async (url) => {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('Failed to fetch events');
    }
    return response.json();
};

function Events() {
    const { loggedIn, checkingStatus } = useAuthStatus();
    const navigate = useNavigate()
    const { data: eventData, error } = useSWR(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/events`, fetcher);

    // if (error) {
    //     return <div>Error loading events</div>;
    // }


    // const { events, pagination } = eventData;
    const events = eventData?.events
    const pagination = eventData?.pagination


    const handleRegisterClick = () => {
        console.log("register clicked to navigate")
        navigate('/events/runforliteracy-2023')
    }

    const handleCreateEvent = () => {
        console.log("create event clicked to navigate")
        navigate('/events/create-event')
    }

    const handleEventLearnMore = (path) => {
        console.log("learn more clicked to navigate")
        navigate(`/events/${path}`)
    }


    return (
        <div className='events-page'>
            <Helmet>
                <title>Events | Rupee For Humanity</title>
            </Helmet>
            <Header />
            <div className="container-sm" style={{ paddingTop: "18px" }}>
                <div className="row">

                    <div className="col-sm-6 flex-center" >
                        <div className="flex-center">
                            <img className='runner-img' src={runnersVector} alt="RFH Runner" />
                        </div>
                    </div>
                    <div className='col-sm-6' style={{ display: "flex", flexDirection: "column", justifyContent: 'center' }}>
                        <h2 className="display-2" style={{ color: "#fff4de", padding: "16px 0", fontWeight: "500", fontFamily: "Asap" }}>
                            <b>Run For Literacy</b>
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
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <h2 className="h2" style={{ color: "#2f6e49", fontWeight: "700", paddingBottom: "2%" }}>Current Events</h2>
                        {loggedIn && <Button variant='contained' color='secondary' onClick={handleCreateEvent}>Create Event</Button>}
                    </div>

                    {!eventData && (
                        <Grid container spacing={2}>
                            {[...Array(6)].map((_, index) => (
                                <Grid item xs={12} sm={6} md={4} key={index}>
                                    <Card>
                                        <Skeleton variant="rectangular" height={140} />
                                        <CardContent>
                                            <Skeleton variant="text" />
                                            <Skeleton variant="text" />
                                            <Skeleton variant="text" />
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    )}

                    <Grid container spacing={2}>
                        {events && events.length &&
                            events.map((event) => (
                                <Grid item xs={12} sm={6} md={4} key={event._id}>
                                    <Card>
                                        <CardHeader
                                            title={event.eventName}
                                            subheader={new Date(event.startDate).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                            })}
                                        />
                                        <CardMedia component="img" image={event.image} alt={event.title} />
                                        <CardContent>
                                            {/* <Typography variant="body2" color="text.secondary">
                                                {event.description}
                                            </Typography> */}
                                            {/* <br /> */}
                                        </CardContent>
                                        <CardActions sx={{ justifyContent: "flex-end" }}>
                                            <Button variant="outlined" onClick={() => handleEventLearnMore(event.path)}>Learn more</Button>
                                        </CardActions>
                                    </Card>
                                </Grid>
                            ))}
                    </Grid>

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



{/* <div className="card mb-3" style={{ maxWidth: "840px" }}>
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
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                    <span className="card-text"><small style={{ color: "red" }}> <strong>Currently Live!</strong> </small></span><br />
                    <span className="card-text"><small style={{ color: "red" }}> <strong>Last Date to Register: March 25th</strong> </small></span>
                </div>
                <div>
                    <button onClick={handleRegisterClick} type="button"
                        className="btn btn-dark btn-lg download-button">Register</button>
                </div>
            </div>


        </div>
    </div>
</div>
</div> */}
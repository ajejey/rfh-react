import React, { useContext, useState } from 'react'
import Header from '../Header'
import useSWR, { mutate } from 'swr';
import 'react-quill/dist/quill.snow.css';
import { Link, useNavigate, useParams } from 'react-router-dom';
import DateRangeIcon from '@mui/icons-material/DateRange';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { GlobalContext } from '../../context/Provider';
import { Button, Dialog } from '@mui/material';
import DonateDialog from '../DonateDialog/DonateDialog';
import useAuthStatus from '../../CustomHooks/useAuthStatus';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Helmet } from 'react-helmet-async';

const fetcher = async (url) => {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('Failed to fetch events');
    }
    return response.json();
}

function Event() {
    let { path } = useParams()
    const navigate = useNavigate()
    const { loggedIn, checkingStatus } = useAuthStatus()
    const { volunteeringEvent, setVolunteeringEvent } = useContext(GlobalContext)
    const { data: eventData, error } = useSWR(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/events/${path}`, fetcher);
    const [open, setOpen] = React.useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDonateClick = () => {
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
    }

    const handleRegisterClick = (eventName) => {
        setVolunteeringEvent(eventName)
        navigate('/volunteer-register?form=form')
    }

    const handleDelete = async () => {
        if (!isDeleting) {
            if (window.confirm('Are you sure you want to delete this blog post?')) {
                setIsDeleting(true);

                try {
                    const response = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/events/${path}`, {
                        method: 'DELETE'
                    });

                    if (response.ok) {
                        // Clear the cached data and navigate to the blog index page
                        mutate(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/events`);
                        navigate('/events');
                    } else {
                        console.error('Failed to delete the blog post');
                    }
                } catch (error) {
                    console.error('An error occurred while deleting the blog post:', error);
                }

                setIsDeleting(false);
            }
        }
    };

    return (
        <div>
            <Helmet>
                <title>{`RFH | ${eventData?.eventName}`}</title>
                <meta name="description" content={eventData?.description} />
                <meta property="og:title" content={eventData?.eventName} />
                <meta property="og:description" content={eventData?.description} />
                {eventData?.image && <meta property="og:image" content={eventData?.image} />}
            </Helmet>
            <Header />
            <div className='container-md mb-5'>
                <div>
                    {loggedIn && (
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                            <Link to={`/events/edit-event/${path}`} title="Edit this event" className="btn btn-dark">
                                <FontAwesomeIcon icon={faPen} />
                            </Link>
                            <button title="Delete this event" onClick={handleDelete} className="btn btn-danger" disabled={isDeleting}>
                                <FontAwesomeIcon icon={faTrash} />
                            </button>
                        </div>
                    )}
                </div>
                <h1 className="h1">{eventData?.eventName}</h1>
                <span style={{ fontWeight: 'bold', color: 'gray' }}>
                    <DateRangeIcon color='tertiary' /> &nbsp;
                    {new Date(eventData?.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </span> <br />
                <a href={eventData?.mapLocation} target="_blank" rel="noopener noreferrer" >
                    <LocationOnIcon color='tertiary' /> &nbsp;
                    {eventData?.location}
                </a>
                <div className="d-flex justify-content-center pt-4">
                    <img src={eventData?.image} className="img-fluid h-75" alt="Event details" />
                </div>
                <div className='pt-3'>
                    <h3 className='h3'>Description</h3>
                    <div className="ql-container ql-snow" style={{ position: "relative", border: "none" }}>
                        <div className="ql-editor" data-gramm="false">
                            <div dangerouslySetInnerHTML={{ __html: eventData?.description }} />
                        </div>
                    </div>
                </div>
                {eventData?.pdf && (
                    <div className="pt-4">
                        <h3 className="h3">Event Document</h3>
                        <iframe
                            title="Event Document"
                            src={eventData?.pdf}
                            style={{ width: "100%", height: "90vh" }}
                            allowFullScreen
                        ></iframe>
                    </div>
                )}

                <div className='pt-4 d-flex justify-content-center gap-5'>
                    <Button onClick={handleDonateClick} variant='contained' color='primary'>Donate Online</Button>
                    <Button color='primary' onClick={() => handleRegisterClick(eventData?.eventName)}>Volunteer for this event</Button>
                </div>
            </div>
            <Dialog open={open}>
                <DonateDialog handleClose={handleClose} eventData={eventData} />
            </Dialog>
        </div>
    )
}

export default Event
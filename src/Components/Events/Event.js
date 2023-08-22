import React, { useContext } from 'react'
import Header from '../Header'
import useSWR from 'swr';
import 'react-quill/dist/quill.snow.css';
import { useNavigate, useParams } from 'react-router-dom';
import DateRangeIcon from '@mui/icons-material/DateRange';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { GlobalContext } from '../../context/Provider';
import { Button, Dialog } from '@mui/material';
import DonateDialog from '../DonateDialog/DonateDialog';

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
    const { volunteeringEvent, setVolunteeringEvent } = useContext(GlobalContext)
    const { data: eventData, error } = useSWR(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/events/${path}`, fetcher);
    const [open, setOpen] = React.useState(false);

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

    return (
        <div>
            <Header />
            <div className='container-md mb-5'>
                <h1 className="h1">{eventData?.eventName}</h1>
                <span style={{ fontWeight: 'bold', color: 'gray' }}>
                    <DateRangeIcon color='tertiary' /> &nbsp;
                    {new Date(eventData?.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </span> <br />
                <span style={{ fontWeight: 'bold', color: 'gray' }}>
                    <LocationOnIcon color='tertiary' /> &nbsp;
                    {eventData?.location}
                </span>
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
                <div className='pt-4 d-flex justify-content-center gap-5'>
                    <Button onClick={handleDonateClick} variant='contained' color='primary'>Donate Online</Button>
                    <Button color='primary' onClick={() => handleRegisterClick(eventData?.eventName)}>Volunteer for this event</Button>
                </div>
            </div>
            <Dialog open={open}>
                <DonateDialog handleClose={handleClose} />
            </Dialog>
        </div>
    )
}

export default Event
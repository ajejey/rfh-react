import { Tab, Tabs } from '@mui/material';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import useSWR from 'swr';
import Header from '../Header';
import EventParticipants from './EventParticipents';
import VolunteerList from './VolunteerList';

function AdminHome() {
    const [tabNumber, setTabNumber] = useState(0);
    const { handleSubmit, register, reset } = useForm();
    const [downloadLink, setDownloadLink] = useState(null);
    const [loading, setLoading] = useState(false);

    const body = [
        'fullName',
        'email',
        'mobNo',
        'PANno',
        'cause',
        'transactionNo',
        'paymentMode',
        'donationAmount',
    ];

    const handleDonationFormSubmit = async (data) => {
        setLoading(true);
        const url = `${process.env.REACT_APP_BACKEND_BASE_URL}/create-receipt`;

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error('Failed to create receipt');
            }

            const responseData = await response.json();

            // Extract the download link from the response
            const { downloadLink } = responseData;

            // Set the download link state to make it available for rendering
            setDownloadLink(downloadLink);
            setLoading(false);
            // Reset the form
            reset();
        } catch (error) {
            console.error(error);
            setLoading(false);
            // alert(error);
        }
    };

    const handleTabChange = (event, newValue) => {
        setTabNumber(newValue);
    };

    const today = new Date().toISOString().split('T')[0]; // Get today's date as default value

    return (
        <div>
            <Header />
            <div className="container-md">
                <h1 className="h1">Admin</h1>
                <h3 className="h3">Update offline donations</h3>
                <form onSubmit={handleSubmit(handleDonationFormSubmit)}>
                    {body.map((field) => (
                        <div className="mb-3" key={field}>
                            <label htmlFor={field} className="form-label">{field}</label>
                            <input
                                type="text"
                                id={field}
                                className="form-control"
                                {...register(field)} // Register the field with react-hook-form
                            />
                        </div>
                    ))}
                    <div className="mb-3">
                        <label htmlFor="date" className="form-label">Date</label>
                        <input
                            type="date"
                            id="date"
                            defaultValue={today} // Set today's date as the default value
                            className="form-control"
                            {...register('date')} // Register the 'date' field with react-hook-form
                        />
                    </div>
                    <button type="submit" className="btn btn-primary">
                        {loading === true ?
                            <div class="spinner-border text-light spinner-border-sm m-1" role="status">
                                <span class="visually-hidden">Loading...</span>
                            </div> :
                            <span></span>}
                        Submit
                    </button>
                </form>
                <br />
                {downloadLink && (
                    <div>
                        <p>Download the invoice:</p>
                        <div dangerouslySetInnerHTML={{ __html: downloadLink }} />
                    </div>
                )}
            </div>
        </div>
    );
}

export default AdminHome;




{/* <Tabs value={tabNumber} onChange={handleTabChange}>
                    <Tab label="Volunteers" value={0} />
                    <Tab label="Event Participant" value={1} />
                </Tabs>
                <br />
                {tabNumber === 0 && <VolunteerList />}
                {tabNumber === 1 && <EventParticipants />} */}
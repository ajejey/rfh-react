import { Tab, Tabs } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import useSWR from 'swr';
import Header from '../Header';
import EventParticipants from './EventParticipents';
import VolunteerList from './VolunteerList';
import { Link } from 'react-router-dom';

function AdminHome() {
    const [tabNumber, setTabNumber] = useState(0);
    const { handleSubmit, register, reset } = useForm();
    const [downloadLink, setDownloadLink] = useState(null);
    const [loading, setLoading] = useState(false);
    const [buttonDisabled, setButtonDisabled] = useState(true);
    const [apiError, setApiError] = useState('');
    const [downloadCSVLoading, setDownloadCSVLoading] = useState(false);
    const [csvDownloadLink, setCsvDownloadLink] = useState(null);
    const downloadLinkRef = useRef(null);

    const downloadCsv = async () => {
        try {
            setDownloadCSVLoading(true);
            const backendUrl = `${process.env.REACT_APP_BACKEND_BASE_URL}/api/donations/csv`;
            const response = await fetch(backendUrl);
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            setCsvDownloadLink(url);
            setDownloadCSVLoading(false);
        } catch (error) {
            console.error(error);
            setDownloadCSVLoading(false);
        }
    }

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
        setButtonDisabled(true);
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
            setApiError(error);
        }
    };

    const handleTabChange = (event, newValue) => {
        setTabNumber(newValue);
    };

    const handleInputChange = () => {
        setButtonDisabled(false);
    };

    useEffect(() => {
        if (downloadLink) {
            if (downloadLinkRef.current) {
                downloadLinkRef.current.scrollIntoView({ behavior: 'smooth' });
            }
        }

    }, [downloadLink])

    const today = new Date().toISOString().split('T')[0]; // Get today's date as default value

    return (
        <div>
            <Header />
            <div className="container-md">
                <h1 className="h1">Admin Panel</h1>
                <hr />
                <section>
                    <h3>See all Marathon Participants</h3>
                    <Link to="/admin/marathon-participants">See all participants</Link>
                    <br />
                    <hr />
                </section>
                <section className="mb-4">
                    <h3>Add Offline Registration</h3>
                    <p>Add offline registrations for participants who paid through other methods</p>
                    <Link to="/admin/offline-registration" className="btn btn-primary">Add Offline Registration</Link>
                    <hr />
                </section>
                <section className="mb-4">
                    <h3>Generate Donations CSV</h3>
                    <div className="d-flex justify-content-center align-items-center mt-3 gap-3">
                        <button className="btn btn-primary mr-2" onClick={downloadCsv}>
                            {downloadCSVLoading ? (
                                <div className="spinner-border spinner-border-sm text-light" role="status"></div>
                            ) : (
                                'Generate CSV'
                            )}
                        </button>
                        {csvDownloadLink && (
                            <a href={csvDownloadLink} download="donations.csv">
                                Download CSV
                            </a>
                        )}
                    </div>
                </section>
                <section className="mb-4">
                    <h3>Get All Donations</h3>
                    <Link to="/admin/get-all-donations">Download donations receipt table</Link>
                </section>
                <hr />

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
                                onChange={handleInputChange} // Add onChange event handler to enable the submit button
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
                            onChange={handleInputChange} // Add onChange event handler to enable the submit button

                        />
                    </div>
                    <button type="submit" disabled={buttonDisabled} className="btn btn-primary">
                        {loading === true ?
                            <div class="spinner-border text-light spinner-border-sm m-1" role="status">
                                <span class="visually-hidden">Loading...</span>
                            </div> :
                            <span></span>}
                        Submit
                    </button>
                </form>
                {apiError && <div className="alert alert-danger" role="alert">{apiError}</div>}
                <br />
                {downloadLink && (
                    <div ref={downloadLinkRef}>
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
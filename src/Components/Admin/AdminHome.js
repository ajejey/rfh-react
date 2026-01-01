import { Tab, Tabs, Box, Typography } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import useSWR from 'swr';
import Header from '../Header';
import EventParticipants from './EventParticipents';
import VolunteerList from './VolunteerList';
import FeedbackDashboard from './FeedbackDashboard';
import { Link } from 'react-router-dom';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `admin-tab-${index}`,
    'aria-controls': `admin-tabpanel-${index}`,
  };
}

function AdminHome() {
  const [tabNumber, setTabNumber] = useState(0);
  const { handleSubmit, register, reset, setValue, getValues } = useForm();
  const [downloadLink, setDownloadLink] = useState(null);
  const [emailData, setEmailData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [apiError, setApiError] = useState('');
  const [donorLookupLoading, setDonorLookupLoading] = useState(false);
  const [donorLookupError, setDonorLookupError] = useState('');
  const [downloadCSVLoading, setDownloadCSVLoading] = useState(false);
  const [csvDownloadLink, setCsvDownloadLink] = useState(null);
  const [copySuccess, setCopySuccess] = useState('');
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
  };

  const body = [
    'email',
    'mobNo',
    'fullName',
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

      // Extract the download link and email data from the response
      const { downloadLink, emailData } = responseData;

      // Extract the base64 data and filename from the download link
      // downloadLink format: <a href="data:application/pdf;base64,..." download="filename.pdf">Download Receipt</a>
      const parser = new DOMParser();
      const doc = parser.parseFromString(downloadLink, 'text/html');
      const linkElement = doc.querySelector('a');
      const pdfDataUrl = linkElement?.href || '';

      // Set the download link and email data state to make them available for rendering
      setDownloadLink(pdfDataUrl);
      setEmailData(emailData);
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

  const copyEmailBody = () => {
    if (!emailData) return;

    // Copy the HTML email body exactly as server sends it
    navigator.clipboard.writeText(emailData.body).then(() => {
      setCopySuccess('Email body copied! Paste it into Gmail.');
      setTimeout(() => setCopySuccess(''), 3000);
    }).catch(err => {
      console.error('Failed to copy: ', err);
      setCopySuccess('Failed to copy');
    });
  };

  const openGmailCompose = () => {
    if (!emailData) return;

    // Convert HTML to plain text for the URL (Gmail compose link has character limits)
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = emailData.body;
    const plainTextBody = tempDiv.textContent || tempDiv.innerText || '';

    const mailtoLink = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(emailData.to)}&su=${encodeURIComponent(emailData.subject)}&body=${encodeURIComponent(plainTextBody)}`;

    window.open(mailtoLink, '_blank');
  };

  const lookupAndAutofillDonor = async () => {
    const email = (getValues('email') || '').toString().trim();
    const mobNo = (getValues('mobNo') || '').toString().trim();

    const hasValidEmail = email.includes('@') && email.includes('.');
    const hasValidMobNo = mobNo.length >= 8;

    if (!hasValidEmail && !hasValidMobNo) return;

    setDonorLookupError('');
    setDonorLookupLoading(true);
    try {
      const params = new URLSearchParams();
      if (hasValidEmail) params.set('email', email);
      if (hasValidMobNo) params.set('mobNo', mobNo);

      const url = `${process.env.REACT_APP_BACKEND_BASE_URL}/api/donations/donor-lookup?${params.toString()}`;
      const response = await fetch(url);
      if (!response.ok) {
        if (response.status === 404) {
          setDonorLookupError('No existing donor found for the given email/phone');
          return;
        }
        throw new Error('Failed to lookup donor');
      }

      const data = await response.json();
      const donor = data?.user;
      if (!donor) return;

      const current = {
        fullName: (getValues('fullName') || '').toString().trim(),
        email: (getValues('email') || '').toString().trim(),
        mobNo: (getValues('mobNo') || '').toString().trim(),
        PANno: (getValues('PANno') || '').toString().trim(),
        donationAmount: (getValues('donationAmount') || '').toString().trim(),
        cause: (getValues('cause') || '').toString().trim(),
      };

      // Only autofill donor personal information (name, email, mobile, PAN)
      // Do NOT autofill previous donation details (cause, amount)
      if (!current.fullName && donor.fullName) setValue('fullName', donor.fullName);
      if (!current.email && donor.email) setValue('email', donor.email);
      if (!current.mobNo && donor.mobNo) setValue('mobNo', donor.mobNo);
      if (!current.PANno && donor.PANno) setValue('PANno', donor.PANno);
    } catch (error) {
      console.error(error);
      setDonorLookupError('Could not lookup donor details');
    } finally {
      setDonorLookupLoading(false);
    }
  };

  useEffect(() => {
    if (downloadLink) {
      if (downloadLinkRef.current) {
        downloadLinkRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [downloadLink]);

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
          <h3>See all Feedback</h3>
          <Link to="/admin/feedback-dashboard">See all feedback</Link>
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
                {...register(field, {
                  onChange: handleInputChange,
                  onBlur: field === 'email' || field === 'mobNo' ? lookupAndAutofillDonor : undefined,
                })}
              />
            </div>
          ))}
          <div className="mb-3">
            <label htmlFor="date" className="form-label">Date</label>
            <input
              type="date"
              id="date"
              defaultValue={today}
              className="form-control"
              {...register('date', { onChange: handleInputChange })}
            />
          </div>
          {donorLookupLoading && (
            <div className="alert alert-info" role="alert">
              Looking up donor details...
            </div>
          )}
          {donorLookupError && !donorLookupLoading && (
            <div className="alert alert-warning" role="alert">{donorLookupError}</div>
          )}
          <button type="submit" disabled={buttonDisabled} className="btn btn-primary">
            {loading ? (
              <div className="spinner-border spinner-border-sm text-light me-2" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            ) : null}
            Submit
          </button>
        </form>
        {apiError && <div className="alert alert-danger mt-3" role="alert">{apiError}</div>}
        <br />
        {downloadLink && emailData && (
          <div ref={downloadLinkRef} className="card my-4">
            <div className="card-header bg-success text-white">
              <strong>✓ Receipt Generated Successfully!</strong>
            </div>
            <div className="card-body">
              <div className="alert alert-info mb-3" role="alert">
                <strong>Email Status:</strong> Being sent automatically in the background.
                <br />
                <strong>If email fails:</strong> Use the quick tools below to send manually.
              </div>

              <div className="mb-3">
                <strong>Receipt Details:</strong><br />
                <strong>Receipt Number:</strong> {emailData.receiptNo}<br />
                <strong>Recipient:</strong> {emailData.to}<br />
                <strong>Filename:</strong> {emailData.receiptFilename}
              </div>

              <div className="d-flex gap-2 flex-wrap mb-3">
                <a
                  href={downloadLink}
                  download={emailData.receiptFilename}
                  className="btn btn-primary"
                  title="Download the receipt PDF"
                >
                  📥 Download Receipt
                </a>

                <button
                  className="btn btn-success"
                  onClick={openGmailCompose}
                  title="Opens Gmail with pre-filled recipient, subject, and body"
                >
                  📧 Open in Gmail
                </button>

                <button
                  className="btn btn-outline-primary"
                  onClick={copyEmailBody}
                  title="Copy the exact HTML email body to clipboard"
                >
                  📋 Copy Email Body
                </button>
              </div>

              {copySuccess && (
                <div className="alert alert-success" role="alert">
                  {copySuccess}
                </div>
              )}

              <div className="alert alert-light mb-0" role="alert">
                <strong>Quick Send Instructions:</strong>
                <ol className="mb-0 mt-2">
                  <li><strong>Click "Download Receipt"</strong> above (saves as {emailData.receiptFilename})</li>
                  <li><strong>Click "Open in Gmail"</strong> - Opens Gmail with recipient, subject, and body pre-filled</li>
                  <li><strong>Attach the downloaded PDF</strong> to the Gmail compose window</li>
                  <li><strong>Click Send</strong> in Gmail</li>
                </ol>
                <p className="mb-0 mt-2 text-muted small">
                  <strong>Note:</strong> Gmail doesn't allow auto-attaching files for security reasons, so you'll need to attach the PDF manually. However, everything else is pre-filled to save you time!
                </p>
              </div>
            </div>
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
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import logo from '../assets/images/Logo.jpg'
import { GlobalContext } from '../context/Provider'

function DonationPaymentRedirect({path = '/app/payment-status'}) {
    const navigate = useNavigate()
    const { transaction, setTransaction } = useContext(GlobalContext)
    const [loading, setLoading] = useState(true)
    const [status, setStatus] = useState({});
    const [displayFields, setDisplayFields] = useState({})

    const convertSeconds = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    };

    const convertCamelCase = (camelCasedString) => {
        const spacedString = camelCasedString.replace(/([A-Z])/g, ' $1').trim();
        return spacedString.charAt(0).toUpperCase() + spacedString.slice(1);
    };

    const handleOkayClick = () => {
        navigate('/')
    }

    const handleDownloadInvoice = () => {
        const link = document.createElement('a');
        link.href = `data:application/pdf;base64,${status?.data?.result?.pdfBase64}`;
        link.download = 'invoice.pdf';
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    useEffect(() => {
        const merchantTransactionId = localStorage.getItem('merchantTransactionId')
        const cause = localStorage.getItem('cause')
        
        // Only fetch if we have required data
        if (merchantTransactionId && cause) {
            const fetchStatus = async () => {
                // Prevent duplicate API calls by checking localStorage flag
                const hasCheckedPayment = localStorage.getItem('paymentChecked')
                if (hasCheckedPayment) return

                setLoading(true)
                const body = { merchantTransactionId, cause }

                try {
                    const res = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}${path}`, {
                        method: 'POST',
                        timeout: 1200000,
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(body)
                    });
                    const data = await res.json();
                    setStatus(data);
                    // Set flag to prevent duplicate API calls
                    localStorage.setItem('paymentChecked', 'true')
                } catch (error) {
                    console.error(error);
                } finally {
                    setLoading(false)
                }
            };

            fetchStatus();
        }
    }, []);

    return (
        <div>
            <div style={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: 'center', }}>
                <div style={{ padding: "3%", boxShadow: "4px 8px 29px -10px rgba(0,0,0,0.75)", borderRadius: "16px" }} >
                    <img src={logo} className="brand-img" alt="RFH Logo" />
                    <br />
                    <br />
                    <h3 style={{ margin: "0" }}>Your payment status: </h3>
                    {loading ?
                        <p>Pending...</p>
                        :
                        <p style={{ color: status.statusColor, fontWeight: 'bold' }}>
                            {status?.message}
                        </p>
                    }

                    <h5 style={{ margin: "0" }}> Amount:  </h5>
                    {loading ?
                        <span class="placeholder col-6"></span>
                        :
                        <small> {status?.data?.data?.amount && `INR ${(Number(status?.data?.data?.amount)) / 100}`}</small>
                    }
                    {console.log(status?.data?.data.paymentInstrument)}
                    <br />
                    <br />

                    <h5 style={{ margin: "0" }}> Transaction ID:  </h5>
                    {loading ?
                        <span class="placeholder col-6"></span>
                        :
                        <small>{status?.data?.data?.transactionId
                        }</small>
                    }
                    <br />
                    <br />

                    <h5 style={{ margin: "0" }}> RFH Reference Number:  </h5>
                    {loading ?
                        <span class="placeholder col-6"></span>
                        :
                        <small>{status?.data?.data?.merchantTransactionId}</small>
                    }
                    <br />
                    <br />
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: "16px" }} >
                        <button onClick={handleOkayClick} type="button" className="btn btn-dark download-button">
                            Go Back Home
                        </button>
                        {/* <button disabled={loading} onClick={handleDownloadInvoice} className="btn btn-dark">
                            Download Invoice
                        </button> */}

                        {(!loading && status.message === 'Your payment is successful.') && <a href={`data:application/pdf;base64,${status?.data?.pdfBase64}`} download={`${status?.data?.data?.merchantTransactionId}.pdf`} target='_blank' rel='noreferrer' >Download Invoice</a>}

                    </div>
                    <p  style={{ color: "#ff7675" }}> <small><i>Please check your email for the receipt</i></small> </p>

                </div>

            </div>

        </div>
    )
}

export default DonationPaymentRedirect
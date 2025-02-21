import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import logo from '../assets/images/Logo.jpg'
import { GlobalContext } from '../context/Provider'

function PaymentRedirect({path = '/app/payment-status'}) {
    const navigate = useNavigate()
    const { transaction, setTransaction } = useContext(GlobalContext)
    const [paymentStatus, setPaymentStatus] = useState("")
    const [paymentDetails, setPaymentDetails] = useState({})
    const [loading, setLoading] = useState(true)
    const [status, setStatus] = useState({});
    const [timeElapsed, setTimeElapsed] = useState(0);
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

    console.log("transactionID Fav ", transaction)

    const handleDownloadInvoice = () => {
        const link = document.createElement('a');
        link.href = `data:application/pdf;base64,${status?.data?.result?.pdfBase64}`;
        link.download = 'invoice.pdf';
        link.target = '_blank'; // add target="_blank" to open link in new tab
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    useEffect(() => {
        if (Object.keys(status).length === 0) {
            setLoading(true)
            const merchantTransactionId = localStorage.getItem('merchantTransactionId')
            const cause = localStorage.getItem('cause')
            const formData = { merchantTransactionId, cause }
            
            const pollPaymentStatus = async () => {
                try {
                    const response = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/marathons/payment/check-status`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ merchantTransactionId })
                    });
                    
                    const result = await response.json();
                    
                    if (result.code === 'PAYMENT_SUCCESS' || result.code === 'PAYMENT_ERROR') {
                        // Update payment and user details
                        const updateResponse = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/marathons/payment/update-details`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                merchantTransactionId,
                                paymentResponse: result,
                                formData
                            })
                        });
                        
                        if (result.code === 'PAYMENT_SUCCESS') {
                            // Generate and send receipt
                            const receiptResponse = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/marathons/payment/send-receipt`, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                    merchantTransactionId,
                                    formData
                                })
                            });
                            
                            const receiptResult = await receiptResponse.json();
                            if (receiptResult.success) {
                                setStatus({
                                    message: result.message,
                                    data: { ...result, pdfBase64: receiptResult.pdfBase64 },
                                    statusColor: 'green',
                                    downloadLink: receiptResult.downloadLink
                                });
                            }
                        } else {
                            setStatus({
                                message: result.message,
                                data: result,
                                statusColor: 'red'
                            });
                        }
                        setLoading(false);
                        return true; // Stop polling
                    }
                    return false; // Continue polling
                } catch (error) {
                    console.error('Error checking payment status:', error);
                    return false; // Continue polling on error
                }
            };

            const startPolling = async () => {
                const interval = setInterval(async () => {
                    const shouldStop = await pollPaymentStatus();
                    if (shouldStop) {
                        clearInterval(interval);
                    }
                }, 3000); // Poll every 3 seconds

                // Stop polling after 5 minutes
                setTimeout(() => {
                    clearInterval(interval);
                    if (loading) {
                        setLoading(false);
                        setStatus({
                            message: 'Payment status check timed out',
                            statusColor: 'red'
                        });
                    }
                }, 5 * 60 * 1000);
            };

            startPolling();
        }
    }, [status, loading]);

    useEffect(() => {
        // Start timer
        const intervalId = setInterval(() => {
            setTimeElapsed(timeElapsed + 1);
        }, 1000);

        // Clear interval when component unmounts
        return () => clearInterval(intervalId);
    }, [timeElapsed])


    return (
        <div>
            <div style={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: 'center', }}>
                <div style={{ padding: "3%", boxShadow: "4px 8px 29px -10px rgba(0,0,0,0.75)", borderRadius: "16px" }} >
                    <img src={logo} className="brand-img" alt="RFH Logo" />
                    <br />
                    <br />
                    <h3 style={{ margin: "0" }}>Your payment status: </h3>
                    {loading ?
                        <p>Pending... {convertSeconds(timeElapsed)} </p>
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

export default PaymentRedirect
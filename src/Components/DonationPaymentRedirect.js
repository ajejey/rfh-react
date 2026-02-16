import React, { useContext, useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import logo from '../assets/images/Logo.jpg'
import { GlobalContext } from '../context/Provider'

function DonationPaymentRedirect({path = '/app/payment-status'}) {
    const navigate = useNavigate()
    const { transaction, setTransaction } = useContext(GlobalContext)
    const [paymentStatus, setPaymentStatus] = useState("")
    const [paymentDetails, setPaymentDetails] = useState({})
    const [loading, setLoading] = useState(true)
    const [status, setStatus] = useState({});
    const [displayFields, setDisplayFields] = useState({})
    const fetchStatusCalled = useRef(false);

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
        link.target = '_blank'; 
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    useEffect(() => {
        if (!fetchStatusCalled.current) {
            fetchStatusCalled.current = true;
            setLoading(true);
            const fetchStatus = async () => {
                let merchantTransactionId = localStorage.getItem('merchantTransactionId')
                let cause = localStorage.getItem('cause')
                let body = { merchantTransactionId: merchantTransactionId, cause: cause }

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
                    console.log("data ", data)

                    setStatus(data);
                    setLoading(false)

                    // If payment successful and shouldSendEmail flag is set, send email via separate endpoint
                    if (data.statusColor === 'green' && data.shouldSendEmail && data.merchantTransactionId) {
                        console.log('Sending payment receipt email...');
                        try {
                            const emailRes = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/send-payment-receipt`, {
                                method: 'POST',
                                headers: {
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify({ merchantTransactionId: data.merchantTransactionId })
                            });
                            const emailData = await emailRes.json();
                            console.log('Email send result:', emailData);
                        } catch (emailError) {
                            console.error('Error sending email:', emailError);
                            // Don't fail the whole flow if email fails - user still got their payment
                        }
                    }

                    // Check if payment is still pending
                    // if (data.success === true && data.data.state === 'PENDING') {
                    //     setTimeout(fetchStatus, 3000);
                    // }
                } catch (error) {
                    console.error(error);
                }
            };

            fetchStatus();

        }


    }, [path]);

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
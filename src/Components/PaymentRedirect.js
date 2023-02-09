import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import logo from '../assets/images/Logo.jpg'
import { GlobalContext } from '../context/Provider'

function PaymentRedirect() {
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

    useEffect(() => {
        setLoading(true)
        const fetchStatus = async () => {
            let transactionID = localStorage.getItem('transactionID')
            let body = { merchantTransactionId: transactionID }
            try {
                const res = await fetch('https://rfh-backend.up.railway.app/app/payment-status', {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(body)
                });
                const data = await res.json();
                console.log("data ", data)

                setStatus(data);
                setLoading(false)

                // Check if payment is still pending
                // if (data.success === true && data.data.state === 'PENDING') {
                //     setTimeout(fetchStatus, 3000);
                // }
            } catch (error) {
                console.error(error);
            }
        };

        fetchStatus();


    }, []);

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
            <div style={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: 'center', }}>
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

                    {status?.message === 'Your payment is successful.' &&
                        <div>
                            <h5 style={{ margin: "0" }}> Amount:  </h5>
                            {loading ?
                                <span class="placeholder col-12"></span>
                                :
                                <small> {status?.data?.data?.amount && `INR ${(Number(status?.data?.data?.amount)) / 1000}`}</small>
                            }
                            {console.log(status?.data?.data.paymentInstrument)}
                            <br />
                            <br />

                            {Object.keys(status?.data?.data.paymentInstrument).map((item, index) => (
                                <div>
                                    <h5 style={{ margin: "0" }}> {convertCamelCase(item)}: </h5>
                                    <small> {status?.data?.data.paymentInstrument[item]} </small>
                                    <br />
                                    <br />
                                </div>
                            ))}
                            <h6>Thank you for your generous donation towards <br /> Rupee For Humanity</h6>
                        </div>
                    }

                    {/* <h5 style={{ margin: "0" }}> IFSC:  </h5>
                    {loading ?
                        <span class="placeholder col-12"></span>
                        :
                        <small>{status?.data?.paymentInstrument?.ifsc}</small>
                    }
                    <br />
                    <br />
                    <h5 style={{ margin: "0" }}> Account No:  </h5>
                    {loading ?
                        <span class="placeholder col-12"></span>
                        :
                        <small>{status?.data?.paymentInstrument?.maskedAccountNumber}</small>
                    }
                    <br />
                    
                    <h5 style={{ margin: "0" }}> Transaction ID:  </h5>
                    {loading ?
                        <span class="placeholder col-12"></span>
                        :
                        <small>{status?.data?.transactionId}</small>
                    } */}
                    <br />
                    <button onClick={handleOkayClick} type="button" className="btn btn-dark download-button">
                        Go Back Home
                    </button>
                </div>

            </div>

        </div>
    )
}

export default PaymentRedirect
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function PaymentRedirect() {
    const navigate = useNavigate()
    const [paymentStatus, setPaymentStatus] = useState("")
    const [paymentDetails, setPaymentDetails] = useState({})

    const handleOkayClick = () => {
        navigate('/')
    }

    useEffect(() => {
        // if (paymentStatus === 'Payment Initiated') {
        const getPaymentStatus = async () => {
            try {
                const response = await fetch("https://rfh-backend.up.railway.app/app/payment-status", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                const data = await response.json();
                console.log("status data", data);
                setPaymentStatus(data?.message)
                setPaymentDetails(data?.data)
            } catch (error) {
                console.log(error)
            }
        }
        getPaymentStatus()
        // }
    }, [paymentStatus])
    return (
        <div>
            <div style={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: 'center', }}>
                <div style={{ padding: "3%", boxShadow: "4px 8px 29px -10px rgba(0,0,0,0.75)", borderRadius: "16px" }} >
                    <h3 style={{ margin: "0" }}>Your payment status: </h3>
                    <small>{paymentStatus}</small>
                    <br />
                    <br />

                    <h5 style={{ margin: "0" }}> Amount:  </h5>
                    <small>INR {Number(paymentDetails?.amount) / 100}</small>
                    <br />
                    <br />
                    <h5 style={{ margin: "0" }}> UPI Transaction ID:  </h5>
                    <small>{paymentDetails?.paymentInstrument?.upiTransactionId}</small>
                    <br />
                    <br />
                    <h5 style={{ margin: "0" }}> Account No:  </h5>
                    <small>{paymentDetails?.paymentInstrument?.maskedAccountNumber}</small>
                    <br />
                    <br />
                    <h5 style={{ margin: "0" }}> Transaction ID:  </h5>
                    <small>{paymentDetails?.transactionId}</small>
                    <br />
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
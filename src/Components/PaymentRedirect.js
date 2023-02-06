import React, { useEffect, useState } from 'react'

function PaymentRedirect() {
    const [paymentStatus, setPaymentStatus] = useState("")
    const [paymentDetails, setPaymentDetails] = useState({})
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
                setPaymentStatus(data.message)
                setPaymentDetails(data.data)
            } catch (error) {
                console.log(error)
            }
        }
        getPaymentStatus()
        // }
    }, [paymentStatus])
    return (
        <div>
            <h3>Your payment status is:  {paymentStatus} </h3>
            <h4>Payment details are: </h4>
            <p> Amount: INR {Number(paymentDetails.amount) / 100} </p>
            <p> UPI Transaction ID: {paymentDetails.paymentInstrument.upiTransactionId} </p>
            <p> Account No: {paymentDetails.paymentInstrument.maskedAccountNumber} </p>
            <p> Transaction ID: {paymentDetails.transactionId} </p>
        </div>
    )
}

export default PaymentRedirect
import { Button } from '@mui/material';
import React, { useContext, useState } from 'react'
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { GlobalContext } from '../context/Provider';

function DonateForm(props) {
    const abortController = new AbortController();
    const signal = abortController.signal;
    const navigate = useNavigate()


    const { register, handleSubmit, getValues, setValue, formState: { errors } } = useForm();
    const { transaction, setTransaction } = useContext(GlobalContext)
    const [paymentStatus, setPaymentStatus] = useState("")
    const [paymentLink, setPaymentLink] = useState("")
    const [loading, setLoading] = useState(false)
    const [status, setStatus] = useState({});

    const handleCancel = () => {
        abortController.abort();
        // handleClose();
    }

    const onSubmit = async (formData) => {
        console.log("donate data ", formData)
        // setValue("merchantTransactionId", generateTransactionId())
        // setOpen(false);
        setLoading(true)
        let formDataCopy = JSON.parse(JSON.stringify(formData))
        // formDataCopy = { ...formDataCopy, merchantTransactionId: generateTransactionId() }
        formDataCopy = { ...formDataCopy, volunteeringEvent: props?.volunteeringEvent || "" }

        // favDispatch({ type: "SET_TRANSACTION_ID", payload: formDataCopy })
        setTransaction({ ...formDataCopy })
        // localStorage.setItem('transactionID', formDataCopy.merchantTransactionId);

        try {
            // const response = await fetch("https://rfh-backend.up.railway.app/api/initiate-payment", {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/initiate-payment`, {
                method: "POST",
                timeout: 1200000,
                signal: signal,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formDataCopy),
            });
            const data = await response.json();
            console.log("data.message", data, data.message);
            console.log("merchantTransactionId from backend ", data?.data?.merchantTransactionId)
            localStorage.setItem('merchantTransactionId', data?.data?.merchantTransactionId
            );
            setPaymentStatus(data.message)
            setPaymentLink(data?.data?.instrumentResponse?.redirectInfo?.url)
            // window.location.href = data?.data?.instrumentResponse?.redirectInfo?.url;

            window.open(
                data?.data?.instrumentResponse?.redirectInfo?.url,
                '_blank' // <- This is what makes it open in a new window.
            );


            const callCheckAPI = async () => {
                let merchantTransactionId = localStorage.getItem('merchantTransactionId')
                // let transactionID = formDataCopy.merchantTransactionId
                let body = { merchantTransactionId: merchantTransactionId }
                try {
                    const res = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/app/payment-status`, {
                        method: 'POST',
                        timeout: 1200000,
                        signal: signal,
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(body)
                    });
                    const data = await res.json();
                    console.log("data ", data)

                    setStatus(data);
                    setLoading(false)

                    navigate('/payment-redirect')

                    // Check if payment is still pending
                    // if (data.success === true && data.data.state === 'PENDING') {
                    //     setTimeout(fetchStatus, 3000);
                    // }
                } catch (error) {
                    console.error(error);
                    setLoading(false)
                    setPaymentStatus(error)
                }
            }

            setTimeout(callCheckAPI, 20000)


        } catch (error) {
            console.error(error);
            setLoading(false);
            setPaymentStatus(error)
        }

    }

    return (
        <>
           
            <form onSubmit={handleSubmit(onSubmit)}>
                
                    <div className="form-group">
                        <label htmlFor="fullName">Full Name <span style={{ color: "red" }}>*</span></label>
                        <input {...register("fullName", { required: true })} type="text" className="form-control" placeholder="" id="fullName" />
                        {errors.fullName && <p style={{ color: "red" }}>This field is mandatory</p>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email <span style={{ color: "red" }}>*</span></label>
                        <input {...register("email", { required: true })} className="form-control" type="email" name="email" id="email" />
                        {errors.email && <p style={{ color: "red" }}>This field is mandatory</p>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="mobile">Mobile No. <small>(include country code (+91 for India))</small>  <span style={{ color: "red" }}>*</span></label>
                        <input {...register("mobNo", { required: true })} className="form-control" type="tel" id="mobile" />
                        {errors.mobNo && <p style={{ color: "red" }}>This field is mandatory</p>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="PANno">PAN Number <small>(write NA if not available)</small>  <span style={{ color: "red" }}>*</span></label>
                        <input {...register("PANno", { required: true })} type="text" className="form-control" id="PANno" />
                        {errors.PANno && <p style={{ color: "red" }}>This field is mandatory</p>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="donationAmount">Amount you would like to Donate <span style={{ color: "red" }}>*</span></label>
                        <input {...register("donationAmount", { required: true })} type="number" className="form-control" id="donationAmount" />
                        {errors.donationAmount && <p style={{ color: "red" }}>This field is mandatory</p>}
                    </div>
                    <small style={{ color: "green", fontWeight: "600" }}> {paymentStatus} </small>
                    {paymentStatus === "Payment Initiated" && <a href={paymentLink} target="_blank" rel='noreferrer' > Payment Link</a>}
                
                <div style={{padding: "16px 0 24px"}}>
                    {/* <Button onClick={handleCancel}>Cancel</Button> */}
                    <Button type='submit' variant='filled' style={{ backgroundColor: "#040002", color: "lightgray" }} >
                        {loading === true ?
                            <div class="spinner-border text-light spinner-border-sm m-1" role="status">
                                <span class="visually-hidden">Loading...</span>
                            </div> :
                            <span></span>}
                        Donate
                    </Button>
                </div>
            </form>
        </>
    )
}

export default DonateForm
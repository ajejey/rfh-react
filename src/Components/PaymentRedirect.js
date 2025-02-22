import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import logo from '../assets/images/Logo.jpg'
import { GlobalContext } from '../context/Provider'
import Helmet from 'react-helmet';

function PaymentRedirect({path = '/app/payment-status'}) {
    const navigate = useNavigate()
    const { transaction, setTransaction } = useContext(GlobalContext)
    const [paymentStatus, setPaymentStatus] = useState("")
    const [paymentDetails, setPaymentDetails] = useState({})
    const [loading, setLoading] = useState(true)
    const [status, setStatus] = useState({});
    const [timeElapsed, setTimeElapsed] = useState(0);
    const [displayFields, setDisplayFields] = useState({})
    const [currentStep, setCurrentStep] = useState('verifying')
    const [stepStatus, setStepStatus] = useState({
        verifying: { status: 'loading', message: 'Verifying payment status...' },
        updating: { status: 'pending', message: 'Updating your details' },
        sending: { status: 'pending', message: 'Generating receipt and sending email' }
    })
    const [paymentInfo, setPaymentInfo] = useState({
        amount: null,
        transactionId: null,
        rfhReferenceId: null
    });

    const convertSeconds = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    };

    const updateStepStatus = (step, status, message = null) => {
        setStepStatus(prev => ({
            ...prev,
            [step]: { 
                status,
                message: message || prev[step].message
            }
        }));
    };

    const handleOkayClick = () => {
        navigate('/')
    }

    useEffect(() => {
        let pollingInterval;
        let timeoutId;

        const handlePaymentProcess = async (merchantTransactionId, formData) => {
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
                    // Clear polling once we have a definitive result
                    clearInterval(pollingInterval);
                    clearTimeout(timeoutId);

                    // Update verification status
                    updateStepStatus('verifying', 'complete', 
                        result.code === 'PAYMENT_SUCCESS' ? 'Payment verified successfully!' : 'Payment verification failed');
                    
                    if (result.code === 'PAYMENT_SUCCESS') {
                        // Show payment details from verification
                        setPaymentInfo(prev => ({
                            ...prev,
                            amount: result.data?.amount,
                            transactionId: result.data?.transactionId
                        }));

                        try {
                            // Start updating details
                            setCurrentStep('updating');
                            updateStepStatus('updating', 'loading');
                            
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

                            const updateResult = await updateResponse.json();
                            if (updateResult.success) {
                                updateStepStatus('updating', 'complete', 'Details updated successfully!');
                                
                                // Show RFH Reference ID after details update
                                setPaymentInfo(prev => ({
                                    ...prev,
                                    rfhReferenceId: updateResult.data?.rfhReferenceId
                                }));
                                
                                // Start sending receipt
                                setCurrentStep('sending');
                                updateStepStatus('sending', 'loading');
                                
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
                                    updateStepStatus('sending', 'complete', 'Receipt sent successfully!');
                                } else {
                                    updateStepStatus('sending', 'error', 'Failed to send receipt. Our team will send it manually.');
                                }
                            } else {
                                updateStepStatus('updating', 'error', 'Failed to update details. Please contact support.');
                            }
                        } catch (error) {
                            console.error('Error in update/receipt process:', error);
                            updateStepStatus('updating', 'error', 'An error occurred. Please contact support.');
                        }
                    } else {
                        updateStepStatus('updating', 'error', 'Payment failed. Please try again.');
                    }
                }
            } catch (error) {
                console.error('Error in payment verification:', error);
                updateStepStatus('verifying', 'error', 'Failed to verify payment. Please contact support.');
            }
        };

        const startPaymentProcess = () => {
            const merchantTransactionId = localStorage.getItem('merchantTransactionId');
            const cause = localStorage.getItem('cause');
            const formData = { merchantTransactionId, cause };
            
            if (!merchantTransactionId) {
                console.error('No merchantTransactionId found');
                return;
            }

            setLoading(true);
            
            // Initial check
            handlePaymentProcess(merchantTransactionId, formData);
            
            // Start polling
            pollingInterval = setInterval(() => {
                handlePaymentProcess(merchantTransactionId, formData);
            }, 3000);
            
            // Set timeout to stop polling after 5 minutes
            timeoutId = setTimeout(() => {
                clearInterval(pollingInterval);
                if (loading) {
                    setLoading(false);
                    updateStepStatus('verifying', 'error', 'Payment status check timed out');
                    setStatus({
                        message: 'Payment status check timed out',
                        statusColor: 'red'
                    });
                }
            }, 5 * 60 * 1000);
        };

        startPaymentProcess();

        // Cleanup function
        return () => {
            clearInterval(pollingInterval);
            clearTimeout(timeoutId);
        };
    }, [navigate]);

    // Timer effect
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeElapsed(prev => prev + 1);
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const steps = [
        { status: stepStatus.verifying.status, text: stepStatus.verifying.message },
        { status: stepStatus.updating.status, text: stepStatus.updating.message },
        { status: stepStatus.sending.status, text: stepStatus.sending.message },
    ];

    const PaymentDetails = () => (
        <div className="payment-details mt-4">
            {(paymentInfo.amount || paymentInfo.transactionId || paymentInfo.rfhReferenceId) && (
                <div className="card bg-dark text-light">
                    <div className="card-body">
                        <h5 className="card-title mb-4">Payment Details</h5>
                        <div className="details-grid">
                            {paymentInfo.amount && (
                                <div className="detail-item">
                                    <span className="label">Amount Paid:</span>
                                    <span className="value">₹{paymentInfo.amount}</span>
                                </div>
                            )}
                            {paymentInfo.transactionId && (
                                <div className="detail-item">
                                    <span className="label">Transaction ID:</span>
                                    <span className="value">{paymentInfo.transactionId}</span>
                                </div>
                            )}
                            {paymentInfo.rfhReferenceId && (
                                <div className="detail-item">
                                    <span className="label">RFH Reference ID:</span>
                                    <span className="value">{paymentInfo.rfhReferenceId}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

    const styles = `
        .payment-details .card {
            border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .details-grid {
            display: grid;
            gap: 1rem;
        }
        .detail-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0.5rem 0;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        .detail-item:last-child {
            border-bottom: none;
        }
        .detail-item .label {
            color: #f39c12;
            font-weight: 500;
        }
        .detail-item .value {
            font-family: monospace;
            background: rgba(255, 255, 255, 0.1);
            padding: 0.25rem 0.5rem;
            border-radius: 4px;
        }
    `;

    return (
        <div style={{ backgroundColor: "#040002", color: "lightgray", minHeight: "100vh" }}>
            <Helmet>
                <title>Payment Status | RFH</title>
                <style>{styles}</style>
            </Helmet>
            
            <div className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-md-8">
                        <div className="text-center mb-4">
                            <img src={logo} alt="RFH Logo" style={{ width: '150px' }} />
                        </div>
                        
                        <div className="status-steps">
                            {Object.entries(stepStatus).map(([step, { status, message }]) => (
                                <div key={step} className={`status-step ${currentStep === step ? 'current' : ''}`}>
                                    <div className={`status-indicator ${status}`}>
                                        {status === 'loading' && <div className="spinner-border spinner-border-sm" role="status" />}
                                        {status === 'complete' && <i className="fas fa-check" />}
                                        {status === 'error' && <i className="fas fa-times" />}
                                        {status === 'pending' && <i className="fas fa-circle" />}
                                    </div>
                                    <div className="status-message">{message}</div>
                                </div>
                            ))}
                        </div>

                        <PaymentDetails />

                        {Object.values(stepStatus).every(step => 
                            step.status === 'complete' || step.status === 'error'
                        ) && (
                            <div className="text-center mt-4">
                                <button className="btn btn-primary" onClick={handleOkayClick}>
                                    Back to Home
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PaymentRedirect;
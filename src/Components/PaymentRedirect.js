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
    const [currentStep, setCurrentStep] = useState('verifying')
    const [stepStatus, setStepStatus] = useState({
        verifying: { status: 'loading', message: 'Verifying payment status...' },
        updating: { status: 'pending', message: 'Updating your details' },
        sending: { status: 'pending', message: 'Generating receipt and sending email' }
    })

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
                        updateStepStatus('verifying', 'complete', 
                            result.code === 'PAYMENT_SUCCESS' ? 'Payment verified successfully!' : 'Payment verification failed');
                        
                        // Move to updating step
                        setCurrentStep('updating');
                        updateStepStatus('updating', 'loading');
                        
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
                            updateStepStatus('updating', 'complete', 'Details updated successfully!');
                            
                            // Move to sending receipt step
                            setCurrentStep('sending');
                            updateStepStatus('sending', 'loading');
                            
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
                                updateStepStatus('sending', 'complete', 'Receipt sent successfully!');
                                setStatus({
                                    message: result.message,
                                    data: { ...result, pdfBase64: receiptResult.pdfBase64 },
                                    statusColor: 'green',
                                    downloadLink: receiptResult.downloadLink
                                });
                            } else {
                                updateStepStatus('sending', 'error', 'Failed to send receipt');
                            }
                        } else {
                            updateStepStatus('updating', 'error', 'Failed to update details');
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
                    updateStepStatus(currentStep, 'error', 'An error occurred');
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
                        updateStepStatus('verifying', 'error', 'Payment status check timed out');
                        setStatus({
                            message: 'Payment status check timed out',
                            statusColor: 'red'
                        });
                    }
                }, 5 * 60 * 1000);
            };

            startPolling();
        }
    }, [status, loading, currentStep]);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeElapsed(prev => prev + 1);
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className='container'>
            <div className="row">
                <div className="col-md-6 offset-md-3">
                    <div className="card mt-5">
                        <div className="card-body text-center">
                            <img src={logo} alt="Logo" style={{ width: '100px', marginBottom: '20px' }} />
                            
                            {/* Step Status Indicators */}
                            <div className="steps-container mb-4">
                                {Object.entries(stepStatus).map(([step, { status, message }]) => (
                                    <div key={step} className={`step-item mb-3 ${currentStep === step ? 'active' : ''}`}>
                                        <div className="d-flex align-items-center">
                                            <div className={`status-indicator ${status}`}>
                                                {status === 'loading' && <div className="spinner-border spinner-border-sm" role="status" />}
                                                {status === 'complete' && <i className="fas fa-check" />}
                                                {status === 'error' && <i className="fas fa-times" />}
                                            </div>
                                            <div className="step-message ms-3 text-start">
                                                <p className="mb-0" style={{ color: currentStep === step ? '#000' : '#666' }}>
                                                    {message}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Timer */}
                            <p className="text-muted mb-4">
                                Time elapsed: {convertSeconds(timeElapsed)}
                            </p>

                            {/* Original Status Content */}
                            {status?.message && (
                                <div className={`alert alert-${status.statusColor === 'green' ? 'success' : 'danger'}`}>
                                    {status.message}
                                </div>
                            )}

                            {/* Transaction Details */}
                            <div className="transaction-details mt-4">
                                <div className="detail-item mb-3">
                                    <h5 className="detail-label mb-1">Amount</h5>
                                    {loading ? (
                                        <div className="placeholder-glow">
                                            <span className="placeholder col-6"></span>
                                        </div>
                                    ) : (
                                        <p className="detail-value mb-0">
                                            {status?.data?.data?.amount && `INR ${(Number(status?.data?.data?.amount)) / 100}`}
                                        </p>
                                    )}
                                </div>

                                <div className="detail-item mb-3">
                                    <h5 className="detail-label mb-1">Transaction ID</h5>
                                    {loading ? (
                                        <div className="placeholder-glow">
                                            <span className="placeholder col-6"></span>
                                        </div>
                                    ) : (
                                        <p className="detail-value mb-0">
                                            {status?.data?.data?.transactionId || 'N/A'}
                                        </p>
                                    )}
                                </div>

                                <div className="detail-item mb-3">
                                    <h5 className="detail-label mb-1">RFH Reference Number</h5>
                                    {loading ? (
                                        <div className="placeholder-glow">
                                            <span className="placeholder col-6"></span>
                                        </div>
                                    ) : (
                                        <p className="detail-value mb-0">
                                            {status?.data?.data?.merchantTransactionId}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Download Receipt Button */}
                            {status?.downloadLink && (
                                <div className="mt-3" dangerouslySetInnerHTML={{ __html: status.downloadLink }} />
                            )}

                            {/* Email Note */}
                            {!loading && status?.statusColor === 'green' && (
                                <p className="text-muted mt-3">
                                    <small><i>Please check your email for the receipt</i></small>
                                </p>
                            )}

                            {/* Okay Button */}
                            <button onClick={handleOkayClick} className="btn btn-primary mt-3">
                                Okay
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .steps-container {
                    text-align: left;
                    padding: 20px;
                    border-radius: 8px;
                    background: #f8f9fa;
                }
                .step-item {
                    opacity: 0.7;
                }
                .step-item.active {
                    opacity: 1;
                }
                .status-indicator {
                    width: 24px;
                    height: 24px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                }
                .status-indicator.loading {
                    background: #f8f9fa;
                }
                .status-indicator.complete {
                    background: #28a745;
                    color: white;
                }
                .status-indicator.error {
                    background: #dc3545;
                    color: white;
                }
                .status-indicator.pending {
                    background: #6c757d;
                    opacity: 0.5;
                }
                .transaction-details {
                    text-align: left;
                    padding: 20px;
                    border-radius: 8px;
                    background: #fff;
                    border: 1px solid #dee2e6;
                }
                .detail-label {
                    color: #6c757d;
                    font-size: 0.9rem;
                    margin: 0;
                }
                .detail-value {
                    color: #212529;
                    font-size: 1rem;
                }
            `}</style>
        </div>
    );
}

export default PaymentRedirect;
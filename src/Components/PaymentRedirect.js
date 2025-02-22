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
                                    setStatus({
                                        message: result.message,
                                        data: { ...result, pdfBase64: receiptResult.pdfBase64 },
                                        statusColor: 'green',
                                        downloadLink: receiptResult.downloadLink
                                    });
                                } else {
                                    throw new Error('Failed to send receipt');
                                }
                            } else {
                                throw new Error('Failed to update details');
                            }
                        } catch (error) {
                            console.error('Error in payment process:', error);
                            updateStepStatus(currentStep, 'error', error.message);
                            setStatus({
                                message: error.message,
                                statusColor: 'red'
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
                    return true;
                }
                return false;
            } catch (error) {
                console.error('Error checking payment status:', error);
                updateStepStatus(currentStep, 'error', 'An error occurred');
                setLoading(false);
                return false;
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
    }, []); // Empty dependency array since we only want this to run once

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

    return (
        <>
        <div className="payment-redirect-container">
            <div className="payment-card">
                <div className="logo-container">
                    <img src={logo} alt="Rupee for Humanity" className="rfh-logo" />
                </div>

                <div className="status-content">
                    {/* Progress Steps */}
                    <div className="progress-steps">
                        {steps.map((step, index) => (
                            <div key={index} className={`step ${step.status}`}>
                                <div className="step-indicator">
                                    {step.status === 'complete' ? (
                                        <i className="fas fa-check"></i>
                                    ) : step.status === 'error' ? (
                                        <i className="fas fa-times"></i>
                                    ) : step.status === 'loading' ? (
                                        <div className="spinner-border spinner-border-sm" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                    ) : (
                                        <span className="step-number">{index + 1}</span>
                                    )}
                                </div>
                                <div className="step-content">
                                    <p className="step-text">{step.text}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Timer */}
                    <div className="timer">
                        Time elapsed: {timeElapsed}s
                    </div>

                    {/* Success Message */}
                    {status?.statusColor === 'green' && (
                        <div className="success-message">
                            <i className="fas fa-check-circle"></i>
                            <h3>Payment Successful!</h3>
                        </div>
                    )}

                    {/* Transaction Details */}
                    <div className="transaction-details">
                        <div className="detail-grid">
                            <div className="detail-item">
                                <label>Amount</label>
                                <div className="detail-value">
                                    {status?.data?.data?.amount ? (
                                        <div className="placeholder-glow">
                                            <span className="placeholder col-8"></span>
                                        </div>
                                    ) : (
                                        <strong>
                                            {status?.data?.data?.amount && `₹${(Number(status?.data?.data?.amount)) / 100}`}
                                        </strong>
                                    )}
                                </div>
                            </div>

                            <div className="detail-item">
                                <label>Transaction ID</label>
                                <div className="detail-value">
                                    {status?.data?.data?.transactionId ? (
                                        <div className="placeholder-glow">
                                            <span className="placeholder col-8"></span>
                                        </div>
                                    ) : (
                                        <code>{status?.data?.data?.transactionId || 'N/A'}</code>
                                    )}
                                </div>
                            </div>

                            <div className="detail-item">
                                <label>RFH Reference</label>
                                <div className="detail-value">
                                    {status?.data?.data?.merchantTransactionId ? (
                                        <div className="placeholder-glow">
                                            <span className="placeholder col-8"></span>
                                        </div>
                                    ) : (
                                        <code>{status?.data?.data?.merchantTransactionId}</code>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="action-buttons">
                        {status?.downloadLink && (
                            <div className="download-button" dangerouslySetInnerHTML={{ __html: status.downloadLink }} />
                        )}
                        <button onClick={handleOkayClick} className="home-button">
                            <i className="fas fa-home"></i>
                            Return to Home
                        </button>
                    </div>

                    {/* Receipt Note */}
                    {!loading && status?.statusColor === 'green' && (
                        <div className="receipt-note">
                            <i className="fas fa-envelope"></i>
                            A copy of your receipt has been sent to your email
                        </div>
                    )}
                </div>
            </div>
        </div>

        <style jsx>{`
            .payment-redirect-container {
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 2rem;
                background: linear-gradient(135deg, #f5f7fa 0%, #e4e9f2 100%);
            }

            .payment-card {
                background: white;
                border-radius: 16px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
                width: 100%;
                max-width: 800px;
                overflow: hidden;
            }

            .logo-container {
                background: #f8f9fa;
                padding: 1.5rem;
                text-align: center;
                border-bottom: 1px solid #e9ecef;
            }

            .rfh-logo {
                height: 60px;
                width: auto;
            }

            .status-content {
                padding: 2rem;
            }

            .progress-steps {
                max-width: 600px;
                margin: 0 auto 2rem;
            }

            .step {
                display: flex;
                align-items: flex-start;
                margin-bottom: 1rem;
            }

            .step:last-child {
                margin-bottom: 0;
            }

            .step-indicator {
                width: 28px;
                height: 28px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                margin-right: 1rem;
                flex-shrink: 0;
                font-size: 0.875rem;
                color: white;
            }

            .step.complete .step-indicator {
                background: #28a745;
            }

            .step.error .step-indicator {
                background: #dc3545;
            }

            .step.loading .step-indicator {
                background: #007bff;
            }

            .step.pending .step-indicator {
                background: #6c757d;
            }

            .step-content {
                flex-grow: 1;
            }

            .step-text {
                margin: 0;
                line-height: 28px;
                color: #495057;
            }

            .timer {
                text-align: center;
                color: #6c757d;
                font-size: 0.875rem;
                margin-bottom: 1.5rem;
            }

            .success-message {
                text-align: center;
                color: #28a745;
                margin-bottom: 2rem;
            }

            .success-message i {
                font-size: 3rem;
                margin-bottom: 1rem;
            }

            .success-message h3 {
                margin: 0;
                color: #212529;
            }

            .transaction-details {
                background: #f8f9fa;
                border-radius: 12px;
                padding: 1.5rem;
                margin-bottom: 2rem;
            }

            .detail-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 1.5rem;
            }

            .detail-item {
                display: flex;
                flex-direction: column;
            }

            .detail-item label {
                color: #6c757d;
                font-size: 0.875rem;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                margin-bottom: 0.5rem;
            }

            .detail-value {
                font-size: 1rem;
                color: #212529;
            }

            .detail-value code {
                background: #e9ecef;
                padding: 0.25rem 0.5rem;
                border-radius: 4px;
                font-size: 0.875rem;
                word-break: break-all;
            }

            .action-buttons {
                display: flex;
                flex-wrap: wrap;
                gap: 1rem;
                justify-content: center;
                margin-bottom: 1.5rem;
            }

            .download-button a {
                display: inline-flex;
                align-items: center;
                padding: 0.75rem 1.5rem;
                background: #28a745;
                color: white;
                text-decoration: none;
                border-radius: 8px;
                font-weight: 500;
                transition: all 0.2s;
            }

            .download-button a:hover {
                background: #218838;
                transform: translateY(-1px);
            }

            .home-button {
                display: inline-flex;
                align-items: center;
                gap: 0.5rem;
                padding: 0.75rem 1.5rem;
                background: #6c757d;
                color: white;
                border: none;
                border-radius: 8px;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.2s;
            }

            .home-button:hover {
                background: #5a6268;
                transform: translateY(-1px);
            }

            .receipt-note {
                text-align: center;
                color: #6c757d;
                font-size: 0.875rem;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 0.5rem;
            }

            @media (max-width: 768px) {
                .payment-redirect-container {
                    padding: 1rem;
                }

                .status-content {
                    padding: 1.5rem;
                }

                .detail-grid {
                    grid-template-columns: 1fr;
                    gap: 1rem;
                }

                .action-buttons {
                    flex-direction: column;
                }

                .download-button a,
                .home-button {
                    width: 100%;
                    justify-content: center;
                }
            }
        `}</style>
        </>
    );
}

export default PaymentRedirect;
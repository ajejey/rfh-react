import React from 'react'
import { Navigate, Outlet } from 'react-router-dom';
import useAuthStatus from '../CustomHooks/useAuthStatus'

function PrivateRoute() {
    const { loggedIn, checkingStatus } = useAuthStatus();
    if (checkingStatus) {
        const cardStyle = {
            padding: '50px',
            width: '300px',
            margin: '0 auto',
            marginTop: '20px',
            borderRadius: '10px',
            background: "#ffffff",
            boxShadow: "15px 13px 34px 10px rgba(0,0,0,0.1)"
        };

        const titleStyle = {
            fontSize: '20px',
            fontWeight: 'bold',
            marginBottom: '10px',
        };

        const textStyle = {
            fontSize: '16px',
        };
        return (
            <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div style={cardStyle}>
                    <div>
                        <h5 style={titleStyle}>Checking your credentials</h5>
                        <p style={textStyle}>Please wait while we verify your credentials...</p>
                    </div>
                </div>

            </div>
        )
    }
    return loggedIn ? <Outlet /> : <Navigate to="/login" />
}

export default PrivateRoute
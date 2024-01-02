import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import AdminHome from './AdminHome'
import GetAllDonations from './GetAllDonations'
import useAuthStatus from '../../CustomHooks/useAuthStatus'
import EventParticipants from './EventParticipents'

const AdminMain = () => {
    console.log("admin main")
    const { loggedIn, checkingStatus } = useAuthStatus();
    // if user is not logged in, redirect to login
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
    return !loggedIn ? <Navigate to="/login" /> : (   
        <div>
            <Routes>
                <Route path='/' element={<AdminHome />} />
                <Route path='/get-all-donations' element={<GetAllDonations />} />
                <Route path='/marathon-participants' element={<EventParticipants />} />

            </Routes>
        </div>
    )
}

export default AdminMain
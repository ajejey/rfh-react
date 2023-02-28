import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Header from './Header'

function EmailVerification() {

    let { id, token } = useParams()
    const navigate = useNavigate()
    const [message, setMessage] = useState("")

    const handleOkayClick = () => {
        navigate('/')
    }

    useEffect(() => {
        const verifyToken = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/verifyEmail/${id}/${token}`, {
                    method: "GET",
                    timeout: 1200000,
                });
                const data = await response.json();
                setMessage(data?.message)
            } catch (error) {
                setMessage(error?.message);
            }
        }

        verifyToken()
    }, [])


    return (
        <div>
            <Header />
            <div className="container-md">
                <p> Message : {message} </p>
                <button onClick={handleOkayClick} type="button" className="btn btn-dark download-button">
                    Go Back Home
                </button>
            </div>


        </div>
    )
}

export default EmailVerification
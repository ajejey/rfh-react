import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Header from './Header'

function EmailVerification() {

    let { id, token } = useParams()
    const [message, setMessage] = useState("")

    useEffect(() => {
        const verifyToken = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/verifyEmail/${id}/${token}`, {
                    method: "GET",
                    timeout: 20000,
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
            </div>


        </div>
    )
}

export default EmailVerification
import React, { useEffect, useState } from 'react'
import GoogleIcon from '@mui/icons-material/Google';
import { createUserWithEmailAndPassword, getAuth, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup, signInWithRedirect, updateProfile } from 'firebase/auth'
import { Link, useNavigate } from 'react-router-dom';
import Header from '../Header';

function Login() {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [loading, setLoading] = useState(false)
    const [authError, setAuthError] = useState("")


    const handleFormChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.id]: e.target.value,
        }));
    }

    const handleLoginSubmit = async (e) => {
        e.preventDefault();

        try {
            const auth = getAuth();
            const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password)
            const user = userCredential.user
            console.log("user ", user)
            // setUser(user)
            let token = await user.getIdToken()
            console.log("token ", token)
            localStorage.setItem('rfhLoginToken', token)
            navigate(-1)
            // setAuthToken(token)
        } catch (error) {
            console.log(error)
            setAuthError(error?.message)
            setLoading(false)
        }
    }



    return (
        <div>
            <Header />
            <div style={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: 'center', }}>
                <div style={{ padding: "3%", boxShadow: "4px 8px 29px -10px rgba(0,0,0,0.75)", borderRadius: "16px" }} >
                    <h2>Login</h2>
                    <form onSubmit={handleLoginSubmit}>
                        <div>
                            <label htmlFor="email" className="form-label">Email address</label>
                            <input name='email' onChange={handleFormChange} type="email" className="form-control" id="email" aria-describedby="signup email" />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">Password</label>
                            <input name='password' onChange={handleFormChange} type="password" className="form-control" id="password" />
                        </div>
                        <div><small style={{ color: "red" }}> {authError} </small></div>

                        <button type="submit" className="btn btn-primary">
                            {loading === true ?
                                <div className="spinner-border text-light spinner-border-sm m-1" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div> :
                                <span></span>}
                            Login</button>
                        <br />
                        <br />
                        <div className="flex justify-between whitespace-nowrap text-sm sm:text-lg">
                            <p className="mb-6">
                                Don't have a account?
                                <Link
                                    to="/sign-up"
                                    className="text-red-600 hover:text-red-700 transition duration-200 ease-in-out ml-1"
                                >
                                    Register
                                </Link>
                            </p>
                            <p>
                                <Link
                                    to="/forgot-password"
                                    className="text-blue-600 hover:text-blue-800 transition duration-200 ease-in-out"
                                >
                                    Forgot password?
                                </Link>
                            </p>
                        </div>

                    </form>
                </div>
            </div>




        </div >
    )
}

export default Login
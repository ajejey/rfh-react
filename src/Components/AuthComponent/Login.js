import React, { useEffect, useState } from 'react'
import GoogleIcon from '@mui/icons-material/Google';
import { createUserWithEmailAndPassword, getAuth, GoogleAuthProvider, signInWithPopup, signInWithRedirect, updateProfile } from 'firebase/auth'

function Login({ setAuthenticated, setUser, authToken, setAuthToken }) {
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
            const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password)
            const user = userCredential.user
            console.log("user ", user)
            setUser(user)
            let token = await user.getIdToken()
            console.log("token ", token)
            setAuthToken(token)
        } catch (error) {
            console.log(error)
            setAuthError(error?.message)
            setLoading(false)
        }
    }

    const loginWithGoogle = async () => {
        const auth = getAuth()
        const provider = new GoogleAuthProvider()
        // const result = await signInWithPopup(auth, provider)
        const result = await signInWithRedirect(auth, provider)
        const user = result.user
        setUser(user)
        console.log("user ", user)
        let token = await user.getIdToken()
        console.log("token, ", token)
        setAuthToken(token)

        // try {
        //     const response = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/authenticate`, {
        //         method: 'POST',
        //         headers: {
        //             'Content-Type': 'application/json'
        //         },
        //         body: JSON.stringify({
        //             idToken: token
        //         })
        //     });

        //     const data = await response.json();
        //     console.log("data after /authenticate ", data)
        //     setAuthenticated(true);
        //     setUser(data);
        // } catch (error) {
        //     console.error(error);
        //     setAuthenticated(false);
        //     setUser({});
        // }
    }

    const authenticateUserBackend = async () => {
        try {
            setLoading(true)
            const response = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/authenticate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    idToken: authToken
                })
            });

            const data = await response.json();
            console.log("data after /authenticate ", data)
            setAuthenticated(true);
            setUser(data);
            setLoading(false)
        } catch (error) {
            console.error(error);
            setAuthenticated(false);
            setUser({});
            setLoading(false)
        }
    }

    useEffect(() => {
        if (authToken.length) {
            authenticateUserBackend()
        }
    }, [authToken])

    return (
        <div>
            {/* <button onClick={loginWithGoogle}><GoogleIcon />  Login with Google</button> */}
            {/* <div className="d-grid gap-2 mb-4">
                <button onClick={loginWithGoogle} type="button" className="btn btn-outline-dark" style={{ textTransform: "none" }}>
                    <img width="20px" style={{ marginBottom: "3px", marginRight: "5px" }} alt="Google sign-in" src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png" />
                    Login with Google
                </button>
            </div> */}
            <form onSubmit={handleLoginSubmit}>

                {/* <div className="text-center mt-3">
                    <p>Sign Up with Email:</p>
                </div> */}

                <div>
                    <label for="email" class="form-label">Email address</label>
                    <input name='email' onChange={handleFormChange} type="email" class="form-control" id="email" aria-describedby="signup email" />
                </div>
                <div class="mb-3">
                    <label for="password" class="form-label">Password</label>
                    <input name='password' onChange={handleFormChange} type="password" class="form-control" id="password" />
                </div>
                <div><small style={{ color: "red" }}> {authError} </small></div>

                <button type="submit" class="btn btn-primary">
                    {loading === true ?
                        <div class="spinner-border text-light spinner-border-sm m-1" role="status">
                            <span class="visually-hidden">Loading...</span>
                        </div> :
                        <span></span>}
                    Sign Up</button>

            </form>


        </div >
    )
}

export default Login
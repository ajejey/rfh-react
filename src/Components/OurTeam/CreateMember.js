import React, { useState } from 'react'
import { Navigate } from 'react-router-dom';
import useAuthStatus from '../../CustomHooks/useAuthStatus';
import Header from '../Header';
import { convertToWebPMulti, uploadToFireBase } from '../../Constants/commonFunctions';
import { toast } from 'sonner';

const CreateMember = () => {
    const { loggedIn, checkingStatus } = useAuthStatus();
    const [member, setMember] = useState({
        name: '',
        designation: '',
        photoUrl: '',
        background: '',
        quote: ''
    });
    const [urls, setUrls] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isAPILoading, setAPILoading] = useState(false);

    const handleChange = (e) => {
        setMember({ ...member, [e.target.name]: e.target.value });
    };

    const handleUpload = async (event) => {
        setIsLoading(true);
        const files = event.target.files;
        let urlList = [];

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const { blob } = await convertToWebPMulti(file);
            const url = await uploadToFireBase(new File([blob], file.name, { type: 'image/webp' }));
            urlList.push(url);
        }

        setUrls(urlList);
        setIsLoading(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setAPILoading(true);
        const postData = {
            name: member.name,
            designation: member.designation,
            photoUrl: urls[0],
            background: member.background,
            quote: member.quote
        };
    
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/teamMembers/save-team-members`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(postData)
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
    
            const data = await response.json();
            console.log(data);
            toast.success('Member added successfully');
    
            // Clear the form
            setMember({
                name: '',
                designation: '',
                photoUrl: '',
                background: '',
                quote: ''
            });
            setUrls([]);
        } catch (error) {
            console.error('There was a problem with the fetch operation: ', error);
            toast.error('Failed to add member');
        } finally {
            setAPILoading(false);
        }
    };
    
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
            <Header />
            <div className="container-md">
                <h1 className='h1'>CreateMember</h1>
                <form onSubmit={handleSubmit} className="m-3">
                    <div className="mb-3">
                        <label className="form-label">Name</label>
                        <input type="text" name="name" value={member.name} onChange={handleChange} className="form-control" />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Designation</label>
                        <input type="text" name="designation" value={member.designation} onChange={handleChange} className="form-control" />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="photoUpload" className="form-label">Upload Photo</label>
                        <input type="file"  className="form-control" id="photoUpload" accept="image/*" onChange={handleUpload} />
                        {isLoading &&
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        }
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Background</label>
                        <textarea rows="3" name="background" value={member.background} onChange={handleChange} className="form-control" />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Quote</label>
                        <textarea rows="3" name="quote" value={member.quote} onChange={handleChange} className="form-control" />
                    </div>
                    <button type="submit" className="btn btn-primary" disabled={isAPILoading}>
                        {isAPILoading ? (
                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        ) : (
                            'Submit'
                        )}
                    </button>

                </form>
            </div>

        </div>
    )
}

export default CreateMember
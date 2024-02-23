import React, { useState } from 'react';
import useSWR, { mutate } from 'swr';
import { Card, CardActions, CardContent, CardHeader, CardMedia, Dialog, DialogContent, DialogTitle, Grid, IconButton, Typography } from '@mui/material';
import Header from '../Header';
import useAuthStatus from '../../CustomHooks/useAuthStatus';
import UploadIcon from '@mui/icons-material/Upload';
import { useNavigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { convertToWebPMulti, uploadToFireBase } from '../../Constants/commonFunctions';
import { toast } from 'sonner';

const fetcher = url => fetch(url).then(res => res.json());

const OurTeam = () => {
    const { loggedIn, checkingStatus } = useAuthStatus()
    const navigate = useNavigate()
    const { data: teamMembers, error } = useSWR(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/teamMembers/`, fetcher);

    const handleUploadClick = () => {
        navigate('/our-team/create-member')
    }

    const [editingMember, setEditingMember] = useState(null);
    const [isEditFormOpen, setIsEditFormOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [urls, setUrls] = useState([]);

    const handleEditClick = (member) => {
        setEditingMember(member);
        setIsEditFormOpen(true);
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

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const updatedMember = { ...editingMember, photoUrl: urls[0] };
    
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/teamMembers/${editingMember._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedMember)
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
    
            const data = await response.json();
            console.log(data);
    
            // Show a success toast
            toast.success('Team member updated successfully');
    
            // Close the edit form
            setIsEditFormOpen(false);
    
            // Revalidate and update the teamMembers data
            mutate(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/teamMembers/`);
        } catch (error) {
            console.error('There was a problem with the fetch operation: ', error);
    
            // Show an error toast
            toast.error('An error occurred while updating the team member');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteClick = async (id) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/teamMembers/${id}`, {
                method: 'DELETE',
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
    
            const data = await response.json();
            console.log(data);
    
            // Revalidate and update the teamMembers data
            mutate(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/teamMembers/`);
            toast.success('Member deleted successfully');
        } catch (error) {
            console.error('There was a problem with the fetch operation: ', error);
            toast.error('Failed to delete member');
        }
    };
    
    

    const handleInputChange = (e) => {
        setEditingMember({ ...editingMember, [e.target.name]: e.target.value });
    };

    // if (error) return <div>Error loading data</div>
    // if (!teamMembers) return <div>Loading...</div>

    return (
        <div>
            <Header />
            <div className="container-md mb-5">
                <h1 className="h1">Meet Our Team</h1>
                {loggedIn && (
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginBottom: '12px' }}>
                        <button title='Upload' onClick={handleUploadClick} className='btn btn-primary '>
                            <UploadIcon />
                        </button>
                    </div>

                )}
                <Grid container spacing={3}>
                    {teamMembers && teamMembers.length > 0 && [...teamMembers].sort((a, b) => a?.sortPosition - b?.sortPosition).map((member) => (
                        <Grid item xs={12} sm={6} md={4} key={member._id}>
                            <Card>
                                <CardMedia
                                    component="img"
                                    alt={member.name}
                                    // height="340"
                                    sx={{ objectFit: 'contain', maxHeight: '340px' }}
                                    image={member.photoUrl}
                                />
                                <CardContent>
                                    <Typography variant="h5" component="div">
                                        {member.name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {member.designation}
                                    </Typography>
                                    <Typography variant="body2" component="p">
                                      {member.background}
                                    </Typography>
                                    <Typography variant="body1" component="p">
                                       {member.quote}
                                    </Typography>
                                    
                                </CardContent>
                                {loggedIn && (
                                    <CardActions disableSpacing sx={{ justifyContent: 'flex-end' }}>
                                        <IconButton onClick={() => handleEditClick(member)} title='Edit' >
                                            <EditIcon color="primary" />
                                        </IconButton>
                                        <IconButton aria-label="delete" title='Delete' onClick={() => handleDeleteClick(member._id)}>
                                            <DeleteForeverIcon color="error" />
                                        </IconButton>
                                    </CardActions>
                                )}
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                {isEditFormOpen && editingMember && (
                    <Dialog open={isEditFormOpen} onClose={() => setIsEditFormOpen(false)}>
                        <DialogTitle>Edit Team Member</DialogTitle>
                        <DialogContent>
                            <form onSubmit={handleEditSubmit}>
                                <div className="mb-3">
                                    <label className="form-label">Name</label>
                                    <input type="text" name="name" value={editingMember.name} onChange={handleInputChange} className="form-control" />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Designation</label>
                                    <input type="text" name="designation" value={editingMember.designation} onChange={handleInputChange} className="form-control" />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="photoUpload" className="form-label">Upload Photo</label>
                                    <input type="file" className="form-control" id="photoUpload" accept="image/*" onChange={handleUpload} />
                                    {isLoading &&
                                        <div className="spinner-border text-primary" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                    }
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Background</label>
                                    <textarea rows="3" name="background" value={editingMember.background} onChange={handleInputChange} className="form-control" />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Quote</label>
                                    <textarea rows="3" name="quote" value={editingMember.quote} onChange={handleInputChange} className="form-control" />
                                </div>
                                <div className='mb-3'>
                                    <label className='form-label'>Sort Position</label>
                                    <input type="number" name="sortPosition" value={editingMember.sortPosition} onChange={handleInputChange} className="form-control" />
                                </div>
                                <button type="submit" className="btn btn-primary">
                                    Submit
                                </button>
                            </form>
                        </DialogContent>
                    </Dialog>
                )}
            </div>

        </div>
    );
};

export default OurTeam;

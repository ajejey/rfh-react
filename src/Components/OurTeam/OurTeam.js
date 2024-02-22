import React from 'react';
import useSWR from 'swr';
import { Card, CardContent, CardMedia, Grid, Typography } from '@mui/material';
import Header from '../Header';
import useAuthStatus from '../../CustomHooks/useAuthStatus';
import UploadIcon from '@mui/icons-material/Upload';
import { useNavigate } from 'react-router-dom';

const fetcher = url => fetch(url).then(res => res.json());

const OurTeam = () => {
    const { loggedIn, checkingStatus } = useAuthStatus()
    const navigate = useNavigate()
    const { data: teamMembers, error } = useSWR(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/teamMembers/`, fetcher);

    const handleUploadClick = () => {
        navigate('/our-team/create-member')
    }

    // if (error) return <div>Error loading data</div>
    // if (!teamMembers) return <div>Loading...</div>

    return (
        <div>
            <Header />
            <div className="container-md">
            {loggedIn && (
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginBottom: '12px' }}>                       
                        <button title='Upload' onClick={handleUploadClick} className='btn btn-primary '>
                            <UploadIcon  />
                        </button>
                    </div>

                )}
                <Grid container spacing={3}>
                    {teamMembers && teamMembers.length > 0 &&  teamMembers.map((member) => (
                        <Grid item xs={12} sm={6} md={4} key={member._id}>
                            <Card>
                                <CardMedia
                                    component="img"
                                    alt={member.name}
                                    // height="340"
                                    image={member.photoUrl}
                                />
                                <CardContent>
                                    <Typography variant="h5" component="div">
                                        {member.name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {member.designation}
                                    </Typography>
                                    <Typography variant="body1" component="p">
                                        {member.quote}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </div>

        </div>
    );
};

export default OurTeam;

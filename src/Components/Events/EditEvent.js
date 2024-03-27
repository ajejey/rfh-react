import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import Header from '../Header';
import { mutate } from 'swr';
import Editor from '../Blog/Editor';
import CkEditor from '../Blog/CkEditor';

const EditEvent = () => {
    const navigate = useNavigate();
    const { path } = useParams();
    const { register, handleSubmit, setValue, formState: { errors } } = useForm();
    const [image, setImage] = useState();
    const [imageInvalid, setImageInvalid] = useState(false);
    const [description, setDescription] = useState('');
    const [pdf, setPdf] = useState('');
    const [pdfLoading, setPdfLoading] = useState(false);
    const [pdfInvalid, setPdfInvalid] = useState(false);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const url = `${process.env.REACT_APP_BACKEND_BASE_URL}/api/events/${path}`;
                const response = await fetch(url);
                const data = await response.json();

                if (response.ok) {
                    const { eventName, location, mapLocation, startDate, image, description, pdf } = data;
                    setValue('eventName', eventName);
                    setValue('location', location);
                    setValue('mapLocation', mapLocation);
                    setValue('startDate', startDate);
                    setDescription(description);
                    setPdf(pdf);
                } else {
                    throw new Error('Failed to fetch event');
                }
            } catch (error) {
                console.error(error);
            }
        };

        fetchEvent();
    }, [path, setValue]);

    const onSubmit = async (formData) => {
        const file = image;

        // Check if the file is an image
        if (file && (!file.type.startsWith('image/') || file.size > (1024 * 1024))) {
            console.error('Invalid file type or size too large');
            setImageInvalid(true);
            return;
        }

        try {
            let imageUrl = formData.image;

            // If a new image is selected, upload it to Firebase Storage
            if (file) {
                const storage = getStorage();
                const fileRef = ref(storage, 'images/' + file.name);
                const snapshot = await uploadBytes(fileRef, file);
                imageUrl = await getDownloadURL(fileRef);
            }

            let pdfUrl = formData.pdf;

            // If a new PDF is selected, upload it to Firebase Storage
            if (pdf) {
                const storage = getStorage();
                const pdfRef = ref(storage, 'pdfs/' + pdf.name);
                const snapshot = await uploadBytes(pdfRef, pdf);
                pdfUrl = await getDownloadURL(pdfRef);
            }

            const data = { ...formData, image: imageUrl, pdf: pdfUrl, description };
            const url = `${process.env.REACT_APP_BACKEND_BASE_URL}/api/events/${path}`;

            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error('Failed to update event');
            }

            // Invalidate the events cache to trigger a re-fetch
            mutate('/api/events');

            navigate('/events');
        } catch (error) {
            console.error(error);
        }
    };

    const handleFileChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handlePdfChange = async (e) => {
        const file = e.target.files[0];

        try {
            setPdfLoading(true);
            setPdf(file);
        } catch (error) {
            console.error('Error uploading file:', error);
        } finally {
            setPdfLoading(false);
        }
    };

    return (
        <div>
            <Header />
            <div className="container-md mb-5">
                <h1 className='h1'>Edit Event</h1>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <label htmlFor="eventName">Event Name</label> <br />
                            <input
                                label="Event Name"
                                name='eventName'
                                className='form-control'
                                {...register('eventName', { required: true })}
                                error={errors.eventName}
                                helperText={errors.eventName && "This field is required"}
                                type="text"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <label htmlFor="description">Description</label> <br />
                            <CkEditor value={description} onChange={setDescription} />
                        </Grid>
                        <Grid item xs={12}>
                            <label htmlFor="location">Location</label> <br />
                            <textarea
                                label="Location"
                                name='location'
                                className='form-control'
                                {...register('location', { required: true })}
                                error={errors.location}
                                helperText={errors.location && "This field is required"}
                                type="text"
                                rows="2"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <label htmlFor="mapLocation">Google Maps Location Link</label> <br />
                            <input
                                label="Map Location"
                                name='mapLocation'
                                className='form-control'
                                {...register('mapLocation', { required: true })}
                                error={errors.mapLocation}
                                helperText={errors.mapLocation && "This field is required"}
                                type="text"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <label htmlFor="startDate">Start Date</label> <br />
                            <input
                                label="Start Date"
                                name='startDate'
                                className='form-control'
                                {...register('startDate', { required: true })}
                                error={errors.startDate}
                                helperText={errors.startDate && "This field is required"}
                                type="date"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <label htmlFor='image'>Image</label> <br />
                            <input className='form-control' type="file" name='image' onChange={handleFileChange} accept='image/*' />
                            {imageInvalid && <small style={{ color: "red" }}>Invalid file type or size too large. Please upload image file less than 1MB</small>}
                        </Grid>
                        <Grid item xs={12}>
                            <label htmlFor='pdf'>PDF</label> <br />
                            <input className='form-control' type="file" name='pdf' onChange={handlePdfChange} accept='application/pdf' />
                            {pdfLoading && <CircularProgress style={{ marginTop: '10px' }} />}
                            {pdfInvalid && <small style={{ color: "red" }}>Invalid file type.</small>}
                        </Grid>
                        <Grid item xs={12}>
                            <Button variant="contained" type="submit">Update</Button>
                        </Grid>
                    </Grid>
                </form>
            </div>
        </div>
    );
};

export default EditEvent;
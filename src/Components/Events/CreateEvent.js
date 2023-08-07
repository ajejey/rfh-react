import React from 'react'
import Header from '../Header'
import { useState } from 'react';
import { TextField, Button, Grid } from '@mui/material';
import { useForm } from 'react-hook-form';
import useSWR, { mutate } from 'swr';
import { storage } from '../../config/firebase-config';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';

function CreateEvent() {
    const { register, handleSubmit, getValues, setValue, reset, formState: { errors } } = useForm();
    const [image, setImage] = useState();
    const [imageInvalid, setImageInvalid] = useState(false);

    // const onSubmit = async (formData) => {
    //     const file = image;

    //     // Check if the file is an image
    //     if (!file.type.startsWith('image/') || file.size > (1024 * 1024)) {
    //         console.error('Invalid file type or size too large');
    //         setImageInvalid(true);
    //         return;
    //     }

    //     // Create a URL for the uploaded file
    //     const imageUrl = URL.createObjectURL(file);

    //     // Create a new image element
    //     const img = new Image();

    //     // Set the image element's src to the URL
    //     img.src = imageUrl;

    //     // When the image is loaded, convert it to WebP format
    //     img.onload = () => {
    //         const canvas = document.createElement('canvas');

    //         canvas.width = img.width;
    //         canvas.height = img.height;

    //         const ctx = canvas.getContext('2d');
    //         ctx.drawImage(img, 0, 0);

    //         canvas.toBlob((blob) => {
    //             // Create a root reference to the storage bucket
    //             const storage = getStorage();

    //             // Create a reference to the file we want to upload
    //             const fileRef = ref(storage, 'images/' + file.name);

    //             uploadBytes(fileRef, blob).then((snapshot) => {
    //                 console.log('Uploaded WebP image: ', snapshot);
    //             })
    //         }, 'image/webp', 0.7);
    //     }

    // }

    const onSubmit = async (formData) => {
        const file = image;

        // Check if the file is an image
        if (!file.type.startsWith('image/') || file.size > (1024 * 1024)) {
            console.error('Invalid file type or size too large');
            setImageInvalid(true);
            return;
        }

        // Create a URL for the uploaded file
        const imageUrl = URL.createObjectURL(file);

        // Create a new image element
        const img = new Image();

        // Set the image element's src to the URL
        img.src = imageUrl;

        // When the image is loaded, convert it to WebP format
        img.onload = async () => {
            const canvas = document.createElement('canvas');

            canvas.width = img.width;
            canvas.height = img.height;

            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);

            canvas.toBlob(async (blob) => {
                try {
                    // Create a root reference to the storage bucket
                    const storage = getStorage();

                    // Create a reference to the file we want to upload
                    const fileRef = ref(storage, 'images/' + file.name);

                    // Upload the file to Firebase Storage
                    const snapshot = await uploadBytes(fileRef, blob);

                    // Get the download URL of the uploaded file
                    const downloadURL = await getDownloadURL(fileRef);
                    console.log("downloadURL ", downloadURL);

                    // Send the download URL to the backend API
                    const data = { ...formData, image: downloadURL };
                    const url = `${process.env.REACT_APP_BACKEND_BASE_URL}/api/events`;

                    const response = await fetch(url, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(data),
                    });

                    if (!response.ok) {
                        throw new Error('Failed to create event');
                    }

                    // Invalidate the events cache to trigger a re-fetch
                    mutate('/api/events');

                    reset();
                } catch (error) {
                    console.error(error);
                }
            }, 'image/webp', 0.7);
        };
    };

    const handleFileChange = (e) => {
        console.log(e.target.files[0]);
        setImage(e.target.files[0]);
    }

    return (
        <div>
            <Header />
            <div className="container-md">
                <h1 className='h1'>Create Event</h1>
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
                            <textarea
                                label="Description"
                                name='description'
                                className='form-control'
                                {...register('description', { required: true })}
                                error={errors.description}
                                helperText={errors.description && "This field is required"}
                                type="text"
                                rows="4"
                            />
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
                            <Button variant="contained" type="submit">Submit</Button>
                        </Grid>
                    </Grid>
                </form>
            </div>
        </div>
    )
}

export default CreateEvent
import React, { useState } from 'react';
import { convertToWebPMulti, uploadToFireBase } from '../../Constants/commonFunctions';
import { mutate } from 'swr';

export default function GalleryUpload() {
    const [eventName, setEventName] = useState('');
    const [startDate, setStartDate] = useState('');
    const [location, setLocation] = useState('');
    const [mapLocation, setMapLocation] = useState('');
    const [description, setDescription] = useState('');
    const [urls, setUrls] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

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

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Prepare the data object to be sent to the backend API
        const data = {
            eventName,
            startDate,
            location,
            mapLocation,
            description,
            photoUrls: urls
        };

        // Send the data to the backend API
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/gallery/save-photos-to-gallery`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                // Handle success
                console.log('Photos saved successfully');
                // After the API call, re-fetch the data
                mutate(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/gallery/`);
            } else {
                // Handle error
                console.error('Failed to save photos');
            }
        } catch (error) {
            console.error('Network error:', error);
        }
    };

    return (
        <div className="container mt-5">
            <form onSubmit={handleSubmit}>
                <h2 className="mb-4">Upload Photos</h2>
                <div className="mb-3">
                    <label htmlFor="eventName" className="form-label">Event Name</label>
                    <input type="text" className="form-control" id="eventName" placeholder="Event Name" value={eventName} onChange={(e) => setEventName(e.target.value)} required />
                </div>
                <div className="mb-3">
                    <label htmlFor="startDate" className="form-label">Start Date</label>
                    <input type="date" className="form-control" id="startDate" placeholder="Start Date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
                </div>
                <div className="mb-3">
                    <label htmlFor="location" className="form-label">Location</label>
                    <input type="text" className="form-control" id="location" placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} required />
                </div>
                <div className="mb-3">
                    <label htmlFor="mapLocation" className="form-label">Map Location</label>
                    <input type="text" className="form-control" id="mapLocation" placeholder="Map Location" value={mapLocation} onChange={(e) => setMapLocation(e.target.value)} required />
                </div>
                <div className="mb-3">
                    <label htmlFor="description" className="form-label">Description</label>
                    <textarea className="form-control" id="description" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required />
                </div>
                <div className="mb-3">
                    <label htmlFor="photoUpload" className="form-label">Upload Photos</label>
                    <input type="file" className="form-control" id="photoUpload" accept="image/*" multiple onChange={handleUpload} />
                </div>
                <button type="submit" className="btn btn-primary" disabled={isLoading}>
                    {isLoading ? 'Uploading...' : 'Save'}
                </button>
            </form>
        </div>
    );
}

import React, { useEffect, useState } from 'react'
import Header from '../Header'
import GalleryUpload from './GalleryUpload'
import useSWR from 'swr';
import useAuthStatus from '../../CustomHooks/useAuthStatus';
import UploadIcon from '@mui/icons-material/Upload';

const fetcher = url => fetch(url).then(res => res.json());



function Gallery() {
    const { loggedIn, checkingStatus } = useAuthStatus()
    const { data, error } = useSWR(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/gallery/`, fetcher);
    const [allImages1, setAllImages1] = useState([])
    const [allImages2, setAllImages2] = useState([])
    const [allImages3, setAllImages3] = useState([])
    const [showUploadForm, setShowUploadForm] = useState(false)

    function importAll(r) {
        return r.keys().map(r);
    }
    useEffect(() => {
        // function importAll(r) {
        //     let images = {};
        //     r.keys().forEach((item, index) => { images[item.replace('./', '')] = r(item); });
        //     return images
        // }

        const images1 = importAll(require.context('../../assets/images/mukul-min', false, /\.(png|jpe?g|svg)$/));
        const images3 = importAll(require.context('../../assets/images/rfh-min', false, /\.(png|jpe?g|svg)$/));
        setAllImages1(images1)
        setAllImages3(images3)
    }, [])

    if (error) return <div>Error loading data</div>
    if (!data) return <div>Loading...</div>


    const handleUploadClick = () => {
        setShowUploadForm(!showUploadForm)
    }

    // Group images by unique event names
    const events = data && data.reduce((acc, item) => {
        const { eventName, photoUrl, startDate } = item;
        if (!acc[eventName]) {
            acc[eventName] = {
                photos: [],
                startDate
            };
        }
        acc[eventName].photos.push(photoUrl);
        return acc;
    }, {});
    console.log("data", data)
    console.log("events", events)

    // Sort event names by startDate in reverse chronological order
    const sortedEventNames = Object.keys(events).sort((a, b) => new Date(events[b].startDate) - new Date(events[a].startDate));


    return (
        <div>
            <Header />
            <div className='container-md' style={{ paddingTop: "50px" }}>
                {loggedIn && (
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>                       
                        <button title='Upload Event Photos' onClick={handleUploadClick} className='btn btn-primary '>
                            <UploadIcon  />
                        </button>
                    </div>

                )}
                {showUploadForm && <GalleryUpload />}
                

                <div>
                    {sortedEventNames.map((eventName) => (
                        <div key={eventName}>
                            <h2>{eventName}</h2>
                            <div style={{ display: "flex", justifyContent: "flex-start", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
                                {events[eventName].photos.map((url, index) => (
                                    <img key={index} src={url} height={200} className="img-fluid" style={{ maxWidth: "400px", }} alt="" />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <h2>RFH 10k Marathon 2019</h2>
                <div style={{ display: "flex", justifyContent: "flex-start", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
                    {allImages1.map(
                        (image, index) => (
                            <img key={index} src={image} height={200} className="img-fluid" style={{ maxWidth: "400px", }} alt="Rupee for Humanity 10k Marathon"></img>
                        )
                    )}
                </div>

                <h2>RFH 10k Marathon 2018</h2>
                <div style={{ display: "flex", justifyContent: "flex-start", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
                    {allImages3.map(
                        (image, index) => (
                            <img key={index} src={image} height={200} className="img-fluid" alt="Rupee for Humanity 10k Marathon"></img>
                        )
                    )}
                </div>

            </div>
        </div>
    )
}

export default Gallery
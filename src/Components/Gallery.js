import React, { useEffect, useState } from 'react'
import Header from './Header'



function Gallery() {
    const [allImages1, setAllImages1] = useState([])
    const [allImages2, setAllImages2] = useState([])
    const [allImages3, setAllImages3] = useState([])
    function importAll(r) {
        return r.keys().map(r);
    }
    useEffect(() => {
        // function importAll(r) {
        //     let images = {};
        //     r.keys().forEach((item, index) => { images[item.replace('./', '')] = r(item); });
        //     return images
        // }

        const images1 = importAll(require.context('../assets/images/mukul-min', false, /\.(png|jpe?g|svg)$/));
        const images3 = importAll(require.context('../assets/images/rfh-min', false, /\.(png|jpe?g|svg)$/));
        setAllImages1(images1)
        setAllImages3(images3)
    }, [])
    return (
        <div>
            <Header />
            <div className='container-md' style={{ paddingTop: "50px" }}>
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
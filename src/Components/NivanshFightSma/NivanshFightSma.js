import React from 'react'
import Header from '../Header'
import image1 from '../../assets/images/Nivansh_Pictures/Nivansh_BiPAP.jpg'
import image2 from '../../assets/images/Nivansh_Pictures/Nivansh.jpg'
import DonateForm from '../DonateForm'
import { Helmet } from 'react-helmet-async'

function NivanshFightSma() {
    return (
        <div>
            <Helmet>
                <title>Save Nivansh fight SMA2 | Rupee For Humanity</title>
                <meta name="description" content="Nivansh, a beloved child of Venkateswara Goud and Usha Rani, is battling Spinal Muscular Atrophy (SMA) type 2, a life-threatening progressive disorder. We urgently need your help to raise funds for the medical breakthrough innovation drug, Zolgensma, which can treat this condition. Your support can make a significant difference in Nivansh's life and help him overcome SMA. Please consider donating today and join us in our mission to help Nivansh fight SMA." />
                <meta name="keywords" content="Nivansh, SMA, Spinal Muscular Atrophy, life-threatening, progressive disorder, Zolgensma, Novartis, 17.5 crore rupees, donation, support, compassion, help, baby, 2 year old" />
                <meta name="robots" content="index, follow" />
                <meta name="googlebot" content="index, follow" />
                <meta name="google" content="notranslate" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <link rel="canonical" href="https://www.rupeeforhumanity.org/nivanshfightsma" />
            </Helmet>
            <Header />
            <div className="container-md">
                <h1 className="h1" style={{ textAlign: "center" }}>Help Nivansh Fight Against SMA</h1>
                <br />
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <img src={image1} alt="Nivansh" height={200} style={{ maxWidth: "200px", }} />
                    <img src={image2} alt="Nivansh" height={200} style={{ maxWidth: "200px", }} />
                </div>
                <br />
                <p className='lead' >
                    We come to you with a heavy heart and a profound sense of urgency, Nivansh, a beloved kid of Venkateswara Goud and Usha Rani, has been battling Spinal Muscular Atrophy(SMA) type 2 life-threatening progressive disorder which has to be treated as early possible.
                </p>
                <p >
                    There is hope on the horizon in the form of a medical breakthrough innovation drug called "Zolgensma" injection from Novartis. This hope comes at a staggering cost of 17.5 crore rupees.
                </p>
                <p >
                    We can't do this alone, we need your help, support and compassion in contributing and spreading this message to your friends and family members.
                </p>
                <p >
                    We together can make a difference in the life of a child who deserves a chance to overcome SMA.
                </p>

                <h2 className="h2">Donate</h2>
                <DonateForm volunteeringEvent="Nivansh fights sma" />
                <footer>
                    <p style={{ textAlign: "center" }}>Save Nivansh fight SMA2</p>

                </footer>
            </div>
        </div>
    )
}

export default NivanshFightSma
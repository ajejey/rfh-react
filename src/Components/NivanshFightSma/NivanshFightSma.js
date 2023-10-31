import React from 'react'
import Header from '../Header'
import image1 from '../../assets/images/Nivansh_Pictures/Nivansh_BiPAP.jpg'
import image2 from '../../assets/images/Nivansh_Pictures/Nivansh.jpg'
import DonateForm from '../DonateForm'

function NivanshFightSma() {
    return (
        <div>
            <Header />
            <div className="container-md">
                <h1 className="h1" style={{ textAlign: "center" }}>Help Nivansh Fight Against SMA</h1>
                <br />
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <img src={image1} alt="Nivansh" height={200}  style={{ maxWidth: "200px", }} />
                    <img src={image2} alt="Nivansh" height={200}  style={{ maxWidth: "200px", }} />
                </div>
                <br />
                <p className='lead' >
                    We come to you with a heavy heart and a profound sense of urgency, Nivansh, a beloved kid of Venkateswara Goud and Usha Rani, has been battling Spinal Muscular Atrophy(SMA) type 2 life-threatening progressive disorder which has to be treated as early possible.
                    </p>
                    <p >
                    There is hope on the horizon in the form of a medical breakthrough innovation drug called "Zolgensma" injection from Novartis. this hope comes at a staggering cost of 17.5 crore rupees.
                    </p>
                    <p >
                    We can't do this alone, we need your help, support and compassion in contributing and spreading this message to your friends and family members.
                    </p>
                    <p >
                    We together can make a difference in the life of a child who deserves a chance to overcome SMA.
                </p>
                
                <h2 className="h2">Donate</h2>
                <DonateForm />
                <footer>
                    <p style={{ textAlign: "center" }}>Save Nivansh right SMA2</p>
                
                </footer>
            </div>
        </div>
    )
}

export default NivanshFightSma
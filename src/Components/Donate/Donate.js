import React from 'react'
import Header from '../Header'
import DonateCard from './DonateCard'

function Donate() {

    const donateCards = [
        { name: "Sponcer for Children's education" },
        { name: "Sponcer for One day lunch/dinner" },
        { name: "Sponcer for Student Stationary items and bags" },
        { name: "Sponcer for Planting trees" },
    ]
    {/* <p>Sponcer for Children's education</p>
                <p>Sponcer for One day lunch/dinner</p>
                <p>Sponcer for Student Stationary items and bags</p>
                <p>Sponcer for Planting trees</p> */}

    return (
        <div>
            <Header />
            <div className="container-md">
                <div className='donate-cards'>
                    {donateCards.map((item) => (
                        <DonateCard name={item.name} />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Donate
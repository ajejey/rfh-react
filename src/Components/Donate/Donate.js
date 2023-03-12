import { FormControl, InputAdornment, InputLabel, OutlinedInput, Paper, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'
import Header from '../Header'
import DonateCard from './DonateCard'
import educationSponcer from '../../assets/images/educationSponcer.png'
import lunchSponcer from '../../assets/images/lunchSponcer.png'
import stationerySponcer from '../../assets/images/stationerySponcer.png'
import plantingSponcer from '../../assets/images/plantingSponcer.png'
import check from '../../assets/images/check.png'
import { Helmet } from 'react-helmet-async'

const donateCards = [
    {
        name: "Sponcer for Children's education",
        body: () => <div>
            <p><img src={check} alt="check" /> &ensp; Education for One Child</p>
            <p><img src={check} alt="check" /> &ensp;  School fee For one Full year</p>
            <p><img src={check} alt="check" /> &ensp; Includes school books and uniform</p>
        </div>,
        image: educationSponcer,
        price: 8000

    },
    {
        name: "Sponcer for One day lunch/dinner",
        body: () => <div>
            <p><img src={check} alt="check" /> &ensp; Education for One Child</p>
            <p><img src={check} alt="check" /> &ensp;  School fee For one Full year</p>
            <p><img src={check} alt="check" /> &ensp; Includes school books and uniform</p>
        </div>,
        image: lunchSponcer,
        price: 400
    },
    {
        name: "Sponcer for Student Stationary items and bags",
        body: () => <div>
            <p><img src={check} alt="check" /> &ensp; Education for One Child</p>
            <p><img src={check} alt="check" /> &ensp;  School fee For one Full year</p>
            <p><img src={check} alt="check" /> &ensp; Includes school books and uniform</p>
        </div>,
        image: stationerySponcer,
        price: 240
    },
    {
        name: "Sponcer for Planting trees",
        body: () => <div>
            <p><img src={check} alt="check" /> &ensp; Education for One Child</p>
            <p><img src={check} alt="check" /> &ensp;  School fee For one Full year</p>
            <p><img src={check} alt="check" /> &ensp; Includes school books and uniform</p>
        </div>,
        image: plantingSponcer,
        price: 400
    },
]

function Donate() {
    const [cart, setCart] = useState({ 0: 0, 1: 0, 2: 0, 3: 0 })
    const [donationAmount, setDonationAmount] = useState(0)

    console.log("cart", cart)

    const handleDonationAmountChange = (e) => {
        setDonationAmount(e.target.value)
    }

    useEffect(() => {
        let total = 0
        donateCards.forEach((item, index) => {
            total = total + (item.price * cart[index])
        })
        console.log("total ", total)
        setDonationAmount(total)
    }, [cart])

    return (
        <div className='donate-container'>
            <Helmet>
                <title>Donate | Rupee For Humanity</title>
            </Helmet>
            <Header />
            <br />
            <div className="container-md">
                <div style={{ textAlign: "center" }}>
                    <h1 className='h1'>Transform Lives with Your Donation</h1>
                    <h5>Choose Your Cause and Donate Today!</h5>
                </div>

                {/* <br />

                <div style={{ padding: "1%", border: "1px solid #ccc", borderRadius: "12px" }}>
                    <p>Rupee for Humanity uses your generous donations for various causes.</p>
                    <p>You can choose the causes you want to donate to.</p>
                    <p>Or you can just donate and we will distribute your donation amoung various causes. </p>
                </div> */}

                <br />
                <hr />
                <br />

                <section>
                    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: '12px' }}>
                        <h2>Make a Donation Now!</h2>
                        <small>Make a donation and we will distribute <br /> your donation amoung various causes</small>
                        {/* <FormControl sx={{ m: 1 }}>
                            <InputLabel htmlFor="outlined-adornment-amount">Amount</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-amount"
                                startAdornment={<InputAdornment position="start">INR</InputAdornment>}
                                label="Amount"
                            />
                        </FormControl> */}
                        <div className="form-group">
                            <label htmlFor="amount">Amount</label>
                            <input type="text" className="form-control" placeholder="" id="amount" />
                        </div>

                        <button style={{ maxWidth: "250px", width: "100%" }} type="button" className="btn btn-dark btn-lg download-button">
                            Donate
                        </button>
                    </div>
                    <br />
                    <br />

                </section>

                <hr />
                <br />
                <h2>Donate to one or more specific causes!</h2>
                <br />
                <br />
                <section>
                    <div className='donate-cards'>
                        {donateCards.map((item, cardIndex) => (
                            <DonateCard
                                name={item.name}
                                body={item.body}
                                cardIndex={cardIndex}
                                setCart={setCart}
                                cart={cart}
                                image={item.image}
                                price={item.price}
                            />
                        ))}
                    </div>
                </section>
                <section>
                    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: '12px' }}>

                        <div className="form-group">
                            <label htmlFor="amount">Amount</label>
                            <input onChange={handleDonationAmountChange} value={donationAmount} type="text" className="form-control" placeholder="" id="amount" />
                        </div>

                        <button style={{ maxWidth: "250px", width: "100%" }} type="button" className="btn btn-dark btn-lg download-button">
                            Donate
                        </button>
                    </div>
                </section>

            </div>
        </div>
    )
}

export default Donate
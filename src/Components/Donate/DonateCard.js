import { Button, Card, CardActionArea, CardActions, CardContent, CardMedia, IconButton, Typography } from '@mui/material'
import React from 'react'
// import image from '../../assets/images/logo.png'
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';

const selectedCardCSS = { backgroundColor: "#040002", color: "whitesmoke", borderRadius: "25px" }
const unSelectedCardCSS = { borderRadius: "25px" }
const priceTagCSS = { backgroundColor: "#efb442", borderRadius: "50%", height: "64px", width: "64px", flexDirection: "column", display: "flex", justifyContent: 'center', alignItems: "center", color: "#040002" }

function DonateCard({ name, cart, setCart, cardIndex, body, image, price }) {
    const handleAddClick = () => {
        setCart({ ...cart, [cardIndex]: (cart[cardIndex]) + 1 })
    }

    const handleRemoveClick = () => {
        setCart({ ...cart, [cardIndex]: cart[cardIndex] - 1 })
    }



    return (
        <div>
            <Card style={cart[cardIndex] > 0 ? selectedCardCSS : unSelectedCardCSS}>
                <CardActionArea onClick={handleAddClick}>
                    <div style={{ textAlign: 'center', padding: "24px" }}>
                        <img src={image} alt="donate" height={100} />
                    </div>
                    <div style={{ display: "flex", justifyContent: "flex-end", padding: "0 24px", marginTop: "-50px" }} >
                        <div style={priceTagCSS} >
                            <small>INR</small>
                            <span style={{ fontWeight: "bold" }}> {price} </span>
                        </div>
                    </div>

                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                            {name}
                        </Typography>
                        <Typography style={{ padding: "8px 24px" }} variant="body2">
                            {body()}
                        </Typography>
                    </CardContent>
                </CardActionArea>
                <CardActions style={{ justifyContent: "flex-end" }}>
                    {cart[cardIndex] > 0 &&
                        <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", opacity: cart[cardIndex] > 0 ? 1 : 0 }}>
                            <IconButton style={{ width: "36px" }} color='primary' onClick={handleRemoveClick}>
                                <RemoveCircleIcon fontSize='medium' />
                            </IconButton>
                            <input value={cart[cardIndex]} readOnly style={{ width: "36px", height: "28px", textAlign: "center", fontSize: "16px", border: "1px solid #ddd", borderRadius: "4px" }} type="text" />
                            <IconButton style={{ width: "36px" }} color='primary' onClick={handleAddClick}>
                                <AddCircleIcon fontSize='medium' />
                            </IconButton>
                        </div>
                    }
                </CardActions>

            </Card>
        </div>
    )
}

export default DonateCard
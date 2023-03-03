import { Button, Card, CardActionArea, CardContent, CardMedia, IconButton, Typography } from '@mui/material'
import React from 'react'
import image from '../../assets/images/logo.png'
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';

function DonateCard({ name, cart, setCart, cardIndex, body }) {
    const handleAddClick = () => {
        setCart({ ...cart, [cardIndex]: (cart[cardIndex]) + 1 })
    }

    const handleRemoveClick = () => {
        setCart({ ...cart, [cardIndex]: cart[cardIndex] - 1 })
    }

    return (
        <div>
            <Card style={{ height: "300px" }}>
                <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
                    <IconButton style={{ width: "36px" }} color='primary' onClick={handleRemoveClick}>
                        <RemoveCircleIcon fontSize='medium' />
                    </IconButton>
                    <input value={cart[cardIndex]} readOnly style={{ width: "36px", height: "28px", textAlign: "center", fontSize: "16px", border: "1px solid #ddd", borderRadius: "4px" }} type="text" />
                    <IconButton style={{ width: "36px" }} color='primary' onClick={handleAddClick}>
                        <AddCircleIcon fontSize='medium' />
                    </IconButton>
                </div>
                <CardMedia
                    component="img"
                    height="100"
                    image={image}
                    alt="green iguana"
                />
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        {name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {body()}
                    </Typography>
                </CardContent>
            </Card>
        </div>
    )
}

export default DonateCard
import React from 'react'
import { Route, Routes } from 'react-router-dom'
import EventForm from './EventForm'
import Events from './Events'

function EventsMain() {
    return (
        <div>
            <Routes>
                <Route path='/' element={<Events />} />
                <Route path='/runforliteracy-2023' element={<EventForm />} />
            </Routes>
        </div>
    )
}

export default EventsMain
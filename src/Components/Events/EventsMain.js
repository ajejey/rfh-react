import React from 'react'
import { Route, Routes } from 'react-router-dom'
import EventForm from './EventForm'
import Events from './Events'
import CreateEvent from './CreateEvent'

function EventsMain() {
    return (
        <div>
            <Routes>
                <Route path='/' element={<Events />} />
                <Route path='/runforliteracy-2023' element={<EventForm />} />
                <Route path='/create-event' element={<CreateEvent />} />
            </Routes>
        </div>
    )
}

export default EventsMain
import React from 'react'
import { Route, Routes } from 'react-router-dom'
import EventForm from './EventForm'
import Events from './Events'
import CreateEvent from './CreateEvent'
import Event from './Event'
import PaymentRedirect from '../PaymentRedirect'

function EventsMain() {
    return (
        <div>
            <Routes>
                <Route path='/' element={<Events />} />
                {/* <Route path='/runforliteracy-2023' element={<EventForm />} /> */}
                <Route path='/rfh-juniors-run-2024' element={<EventForm />} />
                <Route path='/create-event' element={<CreateEvent />} />
                <Route path='/payment-redirect' element={<PaymentRedirect path='/api/marathons/payment-status' />} />
                <Route path='/:path' element={<Event />} />
            </Routes>
        </div>
    )
}

export default EventsMain
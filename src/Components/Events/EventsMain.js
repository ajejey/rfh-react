import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Events from './Events'
import CreateEvent from './CreateEvent'
import Event from './Event'
import PaymentRedirect from '../PaymentRedirect'
import EditEvent from './EditEvent'
import FormBuilder from './FormBuilder'

function EventsMain() {
    return (
        <div>
            <Routes>
                <Route path='/' element={<Events />} />
                {/* <Route path='/runforliteracy-2023' element={<EventForm />} /> */}
                {/* <Route path='/rfh-juniors-run-2024' element={<EventForm />} /> */}
                <Route path='/create-event' element={<CreateEvent />} />
                <Route path='/form-builder' element={<FormBuilder />} />
                <Route path="/edit-event/:path" element={<EditEvent />} />
                <Route path='/payment-redirect' element={<PaymentRedirect path='/api/marathons/payment-status' />} />
                <Route path='/:path' element={<Event />} />
            </Routes>
        </div>
    )
}

export default EventsMain
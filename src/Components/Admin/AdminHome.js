import { Tab, Tabs } from '@mui/material';
import React, { useState } from 'react'
import Header from '../Header'
import EventParticipants from './EventParticipents';
import VolunteerList from './VolunteerList';

function AdminHome() {
    const [tabNumber, setTabNumber] = useState(0)


    const handleTabChange = (event, newValue) => {
        setTabNumber(newValue)
    }

    return (
        <div>
            <Header />
            <div style={{ margin: "0 1%" }}>
                <Tabs value={tabNumber} onChange={handleTabChange}>
                    <Tab label="Volunteers" value={0} />
                    <Tab label="Event Participant" value={1} />
                </Tabs>
                <br />
                {tabNumber === 0 && <VolunteerList />}
                {tabNumber === 1 && <EventParticipants />}

            </div>
        </div>
    )
}

export default AdminHome
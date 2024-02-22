import React from 'react'
import { Route, Routes } from 'react-router-dom'
import OurTeam from './OurTeam'
import CreateMember from './CreateMember'

const OurTeamMain = () => {
  return (
    <div>
        <Routes>
                <Route path='/' element={<OurTeam />} />
                <Route path='/create-member' element={<CreateMember />} />
        </Routes>
               
    </div>
  )
}

export default OurTeamMain
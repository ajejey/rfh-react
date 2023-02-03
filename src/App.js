import './App.css';
import { Route, Routes } from 'react-router-dom';
import Home from './Components/Home';
import Gallery from './Components/Gallery';
import EventsMain from './Components/Events/EventsMain';
import VolunteerForm from './Components/VolunteerForm';

function App() {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='events/*' element={<EventsMain />} />
        <Route path='/gallery' element={<Gallery />} />
        <Route path='/volunteer-register' element={<VolunteerForm />} />
        {/* <Route path="*" element={<Navigate to="/" replace />} /> */}

      </Routes>
    </div>
  );
}

export default App;

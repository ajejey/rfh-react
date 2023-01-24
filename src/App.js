import logo from './logo.svg';
import './App.css';
import { Navigate, Route, Routes } from 'react-router-dom';
import Home from './Components/Home';
import Events from './Components/Events/Events';
import Gallery from './Components/Gallery';
import EventsMain from './Components/Events/EventsMain';

function App() {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='events/*' element={<EventsMain />} />
        <Route path='/gallery' element={<Gallery />} />
        {/* <Route path="*" element={<Navigate to="/" replace />} /> */}
      </Routes>
    </div>
  );
}

export default App;

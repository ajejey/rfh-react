import './App.css';
import { Route, Routes } from 'react-router-dom';
import Home from './Components/Home';
import Gallery from './Components/Gallery';
import EventsMain from './Components/Events/EventsMain';
import VolunteerForm from './Components/VolunteerForm';
import PaymentRedirect from './Components/PaymentRedirect';
import AdminHome from './Components/Admin/AdminHome';
import EmailVerification from './Components/EmailVerification';
import { app } from './config/firebase-config'
import { getAuth } from 'firebase/auth';
import Donate from './Components/Donate/Donate';

function App() {
  const auth = getAuth()
  console.log("auth.currentUser ", auth.currentUser)

  return (
    <div>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='events/*' element={<EventsMain />} />
        <Route path='/gallery' element={<Gallery />} />
        <Route path='/volunteer-register' element={<VolunteerForm />} />
        <Route path='/verifyEmail/:id/:token' element={<EmailVerification />} />
        <Route path='/payment-redirect' element={<PaymentRedirect />} />
        <Route path='/admin' element={<AdminHome />} />
        <Route path='/donate' element={<Donate />} />
        {/* <Route path="*" element={<Navigate to="/" replace />} /> */}

      </Routes>
    </div>
  );
}

export default App;

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
import ReactGA from "react-ga4";
import { HelmetProvider } from 'react-helmet-async';
import PrivateRoute from './Components/PrivateRoute';
import Login from './Components/AuthComponent/Login';
import SignUp from './Components/AuthComponent/SignUp';

// {
//   "reactSnap": {
//     "puppeteerArgs": [
//       "--no-sandbox",
//       "--disable-setuid-sandbox"
//     ]
//   }
// }

function App() {
  ReactGA.initialize("G-F0XBYL4VY9")
  // ReactGA.send({ hitType: "pageview" })
  // ReactGA.pageview(document.location.pathname)

  return (
    <div>
      <HelmetProvider>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path="/sign-in" element={<Login />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path='events/*' element={<EventsMain />} />
          <Route path='/gallery' element={<Gallery />} />
          <Route path='/volunteer-register' element={<VolunteerForm />} />
          <Route path='/verifyEmail/:id/:token' element={<EmailVerification />} />
          <Route path='/payment-redirect' element={<PaymentRedirect />} />
          <Route path='/admin' element={<PrivateRoute />} >
            <Route path='/admin' element={<AdminHome />} />
          </Route>
          <Route path='/donate' element={<Donate />} />
          {/* <Route path="*" element={<Navigate to="/" replace />} /> */}

        </Routes>
      </HelmetProvider>
    </div>
  );
}

export default App;

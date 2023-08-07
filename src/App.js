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
import IndexPage from './Components/Blog/IndexPage';
import CreatePost from './Components/Blog/CreatePost';
import PostPage from './Components/Blog/PostPage';
import EditPost from './Components/Blog/EditPost';
import { ThemeProvider } from '@mui/material';
import theme from './theme/theme';


function App() {
  ReactGA.initialize("G-F0XBYL4VY9")
  // ReactGA.send({ hitType: "pageview" })
  // ReactGA.pageview(document.location.pathname)

  return (
    <div>
      <ThemeProvider theme={theme}>
        <HelmetProvider>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path="/login" element={<Login />} />
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
            <Route path='/blog' element={<IndexPage />} />
            <Route path='/post/:path' element={<PostPage />} />
            <Route path='/edit/:path' element={<EditPost />} />
            <Route path='/create-post' element={<PrivateRoute />} >
              <Route path='/create-post' element={<CreatePost />} />
            </Route>

            {/* <Route path="*" element={<Navigate to="/" replace />} /> */}

          </Routes>
        </HelmetProvider>
      </ThemeProvider>

    </div>
  );
}

export default App;

// {
//   "reactSnap": {
//     "puppeteerArgs": [
//       "--no-sandbox",
//       "--disable-setuid-sandbox"
//     ]
//   }
// }
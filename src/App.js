import './App.css';
import { Route, Routes } from 'react-router-dom';
import Home from './Components/Home';
import EventsMain from './Components/Events/EventsMain';
import VolunteerForm from './Components/VolunteerForm';
import PaymentRedirect from './Components/PaymentRedirect';
import AdminHome from './Components/Admin/AdminHome';
import EmailVerification from './Components/EmailVerification';
import { app} from './config/firebase-config'
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
import ScrollToTop from './Components/ScrollToTop/ScrollToTop';
import NivanshFightSma from './Components/NivanshFightSma/NivanshFightSma';
import EventForm from './Components/Events/EventForm';
import AdminMain from './Components/Admin/AdminMain';
import ForgotPassword from './Components/AuthComponent/ForgotPassword';
import { Toaster } from 'sonner'
import PrivacyPolicy from './Components/PrivacyPolicy/PrivacyPolicy';
import TermsAndConditions from './Components/PrivacyPolicy/TermsAndConditions';
import Gallery from './Components/Gallery/Gallery';
import OurTeamMain from './Components/OurTeam/OurTeamMain';
import EventForm2025 from './Components/Events/EventForm2025';
import RfhSheRun2025 from './Components/Events/RfhSheRun2025';
import DonationPaymentRedirect from './Components/DonationPaymentRedirect';
import FeedbackPage from './Components/Events/FeedbackPage';
import ActivitiesMain from './Components/Activities/ActivitiesMain';







function App() {
  ReactGA.initialize("G-F0XBYL4VY9")
  // ReactGA.send({ hitType: "pageview" })
  // ReactGA.pageview(document.location.pathname)

  return (
    <div>
      <ThemeProvider theme={theme}>
        <Toaster richColors closeButton />
        <ScrollToTop />
        <HelmetProvider>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path="/login" element={<Login />} />
            {/* <Route path="/sign-up" element={<SignUp />} /> */}
            <Route path='/forgot-password' element={<ForgotPassword />} />
            <Route path='events/*' element={<EventsMain />} />
            <Route path='our-team/*' element={<OurTeamMain />} />
            <Route path='activities/*' element={<ActivitiesMain />} />
            <Route path='/gallery' element={<Gallery />} />
            <Route path='/volunteer-register' element={<VolunteerForm />} />
            <Route path='/refund-policy' element={<PrivacyPolicy />} />
            <Route path='/terms-and-conditions' element={<TermsAndConditions />} />
            <Route path='/verifyEmail/:id/:token' element={<EmailVerification />} />
            {/* <Route path='/payment-redirect' element={<PaymentRedirect />} /> */}
            <Route path='/payment-redirect' element={<DonationPaymentRedirect />} />
            {/* <Route path='/admin/*' element={<PrivateRoute />} > */}
            <Route path='admin/*' element={<AdminMain />} />
            {/* </Route> */}
            <Route path='/donate' element={<Donate />} />
            <Route path='/nivanshfightsma' element={<NivanshFightSma />} />
            {/* <Route path='/rfh-juniors-run-2024' element={<EventForm />} /> */}
            <Route path='/rfh-juniors-run-2025' element={<EventForm2025 />} />
            <Route path='/rfh-she-run-2025' element={<RfhSheRun2025 />} />
            <Route path='/rfhrun2025-feedback' element={<FeedbackPage />} />
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
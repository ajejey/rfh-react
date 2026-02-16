import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
// import { HashRouter as Router } from "react-router-dom";
import { BrowserRouter } from "react-router-dom";
import { hydrate, render } from "react-dom";
import { GlobalProvider } from './context/Provider';

const rootElement = document.getElementById("root");
if (rootElement.hasChildNodes()) {
  hydrate(
    <GlobalProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </GlobalProvider>
    , rootElement);
} else {
  render(
    <GlobalProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </GlobalProvider>
    , rootElement);
}

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//   <React.StrictMode>
//     <BrowserRouter>
//       <App />
//     </BrowserRouter>
//   </React.StrictMode>
// );

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

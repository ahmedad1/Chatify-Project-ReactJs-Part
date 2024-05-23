import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import "bootstrap/dist/js/bootstrap.min"
import "bootstrap/dist/css/bootstrap.min.css"
import { BrowserRouter } from 'react-router-dom';
import {Provider} from "react-redux"
import store from './Redux-Toolkit/Store/Store';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';

const root = ReactDOM.createRoot(document.getElementById('root'));
console.clear()
console.log("%cWARNING: Don't Copy and Paste any code here that anyone gives you because this code may make him access your account","font-size:25px;color:red;font-weight:bold;text-shadow: .7px .7px black;")
root.render(
  // <React.StrictMode>
  <Provider store={store}>
    

  <BrowserRouter>
    <GoogleReCaptchaProvider reCaptchaKey="6LfR0OUpAAAAAN1KGu6gjhtetcSLC0y5f15yMPHr">
    <App />
  </GoogleReCaptchaProvider>
    
  </BrowserRouter>
  </Provider>
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

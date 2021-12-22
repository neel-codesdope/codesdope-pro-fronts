import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { BrowserRouter as Router } from 'react-router-dom';
import './Styles/index.less';
import reportWebVitals from './reportWebVitals';
import configureUserStore from './Stores/UserStore';
import configureStore from './Stores/Store';
import ScrollToTop from './HOC/ScrollToTop';

configureUserStore();
configureStore();

// Remove console logs from Prod Env
if (process.env.REACT_APP_ENV === 'prod') {
    console.log = function () {};
}

ReactDOM.render(
    <React.StrictMode>
        <Router>
            <ScrollToTop />
            <App />
        </Router>
    </React.StrictMode>,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

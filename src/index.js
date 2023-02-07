import React from 'react'
import ReactDOM from 'react-dom/client';
import App from './App'
import './i18n'
import * as serviceWorker from './serviceWorker'

if (process.env.NODE_ENV === "production") {
    console.log = () => {
    }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <App />
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register()

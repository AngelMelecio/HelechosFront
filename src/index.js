import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import PaginaEmpleados  from './pages/PaginaEmpleados'
import Login from './pages/Login';

ReactDOM.render(
  <React.StrictMode>
    
    <div className="bg-gray-300 h-screen">
      <Login/>
    </div>
    
    {/*<App />*/}
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

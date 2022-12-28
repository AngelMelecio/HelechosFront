import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import PaginaEmpleados from './pages/PaginaEmpleados'
import Login from './pages/Login'
import AppBar from './components/AppBar';

ReactDOM.render(
  <React.StrictMode>
     <div className="flex w-screen relative h-screen">
        <div className="flex w-14 realtive">
          <AppBar />
        </div>
        <div id='page' className="flex w-full relative">
          <div className="flex absolute w-full">
            <div className='flex w-full bg-slate-100' >
              <PaginaEmpleados />
            </div>
          </div>
        </div>

    </div>
    {/*<App />*/}
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

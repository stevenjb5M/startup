import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './main.css';

import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import { Cards } from './cards/cards';
import { Leaderboard } from './leaderboard/leaderboard';
import { Locations } from './locations/locations';
import { Login } from './login/login';
import { Home } from './home/home';


export default function App() {
    return (
        <BrowserRouter>
            <div className="body bg-dark text-light">
                <header>
                    <h1>Welcome to Card Cash</h1>
                    <hr />
                </header>

                <Routes>
                    <Route path='/' element={<Login />} exact />
                    <Route path='/cards' element={<Cards />} />
                    <Route path='/leaderboard' element={<Leaderboard />} />
                    <Route path='/locations' element={<Locations />} />
                    <Route path='/home' element={<Home />} />
                    <Route path='*' element={<NotFound />} />
                </Routes>

                <footer>
                    <div id="footer-info">
                        <a href="https://github.com/stevenjb5M/startup.git">Steven Brown's GitHub</a>
                    </div>

                </footer>



            </div>;
        </BrowserRouter>

    );
}

function NotFound() {
    return <main className="container-fluid bg-secondary text-center">404: Return to sender. Address unknown.</main>;
  }
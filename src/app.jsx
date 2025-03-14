import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './main.css';

import { BrowserRouter, NavLink, Route, Routes, useLocation } from 'react-router-dom';
import { Cards } from './cards/cards';
import { Leaderboard } from './leaderboard/leaderboard';
import { Locations } from './locations/locations';
import { Login } from './login/login';
import { Home } from './home/home';
import { UserProvider } from './context/UserContext';

export default function App() {
    return (
        <UserProvider>
            <BrowserRouter>
                <AppContent />
            </BrowserRouter>
        </UserProvider>
    );
}

function AppContent() {
    const location = useLocation();
    
    return (
        <div className="body bg-dark text-light">
            <header>
                <h1>Welcome to Card Cash</h1>
                <hr />
            </header>

            <Routes>
                <Route path='/' element={<Login />} />
                <Route path='/cards' element={<Cards />} />
                <Route path='/leaderboard' element={<Leaderboard />} />
                <Route path='/locations' element={<Locations />} />
                <Route path='/home' element={<Home />} />
                <Route path='*' element={<NotFound />} />
            </Routes>

            <footer>
                {location.pathname !== '/' && (
                    <nav id="leaderboard-button-div">
                        <NavLink className="icon-link" to="/">
                            <img className="icon-button" src="user-solid-2.svg" alt="Login" />
                        </NavLink>
                        <NavLink className="icon-link" to="/home">
                            <img className="icon-button" src="house-solid.svg" alt="Home" />
                        </NavLink>
                        <NavLink className="icon-link" to="/locations">
                            <img className="icon-button" src="store-solid.svg" alt="Locations" />
                        </NavLink>
                        <NavLink className="icon-link" to="/cards">
                            <img className="icon-button" src="credit-card-solid.svg" alt="Cards" />
                        </NavLink>
                        <NavLink className="icon-link" to="/leaderboard">
                            <img className="icon-button" src="chart-simple-solid.svg" alt="Leaderboard" />
                        </NavLink>
                    </nav>
                )}
                <div id="footer-info">
                    <a href="https://github.com/stevenjb5M/startup.git">Steven Brown's GitHub</a>
                </div>
            </footer>
        </div>
    );
}

function NotFound() {
    return <main className="container-fluid bg-secondary text-center">404: Return to sender. Address unknown.</main>;
}
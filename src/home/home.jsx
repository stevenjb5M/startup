import React from 'react';
import "../main.css";
import { NavLink } from 'react-router-dom';
import { Cards } from '../cards/cards';
import { Leaderboard } from '../leaderboard/leaderboard';
import { Locations } from '../locations/locations';
import { Login } from '../login/login';

export function Home() {
  return (
    <main>
      <div id="main-div">
        <select id="dropdown" title="Location" name="location_selection">
          <option value="" disabled selected>Select Location (Database data)</option>
          <option value="walmart">Walmart</option>
        </select>
        <br />
    
        <div id="cashback-div">
            <h2>Walmart</h2>
            <p>Use your wells fargo card!</p>
            <p>You will earn 5% back</p>
        </div>
    
        <br />
        <br />
      </div> 

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
    </main>
  );
}
import React from 'react';
import "../main.css";
import { NavLink } from 'react-router-dom';

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

    </main>
  );
}
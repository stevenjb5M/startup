import React, { useEffect, useState } from 'react';
import "../main.css";
import { NavLink } from 'react-router-dom';
import locationsData from '../data/locations.json'; // Adjust the path as needed

export function Home() {
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    setLocations(locationsData);
  }, []);

  return (
    <main>
      <div id="main-div">
        <select id="dropdown" title="Location" name="location_selection">
          <option value="" disabled selected>Select Location (Database data)</option>
          {locations.map((location) => (
            <option key={location.value} value={location.value}>
              {location.label}
            </option>
          ))}
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
import React, { useContext, useEffect, useState } from 'react';
import "../main.css";
import { NavLink } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

export function Home() {
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const { currentUser } = useContext(UserContext);

  useEffect(() => {                                
    const storedLocations = localStorage.getItem(currentUser.email + '/locations');
    if (storedLocations) {
      setLocations(JSON.parse(storedLocations));
    }
  }, []);

  const handleSelectionChange = (event) => {
    const selectedValue = event.target.value;
    const location = locations.find(loc => loc.value === selectedValue);
    setSelectedLocation(location);
  };

  return (
    <main>
      <div id="main-div">
        <select id="dropdown" title="Location" name="location_selection" onChange={handleSelectionChange} defaultValue="">
          <option value="" disabled>Select Location (Database data)</option>
          {locations.map((location) => (
            <option key={location.value} value={location.value}>
              {location.label}
            </option>
          ))}
        </select>
        <br />
    
        {selectedLocation && (
          <div id="cashback-div">
            <h2>{selectedLocation.label}</h2>
            <p>Use your Wells Fargo card!</p>
            <p>You will earn back</p>
          </div>
        )}
    
        <br />
        <br />
      </div> 
    </main>
  );
}
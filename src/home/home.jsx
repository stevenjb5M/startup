import React, { useContext, useEffect, useState } from 'react';
import "../main.css";
import { NavLink, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

export function Home() {
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const { currentUser } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser || !currentUser.email) {
      navigate('/');
      return;
    }

    console.log("Current User:", currentUser);
    const userObject = JSON.parse(localStorage.getItem("users/" + currentUser.email)) || {};
    console.log("User Object from Local Storage:", userObject);

    const storedLocations = userObject.locations || [];
    console.log("Stored Locations:", storedLocations);

    if (storedLocations.length > 0) {
      setLocations(storedLocations);
      console.log("Locations state set:", storedLocations);
    } else {
      console.log("No stored locations found for user:", currentUser.email);
    }
  }, [currentUser, navigate]);

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
            <option key={location} value={location}>
              {location}
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
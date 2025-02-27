import React, { useContext, useEffect, useState } from 'react';
import "./locations.css";
import "../main.css";
import { UserContext } from '../context/UserContext';

export function Locations() {
  const [locations, setLocations] = useState([]);
  const { currentUser } = useContext(UserContext);

  useEffect(() => {
    const storedLocations = JSON.parse(localStorage.getItem(currentUser + '/locations')) || [];
    setLocations(storedLocations);
  }, []);

  return (
    <main>
      <div id="locations-div">
        <h2 id="locations-title">Your Locations</h2>
        <ul id="locations-list">
          {locations.map((location, index) => (
            <li key={index} className="location">{location}</li>
          ))}
        </ul>

        <div id="add-remove-buttons">
          <a className="icon-link" href="#" onClick={openPopup}>
            <img id="plus-button" className="icon-button" src="plus-solid.svg" alt="Description of image" />
          </a>
          <a className="icon-link" href="">
            <img className="icon-button" src="minus-solid.svg" alt="Description of image" />
          </a>
        </div>
      </div>

      <div id="popup-background" style={{display: 'none'}}></div>

      <div id="popup" style={{ display: 'none' }}>
        <h3>Enter Location Name</h3>
        <input type="text" id="locationName" placeholder="Location name" />
        <br />
        <button type="button" onClick={addLocation}>Add Location</button>
        <button type="button" onClick={closePopup}>Close</button>
      </div>
    </main>
  );

  function addLocation() {
    const locationName = document.getElementById('locationName').value;
    if (locationName) {
      const updatedLocations = [...locations, locationName];
      setLocations(updatedLocations);
      localStorage.setItem(currentUser + '/locations', JSON.stringify(updatedLocations));
      document.getElementById('locationName').value = '';
      closePopup();
    }
  }

  function openPopup() {
    document.getElementById('popup').style.display = 'grid';
    document.getElementById('popup-background').style.display = 'block';

  }

  function closePopup() {
    document.getElementById('popup').style.display = 'none';
    document.getElementById('popup-background').style.display = 'none';

  }
}
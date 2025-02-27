import React, { useContext, useEffect, useState } from 'react';
import "./locations.css";
import "../main.css";
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

export function Locations() {
  const [locations, setLocations] = useState([]);
  const { currentUser } = useContext(UserContext);
  const navigate = useNavigate();


  useEffect(() => {
    if (!currentUser.email) {
      navigate('/');
    }

    const storedLocations = JSON.parse(localStorage.getItem(currentUser.email + '/locations')) || [];
    setLocations(storedLocations);
  }, [currentUser, navigate]);

  return (
    <main>
      <div id="locations-div">
        <h2 id="locations-title">Your Locations</h2>
        <ul id="locations-list">
          {locations.map((location, index) => (
            <div className="specific-location-div">
              <li key={index} className="location">{location}</li>
              <button onClick={() => deleteLocation(index)}>Delete</button>
            </div>
            
          ))}
        </ul>

        <div id="add-remove-buttons">
          <a className="icon-link" href="#" onClick={openPopup}>
            <img id="plus-button" className="icon-button" src="plus-solid.svg" alt="Description of image" />
          </a>
        </div>
      </div>

      <div id="popup-background" style={{display: 'none'}}></div>

      <div id="popup" style={{ display: 'none' }}>
        <h3>Enter Location Name</h3>
        <input type="text" id="location-name" placeholder="Location name" />
        <br />
        <button type="button" onClick={addLocation}>Add Location</button>
        <button type="button" onClick={closePopup}>Close</button>
      </div>
    </main>
  );

  function addLocation() {
    const locationName = document.getElementById('location-name').value;
    if (locationName) {
      const updatedLocations = [...locations, locationName];
      setLocations(updatedLocations);
      localStorage.setItem(currentUser.email + '/locations', JSON.stringify(updatedLocations));
      document.getElementById('location-name').value = '';
      closePopup();
    }
  }

  function deleteLocation(locationIndex) {
    const updatedLocations = locations.filter((_, index) => index !== locationIndex);
    setLocations(updatedLocations);
    localStorage.setItem(currentUser.email + '/locations', JSON.stringify(updatedLocations));
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
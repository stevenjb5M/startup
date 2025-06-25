import React, { useContext, useEffect, useState } from 'react';
import "./locations.css";
import "../main.css";
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import PropTypes from 'prop-types';

export function Locations() {
  const { currentUser, setCurrentUser } = useContext(UserContext);
  const navigate = useNavigate();
  const userEmail = currentUser?.email || '';
  const locationsKey = `locations_${userEmail}`;
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!currentUser.email) {
      navigate('/');
    } else {
      getLocations();
    }
  }, [currentUser, navigate]);

  return (
    <main>
      <button
        onClick={() => navigate('/home')}
        style={{
          position: 'absolute',
          left: 24,
          top: 90,
          background: 'none',
          border: 'none',
          color: '#fff',
          fontWeight: 700,
          fontSize: 16,
          cursor: 'pointer',
          padding: 0,
          zIndex: 2,
          marginBottom: 48,
          marginTop: 56
        }}
        aria-label="Back to Home"
      >
        ← Back
      </button>
      <div id="locations-div">
        <h2 id="locations-title">Your Locations</h2>
        {loading && <p>Loading locations...</p>}
        {error && <p className="error-message">{error}</p>}
        <ul id="locations-list">
          {locations.map((location, index) => (
            <div className="specific-location-div" key={location + index}>
              <li key={index} className="location">{location}</li>
              <button onClick={() => deleteLocation(location)}>Delete</button>
            </div>
            
          ))}
        </ul>

        <div id="add-remove-buttons">
          <button className="icon-link" type="button" onClick={openPopup} aria-label="Add Location">
            <img id="plus-button" className="icon-button" src="plus-solid.svg" alt="Add location" />
          </button>
        </div>
      </div>

      <div id="popup-background" style={{display: 'none'}} onClick={closePopup}></div>

      <div id="popup" style={{ display: 'none' }}>
        <h3>Enter Location Name</h3>
        <input type="text" id="location-name" placeholder="Location name" />
        <br />
        <button type="button" onClick={addLocation}>Add Location</button>
        <button type="button" onClick={closePopup}>Close</button>
      </div>
    </main>
  );

  async function getLocations() {
    setLoading(true);
    try {
      const storedLocations = localStorage.getItem(locationsKey);
      const parsedLocations = JSON.parse(storedLocations) || [];
      setLocations(parsedLocations);
    } catch (error) {
      setError("Failed to load locations");
    } finally {
      setLoading(false);
    }
  }

  async function addLocation() {
    try {
      const locationName = document.getElementById('location-name').value.trim();
      if (!locationName) {
        setError("Location name cannot be empty");
        return;
      }
      // Prevent duplicates (case-insensitive)
      if (locations.some(loc => loc.trim().toLowerCase() === locationName.toLowerCase())) {
        setError("Location already exists");
        return;
      }
      const updatedLocations = [...locations, locationName];
      setLocations(updatedLocations);
      const updatedUser = { ...currentUser, locations: updatedLocations };
      setCurrentUser(updatedUser);
      localStorage.setItem(locationsKey, JSON.stringify(updatedLocations));
      setError(null);
      document.getElementById('location-name').value = '';
      closePopup();
    } catch (error) {
      setError("Failed to add location");
    }
  }

  async function deleteLocation(locationName) {
    try {
      const updatedLocations = locations.filter(location => location !== locationName);
      setLocations(updatedLocations);

      const updatedUser = { ...currentUser, locations: updatedLocations };
      setCurrentUser(updatedUser);

      localStorage.setItem(locationsKey, JSON.stringify(updatedLocations));
    } catch (error) {
      setError("Failed to delete location");
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

Locations.propTypes = {
  currentUser: PropTypes.shape({
    email: PropTypes.string,
    token: PropTypes.string,
    locations: PropTypes.arrayOf(PropTypes.string),
  }),
  setCurrentUser: PropTypes.func.isRequired,
};
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
  const [popupOpen, setPopupOpen] = useState(false);

  useEffect(() => {
    if (!currentUser.email) {
      navigate('/');
    } else {
      getLocations();
    }
  }, [currentUser, navigate]);

  return (
    <main className="locations-main">
      <button
        onClick={() => navigate('/home')}
        className="locations-back-btn"
        aria-label="Back to Home"
      >
        ← Back
      </button>
      <div className="locations-container">
        <div className="locations-header">
          <h2 className="locations-title">
            Your Locations
          </h2>
          <img id="plus-button" className="icon-button locations-add-icon" src="plus-solid.svg" alt="Add location" onClick={() => setPopupOpen(true)} />
        </div>
        {loading && <p>Loading locations...</p>}
        {error && <p className="error-message">{error}</p>}
        <ul className="locations-list">
          {locations.map((location, index) => (
            <li key={index} className="locations-item">
              <div className="locations-box">
                <span className="locations-box-title">{location}</span>
                <button onClick={() => deleteLocation(location)} className="locations-delete-btn">Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div id="popup-background" className={`locations-popup-bg${popupOpen ? ' open' : ''}`} onClick={() => setPopupOpen(false)}></div>
      <div className={`locations-popup${popupOpen ? ' open' : ''}`}> 
        <h3 className="locations-popup-title">Enter Location Name</h3>
        <input type="text" id="location-name" placeholder="Location name" className="locations-popup-input" />
        <div className="locations-popup-actions">
          <button type="button" onClick={addLocation} className="locations-add-btn">Add Location</button>
          <button type="button" onClick={() => setPopupOpen(false)} className="locations-close-btn">Close</button>
        </div>
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
      setPopupOpen(false);
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

  function openPopup() { setPopupOpen(true); }
  function closePopup() { setPopupOpen(false); }
}

Locations.propTypes = {
  currentUser: PropTypes.shape({
    email: PropTypes.string,
    token: PropTypes.string,
    locations: PropTypes.arrayOf(PropTypes.string),
  }),
  setCurrentUser: PropTypes.func.isRequired,
};
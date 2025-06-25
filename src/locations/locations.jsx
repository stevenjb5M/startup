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
    <main style={{display: 'flex', justifyContent: 'center', alignItems: 'flex-start', minHeight: '80vh', background: 'transparent'}}>
      <button
        onClick={() => navigate('/home')}
        style={{
          position: 'absolute',
          left: 48,
          top: 110,
          background: 'none',
          border: 'none',
          color: '#fff',
          fontWeight: 700,
          fontSize: 18,
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
      <div style={{width: '70vw', minWidth: 700, maxWidth: 1200, marginTop: 48, background: '#f8fafc', borderRadius: 18, boxShadow: '0 4px 24px rgba(0,0,0,0.10)', padding: '48px 56px 40px 56px', position: 'relative'}}>
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32}}>
          <h2 style={{textAlign: 'left', fontWeight: 800, color: '#1a365d', fontSize: 36, margin: 0, letterSpacing: '-1px', display: 'flex', alignItems: 'center'}}>
            Your Locations
          </h2>
         <img id="plus-button" className="icon-button" src="plus-solid.svg" alt="Add location" style={{marginLeft: 16, width: 26, cursor: 'pointer'}} onClick={openPopup} />
        </div>
        {loading && <p>Loading locations...</p>}
        {error && <p className="error-message">{error}</p>}
        <ul style={{listStyle: 'none', padding: 0, margin: 0}}>
          {locations.map((location, index) => (
            <li key={index} style={{marginBottom: 22}}>
              <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', padding: '18px 32px'}}>
                <span style={{fontWeight: 600, fontSize: 22, color: '#1a365d'}}>{location}</span>
                <button onClick={() => deleteLocation(location)} style={{background: '#e0e7ef', color: '#1a365d', border: 'none', borderRadius: 8, padding: '8px 24px', fontWeight: 700, fontSize: 16, cursor: 'pointer'}}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div id="popup-background" style={{display: 'none'}} onClick={closePopup}></div>
      <div id="popup" style={{ display: 'none', minWidth: 400, minHeight: 220, padding: 32, borderRadius: 16, background: '#fff', boxShadow: '0 4px 24px rgba(0,0,0,0.12)', zIndex: 10, justifyContent: 'center', alignItems: 'center', position: 'fixed', left: '50%', top: '50%', transform: 'translate(-50%, -50%)'}}>
        <h3 style={{marginBottom: 18, color: '#1a365d', fontWeight: 700, fontSize: 22}}>Enter Location Name</h3>
        <input type="text" id="location-name" placeholder="Location name" style={{padding: 14, borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 18, marginBottom: 18, width: '100%'}} />
        <div style={{display: 'flex', gap: 16, marginTop: 8}}>
          <button type="button" onClick={addLocation} style={{background: '#2563eb', color: '#fff', borderRadius: 8, fontWeight: 700, fontSize: 16, padding: '10px 28px'}}>Add Location</button>
          <button type="button" onClick={closePopup} style={{background: '#e0e7ef', color: '#1a365d', borderRadius: 8, fontWeight: 700, fontSize: 16, padding: '10px 28px'}}>Close</button>
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
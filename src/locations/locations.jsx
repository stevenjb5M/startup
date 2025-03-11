import React, { useContext, useEffect, useState } from 'react';
import "./locations.css";
import "../main.css";
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

export function Locations() {
  const [locations, setLocations] = useState([]);
  const { currentUser } = useContext(UserContext);
  const { setCurrentUser } = useContext(UserContext);
  const navigate = useNavigate();


  useEffect(() => {
    if (!currentUser.email) {
      navigate('/');
    } else {
      getLocations();
    }
  }, []);

  return (
    <main>
      <div id="locations-div">
        <h2 id="locations-title">Your Locations</h2>
        <ul id="locations-list">
          {locations.map((location, index) => (
            <div className="specific-location-div" key={location + index}>
              <li key={index} className="location">{location}</li>
              <button onClick={() => deleteLocation(location)}>Delete</button>
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

  async function getLocations() {
    try {
      const response = await fetch('/api/locations', {
        method: "GET", 
        headers: {
          'Authorization': currentUser.token
        },
      });

      if (response.ok) {
        console.log("Got Locations");
        let data;
        try {
          data = await response.json();
        } catch (error) {
          console.error("Failed to parse locations data", error);
          data = [];
        }

        if (data)
        {
          setLocations(data);
  
          const updatedUser = { ...currentUser, locations: data };
          setCurrentUser(updatedUser);  
        }

      }
      else {
        alert('Failed to get locations');
      }
    } catch (error) {
      alert("An error occured while getting the locations");
    }
  }

  async function addLocation() {
    try {
      const locationName = document.getElementById('location-name').value;

      const response = await fetch('/api/locations', {
        method: "POST", 
        headers: {
          'Content-Type': 'application/json',
          'Authorization': currentUser.token
        },
        body: JSON.stringify({location: locationName})
      });

      if (response.ok) {
        console.log("Added Location");

        const updatedLocations = [...locations, locationName];
        console.log("updated locations", updatedLocations);
        setLocations(updatedLocations);

        const updatedUser = { ...currentUser, locations: updatedLocations };
        setCurrentUser(updatedUser);

        document.getElementById('location-name').value = '';
        closePopup();
      }
      else {
        alert('Failed to add location');
      }
    } catch (error) {
      alert("An error occured while adding the location");
    }
  }

  async function deleteLocation(locationName) {
    try {
      const response = await fetch('/api/locations', {
        method: "POST", 
        headers: {
          'Content-Type': 'application/json',
          'Authorization': currentUser.token
        },
        body: JSON.stringify({location: locationName})
      });

      if (response.ok) {
        console.log("deleted Location");

        const updatedLocations = locations.filter(location => location !== locationName);
        setLocations(updatedLocations);

        const updatedUser = { ...currentUser, locations: updatedLocations };
        setCurrentUser(updatedUser);
      }
      else {
        alert('Failed to delete location');
      }
    } catch (error) {
      alert("An error occured while deleting the location");
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
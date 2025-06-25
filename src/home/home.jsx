import React, { useContext, useEffect, useState } from 'react';
import "../main.css";
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import PropTypes from 'prop-types';

export function Home() {
  const { currentUser } = useContext(UserContext);
  const navigate = useNavigate();
  const userEmail = currentUser?.email || '';
  const locationsKey = `locations_${userEmail}`;
  const cardsKey = `cards_${userEmail}`;

  const [locations, setLocations] = useState(() => JSON.parse(localStorage.getItem(locationsKey)) || []);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [cards, setCards] = useState(() => JSON.parse(localStorage.getItem(cardsKey)) || []);
  const [bestCard, setBestCard] = useState(null);
  const [bestCashBack, setBestCashBack] = useState(null);

  useEffect(() => {
    if (!currentUser || !currentUser.email) {
      navigate('/');
      return;
    }
    // Refresh user-specific data on login
    setLocations(JSON.parse(localStorage.getItem(locationsKey)) || []);
    setCards(JSON.parse(localStorage.getItem(cardsKey)) || []);
    setSelectedLocation(null);
    setBestCard(null);
    setBestCashBack(null);
  }, [currentUser, navigate]);

  const addStore = async (newLocation) => {
    try {
      const trimmedLocation = newLocation.trim();
      if (!trimmedLocation) return;
      // Prevent duplicates (case-insensitive)
      if (locations.some(loc => loc.trim().toLowerCase() === trimmedLocation.toLowerCase())) {
        return;
      }
      const updatedLocations = [...locations, trimmedLocation];
      setLocations(updatedLocations);
      localStorage.setItem(locationsKey, JSON.stringify(updatedLocations));
      console.error('Added new store');
    } catch (error) {
      console.error('An error occurred while adding the store', error);
    }
  };

  const handleSelectionChange = (event) => {
    const selectedValue = event.target.value;
    const locationIndex = locations.indexOf(selectedValue);
    const location = locations[locationIndex];
    setSelectedLocation(location);
    addStore(location);
    // Find the card with the highest cashback percentage for the selected location
    let highestCashback = 0;
    let bestCard = null;
    cards.forEach(card => {
      const locationData = card.locations.find(loc => loc.location === selectedValue);
      if (locationData && locationData.cashback > highestCashback) {
        highestCashback = locationData.cashback;
        bestCard = card.cardId;
      }
    });
    setBestCard(bestCard);
    setBestCashBack(highestCashback);
  };

  return (
    <main>
      <div id="main-div">
        <select 
          id="dropdown" 
          title="Location" 
          name="location_selection" 
          onChange={handleSelectionChange} 
          defaultValue=""
          aria-label="Select Location"
        >
          <option value="" disabled>Select Location</option>
          {locations.map((location) => (
            <option key={location} value={location}>
              {location}
            </option>
          ))}
        </select>
        <br />
    
        {selectedLocation && (
          <div id="cashback-div" role="alert">
            <h2>{selectedLocation}</h2>
            {bestCard ? (
              <>
                <p>Use your {bestCard} card!</p>
                <p>You will earn {bestCashBack}% back</p>
              </>
            ) : (
              <p>No card found</p>
            )}
          </div>
        )}
    
        <br />
        <br />
      </div> 
    </main>
  );
}

Home.propTypes = {
  currentUser: PropTypes.shape({
    email: PropTypes.string,
    token: PropTypes.string,
  }),
};
import React, { useContext, useEffect, useState } from 'react';
import "../main.css";
import "./home.css";
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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!currentUser || !currentUser.email) {
      navigate('/');
      return;
    }
    setLoading(true);
    setLocations(JSON.parse(localStorage.getItem(locationsKey)) || []);
    setCards(JSON.parse(localStorage.getItem(cardsKey)) || []);
    setSelectedLocation(null);
    setBestCard(null);
    setBestCashBack(null);
    setLoading(false);
  }, [currentUser, navigate]);

  const handleSelectionChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedLocation(selectedValue);
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
        <h2 className="home-title">
          Find Your Best Card
        </h2>
        <p className="home-desc">
          Select a location to see which card gives you the most cash back.
        </p>
        {locations.length === 0 ? (
          <div className="home-empty">
            <p>You have no locations yet.</p>
            <button onClick={() => navigate('/locations')}>Add a Location</button>
          </div>
        ) : (
          <div className="home-select-container">
            <select 
              id="dropdown" 
              title="Location" 
              name="location_selection" 
              onChange={handleSelectionChange} 
              value={selectedLocation || ''}
              aria-label="Select Location"
            >
              <option value="" disabled>Select Location</option>
              {locations.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>
          </div>
        )}
        {loading && <div className="loading-spinner"></div>}
        {selectedLocation && (
          <div id="cashback-div" role="alert">
            <h3 className="cashback-location">{selectedLocation}</h3>
            {bestCard ? (
              <>
                <div className="cashback-flex">
                  <img src="credit-card-solid.svg" alt="Best Card" className="icon-button cashback-img" />
                  <p className="cashback-card">Use your {bestCard} card!</p>
                  <p className="cashback-amount">You will earn <span className="cashback-bold">{bestCashBack !== null && bestCashBack !== undefined ? bestCashBack : 0}%</span> back</p>
                </div>
              </>
            ) : (
              <>
                <p className="no-card">No card found for this location.</p>
                <button onClick={() => navigate('/cards')}>Add Card</button>
              </>
            )}
          </div>
        )}
        <div className="home-actions">
          <button onClick={() => navigate('/cards')}>Manage Cards</button>
          <button onClick={() => navigate('/locations')}>Manage Locations</button>
        </div>
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
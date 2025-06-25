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
      <div id="main-div" style={{maxWidth: 600, margin: '0 auto', padding: '32px 0'}}>
        <h2 style={{textAlign: 'center', fontWeight: 700, color: 'white', marginBottom: 8, fontSize: 32, textShadow: '0 2px 8px rgba(0,0,0,0.10)', borderRadius: 8, padding: '8px 0'}}>
          Find Your Best Card
        </h2>
        <p style={{textAlign: 'center', color: 'white', marginBottom: 32, fontSize: 18, textShadow: '0 1px 4px rgba(0,0,0,0.08)', borderRadius: 6, padding: '4px 0'}}>
          Select a location to see which card gives you the most cash back.
        </p>
        {locations.length === 0 ? (
          <div style={{textAlign: 'center', margin: '32px 0'}}>
            <p>You have no locations yet.</p>
            <button onClick={() => navigate('/locations')}>Add a Location</button>
          </div>
        ) : (
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <select 
              id="dropdown" 
              title="Location" 
              name="location_selection" 
              onChange={handleSelectionChange} 
              value={selectedLocation || ''}
              aria-label="Select Location"
              style={{width: '70%', minWidth: 200, maxWidth: 400, fontSize: 18, marginBottom: 24}}
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
        {loading && <div className="loading-spinner" style={{margin: '32px auto'}}></div>}
        {selectedLocation && (
          <div id="cashback-div" role="alert" style={{marginTop: 24, marginBottom: 24, background: '#f8fafc', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: '1px solid #e0e0e0', padding: 32, textAlign: 'center'}}>
            <h3 style={{color: '#1a365d', marginBottom: 12}}>{selectedLocation}</h3>
            {bestCard ? (
              <>
                <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                  <img src="credit-card-solid.svg" alt="Best Card" className="icon-button" style={{width: 48, marginBottom: 8}} />
                  <p style={{fontWeight: 600, fontSize: 20, color: '#2563eb'}}>Use your {bestCard} card!</p>
                  <p style={{fontSize: 18, color: "black"}}>You will earn <span style={{fontWeight: 700}}>{bestCashBack !== null && bestCashBack !== undefined ? bestCashBack : 0}%</span> back</p>
                </div>
              </>
            ) : (
              <>
                <p style={{color: '#b91c1c', fontWeight: 500}}>No card found for this location.</p>
                <button onClick={() => navigate('/cards')}>Add Card</button>
              </>
            )}
          </div>
        )}
        <div style={{display: 'flex', justifyContent: 'center', gap: 16, marginTop: 16}}>
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
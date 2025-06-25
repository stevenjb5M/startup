import React, { useContext, useEffect, useState } from 'react';
import "./cards.css";
import "../main.css";
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import PropTypes from 'prop-types';

export function Cards() {
  const { currentUser, setCurrentUser } = useContext(UserContext);
  const navigate = useNavigate();
  const userEmail = currentUser?.email || '';
  const cardsKey = `cards_${userEmail}`;
  const [cards, setCards] = useState([]);
  const [cardName, setCardName] = useState('');
  const [locationName, setLocationName] = useState('');
  const [cashBack, setCashBack] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!currentUser.email) {
      navigate('/');
    } else {
      getCards();
    }
  }, [currentUser, navigate]);

  const getCards = () => {
    const storedCards = JSON.parse(localStorage.getItem(cardsKey)) || [];
    setCards(storedCards);
  };

  const handleCardNameChange = (event) => {
    setCardName(event.target.value);
  };

  const handleLocationNameChange = (event) => {
    setLocationName(event.target.value);
  };

  const handleCashBackChange = (event) => {
    setCashBack(event.target.value);
  };

  const addCard = () => {
    if (!cardName) {
      setError('Card name is required');
      return;
    }

    const newCard = {
      cardId: cardName,
      locations: []
    };

    const updatedCards = [...cards, newCard];
    setCards(updatedCards);
    localStorage.setItem(cardsKey, JSON.stringify(updatedCards));
    setCardName('');
    closePopup();
  };

  const deleteCard = (cardId) => {
    const updatedCards = cards.filter(card => card.cardId !== cardId);
    setCards(updatedCards);
    localStorage.setItem(cardsKey, JSON.stringify(updatedCards));
  };

  const addLocationToCard = (cardId) => {
    if (!locationName || !cashBack) {
      setError('Location name and cashback percentage are required');
      return;
    }

    const updatedCards = cards.map(card => {
      if (card.cardId === cardId) {
        const updatedLocations = [...card.locations, { location: locationName, cashback: cashBack }];
        return { ...card, locations: updatedLocations };
      }
      return card;
    });

    setCards(updatedCards);
    localStorage.setItem(cardsKey, JSON.stringify(updatedCards));
    setLocationName('');
    setCashBack('');
    closePopup();
  };

  const removeLocationFromCard = (cardId, location) => {
    const updatedCards = cards.map(card => {
      if (card.cardId === cardId) {
        const updatedLocations = card.locations.filter(loc => loc.location !== location);
        return { ...card, locations: updatedLocations };
      }
      return card;
    });

    setCards(updatedCards);
    localStorage.setItem(cardsKey, JSON.stringify(updatedCards));
  };

  const openPopup = () => {
    document.getElementById('popup').style.display = 'grid';
    document.getElementById('popup-background').style.display = 'block';
  };

  const closePopup = () => {
    document.getElementById('popup').style.display = 'none';
    document.getElementById('popup-background').style.display = 'none';
  };

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
            Your Cards
          </h2>
          <img id="plus-button" className="icon-button" src="plus-solid.svg" alt="Add new card" style={{marginLeft: 16, width: 26, cursor: 'pointer'}} onClick={openPopup} />
        </div>
        {error && <div className="error-message">{error}</div>}
        <ul style={{listStyle: 'none', padding: 0, margin: 0}}>
          {cards.map((card, index) => (
            <li key={index} style={{marginBottom: 22}}>
              <div style={{display: 'flex', flexDirection: 'column', background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', padding: '18px 32px', marginBottom: 8}}>
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                  <span style={{fontWeight: 700, fontSize: 24, color: '#1a365d'}}>{card.cardId}</span>
                  <button onClick={() => deleteCard(card.cardId)} style={{background: '#e0e7ef', color: '#1a365d', border: 'none', borderRadius: 8, padding: '8px 24px', fontWeight: 700, fontSize: 16, cursor: 'pointer'}}>Delete</button>
                </div>
                <ul style={{listStyle: 'none', padding: 0, margin: '16px 0 0 0'}}>
                  {card.locations && card.locations.map(loc => (
                    <li key={loc.location} style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8}}>
                      <span style={{fontSize: 18, color: '#1a365d'}}>{loc.location}: {loc.cashback}%</span>
                      <button onClick={() => removeLocationFromCard(card.cardId, loc.location)} style={{background: '#fca5a5', color: '#fff', border: 'none', borderRadius: 8, padding: '6px 18px', fontWeight: 600, fontSize: 15, cursor: 'pointer'}}>Remove</button>
                    </li>
                  ))}
                </ul>
                <div style={{display: 'flex', gap: 12, marginTop: 12}}>
                  <input
                    type="text"
                    placeholder="Location name"
                    value={locationName}
                    onChange={handleLocationNameChange}
                    style={{padding: 10, borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 16, flex: 1}}
                  />
                  <input
                    type="text"
                    placeholder="Cash back %"
                    value={cashBack}
                    onChange={handleCashBackChange}
                    style={{padding: 10, borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 16, width: 120}}
                  />
                  <button onClick={() => addLocationToCard(card.cardId)} style={{background: '#2563eb', color: '#fff', borderRadius: 8, fontWeight: 700, fontSize: 16, padding: '10px 20px'}}>Add</button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div id="popup-background" style={{display: 'none'}} onClick={closePopup}></div>
      <div id="popup" style={{ display: 'none', minWidth: 400, minHeight: 220, padding: 32, borderRadius: 16, background: '#fff', boxShadow: '0 4px 24px rgba(0,0,0,0.12)', zIndex: 10, justifyContent: 'center', alignItems: 'center', position: 'fixed', left: '50%', top: '50%', transform: 'translate(-50%, -50%)'}}>
        <h3 style={{marginBottom: 18, color: '#1a365d', fontWeight: 700, fontSize: 22}}>Enter Card Name</h3>
        <input type="text" id="card-name" placeholder="Card name" value={cardName} onChange={handleCardNameChange} style={{padding: 14, borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 18, marginBottom: 18, width: '100%'}} />
        <div style={{display: 'flex', gap: 16, marginTop: 8}}>
          <button type="button" onClick={addCard} style={{background: '#2563eb', color: '#fff', borderRadius: 8, fontWeight: 700, fontSize: 16, padding: '10px 28px'}}>Add Card</button>
          <button type="button" onClick={closePopup} style={{background: '#e0e7ef', color: '#1a365d', borderRadius: 8, fontWeight: 700, fontSize: 16, padding: '10px 28px'}}>Close</button>
        </div>
      </div>
    </main>
  );
}

Cards.propTypes = {
  currentUser: PropTypes.shape({
    email: PropTypes.string,
    token: PropTypes.string,
  }),
  setCurrentUser: PropTypes.func.isRequired,
};
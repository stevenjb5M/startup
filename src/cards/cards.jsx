import React, { useContext, useEffect, useState } from 'react';
import "./cards.css";
import "../main.css";
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

export function Cards() {
  const [cards, setCards] = useState([]);
  const [cardName, setCardName] = useState('');
  const [locationName, setLocationName] = useState('');
  const [cashBack, setCashBack] = useState('');
  const { currentUser, setCurrentUser } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser.email) {
      navigate('/');
    } else {
      getCards();
    }
  }, [currentUser, navigate]);

  const getCards = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/cards', {
        method: 'GET',
        headers: {
          'Authorization': currentUser.token
        }
      });

      if (response.ok) {
        const cards = await response.json();
        setCards(cards);
      } else {
        console.error('Failed to get cards', response.statusText);
      }
    } catch (error) {
      console.error('An error occurred while getting cards', error);
    }
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

  const addCard = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/cards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': currentUser.token
        },
        body: JSON.stringify({ cardId: cardName })
      });

      if (response.ok) {
        const cards = await response.json();
        setCards(cards);
        setCardName('');
        closePopup();
      } else {
        console.error('Failed to add card', response.statusText);
      }
    } catch (error) {
      console.error('An error occurred while adding the card', error);
    }
  };

  const deleteCard = async (cardId) => {
    try {
      const response = await fetch('http://localhost:4000/api/cards', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': currentUser.token
        },
        body: JSON.stringify({ cardId })
      });

      if (response.ok) {
        const cards = await response.json();
        setCards(cards);
      } else {
        console.error('Failed to delete card', response.statusText);
      }
    } catch (error) {
      console.error('An error occurred while deleting the card', error);
    }
  };

  const addLocationToCard = async (cardId) => {
    try {
      const response = await fetch(`http://localhost:4000/api/cards/${cardId}/locations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': currentUser.token
        },
        body: JSON.stringify({ location: locationName, cashback: cashBack })
      });

      if (response.ok) {
        const cards = await response.json();
        setCards(cards);
        setLocationName('');
        setCashBack('');
      } else {
        console.error('Failed to add location to card', response.statusText);
      }
    } catch (error) {
      console.error('An error occurred while adding the location to the card', error);
    }
  };

  const removeLocationFromCard = async (cardId, location) => {
    try {
      const response = await fetch(`http://localhost:4000/api/cards/${cardId}/locations`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': currentUser.token
        },
        body: JSON.stringify({ location })
      });

      if (response.ok) {
        const cards = await response.json();
        setCards(cards);
      } else {
        console.error('Failed to remove location from card', response.statusText);
      }
    } catch (error) {
      console.error('An error occurred while removing the location from the card', error);
    }
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
    <main>
      <div id="cards-div">
        <h2 id="cards-title">Your Cards</h2>
        <ul id="cards-list">
          {cards.map((card, index) => (
            <div key={index} className="specific-card-div">
              <li className="card-style">
                <h3>{card.cardId}</h3>
                <ul>
                  {card.locations && card.locations.map(loc => (
                    <li key={loc.location}>
                      {loc.location}: {loc.cashback}%
                      <button onClick={() => removeLocationFromCard(card.cardId, loc.location)}>Remove Location</button>
                    </li>
                  ))}
                </ul>
                <input
                  type="text"
                  placeholder="Location name"
                  value={locationName}
                  onChange={handleLocationNameChange}
                />
                <input
                  type="text"
                  placeholder="Cash back percentage"
                  value={cashBack}
                  onChange={handleCashBackChange}
                />
                <button onClick={() => addLocationToCard(card.cardId)}>Add Location</button>
              </li>
              <button onClick={() => deleteCard(card.cardId)}>Delete</button>
            </div>
          ))}
        </ul>

        <div id="add-remove-buttons">
          <a className="icon-link" href="#" onClick={openPopup}>
            <img id="plus-button" className="icon-button" src="plus-solid.svg" alt="Add new card" />
          </a>
        </div>
      </div>

      <div id="popup-background" style={{ display: 'none' }}></div>

      <div id="popup" style={{ display: 'none' }}>
        <h3>Enter Card Name</h3>
        <input type="text" id="card-name" placeholder="Card name" value={cardName} onChange={handleCardNameChange} />
        <br />
        <button type="button" onClick={addCard}>Add Card</button>
        <button type="button" onClick={closePopup}>Close</button>
      </div>
    </main>
  );
}
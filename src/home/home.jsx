import React, { useContext, useEffect, useState } from 'react';
import "../main.css";
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

export function Home() {
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [cards, setCards] = useState([]);
  const [bestCard, setBestCard] = useState(null);
  const [bestCashBack, setBestCashBack] = useState(null);
  const { currentUser } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser || !currentUser.email) {
      navigate('/');
      return;
    }

    console.log("Current User:", currentUser);
    getLocations();
    getCards();
  }, [currentUser, navigate]);

  const getLocations = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/locations', {
        method: "GET",
        headers: {
          'Authorization': currentUser.token
        },
      });

      if (response.ok) {
        console.log("Got Locations");
        const data = await response.json();
        setLocations(data);
      } else {
        console.error('Failed to get locations', response.statusText);
      }
    } catch (error) {
      console.error("An error occurred while getting the locations", error);
    }
  };

  const getCards = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/cards', {
        method: "GET",
        headers: {
          'Authorization': currentUser.token
        },
      });

      if (response.ok) {
        console.log("Got Cards");
        const data = await response.json();
        setCards(data);
      } else {
        console.error('Failed to get cards', response.statusText);
      }
    } catch (error) {
      console.error("An error occurred while getting the cards", error);
    }
  };

  const handleSelectionChange = (event) => {
    const selectedValue = event.target.value;
    console.log(selectedValue);
    const locationIndex = locations.indexOf(selectedValue);
    const location = locations[locationIndex];
    console.log(locations);
    console.log(location);
    setSelectedLocation(location);

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
        <select id="dropdown" title="Location" name="location_selection" onChange={handleSelectionChange} defaultValue="">
          <option value="" disabled>Select Location (Database data)</option>
          {locations.map((location) => (
            <option key={location} value={location}>
              {location}
            </option>
          ))}
        </select>
        <br />
    
        {selectedLocation && (
          <div id="cashback-div">
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
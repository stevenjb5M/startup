const { MongoClient } = require('mongodb');
const config = require('./dbConfig.json');

const url = `mongodb+srv://${config.userName}:${config.password}@${config.hostname}`;
const client = new MongoClient(url);
const db = client.db('cardcash');
const userCollection = db.collection('users');
const storeCollection = db.collection('store');

// This will asynchronously test the connection and exit the process if it fails
(async function testConnection() {
  try {
    await db.command({ ping: 1 });
    console.log(`Connected to database`);
  } catch (ex) {
    console.log(`Unable to connect to database with ${url} because ${ex.message}`);
    process.exit(1);
  }
})();

function getUser(email) {
  return userCollection.findOne({ email: email });
}

function getUserByToken(token) {
  return userCollection.findOne({ token: token });
}

async function addUser(user) {
  await userCollection.insertOne(user);
}

async function updateUser(user) {
  await userCollection.updateOne({ email: user.email }, { $set: user });
}

async function addLocation(user, location) {
  await userCollection.updateOne({ email: user.email }, { $addToSet: {locations: location} });
}

async function getCards(email) {
  const user1 = await userCollection.findOne({ email: email });
  console.log("user",user1);
  return user1 ? user1.cards : [];
}

async function removeLocation(user, location) {
  await userCollection.updateOne({ email: user.email }, { $pull: { locations: location } } );
}

async function addCard(user, cardId) {
  await userCollection.updateOne({ email: user.email }, { $addToSet: {cards: { cardId, locations: []}} });
}

async function removeCard(user, cardId) {
  await userCollection.updateOne({ email: user.email }, { $pull: { cards: { cardId: cardId } } });
}

async function addLocationToCard(user, cardId, location, cashback) {
  await userCollection.updateOne({ email: user.email, "cards.cardId": cardId }, { $addToSet: {"cards.$.locations": {location, cashback}} });
}

async function removeLocationFromCard(user, cardId, location) {
  await userCollection.updateOne({ email: user.email, "cards.cardId": cardId }, { $pull: {"cards.$.locations": { location: location.location } } } );
}

async function addStore(store) {
  const existingStore = await storeCollection.findOne({ location: store.location});

  if (existingStore) {
    return storeCollection.updateOne(
      { location: store.location },
      { $inc: {counter: 1} }
    );
  } else {
    return storeCollection.insertOne({ location: store.location, counter: 1});
  }
}

async function getMostPopularStore() {
  const query = {}
  const options = {
    sort: { counter: -1 },
    limit: 1,
  };
  const cursor = storeCollection.find(query, options);
  const result = await cursor.toArray();
  return result.length > 0 ? result[0] : null;
}

module.exports = {
  getUser,
  addStore,
  getUserByToken,
  addUser,
  addCard,
  getCards,
  removeCard,
  updateUser,
  getMostPopularStore,
  removeLocation,
  removeLocationFromCard,
  addLocation,
  addLocationToCard
};

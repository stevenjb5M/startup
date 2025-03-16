const { MongoClient } = require('mongodb');
const config = require('./dbConfig.json');

const url = `mongodb+srv://${config.userName}:${config.password}@${config.hostname}`;
const client = new MongoClient(url);
const db = client.db('cardcash');
const userCollection = db.collection('users');
const scoreCollection = db.collection('score');

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

async function removeLocation(user, location) {
  await userCollection.updateOne({ email: user.email }, { $pull: {locations: location} });
}

async function addCard(user, cardId) {
  await userCollection.updateOne({ email: user.email }, { $addToSet: {cards: { cardId, locations: []}} });
}

async function removeCard(user, cardId) {
  await userCollection.updateOne({ email: user.email }, { $pull: {cards: { cardId, locations: []}} });
}

async function addScore(score) {
  return scoreCollection.insertOne(score);
}

function getHighScores() {
  const query = { score: { $gt: 0, $lt: 900 } };
  const options = {
    sort: { score: -1 },
    limit: 10,
  };
  const cursor = scoreCollection.find(query, options);
  return cursor.toArray();
}

module.exports = {
  getUser,
  getUserByToken,
  addUser,
  addCard,
  removeCard,
  updateUser,
  addScore,
  removeLocation,
  addLocation,
  getHighScores,
};

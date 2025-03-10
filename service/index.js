const bcrypt = require('bcryptjs');
const express = require('express');
const cors = require('cors');
const uuid = require('uuid');
const app = express();

// The scores and users are saved in memory and disappear whenever the service is restarted.
let users = [];
let scores = [];

// The service port. In production the front-end code is statically hosted by the service on the same port.
const port = process.argv.length > 2 ? process.argv[2] : 4000;

// Root endpoint for testing
app.get('/', (req, res) => {
  res.send('Server is running');
});

// Use the cors middleware to allow cross-origin requests
app.use(cors({
  origin: 'http://localhost:5173', // Allow requests from this origin
  credentials: true // Allow cookies to be sent with requests
}));

// JSON body parsing using built-in middleware
app.use(express.json());

// Serve up the front-end static content hosting
app.use(express.static('public'));

// Router for service endpoints
var apiRouter = express.Router();
app.use(`/api`, apiRouter);

// CreateAuth a new user
apiRouter.post('/auth/create', async (req, res) => {
  if (await findUser('email', req.body.email)) {
    res.status(409).send({ msg: 'Existing user' });
  } else {
    const user = await createUser(req.body.email, req.body.password);
    res.send({ email: user.email });
  }
});

// Function to create a new user
async function createUser(email, password) {
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = { email, password: hashedPassword, locations: [] };
  users.push(user);
  return user;
}

// GetAuth login an existing user
apiRouter.post('/auth/login', async (req, res) => {
  const user = await findUser('email', req.body.email);
  if (user) {
    if (await bcrypt.compare(req.body.password, user.password)) {
      user.token = uuid.v4();
      res.send({ email: user.email, token: user.token });
      return;
    }
  }
  res.status(401).send({ msg: 'Unauthorized' });
});

// DeleteAuth logout a user
apiRouter.delete('/auth/logout', async (req, res) => {
  const user = await findUser('email', req.body.email);
  if (user) {
    delete user.token;
    res.status(204).end();
  } else {
    res.status(401).send({ msg: 'Unauthorized' });
  }
});

// GetLocations
apiRouter.get('/locations', verifyAuth, (req, res) => {
  const user = req.user;
  res.send(user.locations);
});

// AddLocation
apiRouter.post('/locations', verifyAuth, (req, res) => {
  const user = req.user;
  const location = req.body.location;
  if (!user.locations.includes(location)) {
    user.locations.push(location);
  }
  res.send(user.locations);
});

// RemoveLocation
apiRouter.delete('/locations', verifyAuth, (req, res) => {
  const user = req.user;
  const location = req.body.location;
  user.locations = user.locations.filter(loc => loc !== location);
  res.send(user.locations);
});

// GetScores
apiRouter.get('/scores', verifyAuth, (_req, res) => {
  res.send(scores);
});

// SubmitScore
apiRouter.post('/score', verifyAuth, (req, res) => {
  scores = updateScores(req.body);
  res.send(scores);
});

// Default error handler
app.use(function (err, req, res, next) {
  res.status(500).send({ type: err.name, message: err.message });
});

// Return the application's default page if the path is unknown
app.use((_req, res) => {
  res.sendFile('index.html', { root: 'public' });
});

// updateScores considers a new score for inclusion in the high scores.
function updateScores(newScore) {
  let found = false;
  for (const [i, prevScore] of scores.entries()) {
    if (newScore.score > prevScore.score) {
      scores.splice(i, 0, newScore);
      found = true;
      break;
    }
  }

  if (!found) {
    scores.push(newScore);
  }

  if (scores.length > 10) {
    scores.length = 10;
  }

  return scores;
}

// Function to find a user by a specific field
async function findUser(field, value) {
  return users.find(user => user[field] === value);
}

// Middleware to verify authentication
async function verifyAuth(req, res, next) {
  const token = req.headers['authorization'];
  const user = users.find(user => user.token === token);
  if (user) {
    req.user = user;
    next();
  } else {
    res.status(401).send({ msg: 'Unauthorized' });
  }
}

app.get('*', (_req, res) => {
  res.send({ msg: 'Simon service' });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
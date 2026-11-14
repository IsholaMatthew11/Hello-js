// 1. Bring in our tools
const express = require('express');
const path = require('path');
require('dotenv').config(); // This reads the .env file

const app = express();

// 2. PORT from .env, if no .env, use 3000
const PORT = process.env.PORT || 3000;

// 3. JSON parsing - Without this, req.body will be undefined
// This is like telling Express: "If someone sends JSON, understand it"
app.use(express.json());

// 4. BONUS: Custom middleware to log requests
// This runs for EVERY request, before the routes
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url} - ${new Date()}`);
  next(); // MUST call next(), or request will hang
});

// 5. Serve static HTML page at /
// If someone goes to /, show them public/index.html
app.use(express.static(path.join(__dirname, 'public')));

// 6. GET / -> "My Week 2 API!"
// NOTE: Because of the static file above, this will only run
// if you don't have index.html. Keep it for safety.
app.get('/', (req, res) => {
  res.send('My Week 2 API!');
});

// 7. POST /user -> Accepts {name, email}, responds "Hello, [name]!"
app.post('/user', (req, res) => {
  const { name, email } = req.body;

  // Error handling: 400 for missing data
  // If name OR email is missing, don't continue. Shout error.
  if (!name || !email) {
    return res.status(400).json({ 
      error: 'Name and email are required!' 
    });
  }

  // If we reach here, everything is good
  res.json({ message: `Hello, ${name}!` });
});

// 8. GET /user/:id -> "User [id] profile"
// :id means "whatever they type here, save it as id"
app.get('/user/:id', (req, res) => {
  const userId = req.params.id;
  res.send(`User ${userId} profile`);
});

// 9. 404 handling - If route doesn't exist
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// 10. Start the server
app.listen(PORT, () => {
  console.log(`My Week 2 API running on port ${PORT}`);
});
const express = require('express');
const passport = require('passport');
const GitHubStrategy = require('passport-github').Strategy;
const session = require('express-session');
const dotenv = require('dotenv').config();
const cors = require('cors');

const app = express();

// Configure session middleware
app.use(session({ secret: 'your-secret', resave: false, saveUninitialized: false }));

// Enable CORS
app.use(cors());

// Initialize Passport and restore authentication state, if any, from the session
app.use(passport.initialize());
app.use(passport.session());

// Passport serialization and deserialization
passport.serializeUser((user, cb) => cb(null, user));
passport.deserializeUser((obj, cb) => cb(null, obj));

// GitHub Strategy for Passport
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "http://localhost:3001/auth/github/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    // Here, you might want to check against your database
    // For this example, the user's GitHub profile is returned directly
    return cb(null, profile);
  }
));

app.get('/api/GetLewisTacToeLeaders', (req, res) => {
  // Implement your logic to get the top leaders, e.g., query your database
  const leaders = getTopLeaders(); // Replace with actual function to get leaders
  res.json(leaders);
});


// Define the GitHub authentication routes
app.get('/auth/github', passport.authenticate('github'));
app.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/login' }), (req, res) => {
  // Successful authentication, redirect home
  res.redirect('/');
});

app.post('/api/AddWinOrTie', ensureAuthenticated, (req, res) => {
  // Implement logic to add a win or tie for the authenticated user
  addWinOrTie(req.user, req.body.winOrTie); // Replace with actual function to record win/tie
  res.send({ success: true, message: 'Win or tie added successfully.' });
});

// Middleware to ensure the route is authenticated
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).send({ success: false, message: 'Unauthorized' });
};

// Start the server
const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

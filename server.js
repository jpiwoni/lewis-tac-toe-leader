const express = require('express');
const passport = require('passport');
const GitHubStrategy = require('passport-github').Strategy;
const session = require('express-session');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Log to check if the GitHub Client ID is loaded from environment variables
console.log('GitHub Client ID:', process.env.GITHUB_CLIENT_ID);

let usersData = {}

/*
// Sample Data
const leaderboardData = [
  { UserName: 'FirstPlayer', TotalWinsOrTies: 2 },
  { UserName: 'SecondPlayer', TotalWinsOrTies: 1 },
  { UserName: 'ThirdPlayer', TotalWinsOrTies: 7 }
];
*/

// Session configuration
app.use(session({
  secret: process.env.SECRET_KEY,
  resave: false,
  saveUninitialized: false
}));

// CORS configuration
const corsOptions = {
  origin: 'http://localhost:3000', // Adjust to match the port of your frontend
  credentials: true
};
app.use(cors(corsOptions));

// Body parser middleware to parse JSON and urlencoded bodies
app.use(bodyParser.json());
////app.use(bodyParser.urlencoded({ extended: true }));

// Passport initialization
app.use(passport.initialize());
app.use(passport.session());

// Serialize and deserialize user instances to and from the session.
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  // Implement a lookup logic if needed, otherwise you can just pass the user ID
////  const user = users[id];
////  done(null, id);
  done(null, usersData[id] || null);
});

////let users  = {};

// GitHub strategy for Passport
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.GITHUB_CALLBACK_URL
  },
  function(accessToken, refreshToken, profile, done) {
    // Here you should check if the profile is already in your database and act accordingly
////   const user = {
    const user = usersData[profile.id] || {
      id: profile.id,
      username: profile.username,
      displayName: profile.displayName,
      wins: 0
    };
////    users[profile.id] = user;
    usersData[profile.id] = user;
////    return done(null, profile);
    done(null, user);
    }
));

// Routes
app.get('/auth/github', passport.authenticate('github'));

app.get('/auth/github/callback', 
  passport.authenticate('github', { failureRedirect: '/login' }), 
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('http://localhost:3000');
});


// Middleware to check if the user is authenticated
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).send({ success: false, message: 'Unauthorized' });
}

app.post('/api/AddWinOrTie', ensureAuthenticated, (req, res) => {
  const user = req.user; // Adjust this according to how you're storing the user in the session
  user.wins++;
  res.send({ success: true, totalWins: user.wins });
});

/*
  if (users[user.id]) {
    users[user.id].wins = (users[user.id].wins || 0) + 1;
    res.send({ success: true, message: 'Win or tie added successfully.'});
  } else {
    res.status(404).send({ success: false, message: 'User not found' });
  }

  // do I need this below? 
  
  const existingUserIndex = leaderboardData.findIndex(u => u.UserName === user.UserName);
  if (existingUserIndex !== -1) {
    leaderboardData[existingUserIndex].TotalWinsOrTies++;
  } else {
    leaderboardData.push({ UserName: user.UserName, TotalWinsOrTies: 1 });
  }
  res.send({ success: true, message: 'Win or tie added successfully.' });
});
*/

app.get('/api/GetLewisTacToeLeaders', (req, res) => {
  const leaders = Object.values(usersData)
    .sort((a, b) => b.wins - a.wins)
    .slice(0, 3);
  res.json(leaders);
});

/*
  // Assuming you want to sort and return the top 3 leaders
  const sortedLeaders = leaderboardData.sort((a, b) => b.TotalWinsOrTies - a.TotalWinsOrTies);
  res.json(sortedLeaders.slice(0, 3));
});
*/

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


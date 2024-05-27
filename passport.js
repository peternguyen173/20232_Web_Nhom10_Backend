const GoogleStrategy = require('passport-google-oauth20').Strategy;
const passport = require('passport');
const express = require('express');
const session = require('express-session');
const dotenv = require('dotenv');

dotenv.config(); // Load environment variables from .env file


const app = express();

// Thiết lập session
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true
}));

// Thiết lập Passport.js
app.use(passport.initialize());
app.use(passport.session());

////////////////
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID, // Use environment variables
  clientSecret: process.env.GOOGLE_CLIENT_SECRET, // Use environment variables
    callbackURL: "http://localhost:8000/auth/google/callback",
    scope: ["profile","email"],
  },
  function(accessToken, refreshToken, profile, done) {
    userProfile=profile;
    return done(null, userProfile);
}
));

passport.serializeUser((user, cb) => {
    cb(null, user);
  });
  
passport.deserializeUser((obj, cb) => {
    cb(null, obj);
  });
  
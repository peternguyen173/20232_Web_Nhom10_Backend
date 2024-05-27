const GoogleStrategy = require('passport-google-oauth20').Strategy;
const passport = require('passport');
const express = require('express');
const session = require('express-session');



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
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
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
  
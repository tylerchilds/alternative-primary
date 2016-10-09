var firebase = require('firebase');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
import Voter from './voter'

require('dotenv').config();

firebase.initializeApp({
  apiKey: process.env.FIREBASE_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DB_URL,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_SENDER_ID
});

passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK,
    profileFields: ['id', 'age_range', 'hometown', 'verified']
  },
  function(accessToken, refreshToken, profile, cb) {
    // User.findOrCreate({ facebookId: profile.id }, function (err, user) {
    //   return cb(err, user);
    // });
    var credential = firebase.auth.FacebookAuthProvider.credential(accessToken);
    firebase.auth().signInWithCredential(credential).catch(function(error) {
      console.log('SIGN IN FAILED:', error)
    });

    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        var voter = new Voter(profile, firebase.database());
        voter.on('ready', () => {
          console.log(voter.serialize())
          cb(null, voter.serialize())
        })
      }
    });
  }
));



passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

module.exports = { passport: passport, firebase: firebase };

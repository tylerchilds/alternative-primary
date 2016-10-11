const firebase = require('./firebase')
const passport = require('passport')
const FB = require('passport-facebook')
const Voter = require('../lib/voter')

require('dotenv').config();

passport.use(new FB.Strategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK,
    profileFields: ['id', 'age_range', 'hometown', 'verified', 'tagged_places']
  },
  function(accessToken, refreshToken, profile, cb) {
    var credential = firebase.auth.FacebookAuthProvider.credential(accessToken);
    firebase.auth().signInWithCredential(credential).catch(function(error) {
      console.log('SIGN IN FAILED:', error)
    });

    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        var voter = new Voter(profile, firebase.database());
        voter.on('ready', (result) => {
          console.log(result)
          cb(null, result)
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

module.exports = passport

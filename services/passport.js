const firebase = require('./firebase')
const passport = require('passport')
const FB = require('passport-facebook')

require('dotenv').config();

passport.scopes = ['user_posts',
  'user_tagged_places',
  'user_birthday',
  'user_photos',
  'user_hometown',
  'user_likes',
  'user_location',
  'user_events',
  'user_work_history',
  'user_religion_politics',
  'user_actions.news',
  'user_friends',
  'user_photos'
]

const FIELDS = [
  'id',
  'age_range',
  'hometown',
  'verified',
  'tagged_places',
  'location',
  'events',
  'work',
  'friends',
  'albums'
]

passport.use(new FB.Strategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK,
    profileFields: FIELDS
  },
  function(accessToken, refreshToken, profile, cb) {
    var credential = firebase.auth.FacebookAuthProvider.credential(accessToken);
    firebase.auth().signInWithCredential(credential).catch(function(error) {
      console.log('SIGN IN FAILED:', error)
    });

    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        cb(null, profile)
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

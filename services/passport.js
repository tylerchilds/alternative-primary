import firebase from './firebase'
import passport from 'passport'
import FB from 'passport-facebook'
import Voter from '../lib/voter'

require('dotenv').config();

const db = firebase.database()

const authentication = function(accessToken, refreshToken, profile, cb) {
  var credential = firebase.auth.FacebookAuthProvider.credential(accessToken);
  firebase.auth()
    .signInWithCredential(credential)
    .catch((error) => console.log('SIGN IN FAILED:', error));

  firebase.auth()
    .onAuthStateChanged(function(user) {
      if (user) {
        var voter = new Voter(profile);
        voter.on('ready', () => {
          db.ref('voters/' + voter.id).set(voter.serialize())
          cb(null, voter.serialize())
        })
      }
    });
}

const strategy = new FB.Strategy({
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: process.env.FACEBOOK_CALLBACK,
  profileFields: ['id', 'age_range', 'hometown', 'verified']
}, authentication)

passport.use(strategy);

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

export default passport

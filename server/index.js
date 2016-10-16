import app from '../services/express'
import firebase from '../services/firebase'
import passport from '../services/passport'
import Voter from '../lib/voter'
import Ballot from '../lib/ballot'

// respond with "hello world" when a GET request is made to the homepage
app.get('/', (req, res) => {
  res.render('pages/index');
})

app.get('/auth/facebook', passport.authenticate('facebook', {scope: passport.SCOPES}));

app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/500' }),
  function(req, res) {
    res.render('pages/flow/callback');
  }
)

app.get('/logout', (req, res) => {
  firebase.auth().signOut().then(function() {
    res.redirect('/');
  }, function(error) {
    res.redirect('/500');
  });
})

app.get('/start', (req, res) => {
  res.render('pages/flow/start');
})

app.get('/dump', (req, res) => {
  firebase.database().ref('voters')
    .once('value')
    .then((snapshot) => {
      console.log(snapshot.val())
    }, (errorObject) => {
      console.log("The read failed: " + errorObject.code);
    });

  firebase.database().ref('ballots')
    .once('value')
    .then((snapshot) => {
      console.log(snapshot.val())
    }, (errorObject) => {
      console.log("The read failed: " + errorObject.code);
    });

  firebase.database().ref('ballots').set({})
})

app.get('/score', (req, res) => {
  const profile = req.session.passport.user._json;
  var voter = new Voter(profile)

  voter.on('ready', (result) => {
    req.session.voter = result;
    req.session.passport = null;

    res.redirect('/vote');
  }).on('error', () => {
    res.redirect('/500')
  });

  voter.initialize()
})

app.get('/vote', (req, res) => {
  const ballot = new Ballot(req.session.voter, {})

  ballot.on('ready', () => {
    res.render('pages/flow/vote', ballot.serialize())
  }).on('error', () => {
    res.render('pages/flow/vote', ballot.serialize())
  });

  ballot.initialize()
})

app.post('/vote', (req, res) => {
  const {choices,abstained} = req.body;
  const ballot = new Ballot(req.session.voter, {choices, abstained})

  ballot.on('ready', (result) => {
    ballot.save(() => res.render('pages/flow/complete'))
  }).on('error', () => {
    res.render('pages/flow/vote', ballot.serialize())
  });

  ballot.initialize()
})

app.get('/complete', (req, res) => {
  res.render('pages/flow/complete');
})

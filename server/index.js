import app from '../services/express'
import firebase from '../services/firebase'
import passport from '../services/passport'
import Voter from '../lib/voter'
import Ballot from '../lib/ballot'
import Bouncer from '../lib/bouncer'

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

  // firebase.database().ref('ballots').set(null)
  // firebase.database().ref('voters').set(null)
})

// respond with "hello world" when a GET request is made to the homepage
app.get('/', (req, res) => {
  const user = new Bouncer(req, res).serialize()
  console.log(user)
  res.render('pages/index', user);
})

/* Facebook connection relevant pages */

app.get('/auth/facebook', passport.authenticate('facebook', {scope: passport.SCOPES}));

app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/500' }),
  function(req, res) {
    const user = new Bouncer(req, res, {kickVoters: true}).serialize()
    res.render('pages/flow/callback', user);
  }
)

app.get('/logout', (req, res) => {
  firebase.auth().signOut().then(function() {
    req.session.voter = null;
    res.redirect('/');
  }, function(error) {
    res.redirect('/500');
  });
})

/* Flow pages! */

app.get('/start', (req, res) => {
  const user = new Bouncer(req, res, {kickVoters: true}).serialize()
  res.render('pages/flow/start', user);
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
  const user = new Bouncer(req, res, {kickVoters: true, signedIn: true}).serialize()
  const ballot = new Ballot(req.session.voter, {confirmation: true})

  ballot.on('ready', () => {
    res.render('pages/flow/vote', {...ballot.serialize(), ...user})
  }).on('error', () => {
    res.render('pages/flow/vote', {...ballot.serialize(), ...user})
  });

  ballot.initialize()
})

app.post('/vote', (req, res) => {
  const user = new Bouncer(req, res, {kickVoters: true, signedIn: true}).serialize()
  const {choices,confirmation} = req.body;
  const ballot = new Ballot(req.session.voter, {choices, confirmation})

  ballot.on('ready', (result) => {
    ballot.save(() => res.redirect('/complete'))
  }).on('error', () => {
    res.render('pages/flow/vote', {...ballot.serialize(), ...user})
  });

  ballot.initialize()
})

app.get('/complete', (req, res) => {
  const user = new Bouncer(req, res, {signedIn: true}).serialize()
  res.render('pages/flow/complete', user);
})

app.get('/scores', (req, res) => {
  const user = new Bouncer(req, res).serialize()
  res.render('pages/scores', user);
})

app.get('/:page?', function(req, res) {
  const user = new Bouncer(req, res).serialize()
  try{
    const { page } = req.params;
    res.render(`pages/${page}`, user);
  } catch(e){
    console.log(e)
    res.render(`pages/404`, user);
  }
});

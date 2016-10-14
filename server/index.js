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
    res.render('pages/callback');
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
  res.render('pages/start');
})

app.get('/dump', (req, res) => {
  firebase.database().ref('voters')
    .once('value')
    .then((snapshot) => {
      console.log(snapshot.val())
    }, (errorObject) => {
      console.log("The read failed: " + errorObject.code);
    });
})

app.get('/score', (req, res) => {
  var voter = new Voter(req.session.passport.user._json, firebase.database());

  voter.on('ready', result => {
    req.session.user = result;
    req.session.passport = null;
console.log(result)

    res.redirect('/vote');
  })

  voter.on('error', (msg) => {
    res.redirect('/500')
  })
})

app.get('/vote', (req, res) => {
  const ballot = new Ballot()

  res.render('pages/vote', ballot.serialize())
})

app.post('/vote', (req, res) => {
  const {choices,abstained} = req.body;
  const ballot = new Ballot(choices,abstained)
console.log(req.body)
  if(ballot.hasError()){
    res.render('pages/vote', ballot.serialize())
  } else {
    res.render('pages/complete')
  }
})

app.get('/complete', (req, res) => {
  res.render('pages/start');
})

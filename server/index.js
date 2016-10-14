import app from '../services/express'
import firebase from '../services/firebase'
import passport from '../services/passport'
import Voter from '../lib/voter'
import Ballot from '../lib/ballot'

const SCOPES = ['user_posts',
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

// respond with "hello world" when a GET request is made to the homepage
app.get('/', (req, res) => {
  res.render('pages/index');
})

app.get('/auth/facebook', passport.authenticate('facebook', {scope: SCOPES}));

app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/500' }),
  function(req, res) {
    // callback will redirect to:
    //  js: /process (to call score via AJAX)
    //  no-js: /score
    res.render('pages/callback');
  }
)

app.get('/start', (req, res) => {
  res.render('pages/start');
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
    if (req.params.format) {
      res.sendStatus(500);
    } else {
      res.redirect('/500');
    }
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

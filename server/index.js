import app from '../services/express'
import firebase from '../services/firebase'
import passport from '../services/passport'
import Voter from '../lib/voter'

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
  'user_actions.news'
]

// respond with "hello world" when a GET request is made to the homepage
app.get('/', (req, res) => {
  res.render('index', { title: 'Boom, baby!'});
});

app.get('/auth/facebook', passport.authenticate('facebook', {scope: SCOPES}));

app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/500' }),
  function(req, res) {
    res.render('callback', { title: 'Boom, baby!'});
  }
);

app.get('/process', function(req, res) {
  res.render('process', { title: 'Boom, baby!'});
});

app.get('/score', (req, res) => {
  var voter = new Voter(req.session.passport.user._json, firebase.database());
  voter.on('ready', (result) => {
    console.log('oooops', result)
  })
})

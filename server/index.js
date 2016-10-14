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
  'user_actions.news',
  'user_friends',
  'user_photos'
]

// respond with "hello world" when a GET request is made to the homepage
app.get('/', (req, res) => {
  res.render('pages/index');
});

app.get('/auth/facebook', passport.authenticate('facebook', {scope: SCOPES}));

app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/500' }),
  function(req, res) {
    // callback will redirect to:
    //  js: /process (to call score via AJAX)
    //  no-js: /score
    res.render('pages/callback');
  }
);

app.get('/score/:format?', (req, res) => {
  var voter = new Voter(req.session.passport.user._json, firebase.database());

  voter.on('ready', result => {
    req.session.user = result;
    req.session.passport = null;
console.log(result)
    if (req.params.format) {
      res.sendStatus(204);
    }
    else {
      res.redirect('/ready');
    }
  })

  voter.on('error', (msg) => {
    if (req.params.format) {
      res.sendStatus(500);
    }
    else {
      res.redirect('/500');
    }
  })
})

app.get('/:page?', function(req, res) {
  const { page } = req.params;
  res.render(`pages/${page}`);
});

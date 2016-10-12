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
  res.render('index');
});

app.get('/auth/facebook', passport.authenticate('facebook', {scope: SCOPES}));

app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/500' }),
  function(req, res) {
    res.render('callback');
  }
);

app.get('/process', function(req, res) {
  res.render('process');
});

app.get('/score/:format', (req, res) => {
  var voter = new Voter(req.session.passport.user._json, firebase.database());

  voter.on('ready', result => {
    if (req.params.format) {
      res.sendStatus(204);
    }
    else {
      res.redirect('/ready');
    }
  })

  voter.on('error', result => {
    if (req.params.format) {
      res.sendStatus(500);
    }
    else {
      res.redirect('/500');
    }
  })
})

app.get('/vote', function(req, res) {
  res.render('vote');
});

app.get('/complete', function(req, res) {
  res.render('complete');
});

import app from '../services/express'
import firebase from '../services/firebase'
import passport from '../services/passport'

const SCOPES = ['user_posts',
  'user_tagged_places',
  'user_birthday',
  'user_photos',
  'user_hometown',
  'user_likes',
  'user_location',
  'user_friends',
  'user_events',
  'user_education_history',
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
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    //res.redirect('/');
    res.render('callback', { title: 'Boom, baby!'});
  }
);

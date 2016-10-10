import app from '../services/express'
import firebase from '../services/firebase'
import passport from '../services/passport'

// respond with "hello world" when a GET request is made to the homepage
app.get('/', (req, res) => {
  res.render('index', { title: 'Boom, baby!'});
});

app.get('/auth/facebook', passport.authenticate('facebook'));

app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    //res.redirect('/');
    res.render('callback', { title: 'Boom, baby!'});
  }
);

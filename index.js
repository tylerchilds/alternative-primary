import express from 'express'
import session from 'express-session'
import services from './lib/services'

require('dotenv').config();

var app = express();

app.use(express.static('public'));
app.use(session({secret: process.env.SESSION_SECRET}));
app.use(services.passport.initialize());
app.use(services.passport.session());

// respond with "hello world" when a GET request is made to the homepage
app.get('/', (req, res) => {
  res.send('<a href="/auth/facebook">Connect</a>');
});

app.get('/auth/facebook', services.passport.authenticate('facebook'));

app.get('/auth/facebook/callback',
  services.passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    //res.redirect('/');
    res.send('hello facebook');
  }
);

app.listen(5000, () => console.log('http://localhost:5000/'));

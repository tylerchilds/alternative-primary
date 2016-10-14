const express = require('express')
const session = require('express-session')
const bodyParser = require('body-parser')
const passport = require('./passport')

require('dotenv').config();

let app = express();

app.set('view engine', 'pug');
app.set('port', (process.env.PORT || 5000));

app.use(express.static('dist'));
app.use(session({secret: process.env.SESSION_SECRET}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());

app.listen(app.get('port'), () => console.log(`App running on port: ${app.get('port')}`));

module.exports = app

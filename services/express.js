import express from 'express'
import session from 'express-session'
import passport from './passport'
require('dotenv').config();

let app = express();

app.set('view engine', 'pug');

app.use(express.static('public'));
app.use(session({secret: process.env.SESSION_SECRET}));
app.use(passport.initialize());
app.use(passport.session());

app.listen(5000, () => console.log('http://localhost:5000/'));


export default app

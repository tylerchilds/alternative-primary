import express from 'express'
import session from 'express-session'
import passport from './passport'
require('dotenv').config();

let app = express();

app.use(express.static('public'));
app.use(session({secret: process.env.SESSION_SECRET}));
app.use(passport.initialize());
app.use(passport.session());

export default app

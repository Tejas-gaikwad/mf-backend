
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRoutes = require('./routes/authroutes');
const profileRoutes = require('./routes/profile_routes');
const clientRoutes = require('./routes/client_routes');
const researchRoutes = require('./routes/research_routes');
const session = require('express-session');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Session middleware
app.use(session({
    secret: 'mutual_fund_jwt_secret_key', // Replace with a strong secret key
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true in production if using HTTPS
  }));

app.use('/api', authRoutes);
app.use('/api', profileRoutes);
app.use('/api', clientRoutes);
app.use('/api', researchRoutes);


module.exports = app;

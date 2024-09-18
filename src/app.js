
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRoutes = require('./routes/authroutes');
const profileRoutes = require('./routes/profile_routes');
const clientRoutes = require('./routes/client_routes');
const researchRoutes = require('./routes/research_routes');
const transactionRoutes = require('./routes/transaction_routes');
const crmRoutes = require('./routes/crm_routes');
const utilitiesRoutes = require('./routes/utilities_routes');
const employeeRoutes = require('./routes/employee_routes');
const mutualRoutes =  require('./routes/mutual_routes');
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
app.use('/api', transactionRoutes);
app.use('/api', crmRoutes);
app.use('/api', utilitiesRoutes);
app.use('/api', employeeRoutes);
app.use('/api', mutualRoutes);







module.exports = app;

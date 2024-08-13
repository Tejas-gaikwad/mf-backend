const{ SIPCalculator,  } = require('../controllers/authcontroller');
const express = require('express');
const router = express.Router();

router.post('/sip_calculator', SIPCalculator);



module.exports = router;
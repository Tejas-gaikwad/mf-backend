


const{ SIPCalculator, delaySIP, } = require('../controllers/research_controller');
const{ authenticateToken,  } = require('../middlewares/auth_middleware');
const express = require('express');
const router = express.Router();

router.post('/calculate_sip', SIPCalculator);
router.post('/delay_sip', delaySIP);


module.exports = router;
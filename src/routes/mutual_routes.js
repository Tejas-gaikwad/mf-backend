const express = require('express');
const router = express.Router();
const{ authenticateToken  } = require('../middlewares/auth_middleware');
const { AddMFDetails, GetMFDetailsOfClient, GetFundsListOfClientOfInvestments } = require('../controllers/mutual_controller')


router.post('/add_mutual_fund_details', authenticateToken, AddMFDetails);
router.post('/get_mutual_fund_details/:clientId', authenticateToken, GetMFDetailsOfClient);
router.get('/get_client_investment_fund_list/:clientId', authenticateToken, GetFundsListOfClientOfInvestments);




module.exports = router;

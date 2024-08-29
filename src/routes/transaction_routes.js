const express = require('express');
const router = express.Router();
const{ authenticateToken,  } = require('../middlewares/auth_middleware');
const { GetCurrentTransactionLog, GetFutureTransactionLog, UpdateTransactionExecutionDate, InvestInTopSchemes, InvestInExistingSchemes, AllSchemeList, BuyNFO, RedemptionAnsSWP, SwitchAndStpAMC } = require('../controllers/transact_controller')

router.post('/:clientId/get_current_transaction_log', authenticateToken, GetCurrentTransactionLog);
router.post('/:clientId/get_future_transaction_log', authenticateToken, GetFutureTransactionLog);
router.patch('/update_execution_date_future_transaction', authenticateToken, UpdateTransactionExecutionDate);
router.get('/schemes_list', authenticateToken, InvestInTopSchemes);
router.get('/existing_scheme', authenticateToken, InvestInExistingSchemes);
router.get('/all_scheme_list', authenticateToken, AllSchemeList);

router.get('/nfo_list', authenticateToken, BuyNFO);
router.get('/redemption_and_SWP', authenticateToken, RedemptionAnsSWP);
router.get('/switch_and_STP_AMC', authenticateToken, SwitchAndStpAMC);




module.exports = router;
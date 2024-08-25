
const express = require('express');
const router = express.Router();
const{ authenticateToken,  } = require('../middlewares/auth_middleware');
const { GetCurrentTransactionLog, GetFutureTransactionLog } = require('../controllers/transact_controller')



router.post('/:clientId/get_current_transaction_log', authenticateToken, GetCurrentTransactionLog);
router.post('/:clientId/get_future_transaction_log', authenticateToken, GetFutureTransactionLog);


module.exports = router;
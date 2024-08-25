const{ GetTransactionLog } = require('../controllers/transact_controller');
const express = require('express');
const router = express.Router();
const{ authenticateToken,  } = require('../middlewares/auth_middleware');


router.post('/get_transaction_log', authenticateToken, GetTransactionLog);



module.exports = router;
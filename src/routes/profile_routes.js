const{ GetInvestorProfile, GetNotifications, SendNotification, WhatsNew } = require('../controllers/profile_controller');
const{ authenticateToken,  } = require('../middlewares/auth_middleware');
const express = require('express');
const router = express.Router();
const { GetStockPrices } = require('../controllers/stock_controller');

router.get('/get_profile/', authenticateToken, GetInvestorProfile);
router.get('/get_notifications/', authenticateToken, GetNotifications);
router.post('/send_notification/', authenticateToken, SendNotification);
router.get('/whats_new/', authenticateToken, WhatsNew);
router.get('/get_stock_prices/', authenticateToken, GetStockPrices);





module.exports = router;
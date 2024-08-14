const{ GetInvestorProfile, GetNotifications, SendNotification } = require('../controllers/profile_controller');
const{ authenticateToken,  } = require('../middlewares/auth_middleware');
const express = require('express');
const router = express.Router();

router.get('/get_profile/', authenticateToken, GetInvestorProfile);
router.get('/get_notifications/', authenticateToken, GetNotifications);
router.post('/send_notification/', authenticateToken, SendNotification);


module.exports = router;
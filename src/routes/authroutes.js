const{ Login, BecomeMember, SendVerificationCode, VerifyCode, ChangePassword } = require('../controllers/authcontroller');
const express = require('express');
const router = express.Router();
const{ authenticateToken } = require('../middlewares/auth_middleware');

router.post('/login', Login);
router.post('/become_member', BecomeMember);
router.post('/send_verification_code', SendVerificationCode);
router.post('/verify_code', VerifyCode);
router.patch('/change_password', authenticateToken, ChangePassword);

module.exports = router;
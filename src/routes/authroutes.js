const{ Login, BecomeMember, SendVerificationCode, VerifyCode } = require('../controllers/authcontroller');
const express = require('express');
const router = express.Router();

router.post('/login', Login);
router.post('/become_member', BecomeMember);
router.post('/send_verification_code', SendVerificationCode);
router.post('/verify_code', VerifyCode);


module.exports = router;
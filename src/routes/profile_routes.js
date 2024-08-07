const{ GetUserProfile,  } = require('../controllers/profile_controller');
const{ authenticateToken,  } = require('../middlewares/auth_middleware');
const express = require('express');
const router = express.Router();

router.get('/get_profile/', authenticateToken, GetUserProfile);


module.exports = router;

const express = require('express');
const {MergeClients, GetMergedClients } = require("../controllers/utilities_controller");
const router = express.Router();
const{ authenticateToken,  } = require('../middlewares/auth_middleware');



router.post('/merge_client', authenticateToken, MergeClients);
router.get('/:mergedClientId/get_merge_client', authenticateToken, GetMergedClients);


module.exports = router;

const express = require('express');
const {MergeClients, GetMergedClients, DifferClient, GetAllMergeClients } = require("../controllers/utilities_controller");
const router = express.Router();
const{ authenticateToken,  } = require('../middlewares/auth_middleware');

router.post('/merge_client', authenticateToken, MergeClients);
router.get('/:mergedClientId/get_merge_client', authenticateToken, GetMergedClients);
router.post('/differ_client', authenticateToken, DifferClient);
router.get('/get_all_merge_client', authenticateToken, GetAllMergeClients);



module.exports = router;

const express = require('express');
const {MergeClients, GetMergedClients, DifferClient, GetAllMergeClients, CreateFamily, GetAllFamilies, GetFamilyMembersByClient, DeleteFamily } = require("../controllers/utilities_controller");
const router = express.Router();
const{ authenticateToken,  } = require('../middlewares/auth_middleware');

router.post('/merge_client', authenticateToken, MergeClients);
router.get('/:mergedClientId/get_merge_client', authenticateToken, GetMergedClients);
router.post('/differ_client', authenticateToken, DifferClient);
router.get('/get_all_merge_client', authenticateToken, GetAllMergeClients);

router.post('/create_family', authenticateToken, CreateFamily);
router.get('/get_all_families', authenticateToken, GetAllFamilies);
router.get('/get_family_members_by_client/:clientId', authenticateToken, GetFamilyMembersByClient);
router.delete('/delete_family/:clientId', authenticateToken, DeleteFamily);







module.exports = router;
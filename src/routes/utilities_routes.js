
const express = require('express');
const {MergeClients, GetMergedClients, DifferClient, DeleteFamilyMember, GetAllMergeClients, CreateFamily, GetAllFamilies, GetFamilyMembersByClient, DeleteFamily, SearchClientByType, UpdateFamily } = require("../controllers/utilities_controller");
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
router.delete('/delete_family_member', authenticateToken, DeleteFamilyMember);
router.post('/update_family', authenticateToken, UpdateFamily);



router.post('/search_client_by_type', authenticateToken, SearchClientByType);












module.exports = router;
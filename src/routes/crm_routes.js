const{ SetCRMRuleSetting, GetCRMRuleSetting, ShowClientForBulkAnalysis, SearchClient, RemoveCRMRule, UpdateRuleSetting, ClientAnalysisReport, AddVendor, GetAllVendors, UpdateVendor, DeleteVendor } = require('../controllers/crm_controller'); 
const{ authenticateToken,  } = require('../middlewares/auth_middleware');
const express = require('express');
const router = express.Router();


router.post('/set_crm_setting', authenticateToken, SetCRMRuleSetting);
router.get('/get_crm_setting', authenticateToken, GetCRMRuleSetting);

router.get('/get_client_list_bulk_analysis', authenticateToken, ShowClientForBulkAnalysis);
router.get('/search_client', authenticateToken, SearchClient);
router.delete('/delete_rule', authenticateToken, RemoveCRMRule);
router.put('/update_rule', authenticateToken, UpdateRuleSetting);
router.get('/get_client_analysis_report', authenticateToken, ClientAnalysisReport);

router.post('/add_vendor', authenticateToken, AddVendor);
router.get('/get_all_vendors', authenticateToken, GetAllVendors);
router.put('/update_vendor/:vendorId', authenticateToken, UpdateVendor);
router.delete('/delete_vendor/:vendorId', authenticateToken, DeleteVendor);


module.exports = router;
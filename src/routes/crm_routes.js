const{ SetCRMRuleSetting, GetCRMRuleSetting, ShowClientForBulkAnalysis, SearchClient, RemoveCRMRule, UpdateRuleSetting, ClientAnalysisReport, AddVendor, GetAllVendors, UpdateVendor, DeleteVendor, AddItemToVendor, EditItemVendor, GetAllItemsVendor, DeleteItemVendor, AboutUs, TermsAndConditions , GetTermsAndConditions, GetAboutUs} = require('../controllers/crm_controller'); 
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


// VENDOR API
router.post('/add_vendor', authenticateToken, AddVendor);
router.get('/get_all_vendors', authenticateToken, GetAllVendors);
router.put('/update_vendor/:vendorId', authenticateToken, UpdateVendor);
router.delete('/delete_vendor/:vendorId', authenticateToken, DeleteVendor);


// VENDOR's ITEM API
router.post('/add_item_to_vendor', authenticateToken, AddItemToVendor);
router.get('/:vendorId/get_all_items', authenticateToken, GetAllItemsVendor);
router.put('/update_item/:itemId', authenticateToken, EditItemVendor);
router.delete('/delete_item/:itemId', authenticateToken, DeleteItemVendor);

router.post('/about_us', authenticateToken, AboutUs);
router.post('/terms_and_conditions', authenticateToken, TermsAndConditions);
router.get('/get_terms_and_conditions', authenticateToken, GetTermsAndConditions);
router.get('/get_about_us', authenticateToken, GetAboutUs);
















module.exports = router;
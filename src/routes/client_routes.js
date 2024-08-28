const{ AddClient, ListOfAllClients, GetClientMFReport, GoalTracking, GetClientWealthReport, GetClientInformation, AddClientMutualFundReport,  updateClientData, GetOpportunities, ShareClientLoginCredentials, ClientTracker } = require('../controllers/client_controller'); //  FatcaDetails, AddUserDetails, AddBankDetails, ClientDeskSettings,
const{ authenticateToken,  } = require('../middlewares/auth_middleware');
const { updateClientVideoKycData } = require('../controllers/video_kyc_controller');
const express = require('express');
const router = express.Router();


router.post('/add_client', authenticateToken, AddClient);
router.put('/updateClientDetails/', authenticateToken, );
router.get('/getClientDetails/', authenticateToken, );
router.get('/getAllClients/', authenticateToken, ListOfAllClients);;
router.post('/:clientId/sendClientLoginCredentials', authenticateToken,);
router.get('/:clientId/getClientData', authenticateToken, GetClientInformation,);
router.post('/getClientMFReport', authenticateToken, GetClientMFReport);
router.get('/:clientId/get_wealth_report', authenticateToken, GetClientWealthReport);
router.post('/:clientId/addClientMutualFundReport', authenticateToken, AddClientMutualFundReport);
router.patch('/:clientId/updateClientData', authenticateToken, updateClientData);
router.get('/:clientId/track_goal', authenticateToken, GoalTracking);
router.get('/get_all_opportunities', authenticateToken, GetOpportunities);
router.post('/update_client_video_kyc', authenticateToken, updateClientVideoKycData);
router.post('/share_client_login_creds', authenticateToken, ShareClientLoginCredentials);
router.get('/track_clients', authenticateToken, ClientTracker);


module.exports = router;
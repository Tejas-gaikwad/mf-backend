const{ AddClient, ListOfAllClients, GetClientMFReport, GetClientWealthReport, GetClientInformation, AddClientMutualFundReport, GetClientMutualFundReport, updateClientData } = require('../controllers/client_controller'); //  FatcaDetails, AddUserDetails, AddBankDetails, ClientDeskSettings,
const{ authenticateToken,  } = require('../middlewares/auth_middleware');
const express = require('express');
const router = express.Router();


router.post('/add_client', authenticateToken, AddClient);
router.put('/updateClientDetails/', authenticateToken, );
router.get('/getClientDetails/', authenticateToken, );
router.get('/getAllClients/', authenticateToken, ListOfAllClients);
// router.put('/:clientId/addfatcadetails', authenticateToken, FatcaDetails);
// router.put('/:clientId/addUserDetails', authenticateToken, AddUserDetails);
// router.put('/:clientId/addBankDetails', authenticateToken, AddBankDetails);
// router.get('/:clientId/fatcadetails', authenticateToken, FatcaDetails);
// router.get('/:clientId/addClientDeskSettings', authenticateToken, ClientDeskSettings);
router.post('/:clientId/sendClientLoginCredentials', authenticateToken,);
router.get('/:clientId/getClientData', authenticateToken, GetClientInformation,);
router.post('/getClientMFReport', authenticateToken, GetClientMFReport);
router.post('/getClientWealthReport', authenticateToken, GetClientWealthReport);
router.post('/:clientId/addClientMutualFundReport', authenticateToken, AddClientMutualFundReport);
router.patch('/:clientId/updateClientData', authenticateToken, updateClientData);

// router.get('/:clientId/getClientMutualFundReport', authenticateToken, GetClientMutualFundReport);






module.exports = router;
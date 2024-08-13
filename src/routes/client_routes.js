const{ AddClient, ListOfAllClients, FatcaDetails, AddUserDetails, AddBankDetails, ClientDeskSettings, GetClientMFReport, GetClientWealthReport  } = require('../controllers/client_controller');
const{ authenticateToken,  } = require('../middlewares/auth_middleware');
const express = require('express');
const router = express.Router();


router.post('/add_client', authenticateToken, AddClient);
router.get('/getAllClients/', authenticateToken, ListOfAllClients);
router.put('/:clientId/addfatcadetails', authenticateToken, FatcaDetails);
router.put('/:clientId/addUserDetails', authenticateToken, AddUserDetails);
router.put('/:clientId/addBankDetails', authenticateToken, AddBankDetails);
router.get('/:clientId/fatcadetails', authenticateToken, FatcaDetails);
router.get('/:clientId/addClientDeskSettings', authenticateToken, ClientDeskSettings);
router.post('/:clientId/sendClientLoginCredentials', authenticateToken,);
router.post('/getClientMFReport', authenticateToken, GetClientMFReport);
router.post('/getClientWealthReport', authenticateToken, GetClientWealthReport);




module.exports = router;
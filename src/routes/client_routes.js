const{ AddClient, ListOfAllClients } = require('../controllers/client_controller');
const{ authenticateToken,  } = require('../middlewares/auth_middleware');
const express = require('express');
const router = express.Router();


router.post('/add_client', authenticateToken, AddClient);
router.get('/getAllClients', authenticateToken, ListOfAllClients);

module.exports = router;
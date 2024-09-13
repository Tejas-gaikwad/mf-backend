const express = require('express');
const router = express.Router();
const{ authenticateToken  } = require('../middlewares/auth_middleware');
const { AddEmployee, GetAllEmployees, UpdateEmployeeData, DeleteEmployee } = require('../controllers/employee_controller')


router.post('/add_new_employee', authenticateToken, AddEmployee)
router.get('/get_all_employees', authenticateToken, GetAllEmployees)
router.put('/:employeeId/update_employee', authenticateToken, UpdateEmployeeData)
router.delete('/:employeeId/delete_employee', authenticateToken, DeleteEmployee)



module.exports = router;

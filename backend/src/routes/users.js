const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticate, authorize } = require('../middleware/auth');
const { userCreateValidation } = require('../middleware/validators');

router.get('/dashboard/stats', authenticate, authorize('admin'), userController.getDashboardStats);
router.get('/', authenticate, authorize('admin'), userController.getAllUsers);
router.get('/:id', authenticate, authorize('admin'), userController.getUserById);
router.post('/', authenticate, authorize('admin'), userCreateValidation, userController.createUser);

module.exports = router;

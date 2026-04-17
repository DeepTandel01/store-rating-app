const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');
const { authenticate, authorize } = require('../middleware/auth');
const { storeValidation } = require('../middleware/validators');

router.get('/my-dashboard', authenticate, authorize('store_owner'), storeController.getStoreOwnerDashboard);
router.get('/', authenticate, storeController.getAllStores);
router.post('/', authenticate, authorize('admin'), storeValidation, storeController.createStore);

module.exports = router;

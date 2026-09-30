const express = require('express');
const router = express.Router();

const { protect } = require('../Middleware/auth');

const kycController = require('../Controllers/kycController');
const { authorize } = require('../Middleware/role');

router.post('/onboardbvn', protect, authorize("accountant"), kycController.onboardBvn);

router.post('/onboardnin', protect, authorize("accountant"), kycController.onboardNin);


module.exports = router;
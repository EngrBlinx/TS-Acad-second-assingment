const express = require('express');
const router = express.Router();

const staffController = require('../Controllers/staff');

router.post('/onboard', staffController.createStaff);
router.post('/login', staffController.staffLogin);

module.exports = router;
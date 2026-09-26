const express = require('express');
const router = express.Router();

const staffController = require('../Controllers/staff');

router.post('/onboardstaff', staffController.createStaff);

module.exports = router;
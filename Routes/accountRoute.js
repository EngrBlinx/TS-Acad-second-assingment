const express = require('express');
const router = express.Router();

//import the token decoder middleware
const {protect} = require('../Middleware/auth');
//import the authorization middleware
const {authorize} = require('../Middleware/role');

//import the the controller source files
const accountController = require('../Controllers/account');

//define the routes
router.post('/createaccont', protect, accountController.createAccount);

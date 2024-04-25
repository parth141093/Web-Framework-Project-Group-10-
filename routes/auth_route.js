const express = require('express');
const router = express.Router();
const auth_controller = require('../controllers/auth_controller');

//Signup
router.get('/signup', auth_controller.signUp);
router.post('/signup', auth_controller.signUp);

//Login
router.post('/login', auth_controller.login);
router.get('/login', auth_controller.login);


//Logout
router.get('/logout', auth_controller.logout);

module.exports = router;

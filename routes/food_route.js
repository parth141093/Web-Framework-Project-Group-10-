const express = require('express');
const Food = require('../models/food_model');
const router = express.Router();

router.get('/', food_controller.getHome );

module.exports = router;
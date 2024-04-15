const express = require('express');
const food_controller = require('../controllers/food_controller');
const router = express.Router();

router.get('/', food_controller.getHome );

router.get('/foods/:id', food_controller.getFoodDetails);

module.exports = router;
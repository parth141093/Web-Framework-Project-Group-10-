const express = require('express');
const food_controller = require('../controllers/food_controller');
const router = express.Router();

router.get('/', food_controller.getHome);

router.get('/get-all', food_controller.getAllFood);

router.put('/update/:id', food_controller.updateFood);

module.exports = router;
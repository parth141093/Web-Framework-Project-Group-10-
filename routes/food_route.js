const express = require('express');
const food_controller = require('../controllers/food_controller');
const router = express.Router();

router.get('/', food_controller.getHome);

router.get('/get-all', food_controller.getAllFood);

router.put('/update/:id', food_controller.updateFood);

router.get('/add-food-page', food_controller.getAddFoodPage);

router.post('/foods', food_controller.postFood);

module.exports = router;
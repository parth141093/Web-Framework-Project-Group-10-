const express = require('express');
const food_controller = require('../controllers/food_controller');
const router = express.Router();

router.get('/', food_controller.getHome);

router.get('/get-all', food_controller.getAllFood);

router.get('/updateFood', food_controller.getUpdateFoodPage);

router.patch('/updateFood/name', food_controller.updateFood);

router.get('/add-food-page', food_controller.getAddFoodPage);

router.post('/foods', food_controller.postFood);

router.get('/remove-food', food_controller.getDelFoodPage)

router.post('/delete', food_controller.deleteFood);

module.exports = router;
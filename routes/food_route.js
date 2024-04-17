const express = require('express');
const food_controller = require('../controllers/food_controller');
const router = express.Router();

router.get('/', food_controller.getHome);

router.get('/food', food_controller.getAllFood);

router.get('/food/type/:type_of_food', food_controller.getAllFoodByType);

router.get('/food/:id', food_controller.getFoodById);

// router.get('/food/update', food_controller.getUpdateFoodPage);

// router.post('/update', food_controller.updateFood);

router.get('/food/update/:id', food_controller.getUpdateFoodPage);

router.get('/food/add', food_controller.getAddFoodPage);

router.post('/foods', food_controller.postFood);

// router.get('/food/remove', food_controller.getDelFoodPage)

// router.post('/delete', food_controller.deleteFood);

router.post('/food/delete/:id', food_controller.deleteFood);

router.get('/foods/search', food_controller.searchFood);

module.exports = router;
const express = require('express');
const food_controller = require('../controllers/food_controller');
const router = express.Router();

router.get('/', food_controller.getHome);

router.get('/food/search', food_controller.searchFood);

router.get('/food/add', food_controller.getAddFoodPage);

router.post('/food', food_controller.postFood);

router.get('/food', food_controller.getAllFood);

router.get('/food/type/:type_of_food', food_controller.getAllFoodByType);

router.get('/food/:id', food_controller.getFoodById);

// Edit
router.get('/food/edit/:id', food_controller.getEditFoodPage);
router.post('/edit', food_controller.editFood);



router.post('/food/delete/:id', food_controller.deleteFood);



module.exports = router;
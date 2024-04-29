const express = require('express');
const food_controller = require('../controllers/food_controller');
const router = express.Router();

router.get('/', food_controller.getHome);

//Comment
router.post('/food/comment/add', food_controller.addCommentValidationRules, food_controller.addComment);

// Search
router.get('/food/search', food_controller.searchFood);

// Add
router.get('/food/add', food_controller.getAddFoodPage);
router.post('/food', food_controller.postFoodValidationRules, food_controller.postFood);

// List
router.get('/food', food_controller.getAllFood);
router.get('/food/type/:type_of_food', food_controller.getAllFoodByType);
router.get('/food/:id', food_controller.getFoodById);
router.get('/food/meal-type/:mealType', food_controller.getAllFoodByMealType);

// Rate
router.post('/food/:id/rate', food_controller.rate);

// Edit
router.get('/food/edit/:id', food_controller.getEditFoodPage);
router.post('/edit/:id', food_controller.editFood);

// Delete
router.post('/food/delete/:id', food_controller.deleteFood);

module.exports = router;
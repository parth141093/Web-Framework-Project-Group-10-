const express = require('express');
const mongoose = require('mongoose');
const { emailTypeEnum, sendEmail } = require('./send_email');
require('dotenv').config();
const { body, validationResult } = require('express-validator');
const multer = require('multer');
const path = require('path');

const app = express();

mongoose.connect(`mongodb+srv://${process.env.DBUSERNAME}:${process.env.DBPASSWORD}@${process.env.CLUSTER}.mongodb.net/${process.env.DB}?retryWrites=true&w=majority`)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));
const food_model = require('../models/food_model');
const Comment = require('../models/comment_model');

//list all food 
const getAllFood = async (req, res) => {
    try{
        const foods = await food_model.find();
        res.render('pages/allFood', {
            title: "Eat what today?",
            foods: foods.map(doc => {
                const food = doc.toJSON();
                food.imageUrl = `/assets/images/${food.picture}`;
                return food;
            })
        });
    } catch (error) {
        console.log(error);
        res.status(500).send("Something went wrong! Please try again!");
    }
};

//list all food by type
const getAllFoodByType = async (req, res) => {
    try {
        const type_of_food = req.params.type_of_food;
        const foods = await food_model.find({ type_of_food: type_of_food });
        res.render('pages/allFoodByType', {
            title: `Here are our great ${type_of_food} recipes`,
            foods: foods.map(doc => {
                const food = doc.toJSON();
                food.imageUrl = `/assets/images/${food.picture}`;
                return food;
            })
        });
    } catch (error) {
        console.log(error);
        res.status(500).send("Something went wrong! Please try again!");
    }
};

// list all food by mealType
const getAllFoodByMealType = async (req, res) => {
    try {
        const mealType = req.params.mealType;
        const foods = await food_model.find({ mealType: mealType });
        res.render('pages/allFoodByMealType', {
            title: `Here are our great ${mealType} recipes`,
            foods: foods.map(doc => {
                const food = doc.toJSON();
                food.imageUrl = `/assets/images/${food.picture}`;
                return food;
                
            })
        });
    } catch (error) {
        console.log(error);
        res.status(500).send("Something went wrong! Please try again!");
    }
};

//get a food details by id - user
const getFoodByIdUser = async (req, res) => {
    try{
        const foodId = req.params.id;
        const food = await food_model.findById(foodId);
        const comments = await Comment.find({ foodId: foodId }).exec();
        const foodData = food.toJSON();
        foodData.imageUrl = `/assets/images/${foodData.picture}`;
        const relatedFoods = await food_model.find({ type_of_food: food.type_of_food, _id: { $ne: foodId } });
        const relatedFoodsData = relatedFoods.map(foodItem => {
            return {
                ...foodItem.toJSON(),
                imageUrl: `/assets/images/${foodItem.picture}`,
                averageRating: foodItem.averageRating,
            };
        });
        res.render('pagesUser/foodById', { food: foodData, relatedFoods: relatedFoodsData, comments: comments, foodId: foodId });
    }catch(error){
        console.error(error);
        res.status(500).json("Something went wrong! Please try again!");
    }
};

//get a food details by id - admin
const getFoodByIdAdmin = async (req, res) => {
    try{
        const foodId = req.params.id;
        const food = await food_model.findById(foodId);
        const comments = await Comment.find({ foodId: foodId }).exec();
        const foodData = food.toJSON();
        foodData.imageUrl = `/assets/images/${foodData.picture}`;
        const relatedFoods = await food_model.find({ type_of_food: food.type_of_food, _id: { $ne: foodId } });
        const relatedFoodsData = relatedFoods.map(foodItem => {
            return {
                ...foodItem.toJSON(),
                imageUrl: `/assets/images/${foodItem.picture}`,
                averageRating: foodItem.averageRating
            };
        });
        res.render('pagesAdmin/foodById', { food: foodData, relatedFoods: relatedFoodsData, comments: comments, foodId: foodId });
    }catch(error){
        console.error(error);
        res.status(500).json("Something went wrong! Please try again!");
    }
};

//rating system
//first lets users rate the food in foodById
const rate = async (req, res) => {
    const {id} = req.params;
    const {rating} = req.body;
    try {
        const food = await food_model.findById(id);
        const updatedRatings = [...food.ratings, parseInt(rating)];
        const averageRating = updatedRatings.reduce((acc, curr) => acc + curr, 0) / updatedRatings.length;
        await food_model.findByIdAndUpdate(id, {
            $push: { ratings: rating },
            $set: { averageRating: averageRating }
        }, { new: true });
        res.redirect(`/food/${id}`);
    } catch (error) {
        console.log(error)
        res.status(500).json("Something went wrong! Please try again!");
    }
};
//next, find out the highest rated food by mealType and display them in Homepage
const getHome = async (req, res) => {
    try {
        const foods = await food_model.find().sort({ averageRating: -1 }).exec();
        let highestRatedFood = {};
        foods.forEach(food => {
            if (!highestRatedFood[food.mealType] || highestRatedFood[food.mealType].averageRating < food.averageRating) {
                highestRatedFood[food.mealType] = food;  
            }});
        res.render('pages/index', {highestRatedFood});
    }catch(error){
        console.log(error)
        res.status(500).json("Something went wrong! Please try again!");
    }
};

//save pic to the exsisted storage
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'assets/images/');
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname); 
    }
});


//make sure that pic is png file
const upload = multer({ 
    storage: storage,
    fileFilter: function(req, file, cb){
        if (file.mimetype === "image/png") {
            cb(null, true);
        } else {
            cb(new Error("Only .png files are allowed!"), false);
        }
    }
}).single('picture');

//Add food validation 
const postFoodValidationRules = [
    // body('name').notEmpty().trim().escape().withMessage('Name is required.'),
    // body('description').notEmpty().trim().escape().withMessage('Description is required.'),
    // body('ingredients').notEmpty().trim().escape().withMessage('Ingredients are required.'),
    // body('how_to_make').notEmpty().trim().escape().withMessage('How to make is required.'),
    // body('type_of_food').notEmpty().withMessage('Type of food is required.')
    //   .isIn(['Fine Dining', 'Street Food', 'Vegan', 'Fried', 'Beverage']).withMessage('Invalid type of food selected.'),
    // body('nationality').notEmpty().trim().escape().withMessage('Nationality is required.'),
    // body('mealType').notEmpty().withMessage('Meal type is required.')
    //   .isIn(['main', 'appetizer', 'side', 'dessert', 'drink']).withMessage('Invalid meal type selected.'),
  ];

//add a food

const getAddFoodPage = (req, res) => {
    res.render('pages/add-food-page');
};

const postFood = async (req, res) => {
    upload(req, res, async (error) => {
        if (error) {
            return res.status(400).send("Error uploading file: " + error.message);
        }
        
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, description, ingredients, how_to_make, type_of_food, nationality, mealType } = req.body;
        const filename = req.file ? path.basename(req.file.path) : 'veganChicken.png';
        const newFood = new food_model({
            name,
            description,
            ingredients,  
            how_to_make,  
            type_of_food,
            nationality,
            mealType,
            picture: filename 
        });

        try {
            await newFood.save();
            res.send("<h1>Food Added Successfully</h1>");
        } catch (err) {
            res.status(500).send("Error adding food: " + err.message);
        }
    });
};


//delete
const deleteFood = async (req, res) => {
    try {
        const food = await food_model.findById(req.params.id);
        const result = await food_model.findByIdAndDelete(req.params.id);

        sendEmail(emailTypeEnum.DELETE, null, food, null);

        res.send("Food deleted successfully");
    } catch (error) {
        res.status(500).send("Failed to delete the food.");
    }
};


//update

const getEditFoodPage = async (req, res) => {
    try {
        const food = await food_model.findById(req.params.id);
        res.render('pagesAdmin/editFood', { food });
    } catch (error) {
        res.status(500).send("Failed to get the food for edit.");
    }
};

const editFood = async (req, res) => {
    try {
        const { id, name, description, ingredients, how_to_make, type_of_food, nationality, mealType, email } = req.body;
        if (!name) {
            return res.status(400).json({ error: "Name of food is required"});
        }

        const updatedFields = { name, description, type_of_food, nationality, mealType };

        // Convert ingredients and how_to_make to arrays if they are provided as comma-separated strings
        if (ingredients) {
            updatedFields.ingredients = ingredients.split(',').map(ingredient => ingredient.trim());
        }
        if (how_to_make) {
            updatedFields.how_to_make = how_to_make.split('.').map(step => step.trim());
        }

        const currentFoodDetails = await food_model.findById(id);

        const food = await food_model.findByIdAndUpdate(id, updatedFields, { new: true });

        if (!food) {
            return res.status(404).json({ error: "Food not found"});
        }

        sendEmail(emailTypeEnum.UPDATE, email, currentFoodDetails, food);

        res.send("<h1>Food edited</h1>");
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
};

// Search Function
const searchFood = async (req, res) => {
    const searchTerm = req.query.searchTerm;

    try {
        if (!searchTerm) {
            return res.render('pages/searchResults');
        }

        const foods = await food_model.find({ $text: { $search: searchTerm } });
        const foodsWithImage = foods.map(doc => {
            const food = doc.toJSON();
            food.imageUrl = `/assets/images/${food.picture}`;
            return food;
        });

        res.render('pages/searchResults', { foods: foodsWithImage });
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
};
//Comment Validation code
const addCommentValidationRules = [
    body('foodId').notEmpty().isMongoId(),
    body('username').notEmpty().trim().isString().escape(),
    body('content').notEmpty().trim().isString().escape(),
  ];

//comment code
const addComment = async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { foodId, username, content } = req.body;
      const comment = new Comment({ foodId, username, content });
      await comment.save();
      res.redirect(`/food/${foodId}`);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

//chat 
const chat = async (req, res) => {
    try {
        res.render('pages/chatapp');
    } catch (error) {
        res.status(500).send("Failed to get to chatbox.");
    }
};

module.exports = {
    getHome, 
    getAllFood, 
    getAllFoodByType, 
    getAllFoodByMealType,
    getFoodByIdUser,
    getFoodByIdAdmin, 
    rate,
    editFood, 
    getAddFoodPage, 
    postFood, 
    deleteFood, 
    getEditFoodPage, 
    searchFood, 
    addComment,
    addCommentValidationRules,
    postFoodValidationRules,
    chat
};
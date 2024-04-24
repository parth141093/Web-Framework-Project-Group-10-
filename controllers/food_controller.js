const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

const dbURI = 'mongodb+srv://'+process.env.DBUSERNAME+':'+process.env.DBPASSWORD+'@'+process.env.CLUSTER+'.mongodb.net/'+process.env.DB+'?retryWrites=true&w=majority';
mongoose.connect(dbURI);
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
                food.imageUrl = `/assets/images/${food.picture}.png`;
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
            title: `Type of food: ${type_of_food}`,
            foods: foods.map(doc => {
                const food = doc.toJSON();
                food.imageUrl = `/assets/images/${food.picture}.png`;
                return food;
                
            })
        });
    } catch (error) {
        console.log(error);
        res.status(500).send("Something went wrong! Please try again!");
    }
};

//get a food details by id
const getFoodById = async (req, res) => {
    try{
        const foodId = req.params.id;
        const food = await food_model.findById(foodId);
        const comments = await Comment.find({ foodId: foodId }).exec();
        const foodData = food.toJSON();
        foodData.imageUrl = `/assets/images/${foodData.picture}.png`;
        const relatedFoods = await food_model.find({ type_of_food: food.type_of_food, _id: { $ne: foodId } });
        const relatedFoodsData = relatedFoods.map(foodItem => {
            return {
                ...foodItem.toJSON(),
                imageUrl: `/assets/images/${foodItem.picture}.png`,
                averageRating: foodItem.averageRating
            };
        });
        res.render('pages/foodById', { food: foodData, relatedFoods: relatedFoodsData, comments: comments });
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
        res.status(500).json({success: false, message: "Something went wrong!"});
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
        console.error(error);
        res.status(500).json({success: false, message: "Something went wrong!"})
    }
};

//add a food

const getAddFoodPage = (req, res) => {
    res.render('add-food-page');
};

const postFood = async (req, res) => {
    try {
        const newFood = new food_model(req.body);
        await newFood.save();
        res.send("<h1>Food Added</h1>");
    } catch (error) {
        res.status(500).send("Error adding food: " + error.message);
    }
};

const deleteFood = async (req, res) => {
    try {
        const result = await food_model.findByIdAndDelete(req.params.id);
        res.send("Food deleted successfully");
    } catch (error) {
        res.status(500).send("Failed to delete the food.");
    }
};


//update

const getEditFoodPage = async (req, res) => {
    try {
        const food = await food_model.findById(req.params.id);
        res.render('pages/editFood', { food });
    } catch (error) {
        res.status(500).send("Failed to get the food for edit.");
    }
};
const sendMail = async (req, res) => {
};
const editFood = async (req, res) => {
    try {
        const { id, name, description, ingredients, how_to_make, type_of_food, nationality, picture } = req.body;
        if (!name) {
            return res.status(400).json({ error: "Name of food is required"});
        }

        const updatedFields = { name, description, type_of_food, nationality, picture };

        // Convert ingredients and how_to_make to arrays if they are provided as comma-separated strings
        if (ingredients) {
            updatedFields.ingredients = ingredients.split(',').map(ingredient => ingredient.trim());
        }
        if (how_to_make) {
            updatedFields.how_to_make = how_to_make.split('\n').map(step => step.trim());
        }

        const food = await food_model.findByIdAndUpdate(id, updatedFields, { new: true });

        if (!food) {
            return res.status(404).json({ error: "Food not found"});
        }
        const nodemailer = require("nodemailer");
        const transporter = nodemailer.createTransport({
            host: 'smtp.mailosaur.net',
            port: 587,
            auth: {
                user: "ejhcanme@mailosaur.net",
                pass: "TXH04fX8FprZQKAkgiqavGrscJcBHoEm",
            }
        });
        let info = await transporter.sendMail({
            from:{
                name: 'Group10',
                address: "ejhcanme@mailosaur.net"
            },
            to: "ejhcanme@mailosaur.net", // list of receivers
            subject: "About Food", // Subject line
            text: "Hello Team", // plain text body
            html: "<b>Hello Your Food is Edited</b>", // html body
          });
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
            food.imageUrl = `/assets/images/${food.picture}.png`;
            return food;
        });

        res.render('pages/searchResults', { foods: foodsWithImage });
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
};

//comment code
const addComment = async (req, res) => {
    try {
      const { foodId, content } = req.body;
      const comment = new Comment({ foodId, content });
      await comment.save();
      res.redirect(`/food/${foodId}`);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

module.exports = {
    getHome, 
    getAllFood, 
    getAllFoodByType, 
    getFoodById, 
    rate,
    editFood, 
    getAddFoodPage, 
    postFood, 
    deleteFood, 
    getEditFoodPage, 
    searchFood, 
    sendMail,
    addComment
};
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

const dbURI = 'mongodb+srv://'+process.env.DBUSERNAME+':'+process.env.DBPASSWORD+'@'+process.env.CLUSTER+'.mongodb.net/'+process.env.DB+'?retryWrites=true&w=majority';
mongoose.connect(dbURI);
const food_model = require('../models/food_model');



//Home root
const getHome = (req, res) => {
    res.send('Food blog');
};

//list all food
const getAllFood = async (req, res) => {
    try{
        const foods = await food_model.find();
        res.render('allFood', {
            title: "Eat what today?",
            foods: foods.map(doc => {
                const food = doc.toJSON();
                food.imageUrl = `/assets/images/${food.picture}.png`;
                return food;
            })
        })
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
};

//list all food by type
const getAllFoodByType = async (req, res) => {
    try {
        const type_of_food = req.params.type_of_food;
        const foods = await food_model.find({ type_of_food: type_of_food });
        res.render('allFoodByType', {
            title: `Food Items - ${type_of_food}`,
            foods: foods.map(doc => {
                const food = doc.toJSON();
                food.imageUrl = `/assets/images/${food.picture}.png`;
                return food;
                
            })
        });
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
};

//get a food details by id
const getFoodById = async (req, res) => {
    try{
        const foodId = req.params.id;
        const food = await food_model.findById(foodId);
        const foodData = food.toJSON();
        foodData.imageUrl = `/assets/images/${foodData.picture}.png`;

        res.render('foodById', { food: foodData });
    }catch(error){
        console.error(error);
        res.status(500).json({error:"Internal Server Error"});
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


//delete

// const getDelFoodPage = (req, res) => {
//     res.render('remove-food');
// };

// const deleteFood = async (req, res) => {
//     const {_id} = req.body;
//     try {
//         const deletedFood = await food_model.findByIdAndDelete(_id);
//         if (!deletedFood) {
//             return res.status(404).send('Food not found');
//         }
//         res.send("<h1>Food Deleted</h1>");
//     } catch (error) {
//         res.status(500).send("Error deleting food: " + error.message);
//     }
// }

const deleteFood = async (req, res) => {
    try {
        const result = await food_model.findByIdAndDelete(req.params.id);
        res.send("Food deleted successfully");
    } catch (error) {
        res.status(500).send("Failed to delete the food.");
    }
};


//update

const getUpdateFoodPage = async (req, res) => {
    try {
        const food = await food_model.findById(req.params.id);
        res.render('updateFood', { food });
    } catch (error) {
        res.status(500).send("Failed to get the food for update.");
    }
};


const updateFood = async (req, res) => {
    try {
        const { name, description, ingredients, how_to_make, type_of_food, nationality, picture } = req.body;
        if (!name) {
            return res.status(400).json({ error: "Name of food is required"});
        }

        const updatedFields = { name, description, ingredients, how_to_make, type_of_food, nationality, picture };

        const food = await food_model.findByIdAndUpdate(req.body.id, updatedFields, { new: true });

        if (!food) {
            return res.status(404).json({ error: "Food not found"});
        }
        
        res.send("<h1>Food Updated</h1>");
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
};

// Search Function
const searchFood = async (req, res) => {
    const searchTerm = req.query.q;

    try {
        if (!searchTerm) {
            return res.render('searchPage');;
        }

        const foods = await food_model.find({ $text: { $search: searchTerm } });
        res.render('searchResults', { foods });
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
};

module.exports = {getHome, getAllFood, getAllFoodByType, getFoodById, updateFood, getAddFoodPage, postFood, /*getDelFoodPage,*/ deleteFood, getUpdateFoodPage, searchFood};
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

app.use(express.urlencoded({ extended: true }));

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
//get 1 food details

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

const getDelFoodPage = (req, res) => {
    res.render('remove-food');
};

const deleteFood = async (req, res) => {
    const {_id} = req.body;
    try {
        const deletedFood = await food_model.findByIdAndDelete(_id);
        if (!deletedFood) {
            return res.status(404).send('Food not found');
        }
        res.send("<h1>Food Deleted</h1>");
    } catch (error) {
        res.status(500).send("Error deleting food: " + error.message);
    }
}

//update

const getUpdateFoodPage = (req, res) => {
    res.render('updateFood');
};

const updateFood = async (req, res) => {
    try {
        const newFood = new food_model(req.body);
        await newFood.save();
        res.send("<h1>Food Added</h1>");
    } catch (error) {
        res.status(500).send("Error adding food: " + error.message);
    }
};
// const updateFood = async (req, res) => {
//     res.render('updateFood');
//     const { id } = req.params; 
//     const { name, description, ingredients, how_to_make, type_of_food, nationality } = req.body; 

//     try {
//         // Find the food item by id and update it
//         const updatedFood = await food_model.findByIdAndUpdate(id, { name, description, ingredients, how_to_make, type_of_food, nationality }, { new: true });

//         if (!updatedFood) {
//             return res.status(404).send('Food item not found');
//         }

//         res.send('Food item updated successfully');
//     } catch (error) {
//         console.log(error);
//         res.status(500).send('Internal Server Error');
//     }
// };

module.exports = {getHome, getAllFood, updateFood, getAddFoodPage, postFood, getDelFoodPage, deleteFood, getUpdateFoodPage};
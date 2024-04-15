const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const dbURI = 'mongodb+srv://'+process.env.DBUSERNAME+':'+process.env.DBPASSWORD+'@'+process.env.CLUSTER+'.mongodb.net/'+process.env.DB+'?retryWrites=true&w=majority';
mongoose.connect(dbURI);
const Food = require('../models/food_model');



//Home root
const getHome = (req, res) => {
    res.send('Food blog');
};

//list all food

//get 1 food details
const getFoodDetails = async (req,res) => {
    try {
        const foodId = req.params.id;
        const food = await Food.findById(foodId);
        res.render('index', {
            food : food.toJSON()
        });
    } catch (err) {
        res.status(404).json({
            msg: "not found"
        });
    }
};

//add a food


//delete

//update

module.exports = {getHome, getFoodDetails};
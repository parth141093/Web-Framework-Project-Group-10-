const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const dbURI = 'mongodb+srv://'+process.env.DBUSERNAME+':'+process.env.DBPASSWORD+'@'+process.env.CLUSTER+'.mongodb.net/'+process.env.DB+'?retryWrites=true&w=majority';
mongoose.connect(dbURI);
const food_model = require('../models/food_model');



//Home root
const getHome = (req, res) => {
    res.send('Food blog');
};

//list all food

//get 1 food details

//add a food


//delete

//update

module.exports = {getHome, getFoodDetails};
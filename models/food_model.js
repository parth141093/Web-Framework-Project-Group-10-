const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
    name: String,
    description: String,
    ingredients: Array,
    how_to_make: Array,
    type_of_food: String,
    nationality: String,
    picture: String
}, { collection: 'food_info' }); // Specify the collection name explicitly

const Food = mongoose.model('Food', foodSchema);

module.exports = Food;

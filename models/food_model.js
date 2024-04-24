const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
    name: String,
    description: String,
    ingredients: [String],
    how_to_make: [String],
    type_of_food: String,
    nationality: String,
    picture: String,
    mealType: String,
    ratings: [{type: Number}],
    averageRating: { type: Number, default: 0 }
}, { collection: 'food_info' }); 

foodSchema.virtual('comments', {
    ref: 'Comment',
    localField: '_id',
    foreignField: 'foodId'
  });

const Food = mongoose.model('Food', foodSchema);

module.exports = Food;

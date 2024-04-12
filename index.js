const express = require('express');
const mongoose = require('mongoose');
const exphbs = require('express-handlebars');
require('dotenv').config();
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const dbURI = 'mongodb+srv://'+process.env.DBUSERNAME+':'
+process.env.DBPASSWORD+'@'+process.env.CLUSTER+'.mongodb.net/'
+process.env.DB+'?retryWrites=true&w=majority';

const Food = require('./models/Food');

mongoose.connect(dbURI)
.then((result) => 
{
    console.log('Connected to DB');
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log("Listening on " + PORT));
})
.catch((err) => {
    console.log(err);
})



// Create data Entry
app.post('/add-foods', async (req, res) => {
    const { name, description, ingredients, how_to_make, type_of_food,nationality,picture } = req.body;

    const newFood = new Food({
        name,
        description,
        ingredients,
        how_to_make,
        type_of_food,
        nationality,
        picture
    });

    newFood.save()
        .then((result) => {
            res.status(201).json({ message: 'Item entry added', newFood: result });
        })
        .catch((error) => {
            console.error('Adding Error:', error);
            res.status(500).json({ error: 'Server Error' });
        });
});

// Delete an entry
app.delete('/delete-food/:id', async (req, res) => {
    const id = req.params.id;
    const deletedFood = await Food.findByIdAndDelete(id);
    res.json(deletedFood);
});

//Get Food info

const getAll = async () =>{
    try
    {
        const result = await Food.find();
        console.log(result);
    }
    catch (error)
    {
        console.log(error);
    }
}
//getAll();

app.get('/foods', async (req,res) => {
    try
    {
        const result = await Food.find();
        res.json(result);
    }
    catch (error)
    {
        console.log(error);
    }
});

app.get('/foods/:id', async (req,res) => {
    const id = req.params.id;
    const food = await Food.findById(id);
    res.json(food);
    
});
// Update data
app.patch('/update-food/:id', async (req, res) => {
    try {
        const { name, description, ingredients, how_to_make, type_of_food, nationality, picture } = req.body;
        if (!name) {
            return res.status(400).json({ error: "Name of food is required"});
        }
        const food = await Food.findByIdAndUpdate(req.params.id, req.body, {new: true});
        if (!food) {
            return res.status(404).json({ error: "Food not found"});
        }
        res.json(food);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Internal Server Error"});
    }
});
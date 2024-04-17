const express = require('express');
const mongoose = require('mongoose');
const exphbs = require('express-handlebars');
const handlebars = require('handlebars');
const path = require('path');
require('dotenv').config();

handlebars.handlebars = handlebars.create({ allowProtoMethodsByDefault: true });

const app = express();
app.use(express.urlencoded({ extended: true }));
app.engine('handlebars', exphbs.engine({ 
    defaultLayout: 'main', 
    runtimeOptions: {allowProtoMethodsByDefault: true, allowProtoPropertiesByDefault: true},
    partialsDir: ['views/partials/']
 }));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use(express.static('public'));

app.use('',require('./routes/food_route'));
app.use('/food', require('./routes/food_route'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`App listening to port ${PORT}`));

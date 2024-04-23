const express = require('express');
const mongoose = require('mongoose');
const exphbs = require('express-handlebars');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: '.handlebars',
    runtimeOptions: {
        allowProtoMethodsByDefault: true,
        allowProtoPropertiesByDefault: true
    },
    partialsDir: ['views/partials/'],
    helpers: {
        toFixed: function (value, precision) {
            if (value != null) {
                return Number(value).toFixed(precision);
            }
            return '';
        }
    }
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use('/controllers', express.static(path.join(__dirname, 'controllers')));

app.use('', require('./routes/food_route'));
app.use('/food', require('./routes/food_route'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`App listening to port ${PORT}`));

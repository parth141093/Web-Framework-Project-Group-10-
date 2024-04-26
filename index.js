const express = require('express');
const session = require('express-session');
const passport = require('./config/passport');
const mongoose = require('mongoose');
const exphbs = require('express-handlebars');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: false
  }));
  app.use(passport.initialize());
  app.use(passport.session());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());



const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: '.handlebars',
    runtimeOptions: {
        allowProtoMethodsByDefault: true,
        allowProtoPropertiesByDefault: true
    },
    // to use frontend widgets in partials folder
    partialsDir: ['views/partials/'],
    // to show decimal number with 2 digits after the comma
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

app.use('/food', require('./routes/food_route'));
app.use('/auth', require('./routes/auth_route'));
app.use('', require('./routes/food_route'));

/*
app.get('/', (req, res) => {
    res.render('pages/index', { isLoggedIn: req.session.isLoggedIn, username: req.session.username });
});
*/
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`App listening to port ${PORT}`));

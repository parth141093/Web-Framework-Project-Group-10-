//import modules
const express = require('express');
const session = require('express-session');
const passport = require('./controllers/passport');
const mongoose = require('mongoose');
const exphbs = require('express-handlebars');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');

//environment variables from .env
require('dotenv').config();

//to initialize express app first
const app = express();

//to create new socket.io server using http server
const server = http.createServer(app);
const io = new Server(server);

//session middleware
app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

//parsing middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//handlebars(hbs) setup
const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: '.handlebars',
    runtimeOptions: {
        allowProtoMethodsByDefault: true,
        allowProtoPropertiesByDefault: true
    },
    //to use frontend widgets in partials folder
    partialsDir: ['views/partials/'],
    //to show decimal number with 2 digits after the comma
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

//static files
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use('/controllers', express.static(path.join(__dirname, 'controllers')));

//routes
app.use('', require('./routes/food_route'));
app.use('/food', require('./routes/food_route'));

//chatapp
io.on('connection', (socket) => {
    socket.on('on-chat', data => {
        io.emit('user-chat', data)
    })
});

//server activation
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`App listening to port ${PORT}`));

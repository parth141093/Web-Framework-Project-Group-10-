const User = require('../models/user_model');
const passport = require('passport');
const bcrypt = require('bcrypt');


//Signup
const signUp = async (req, res) => {
    if (req.method === 'GET') {
        res.render('pages/signUp');
    } else if (req.method === 'POST') {
        try {
            const { username, email, password } = req.body;
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = new User({ username, email, password: hashedPassword });
            await newUser.save();
            res.status(201).json({ message: 'User created successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
};

//Login
const login = (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            // Render the login page with error message
            return res.status(400).render('pages/login', { errorMessage: info.message });
        }
        req.logIn(user, (err) => {
            if (err) {
                return next(err);
            }
            // Redirect to a different page upon successful login
            res.redirect('/');
        });
    })(req, res, next);
};


//Logout
const logout = (req, res) => {
    req.logout((err) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        // Redirect to a different page upon successful logout
        res.redirect('/');
    });
};

module.exports = { signUp, login, logout };

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/user_model');

//Local Strategy config
passport.use(new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password'
  },
  async function(email, password, done) {
    try {
      const user = await User.findOne({ email });
      if (!user || !await user.isValidPassword(password)) {
        return done(null, false, { message: 'Incorrect email or password' });
      }
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

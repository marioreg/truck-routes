const { check, validationResult } = require('express-validator/check');
var bcrypt = require('bcryptjs');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require("../models/user.js");

module.exports = function (router) {

  // Index Route
  router.get("/", function (req, res) {
    res.render("index");
  });

  // Register form route
  router.get("/register", function (req, res) {
    res.render("register");
  });
  // Post method for register using express validator
  router.post("/register", [
    // email imput must be an email
    check('email').isEmail().withMessage('Email address must be a valid email format: you@example.com'),
    check('email').not().isEmpty().withMessage('email is required'),
    // password must be at least 5 chars long
    check('password').isLength({ min: 3 }).withMessage('Password must be at least 8 characters'),
    check('password').not().isEmpty().withMessage('Password is required'),
    // first name field cannot be empty
    check('name').not().isEmpty().withMessage('Name is required'),
    // last name field cannot be empty
    check('username').not().isEmpty().withMessage('Username is required')
  ], function (req, res, next) {

    //validation errors stored
    const errors = validationResult(req);

    // if there are errors, send them to register page
    if (!errors.isEmpty()) {
      console.log(errors);
      var errores = errors.array();
      console.log(errores);
      return res.render("register", { errors: errores });

    } else {
      
      // no errors
      //store name, email and password in variables
      var name = req.body.name;
      var username = req.body.username;
      var email = req.body.email;
      var password = req.body.password;

      //encrpyt password with bcryptjs
      bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(password, salt, function (err, hash) {
          // Store hash in your password DB.
          var newUser = new User({
            name: name,
            username: username,
            email: email,
            password: hash
          });
          // insert new user in database
          User.create(newUser, function (error, user) {
            if (error) throw error;
            console.log(user);
          });
          // render registration page with success msg
          res.render('register', { message: 'User registration succesful!' })
        });
      });
    }
  });

  //Login form route
  router.get("/login", function (req, res) {
    res.render("login");
  });

  //passport strategy for finding user in db and comparing password for login
  passport.use(new LocalStrategy(
    function (username, password, done) {
      User.findOne({ username: username }, function (err, user) {
        console.log(user)
          ; if (err) { return done(err); }
        if (!user) {
          return done(null, false, { message: 'Incorrect username.' });
        }
        // using bcryptjs for comparing hashed password
        bcrypt.compare(password, user.password, function (err, res) {

        });
        return done(null, user);
      });
    }
  ));

  //for passport serialization
  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  //for passport deserialization
  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });

  //login form authentication method with passport
  router.post('/login',
    passport.authenticate('local', { successRedirect: '/dashboard', failureRedirect: '/login' }),
    function (req, res) {
      res.redirect('/dashboard');
    });

  //dashboard route with function that requires user to de signed in to acces it
  router.get("/dashboard", ensureAuthenticated, function (req, res) {
    var name = req.user.name;
    var email = req.user.email;
    var username = req.user.username;
    var id = req.user.id;
    console.log(name, username, email);
    res.render("dashboard", { name: name, email: email, username: username, id:id });
  });

  //function that ensures user is authenticated before rendering route
  function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    } else {
      res.redirect('/login');
    }
  }

  //logout route
  router.get("/logout", function (req, res) {
    req.logout();
    res.redirect('/login');
  });



}
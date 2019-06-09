const express = require('express');
const router = express.Router();
const User = require('../models/User');
const alertMessage = require('../helpers/messenger');
const passport = require('passport');
const bcrypt = require('bcryptjs');

router.post('/Login', (req, res, next) => {
  passport.authenticate('local', {
      successRedirect: '/', // Route to /video/listVideos URL
      failureRedirect: '/Login', // Route to /login URL
      failureFlash: true
      /* Setting the failureFlash option to true instructs Passport to flash an error
      message using the message given by the strategy's verify callback, if any.
      When a failure occur passport passes the message object as error */
  })(req, res, next);
});

router.post('/Register', (req, res) => {
  let errors = [];
  let { name, email, password, cfmpassword, phone, address} = req.body;

  if (req.body.password != cfmpassword) {
      errors.push({
          text: 'Password do not match'
      })
  }
  if (password.length < 4) {
      errors.push({
          text: 'Password must have at least 4 character'
      })
  }

  if (errors.length > 0) {
      res.render('user/register', {
          errors,
          name,
          email,
          password,
          cfmpassword,
          phone,
          address
      })
  } else {
      // If all is well, checks if user is already registered
      User.findOne({ where: { email: req.body.email } })
          .then(user => {
              if (user) {
                  // If user is found, that means email has already been
                  // registered
                  res.render('user/register', {
                      error: user.email + ' already registered',
                      name,
                      email,
                      password,
                      cfmpassword,
                      phone,
                      address
                  });
              } else {
                  bcrypt.genSalt(10, (err, salt) => {
                      bcrypt.hash(password, salt, (err, hash) => {
                          if (err) throw err;
                          password = hash;
                          User.create({ name, email, password, phone,address })
                              .then(user => {
                                  alertMessage(res, 'success', user.name + ' added.Please login', 'fas fa - sign -in -alt', true);
                                  res.redirect('/Login');
                              })
                              .catch(err => console.log(err));
                      })
                     
                  })// Create new user record
              
              }
          });
  }
});



/* GET user profile */
router.get('/profile', function(req, res) {
  const title = "Profile";
  res.render('user/profile', { title: title });
});

router.get('/password', function(req, res) {
    const title = "Password";
    res.render('user/password', { title: title });
  });
module.exports = router;

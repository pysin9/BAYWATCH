const express = require('express');
const router = express.Router();
const User = require('../models/User');
const alertMessage = require('../helpers/messenger');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const Sequelize = require('sequelize')

const sequelize = new Sequelize('organic', 'organic', 'green', {
    host: 'localhost',
    dialect: 'mysql',

    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    operatorsAliases: false
});

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
    let { name, email, password, cfmpassword, phone } = req.body;

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
                        phone
                    });
                } else {
                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(password, salt, (err, hash) => {
                            if (err) throw err;
                            password = hash;
                            User.create({ name, email, password, phone})
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

router.put('/saveProfile/:id', function (req, res) {
    let id = req.params.id;
    let name = req.body.name;
    let email = req.body.email;
    let address = req.body.address;
    let phone = req.body.phone;
    let bankName = req.body.bankName;
    let bankNo = req.body.bankNo;
    if (phone.length != 8)
    {
        alertMessage(res, 'danger', 'Phone number should contain 8 numbers!', 'fas fa - sign -in -alt', true);
            res.redirect('/profile');
    }
    if (bankNo != "")
    {
        sequelize.query("UPDATE users SET bankNo= :BankNo WHERE id= :ID",
        {replacements:{BankNo: bankNo, ID: id }})
        .then(() => {
            alertMessage(res, 'success', 'Bank Number Updated!', 'fas fa - sign -in -alt', true);
            res.redirect('/profile');
        })
    }
    else
    {
    sequelize.query("UPDATE users SET name= :Name, email= :Email, address= :Address, phone= :Phone, bankName= :BankName WHERE id= :ID",
        {replacements:{ Name: name, Email: email, Address: address, Phone: phone,BankName: bankName, ID: id }})
        .then(() => {
            alertMessage(res, 'success', 'Profile Updated!', 'fas fa - sign -in -alt', true);
            res.redirect('/profile');
        })
    }
    // User.update({
    //     name,
    //     email,
    //     address,
    //     phone,
    //     bankName,
    //     bankNo,
    // }, {
    //         where: {
    //             id
    //         }
    //     }).then(() => {
    //         alertMessage(res, 'success', 'Profile Updated!', 'fas fa - sign -in -alt', true);
    //         res.redirect('/user/profile');
    //     }).catch(err => console.log(err));
});

router.put('/savePassword/:id', function (req, res) {
    let id = req.params.id;
    let password = req.body.password;
    let cpassword = req.body.cpassword;
    if (password != cpassword) {
        alertMessage(res, 'danger', 'Passwords do not match!', 'fas fa - sign -in -alt', true);
        res.redirect('/password');
    }
    if (password.length < 4) {
        alertMessage(res, 'danger', 'Password length should be at least 4 characters!', 'fas fa - sign -in -alt', true);
        res.redirect('/password');
    }
    if (password == '' || cpassword == '') {
        alertMessage(res, 'danger', 'Please fill up both fields!', 'fas fa - sign -in -alt', true);
        res.redirect('/password');
    }
    else {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(password, salt, (err, hash) => {
                if (err) throw err;
                password = hash;

                sequelize.query("UPDATE users SET password= :Password WHERE id= :ID", {replacements:{Password:password, ID: id}
                    }).then(() => {
                        alertMessage(res, 'success', 'Password Updated!', 'fas fa - sign -in -alt', true);
                        res.redirect('/password');
                    }).catch(err => console.log(err));
            })
        })
    };
});

module.exports = router;

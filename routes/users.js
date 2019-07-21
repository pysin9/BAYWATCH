const express = require('express');
const router = express.Router();
const User = require('../models/User');
const alertMessage = require('../helpers/messenger');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const Sequelize = require('sequelize')
const sgMail = require('@sendgrid/mail');
const jwt = require('jsonwebtoken');

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
    sequelize.query('SELECT verified FROM users WHERE email = :Email', { replacements: { Email: req.body.email } }, raw = true
    ).then(user => {
        if (user) {
            if (user == 0) {
                alertMessage(res, 'danger', 'Email ' + user.email + ' has not been verified.', 'fas fa-exclamation-circle', true);
                res.redirect('/');
            } else {
                passport.authenticate('local', {
                    successRedirect: '/', // Route to /video/listVideos URL
                    failureRedirect: '/Login', // Route to /login URL
                    failureFlash: true
                    /* Setting the failureFlash option to true instructs Passport to flash an error
                    message using the message given by the strategy's verify callback, if any.
                    When a failure occur passport passes the message object as error */
                })(req, res, next);
            }
        }
    })


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
                        phone,
                    });
                } else {
                    let token;
                    jwt.sign(email, 'gr33ngra33', (err, jwtoken) => {
                        if (err) console.log('Error generating Token: ' + err);
                        token = jwtoken;
                    });
                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(password, salt, (err, hash) => {
                            if (err) throw err;
                            password = hash;
                            User.create({
                                name,
                                email,
                                password,
                                phone,
                                verified: 0
                            }).then(user => {
                                sendEmail(user.id, user.email, token)
                                    .then((msg) => {		// Send email success
                                        alertMessage(res, 'success', user.name + ' added. Please log in to ' + user.email + ' to verify account.'
                                            , 'fas fa-sign-in-alt', true);
                                        res.redirect('/Login');
                                    })
                                    .catch((err) => {		// Send email fail
                                        alertMessage(res, 'warning', 'Error sending to ' + user.email + ' ' + err, 'fas fa-sign-in-alt', true);
                                        console.log('Sending email error: ' + err);
                                        res.redirect('/');
                                    });

                            }).catch(err => console.log(err));
                        })
                    });
                }
            });
    }
});
router.get('/verify/:userId/:token', (req, res, next) => {
    // retrieve from user using id
    User.findOne({
        where: {
            id: req.params.userId
        }
    }).then(user => {
        if (user) { // If user is found
            let userEmail = user.email;
            console.log(userEmail) // Store email in temporary variable
            if (user.verified === true) { // Checks if user has been verified
                alertMessage(res, 'info', 'User already verified', 'fas fa-exclamation - circle', true);
                res.redirect('/Login');
            } else {
                // Verify JWT token sent via URL
                jwt.verify(req.params.token, 'gr33ngra33', (err, authData) => {
                    if (err) {
                        alertMessage(res, 'danger', 'Unauthorised Access', 'fas fa-exclamation - circle', true);
                        res.redirect('/');
                    } else {
                        sequelize.query("UPDATE users SET verified= 1 WHERE id= :ID",
                        { replacements: { ID: req.params.userId } 
                        }).then(user => {
                            console.log(user)
                            alertMessage(res, 'success', userEmail + ' verified.Please login', 'fas fa - sign -in -alt', true);
                            res.redirect('/Login');
                        });
                    }
                });
            }
        } else {
            alertMessage(res, 'danger', 'Unauthorised Access', 'fas fa-exclamation-circle', true);
            res.redirect('/');
        }
    });
});




function sendEmail(userId, email, token) {
    sgMail.setApiKey('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');
    const message = {
        to: email,
        from: 'Do Not Reply <admin@video-jotter.sg>',
        subject: 'Verify Organic Account',
        text: 'New organics Email Verification',
        html: `Thank you registering with Video Jotter.<br><br>
        Please <a href="http://localhost:5001/user/verify/${userId}/${token}">
        <strong>verify</strong></a>your account.`
    };
    // const message = {
    //     to: email,
    //     from: 'Do Not Reply <admin@New-Organic.sg>',
    //     subject: 'Verify Organic Account',
    //     templateId: 'd-c0bbe395148d4dfb889d5223f5334d2e',
    //     dynamic_template_data: {     
    //         name: 'name',
    //         confirm_account: `<a href="http://localhost:5001/user/verify/${userId}/${token}">`
    //     },
    // };

    // Returns the promise from SendGrid to the calling function
    return new Promise((resolve, reject) => {
        sgMail.send(message)
            .then(msg => resolve(msg))
            .catch(err => reject(err));
    });

}

/* GET user profile */

router.put('/saveProfile/:id', function (req, res) {
    let id = req.params.id;
    let name = req.body.name;
    let email = req.body.email;
    let address = req.body.address;
    let phone = req.body.phone;
    let bankName = req.body.bankName;
    let bankNo = req.body.bankNo;
    let points = req.body.points;
    let day = new Date();
    let currday = day.getDate();

    if (phone.length != 8) {
        alertMessage(res, 'danger', 'Phone number should contain 8 numbers!', 'fas fa - sign -in -alt', true);
        res.redirect('/profile');
    }
    if (bankNo != "") {
        sequelize.query("UPDATE users SET bankNo= :BankNo WHERE id= :ID",
            { replacements: { BankNo: bankNo, ID: id } })
            .then(() => {
                alertMessage(res, 'success', 'Bank Number Updated!', 'fas fa - sign -in -alt', true);
                res.redirect('/profile');
            })
    }
    else {
        sequelize.query("UPDATE users SET name= :Name, email= :Email, address= :Address, phone= :Phone, bankName= :BankName, points = :Points, signin = :Day WHERE id= :ID",
            { replacements: { Name: name, Email: email, Address: address, Phone: phone, BankName: bankName, Points:points, Day:currday, ID: id } })
            .then(() => {
                alertMessage(res, 'success', 'Profile Updated!', 'fas fa - sign -in -alt', true);
                res.redirect('/profile');
            })
    }
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

                sequelize.query("UPDATE users SET password= :Password WHERE id= :ID", {
                    replacements: { Password: password, ID: id }
                }).then(() => {
                    alertMessage(res, 'success', 'Password Updated!', 'fas fa - sign -in -alt', true);
                    res.redirect('/password');
                }).catch(err => console.log(err));
            })
        })
    };
});

module.exports = router;

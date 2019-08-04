const express = require('express');
const router = express.Router();
const checkout = require('../models/checkout');
const alertMessage = require('../helpers/messenger');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const Sequelize = require('sequelize')
//const moment = reqiure('moment')

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


router.post('/checkout4', (req, res) => {

    //let Fname = req.body.Fname
    //let Lname = req.body.Lname
     let EXPD = moment(req.body.EXPD, 'MM');
     let EXPYear = moment(req.body.EXPYear, 'YYYY');
    // let EmailAdd = req.body.EmailAdd;
    // let ADD = req.body.ADD;
    // let PhoneNumber = req.body.PhoneNumber;
    // let city = req.body.city;
    // let state = req.body.state;
    // let zip = req.body.zip;
    let CardType = req.body.CardType;
    let CardNumber = req.body.CardNumber;
    let NameOnC = req.body.NameOnC;
    let SECNO = req.body.SECNO;

    checkout.create({

        CardType,
        CardNumber,
        NameOnC,
        SECNO,
        EXPD,
        EXPYear
    }).then(checkouts => {
        res.redirect('/Reciept');
    })
        .catch(err => console.log(err))

});

// List videos belonging to current logged in user
router.get('/Reciept', function (req, res) {
    title = 'Reciept'
    res.render('Checkout/Reciept', { title: title })
});

router.post('/checkout1', (req, res) => {
    let errors = [];

    let { Fname, Lname, EmailAdd, ADD, PhoneNumber, city, state, zip } = req.body;

    if (Fname < 0) {
        errors.push({ text: 'please fill up' });
    }
    if (Lname < 0) {
        errors.push({ text: 'please fill up' });
    }
    if (EmailAdd < 0) {
        errors.push({ text: 'please fill up' });
    }
    if (ADD < 0) {
        errors.push({ text: 'please fill up' });
    }
    // Checks that password length is more than 4
    if (PhoneNumber < 8) {
        errors.push({ text: 'Please enter correct phone number' });
    }
    if (zip < 0) {
        errors.push({ text: 'please fill in' });
    }
    if (city < 0) {
        errors.push({ text: 'please fill in' });
    }
    if (state < 0) {
        errors.push({ text: 'please fill in' });
    }
    if (errors.length > 0) {
        res.render('/Checkout/checkout1', {
            errors,
            Fname,
            Lname,
            PhoneNumber,
            zip,
            city,
            state
        });
    }
    else {
        res.redirect('/checkout2')
    }



});

router.post('/checkout1', (req, res) => {

    let Fname = req.body.Fname
    let Lname = req.body.Lname
   // let EXPD = moment(req.body.EXPD, 'MM');
    //let EXPYear = moment(req.body.EXPYear, 'YYYY');
    let EmailAdd = req.body.EmailAdd;
    let ADD = req.body.ADD;
    let PhoneNumber = req.body.PhoneNumber;
    let city = req.body.city;
    let state = req.body.state;
    let zip = req.body.zip;
    //let CardType = req.body.CardType;
    // let CardNumber = req.body.CardNumber;
    /// let NameOnC = req.body.NameOnC;
    // let SECNO = req.body.SECNO;

    checkout.create({
       Fname,
       Lname,
       EmailAdd,
       ADD,
       PhoneNumber,
       city,
       state,
       zip
    }).then(checkouts => {
        res.redirect('/Reciept');
    })
        .catch(err => console.log(err))

});

router.post('/checkout1', (req, res) => { });


router.post('/checkout3', (req, res) => { });

router.get('/Reciept', (req, res) => { });
module.exports = router;
const express = require('express');
const router = express.Router();
const checkout = require('../models/checkout');
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

router.post('/checkout1', (req, res) => {
    let errors = [];
    let { Fname , Lname , EmailAdd , ADD, PhoneNumber } = req.body;

    if (PhoneNumebr.length < 8) {
        errors.push({
            text: 'phone Number must be 8 numbers long'
        })
    }
});
router.post('/checkout2', (req, res) => {});

router.post('/checkout3', (req, res) => {
});

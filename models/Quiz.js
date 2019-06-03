const Sequelize = require('sequelize');
const db = require('../config/DBConfig');
const Shop = db.define('Quiz', {
    question: {
        type: Sequelize.STRING
    },
    option1: {
        type: Sequelize.STRING
    },
    option2: {
        type: Sequelize.FLOAT
    },
    option3:{
        type: Sequelize.STRING
    },
    option4:{
        type: Sequelize.STRING
    },
    correct:{
        type: Sequelize.STRING
    },
});
module.exports = Shop;
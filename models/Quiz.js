const Sequelize = require('sequelize');
const db = require('../config/DBConfig');
const Quiz = db.define('Quiz', {
    question: {
        type: Sequelize.STRING
    },
    option1: {
        type: Sequelize.STRING
    },
    option2: {
        type: Sequelize.STRING
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
module.exports = Quiz;
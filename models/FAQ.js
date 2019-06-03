const Sequelize = require('sequelize');
const db = require('../config/DBConfig');
const faq = db.define('faq', {
    questions: {
        type: Sequelize.STRING
    },
    answers: {
        type: Sequelize.STRING
    },

});
module.exports = faq;
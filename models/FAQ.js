const Sequelize = require('sequelize');
const db = require('../config/DBConfig');
const faq = db.define('faq', {
    qns: {
        type: Sequelize.STRING
    },
    answers: {
        type: Sequelize.STRING
    },

});
module.exports = faq;
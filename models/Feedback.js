const Sequelize = require('sequelize');
const db = require('../config/DBConfig');
const Feedback = db.define('feedback', {
    message: {
        type: Sequelize.STRING
    },
    name: {
        type: Sequelize.STRING
    },
    email: {
        type: Sequelize.STRING
    }
});

module.exports = Feedback;
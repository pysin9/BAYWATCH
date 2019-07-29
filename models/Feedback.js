const Sequelize = require('sequelize');
const db = require('../config/DBConfig');
const Feedback = db.define('feedback', {
    qns: {
        type: Sequelize.STRING
    },
    ans: {
        type: Sequelize.STRING
    }
});
module.exports = Feedback;
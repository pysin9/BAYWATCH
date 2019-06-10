const Sequelize = require('sequelize');
const db = require('../config/DBConfig');
const QnA = db.define('qna', {
    qns: {
        type: Sequelize.STRING
    },
    answers: {
        type: Sequelize.STRING
    }
});
module.exports = QnA;
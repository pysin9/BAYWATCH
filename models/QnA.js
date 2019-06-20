const Sequelize = require('sequelize');
const db = require('../config/DBConfig');
const QnA = db.define('qna', {
    qns: {
        type: Sequelize.STRING
    },
    ans: {
        type: Sequelize.STRING
    }
});
module.exports = QnA;
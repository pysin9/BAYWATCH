const Sequelize = require('sequelize');
const db = require('../config/DBConfig');
const User = db.define('user', {
    name: {
        type: Sequelize.STRING
    },
    email: {
        type: Sequelize.STRING
    },
    password: {
        type: Sequelize.STRING
    },
    address:{
        type: Sequelize.STRING
    },
    phone:{
        type: Sequelize.INTEGER(8)
    },
    bankName:{
        type: Sequelize.STRING
    },
    bankNo: {
        type: Sequelize.INTEGER
    },
    points:{
        type: Sequelize.INTEGER,
        defaultValue: 0
    },
    quizcompleted:{
        type: Sequelize.STRING,
    },
    signin:{
        type: Sequelize.STRING
    },
    isAdmin:{
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    isNotAdmin: {
        type: Sequelize.BOOLEAN,
        allowNull: false, 
        defaultValue: true
    },
    verified:{
        type: Sequelize.BOOLEAN,
        defaultValue: false
    }
});
module.exports = User;
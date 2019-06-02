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
    }
});
module.exports = User;
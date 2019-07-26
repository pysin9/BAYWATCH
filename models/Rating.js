const Sequelize = require('sequelize');
const db = require('../config/DBConfig');
const Rating = db.define('Rating', {
    username: {
        type: Sequelize.STRING
    },
    rating:{
        type: Sequelize.STRING
    },
    date: {
       type: Sequelize.STRING 
    }
});
module.exports = Rating;
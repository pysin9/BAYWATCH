const Sequelize = require('sequelize');
const db = require('../config/DBConfig');
const Category = db.define('category', {
    catName: {
        type: Sequelize.STRING
    },
    catType: {
        type: Sequelize.STRING
    },
});
module.exports = Shop;
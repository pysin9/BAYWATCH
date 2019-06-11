const Sequelize = require('sequelize');
const db = require('../config/DBConfig');
const Shop = db.define('shop', {
    images: {
        type: Sequelize.BLOB('long')
    },
    name: {
        type: Sequelize.STRING
    },
    price: {
        type: Sequelize.DECIMAL
    },
    description:{
        type: Sequelize.STRING
    },
});
module.exports = Shop;
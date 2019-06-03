const Sequelize = require('sequelize');
const db = require('../config/DBConfig');
const Shop = db.define('shop', {
    image: {
        type: Sequelize.BLOB('long')
    },
    name: {
        type: Sequelize.STRING
    },
    price: {
        type: Sequelize.FLOAT
    },
    description:{
        type: Sequelize.STRING
    },
});
module.exports = Shop;
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
    category:{
        type: Sequelize.STRING
    },
    avgrating: {
        type: Sequelize.DECIMAL(10,2),
        allowNull: false,
        defaultValue: '0.00'
    }
});
module.exports = Shop;
const Sequelize = require('sequelize');
const db = require('../config/DBConfig');
const Cart = db.define('cart', {
    images: {
        type: Sequelize.BLOB('long')
    },
    name: {
        type: Sequelize.STRING
    },
    description:{
        type: Sequelize.STRING
    },
    price: {
        type: Sequelize.FLOAT
    },
    quantity: {
        type: Sequelize.INTEGER
    },
    itemId: {
        type: Sequelize.INTEGER
    }
});
module.exports = Cart;
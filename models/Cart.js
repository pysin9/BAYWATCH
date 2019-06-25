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
    total: {
        type: Sequelize.DECIMAL
    },
    subtotal: {
        type: Sequelize.DECIMAL
    },
    shipping: {
        type: Sequelize.DECIMAL
    },
    grandTotal: {
        type: Sequelize.DECIMAL
    },
});
module.exports = Cart;
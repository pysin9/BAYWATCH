const Sequelize = require('sequelize');
const db = require('../config/DBConfig');
const Checkout = db.define('checkout', {
    Firstname: {
        type: Sequelize.STRING
    },
    LastName:{
        type: Sequelize.STRING
    },
    Email: {
        type: Sequelize.STRING
    },
    Address:{
        type: Sequelize.STRING
    },
    PhoneNumber:{
        type: Sequelize.INTEGER(8)
    },
    City:{
        type: Sequelize.STRING
    },
    State: {
        type: Sequelize.INTEGER
    },
    zip:{
        type: Sequelize.INTEGER(6),
    },
    CardType: {
        type: Sequelize.INTEGER
    },
    CardNumber: {
        type: Sequelize.INTEGER
    },
    NameOnC: {
        type: Sequelize.STRING
    },
    EXPD: {
        type: Sequelize.INTEGER(2)
    },
    ExpYear: {
        type: Sequelize.INTEGER(2)
    },
    SECNO: {
        type: Sequelize.INTEGER
    }
   
});
module.exports = Checkout;
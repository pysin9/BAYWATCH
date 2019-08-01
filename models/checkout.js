const Sequelize = require('sequelize');
const db = require('../config/DBConfig');
const Checkout = db.define('checkout', {
    Fname: {
        type: Sequelize.STRING
    },
    Lname:{
        type: Sequelize.STRING
    },
    EmailAdd: {
        type: Sequelize.STRING
    },
    ADD:{
        type: Sequelize.STRING
    },
    PhoneNumber:{
        type: Sequelize.INTEGER(8)
    },
    city:{
        type: Sequelize.STRING
    },
    state: {
        type: Sequelize.INTEGER
    },
    zip:{
        type: Sequelize.INTEGER(6)
    },
    CardType: {
        type: Sequelize.STRING
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
    EXPYear: {
        type: Sequelize.INTEGER(2)
    },
    SECNO: {
        type: Sequelize.INTEGER
    }
   
});
module.exports = Checkout;
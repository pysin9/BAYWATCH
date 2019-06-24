const Sequelize = require('sequelize');
const db = require('../config/DBConfig');
const Category = db.define('category', {
    fruits: {
        type: Sequelize.STRING
    },
    herbs: {
        type: Sequelize.STRING
    },
    vegetables: {
        type: Sequelize.STRING
    },
    milk:{
        type: Sequelize.STRING
    },
    yogurt:{
        type: Sequelize.STRING
    },
    butter:{
        type: Sequelize.STRING
    },
    cheese:{
        type: Sequelize.STRING
    },
    juice:{
        type: Sequelize.STRING
    },
    soy:{
        type: Sequelize.STRING
    },
    tea:{
        type: Sequelize.STRING
    },
    chicken:{
        type: Sequelize.STRING
    },
    pork:{
        type: Sequelize.STRING
    },
    beef:{
        type: Sequelize.STRING
    },
    fish:{
        type: Sequelize.STRING
    },
    personal:{
        type: Sequelize.STRING
    },
    healing:{
        type: Sequelize.STRING
    },
    supplements:{
        type: Sequelize.STRING
    },
    crackers:{
        type: Sequelize.STRING
    },
    nuts:{
        type: Sequelize.STRING
    },
    candy:{
        type: Sequelize.STRING
    },
    energy:{
        type: Sequelize.STRING
    },
});
module.exports = Shop;
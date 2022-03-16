const Sequelize = require('sequelize');
const config = new Sequelize("miniproject_1", "bobby", "password", {dialect: 'mysql'});

module.exports = config;


const Sequelize = require('sequelize');
const config = require('./../config');

const Student = config.define('Student', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    section: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    gpa: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    nationality: {
        type: Sequelize.STRING,
        allowNull: false
    }
}, {timestamps: false});

module.exports = Student;

"use strict";
/* -------------------------------------------------------
    EXPRESSJS - TODO Project with Sequelize
------------------------------------------------------- */

//? Sequelize

const { Sequelize, DataTypes } = require('sequelize');

// Where is DB (DB Connnection Detail)
const sequelize = new Sequelize('sqlite:./db.sqlite3');

//* Model:
// sequelize.define('tableName', {columns})
const Todo = sequelize.define('todos', {

    title: {
        type: DataTypes.STRING(256), // varchar(256)
        allowNull: false
    },

    description: DataTypes.TEXT, // Shorthand using

    priority: { // -1:Low, 0:Normal, 1:High
        type: DataTypes.SMALLINT,
        allowNull: false,
        defaultValue: 0
    },

    isDone: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },

    // newField: DataTypes.TEXT

    // No need define createdAt & updatedAt fields. They are default created.

});

//* Synchorization: // This methods should run only once.
// sequelize.sync() // Create table
// sequelize.sync({ force: true }) // Drop Table & Create Table
// sequelize.sync({ alter: true }) // Backup from pervios table & Drop Table & Create Table from backup

//* DB Connection:
sequelize.authenticate()
    .then(() => console.log('* DB Connected *'))
    .catch(() => console.log('! DB Not Connected !'));

module.exports = Todo
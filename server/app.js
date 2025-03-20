"use strict";
/* -------------------------------------------------------
    EXPRESSJS - TODO Project with Sequelize
------------------------------------------------------- */

/* 
 * npm init -y
 * npm i express dotenv express-async-errors
 * echo PORT=8000 > .env
 * npm i sequelize sqlite3
*/

const express = require("express");
const app = express();

require("dotenv").config();
const PORT = process.env.PORT || 8000;

/* ------------------------------------------------------- */
// Accept json data:
app.use(express.json());

// Catch async-errors:
require('express-async-errors');

const cors = require('cors');
// const defatulCorsOptions = {
//     "origin": "*",
//     "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
//     "preflightContinue": false,
//     "optionsSuccessStatus": 204
// }
app.use(cors());

/* ------------------------------------------------------- */
// Routes

app.all('/', (req, res) => {
    res.send('WELCOME TO TODO API')
})

app.use(require('./routes/todo.router'));
/* ------------------------------------------------------- */
// ErrorHandler;
app.use(require('./middlewares/errorHandler'));
/* ------------------------------------------------------- */
app.listen(PORT, () => console.log("Running: http://127.0.0.1:" + PORT));
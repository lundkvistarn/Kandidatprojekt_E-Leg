'use strict';
var http = require('http');
var port = process.env.PORT || 1337;
var mysql = require('mysql');
const express = require("express");
const { request } = require('express');
const dotenv = require('dotenv');
const path = require('path');
const cookieParser = require('cookie-parser');

dotenv.config({ path: './.env' });

const app = express();

const db = mysql.createConnection({
    host: process.env.DATABAS_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

const publicDirectory = path.join(__dirname, './public'); //define where all public directory is - AL
app.use(express.static(publicDirectory)); //säger åt server att använda publicdirextory - AL

//parse URL-encoded bodies (as sent by HTML forms) - AL
app.use(express.urlencoded({ extended: false }));
//parse JSON bodies (as sent byt API clients) - AL
app.use(express.json());
//initialize cookieparser så vi kan använda cookies i browsern - AL
app.use(cookieParser());

app.set('view engine', 'hbs');




db.connect(function (err) {
    if (err) {
        return console.error('error: ' + err.message);
    }
    console.log('Connected to the MySQL server.');

    //connection.query("CREATE DATABASE mydb", function (err, result) {
    //    if (err) throw err;
    //    console.log("Database created");
    //});

    //var sql = "CREATE TABLE users (id int primary key auto_increment, email VARCHAR(255), name VARCHAR(255), password VARCHAR(255))";
    //db.query(sql, function (err, result) {
    //    if (err) throw err;
    //    console.log("Table created");
    //});

    //var sql = "INSERT INTO customers (username, password) VALUES ?";
    //var values = [
    //    ['Anders', 'Highway71'],
    //    ['Erik', 'Lowstreet4'],
    //    ['Carl', 'Applest52'],
    //    ['Ludde', 'Mountain21'],
    //    ['Richard', 'Valley345'],
    //    ['Linnea', 'Oceanblvd2'],
    //    ['Moa', 'greenGrass1']
    //];
    //connection.query(sql, [values], function (err, result) { 
    //    if (err) throw err;
    //    console.log("Number of records inserted: " + result.affectedRows);
    //})
});

//Define routes
//Varje gång man använder / går den in i pages.js och kollar om det finns en sådan route - AL
app.use('/', require('./routes/pages'));

//varje gång /auth används går den in i auth  - AL
app.use('/auth', require('./routes/auth'));

app.listen(port, () => {
    console.log("server started on port 1337");
});
"use strict";
var http = require("http");
var port = process.env.PORT || 1337;
var mysql = require("mysql");
const express = require("express");
const { request } = require("express");
const dotenv = require("dotenv");
const path = require("path");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");

dotenv.config({ path: "./.env" });

const app = express();

const db = mysql.createConnection({
  host: process.env.DATABAS_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE,
  port: process.env.DATABASE_PORT,
});

const publicDirectory = path.join(__dirname, "./public"); //define where all public directory is - AL
app.use(express.static(publicDirectory)); //s�ger �t server att anv�nda publicdirextory - AL

//parse URL-encoded bodies (as sent by HTML forms), vi kan anv�nda det user skriver i forms i req - AL
app.use(express.urlencoded({ extended: false }));
//parse JSON bodies (as sent byt API clients) - AL
app.use(express.json());
//initialize cookieparser s� vi kan anv�nda cookies i browsern - AL
app.use(cookieParser());

app.use(fileUpload());

app.set("view engine", "hbs");

db.connect(function (err) {
  if (err) {
    return console.error("error: " + err.message);
  }
  console.log("Connected to the MySQL server.");
});

//Define routes
//Varje g�ng man anv�nder / g�r den in i pages.js och kollar om det finns en s�dan route - AL
app.use("/", require("./routes/pages"));

//varje g�ng /auth anv�nds g�r den in i auth  - AL
app.use("/auth", require("./routes/auth"));

app.listen(port, () => {
  console.log("server started on port 1337");
});

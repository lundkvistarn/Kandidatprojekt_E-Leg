var mysql = require('mysql');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const db = mysql.createConnection({
    host: process.env.DATABAS_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});


exports.profile = (req, res) => {

    let token = req.cookie.jwt
    

    //om det inte finns en token stored som cookie är usern unauthorized
    if (!token) {
        return res.status(403).send()
    }

    let payload

    try {

        payload = jwt.verify(token, process.env.JWT_SECRET)
        next()

    } catch (e) {
        return re.status(401).send()
    }
}
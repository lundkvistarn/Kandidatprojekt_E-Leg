//denna fil innehåller alla routes så dem inte finns i server.js filen - AL

const express = require('express');

const router = express.Router();

//när man går till startsidan renderas index.hbs - AL
router.get('/', (req, res) => {
    res.render('index');
});

//när man går till register sidan renderas register.hbs - AL
router.get('/register', (req, res) => { 
    res.render('register');
});

//när man går till register sidan renderas login.hbs - AL
router.get('/login', (req, res) => {
    res.render('login');
});

module.exports = router; //exportar router - AL
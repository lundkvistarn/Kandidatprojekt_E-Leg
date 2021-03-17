//denna fil innehåller alla routes så dem inte finns i server.js filen - AL

const express = require('express');

const authController = require('../controllers/auth');

const router = express.Router();



//när man går till startsidan renderas index.hbs - AL
router.get('/', authController.isLoggedIn, (req, res) => {
    res.render('index', {
        user: req.user //skickar varibeln user så den kan användas i index.hbs ifall någon är inloggad - AL
    });
});

//när man går till register sidan renderas register.hbs - AL
router.get('/register', (req, res) => { 
    res.render('register');
});

//när man går till login sidan renderas login.hbs - AL
router.get('/login', (req, res) => {
    res.render('login');
});

//när man går till profile sidan renderas profile.hbs om funktionen isLoggedIn godkänner - AL
router.get('/profile', authController.isLoggedIn, (req, res) => {

    //Om någon försöker gå in på profile page utan en token blir den redirectad till login sidan - AL
    if (req.user) {
        res.render('profile', {
            user: req.user //skickar varibeln user så den kan användas i profile.hbs - AL
        });
    } else {
        res.redirect('/login');
    }
    
});

module.exports = router; //exportar router - AL
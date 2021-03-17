const express = require('express');
const authController = require('../controllers/auth');

const verify = require('../middleware');
//router.use('/profile', verify, router);

const router = express.Router();

//när register formen submittas datan - AL
router.post('/register', authController.register) //när någon klickar på register körs funktionen register i auth.js - AL

router.post('/login', authController.login); //när någon klickar på login körs funktionen login i auth.js - AL

router.get('/logout', authController.logout); //när någon klickar på logut körs funktionen logout i auth.js - AL

module.exports = router; //exportar router - AL
const express = require('express');
const authController = require('../controllers/auth');

const router = express.Router();

//n�r register formen submittas datan - AL
router.post('/register', authController.register) //n�r n�gon klickar p� register k�rs funktionen register i auth.js - AL

router.post('/login', authController.login); //n�r n�gon klickar p� login k�rs funktionen login i auth.js - AL

router.get('/logout', authController.logout); //n�r n�gon klickar p� logut k�rs funktionen logout i auth.js - AL

router.post('/changePassword', authController.changePassword); //n�r n�gon klickar p� byta lösenord k�rs funktionen logout i auth.js - AL

//router.get('/confirm_request', authController.confirm_request); //n�r n�gon klickar p� logut k�rs funktionen logout i auth.js - AL

//router.get('/activeleg', authController.confirm_request);

router.post('/new_request', authController.new_request);

router.post("/addInfo", authController.addInfo); //n�r n�gon klickar p� register k�rs funktionen register i auth.js - AL

//router.post('/updateAcc', authController.updateAcc);

module.exports = router; //exportar router - AL
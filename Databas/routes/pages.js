//denna fil inneh�ller alla routes s� dem inte finns i server.js filen - AL

const express = require('express');

const authController = require('../controllers/auth');

const router = express.Router();



//n�r man g�r till startsidan renderas index.hbs - AL
router.get('/', authController.isLoggedIn, (req, res) => {
    res.render('index', {
        user: req.user //skickar varibeln user s� den kan anv�ndas i index.hbs ifall n�gon �r inloggad - AL
    });
});

//n�r man g�r till register sidan renderas register.hbs - AL
router.get('/register', (req, res) => { 
    res.render('register');
});

//n�r man g�r till login sidan renderas login.hbs - AL
router.get('/login', (req, res) => {
    res.render('login');
});

//n�r man g�r till profile sidan renderas profile.hbs om funktionen isLoggedIn godk�nner - AL
router.get('/profile', authController.isLoggedIn, (req, res) => {

    //Om n�gon f�rs�ker g� in p� profile page utan en token blir den redirectad till login sidan - AL
    if (req.user) {
        res.render('profile', {
            user: req.user //skickar varibeln user s� den kan anv�ndas i profile.hbs - AL
        });
    } else {
        res.redirect('/login');
    }
    
});

//n�r man g�r till profile sidan renderas profile.hbs om funktionen isLoggedIn godk�nner - AL
router.get('/settings', authController.isLoggedIn, (req, res) => {

    //Om n�gon f�rs�ker g� in p� profile page utan en token blir den redirectad till login sidan - AL
    if (req.user) {
        res.render('settings', {
            user: req.user //skickar varibeln user s� den kan anv�ndas i profile.hbs - AL
        });
    } else {
        res.redirect('/login');
    }
    
});

//n�r man g�r till profile sidan renderas profile.hbs om funktionen isLoggedIn godk�nner - AL
router.get('/changepassword', authController.isLoggedIn, (req, res) => {

    //Om n�gon f�rs�ker g� in p� profile page utan en token blir den redirectad till login sidan - AL
    if (req.user) {
        res.render('changepassword', {
            user: req.user //skickar varibeln user s� den kan anv�ndas i profile.hbs - AL
        });
    } else {
        res.redirect('/login');
    }
    
});

//n�r man g�r till profile sidan renderas profile.hbs om funktionen isLoggedIn godk�nner - AL
router.get('/activeleg', authController.isLoggedIn, (req, res) => {

    //Om n�gon f�rs�ker g� in p� profile page utan en token blir den redirectad till login sidan - AL
    if (req.user) {
        res.render('activeleg', {
            user: req.user //skickar varibeln user s� den kan anv�ndas i profile.hbs - AL
        });
    } else {
        res.redirect('/login');
    }
    
});

//n�r man g�r till profile sidan renderas profile.hbs om funktionen isLoggedIn godk�nner - AL
router.get('/new_request', authController.isLoggedIn, (req, res) => {

    //Om n�gon f�rs�ker g� in p� profile page utan en token blir den redirectad till login sidan - AL
    if (req.user) {
        res.render('new_request', {
            user: req.user //skickar varibeln user s� den kan anv�ndas i profile.hbs - AL
        });
    } else {
        res.redirect('/login');
    }
    
});

//n�r man g�r till profile sidan renderas profile.hbs om funktionen isLoggedIn godk�nner - AL
router.get('/request_sent', authController.isLoggedIn, (req, res) => {

    //Om n�gon f�rs�ker g� in p� profile page utan en token blir den redirectad till login sidan - AL
    if (req.user) {
        res.render('request_sent', {
            user: req.user //skickar varibeln user s� den kan anv�ndas i profile.hbs - AL
        });
    } else {
        res.redirect('/login');
    }
    
});

//n�r man g�r till profile sidan renderas profile.hbs om funktionen isLoggedIn godk�nner - AL
router.get('/about_us', authController.isLoggedIn, (req, res) => {

    //Om n�gon f�rs�ker g� in p� profile page utan en token blir den redirectad till login sidan - AL
    if (req.user) {
        res.render('about_us', {
            user: req.user //skickar varibeln user s� den kan anv�ndas i profile.hbs - AL
        });
    } else {
        res.redirect('/login');
    }
    
});


//n�r man g�r till profile sidan renderas profile.hbs om funktionen isLoggedIn godk�nner - AL
router.get('/security', authController.isLoggedIn, (req, res) => {

    //Om n�gon f�rs�ker g� in p� profile page utan en token blir den redirectad till login sidan - AL
    if (req.user) {
        res.render('security', {
            user: req.user //skickar varibeln user s� den kan anv�ndas i profile.hbs - AL
        });
    } else {
        res.redirect('/login');
    }
    
});
//n�r man g�r till profile sidan renderas profile.hbs om funktionen isLoggedIn godk�nner - AL
router.get('/contact', authController.isLoggedIn, (req, res) => {

    //Om n�gon f�rs�ker g� in p� profile page utan en token blir den redirectad till login sidan - AL
    if (req.user) {
        res.render('contact', {
            user: req.user //skickar varibeln user s� den kan anv�ndas i profile.hbs - AL
        });
    } else {
        res.redirect('/login');
    }
    
});

//n�r man g�r till profile sidan renderas profile.hbs om funktionen isLoggedIn godk�nner - AL
router.get('/confirm_request', authController.isLoggedIn, (req, res) => {

    //Om n�gon f�rs�ker g� in p� profile page utan en token blir den redirectad till login sidan - AL
    if (req.user) {
        res.render('confirm_request', {
            user: req.user //skickar varibeln user s� den kan anv�ndas i profile.hbs - AL
        });
    } else {
        res.redirect('/login');
    }
    
});

//n�r man g�r till profile sidan renderas profile.hbs om funktionen isLoggedIn godk�nner - AL
router.get('/safetylevel', authController.isLoggedIn, (req, res) => {

    //Om n�gon f�rs�ker g� in p� profile page utan en token blir den redirectad till login sidan - AL
    if (req.user) {
        res.render('safetylevel', {
            user: req.user //skickar varibeln user s� den kan anv�ndas i profile.hbs - AL
        });
    } else {
        res.redirect('/login');
    }
    
});

//n�r man g�r till profile sidan renderas profile.hbs om funktionen isLoggedIn godk�nner - AL
router.get('/account', authController.isLoggedIn, (req, res) => {

    //Om n�gon f�rs�ker g� in p� profile page utan en token blir den redirectad till login sidan - AL
    if (req.user) {
        res.render('account', {
            user: req.user //skickar varibeln user s� den kan anv�ndas i profile.hbs - AL
        });
    } else {
        res.redirect('/login');
    }
    
});

//n�r man g�r till profile sidan renderas profile.hbs om funktionen isLoggedIn godk�nner - AL
router.get('/addInfo', authController.isLoggedIn, (req, res) => {

  //Om n�gon f�rs�ker g� in p� profile page utan en token blir den redirectad till login sidan - AL
  if (req.user) {
      res.render('addInfo', {
          user: req.user //skickar varibeln user s� den kan anv�ndas i profile.hbs - AL
      });
  } else {
      res.redirect('/login');
  }
  
});

router.get('/updateAcc', authController.isLoggedIn, (req, res) => {

    //Om n�gon f�rs�ker g� in p� profile page utan en token blir den redirectad till login sidan - AL
    if (req.user) {
        res.render('updateAcc', {
            user: req.user //skickar varibeln user s� den kan anv�ndas i profile.hbs - AL
        });
    } else {
        res.redirect('/login');
    }
    
});



module.exports = router; //exportar router - AL
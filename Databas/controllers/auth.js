var mysql = require('mysql');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { promisify } = require('util');

//connectar till databasen
const db = mysql.createConnection({
    host: process.env.DATABAS_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE,
    port: process.env.DATABASE_PORT
});


exports.login = async (req, res) => {
    try {

        const { email, password } = req.body;

        if (!email || !password) { //om emailen eller passwordet �r "olagliga" eller rutorna �r tomma - AL
            return res.status(400).render('login', {
                message: 'Please provide an email and password'
            })
        }

        db.query('SELECT * FROM users WHERE email = ?', [email], async (error, results) => { //query f�r att f� emailen - AL
            console.log(results);

            if (!results || !(await bcrypt.compare(password, results[0].password))) { //om mailen inte finns eller l�senordet �r fel - AL
                res.status(401).render('login', {
                    message: 'Email or password is incorrect'
                })
                
            }
            else {
                const id = results[0].id;

                //create token for personal id - AL
                const token = jwt.sign({ id: id }, process.env.JWT_SECRET, { 
                   expiresIn: process.env.JWT_EXPIRES_IN
                });
                console.log("The token is: " + token);

                //options f�r cookien
                const cookieOptions = {
                    expires: new Date(
                        Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60* 60* 1000
                    ),
                    httpOnly: true //kan bara ge cookie om usern �r inne p� en http sida - AL
                }
                //skickar token till client som en cookie
                res.cookie('jwt', token, cookieOptions);
                res.status(200).redirect("/profile");
            }
            

        })
    } catch (error) {
        console.log(error);
    }
}


exports.register = (req, res) => {
    console.log(req.body);


    //skapar variabler f�r varje ruta i register - AL
    const { name, email, password, passwordConfirm } = req.body;

    //mysql query f�r att f� email fr�n databasen, g�r �ven att en email bara kan skrivas in en g�ng och kollar ifall l�senorden st�mmer �verns med varandra - AL
    db.query('SELECT email FROM users WHERE email = ?', [email], async (error, results) => {
        if (error) {
            console.log(error);
        }

        if (results.length > 0) {
            return res.render('register', {
                message: 'That email is already in use'
            })
        } else if (password !== passwordConfirm) {
            return res.render('register', {
                message: 'The passwords do not match'
            })
        }

        //encryptar l�senorden med becryptjs och hashing - AL
        let hashedPassword = await bcrypt.hash(password, 8);
        console.log(hashedPassword);

        //skickar in namn, email och encryptad l�senord till databasen - AL
        db.query('INSERT INTO users SET ?', { name: name, email: email, password: hashedPassword }, (error, results) => {
            if (error) {
                console.log(error);
            } else {
                console.log(results);
                return res.render('register', {
                    message: 'User registered'
                });
            }
        })
    });
}

exports.isLoggedIn = async (req, res, next) => {
    //console.log(req.cookies);

    //om det finns en cookie med namnet jwt - AL
    if (req.cookies.jwt) {
        try {
            //verify token
            const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET) //j�mf�r userns cookie med l�senordet vi anv�nde f�r att skapa token vi har sparat i env
            console.log(decoded);

            //check if the user still exists - AL
            db.query('SELECT * FROM users WHERE id = ?', [decoded.id], (error, result) => {
                console.log(result);

                //om det inte finns n�got resultat - AL
                if (!result) {
                    return next();
                }

                //skapar ny variabel user med all info om den inloggade usern - AL
                req.user = result[0];
                return next();
            });
        } catch (error) {
            console.log(error);
            return next();
        }
    } else { //om det inte finns en cookie g�r den vidare  - AL
        next();
    } 
}

//n�r anv�ndare klickar p� logout byts dens cookie till en cookie med value 'logout' som expirar efter 2 sekunder vilket leder till utloggning  - AL
exports.logout = async (req, res) => {
    res.cookie('jwt', 'logout', {
        expires: new Date(Date.now() + 2 * 1000),
        httpOnly: true //kan bara g�ras fr�n en http browser, skyddar mot attacker  - AL
    });

    res.status(200).redirect('/');
}

exports.legetimera = async (req, res) => {

    const { email } = req.body; //hämtar email från formuläret

        if (!email) { //om emailen �r "olagliga" eller rutorna �r tomma - AL
            return res.status(400).render('legitimera', {message: 'Please provide a valid email'})
        }

        db.query('SELECT email FROM users WHERE email = ?', [email], async (error, results) => { //query f�r att f� emailen - AL
            console.log(results);

            if (!results) { //om mailen inte finns eller l�senordet �r fel - AL
                console.log("Mejlen fanns inte");
                return res.render('legitimera', { message: 'No corresponding email found' })
                
            }
            else {
                console.log("Skickat");
                return res.render('legitimera', {message: 'Request sent'})
            }
            
        })

    //res.status(200).redirect('/legitimera');
}
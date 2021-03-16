var mysql = require('mysql');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

//connectar till databasen
const db = mysql.createConnection({
    host: process.env.DATABAS_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});


exports.login = async (req, res) => {
    try {

        const { email, password } = req.body;

        if (!email || !password) { //om emailen eller passwordet är "olagliga" eller rutorna är tomma - AL
            return res.status(400).render('login', {
                message: 'Please provide an email and password'
            })
        }

        db.query('SELECT * FROM users WHERE email = ?', [email], async (error, results) => { //query för att få emailen - AL
            console.log(results);

            if (!results || !(await bcrypt.compare(password, results[0].password))) { //om mailen inte finns eller lösenordet är fel - AL
                res.status(401).render('login', {
                    message: 'Email or password is incorrect'
                })
                
            }
            else {
                const id = results[0].id;

                //cookien får id - AL
                const token = jwt.sign({ id: id }, process.env.JWT_SECRET, {
                   expiresIn: process.env.JWT_EXPIRES_IN
                });
                console.log("The token is: " + token);

                const cookieOptions = {
                    expires: new Date(
                        Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60* 60* 1000
                    ),
                    httpOnly: true //kan bara ge cookie om usern är inne på en http sida - AL
                }
                res.cookie('jwt', token, cookieOptions);
                res.status(200).redirect("/");
            }
            

        })
    } catch (error) {
        console.log(error);
    }
}


exports.register = (req, res) => {
    console.log(req.body);


    //skapar variabler för varje ruta i register - AL
    const { name, email, password, passwordConfirm } = req.body;

    //mysql query för att få email från databasen, gör även att en email bara kan skrivas in en gång och kollar ifall lösenorden stämmer överns med varandra - AL
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

        //encryptar lösenorden med becryptjs och hashing - AL
        let hashedPassword = await bcrypt.hash(password, 8);
        console.log(hashedPassword);

        //skickar in namn, email och encryptad lösenord till databasen - AL
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
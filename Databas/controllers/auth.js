var mysql = require('mysql');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { promisify } = require('util');
const { nextTick } = require('process');
const path = require('path');


function readableDate(isostring) {
        
    const date = new Date(isostring) 
    const result = date.getDate() + '/' + (date.getMonth() + 1) + ' - ' + (date.getHours() + 2) + ':' + date.getMinutes()
    return result
}

async function getName(id)  {
        
    return new Promise ((resolve, reject) => {
        db.query("SELECT name FROM users WHERE ID=?", [id], (error, result) => {

            if (!result) { //om ingen matchning finns
               console.log("Inga matchningar.");
            }
        
        for (let i = 0; i < result.length; i++) {
            element = result[i].name;
        }
        
        //const sender = sendername.toString();
    
        //console.log()
        
        resolve(element)

        })
    })   
}

async function getSafety(id)  {
        
    return new Promise ((resolve, reject) => {
        db.query("SELECT safetylevel FROM users WHERE ID=?", [id], (error, result) => {

            if (!result) { //om ingen matchning finns
               console.log("Inga matchningar.");
            }
        
        for (let i = 0; i < result.length; i++) {
            element = result[i].safetylevel;
        }
        
        //const sender = sendername.toString();
    
        //console.log()
        
        resolve(element)

        })
    })   
}



//connectar till databasen
const db = mysql.createConnection({
    host: process.env.DATABAS_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE,
    port: process.env.DATABASE_PORT,
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

        //encryptar l�senorden med bcryptjs och hashing - AL
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

            db.query('SELECT * FROM requests WHERE receiverID = ?', [decoded.id], async (error, result) => {
                console.log(result);

                if (!result) { //om mailen inte finns eller l�senordet �r fel - AL
                    console.log("Inga requests.");        
                }

                var thisManys = 0;
                var thisMany = 0;
                thisMany += thisManys + result.length;
                
                //this.decline(results[0]); 
                //this.accept(results[0]);     
                //this.removeOldRequests(results[0])  

                const setItem = async (item) => {
                    item.senderName = await getName(item.senderID);
                    item.datum = readableDate(item.datum)  
                    item.senderSafety = await getSafety(item.senderID);
                    //item.howmanySender = await getHowMany(item.senderID);
                    item.howmanySender = thisMany;
                    return item
                }

                const unresolved = result.map((request)=>{ 
                    return setItem(request)
                })

                req.lego = await Promise.all(unresolved)
                console.log('resolving...')
                // console.log(req.lego)
                

                /*

                req.lego = result.map((request)=>{ 
                    //request.senderName = IDtoname(request.senderID);
                    request.senderName = 'fo' // <----------------- Här ska en funktion finnas = nameOfID(request.senderID)
                    request.datum = readableDate(request.datum)
                    return request
                });

                */
            });

            db.query('SELECT * FROM requests WHERE senderID = ?', [decoded.id], async (error, result) => {
                console.log(result);

                if (!result) { //om mailen inte finns eller l�senordet �r fel - AL
                    console.log("Du har inte skickat några requests.");        
                }


                var thisManys = 0;
                var thisMany = 0;
                thisMany += thisManys + result.length;
            

                const setItem = async (item) => {
                    item.receiverName = await getName(item.receiverID);
                    console.log("recname" + item.receiverName)
                    item.datum = readableDate(item.datum)  
                    item.receiverSafety = await getSafety(item.senderID);
                    item.howmanyReceiver = thisMany;
                    return item
                }

                const unresolved = result.map((request)=>{ 
                    return setItem(request)
                })

                req.rec = await Promise.all(unresolved)
                console.log(req)
            
            });

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

exports.confirm_request = async (req, res) => { //mottagare ser sina inkommande requests o kan svara ja/nej
    console.log("Visiting your requests page.");
    
            if (req.cookies.jwt) {
                try {
                    const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET)
                    db.query('SELECT * FROM requests WHERE receiverID = ?', [decoded.id], (error, results) => {
                        if (error) {
                            console.log(error);
                        } 
                        if (results.length<1) { //om mailen inte finns eller l�senordet �r fel - AL
                            console.log("Inga requests.");           
                        }
                        else {
                            console.log("You have pending reuests.");
                            console.log(results);
                            //this.decline(results[0]); 
                            //this.accept(results[0]);     
                            //this.removeOldRequests(results[0])     
                            req.lego = results[1];
                            
                            //res.render('confirm_request', {
                               
                            //});

                            //return next(); 
                        }
                    })
        
                } catch (error) {
                    console.log(error);
                }
            } 
            console.log("Done checking request table.");  
}

//n�r anv�ndare klickar p� logout byts dens cookie till en cookie med value 'logout' som expirar efter 2 sekunder vilket leder till utloggning  - AL
exports.logout = async (req, res) => {
    res.cookie('jwt', 'logout', {
        expires: new Date(Date.now() + 2 * 1000),
        httpOnly: true //kan bara g�ras fr�n en http browser, skyddar mot attacker  - AL
    });

    res.status(200).redirect('/');
}

exports.changePassword = async (req, res) => {

    try {

        const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET) //j�mf�r userns cookie med l�senordet vi anv�nde f�r att skapa token vi har sparat i env
        console.log(decoded);
        console.log(req.body);
        
        //skapar variabler f�r varje ruta i register - AL
        const { password, newpassword, passwordConfirm } = req.body;

        if (!password || !newpassword || !passwordConfirm) { //om emailen eller passwordet �r "olagliga" eller rutorna �r tomma - AL
            return res.status(400).render('profile', {
                message: 'Please enter all fields'
            })
        }
    
        //mysql query f�r att f� email fr�n databasen, g�r �ven att en email bara kan skrivas in en g�ng och kollar ifall l�senorden st�mmer �verns med varandra - AL
        db.query('SELECT password FROM users WHERE id = ?', [decoded.id], async (error, results) => {
            if (error) {
                console.log(error);
            }
    
            if (!(await bcrypt.compare(password, results[0].password))) {
                return res.render('profile', {
                    message: 'The current password is incorrect'
                })
            } else if (newpassword !== passwordConfirm) {
                return res.render('profile', {
                    message: 'The passwords do not match'
                })
            }
    
            //encryptar l�senorden med becryptjs och hashing - AL
            let hashedPassword = await bcrypt.hash(newpassword, 8);
            console.log(hashedPassword);
    
            var insertQuery = "UPDATE `users` SET `password` = '" + hashedPassword + "' WHERE ID = " + decoded.id + ";"
            //skickar in namn, email och encryptad l�senord till databasen - AL
            db.query(insertQuery,  (error, results) => {
                if (error) {
                    console.log(error);
                } else {
                    console.log(results);
                    return res.render('profile', {
                        message: 'Password changed'
                    });
                }
            })
        });
    } catch (error) {
        console.log(error);
    }
}

 

exports.new_request = async (req, res) => { //avsändare

    const { email } = req.body; //hämtar email från formuläret

        if (!email) { //om emailen �r "olagliga" eller rutorna �r tomma - AL
            return res.status(400).render('new_request', {message: 'Please provide a valid email'})
        }

        db.query('SELECT id FROM users WHERE email = ?', [email], async (error, results) => { //query f�r att f� emailen - AL
            console.log(results);

            if (results.length<1) { //om mailen inte finns eller l�senordet �r fel - AL
                console.log("Mejlen fanns inte");
                return res.render('new_request', { message: 'No corresponding email found' })
                
            }
            else {
                if (req.cookies.jwt) {
                    try {
                        const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET)
                        db.query('INSERT INTO requests SET ?', { senderID: [decoded.id], receiverID: results[0].id}, (error, results) => {
                            if (error) {
                                console.log(error);
                            } else {
                                
                                console.log("success");         
                            }
                        })
            
                    } catch (error) {
                        console.log(error);
                    }
                } 
                
                console.log("Skickat");
                res.redirect('/request_sent');
                //this.sendRequest(result); //skickar request till den användaren som hittades
                //return res.render('legitimera', {message: 'Request sent'})
            }
            
        })


        // db.query('SHOW TABLES', async (error, results) => { console.log(results);})


    //res.status(200).redirect('/legitimera');pkill -f node
};

exports.addInfo = async (req, res) => {
  const decoded = await promisify(jwt.verify)(
    req.cookies.jwt,
    process.env.JWT_SECRET
  ); //j�mf�r userns cookie med l�senordet vi anv�nde f�r att skapa token vi har sparat i env
  console.log(decoded);

  //skapar variabler f�r varje ruta i register - AL
  const { personID, address } = req.body;

  //mysql query f�r att f� email fr�n databasen, g�r �ven att en email bara kan skrivas in en g�ng och kollar ifall l�senorden st�mmer �verns med varandra - AL
  db.query(
    "SELECT personid FROM users WHERE personid = ?",
    [personID],
    async (error, results) => {
      if (error) {
        console.log(error);
      }

      if (results.length > 0) {
        return res.render("profile", {
          message: "That person-ID is already in use",
        });
      } else if (!address) {
        //om addressen �r "olagliga" eller rutorna �r tomma - AL
        return res.status(400).render("profile", {
          message: "Please enter a address",
        });
      } else if (!personID) {
        //om personnummret �r "olagliga" eller rutorna �r tomma - AL
        return res.status(400).render("profile", {
          message: "Please enter a person-ID",
        });
      }

      var sql = "UPDATE users SET ? WHERE ID = " + decoded.id + ";";

      var data = { safetylevel: 2, personid: personID, address: address };

      //skickar in namn, email och encryptad l�senord till databasen - AL
      db.query(sql, data, (error, results) => {
        if (error) {
          console.log(error);
        } else {
          console.log(results);
          return res.redirect("/profile");
         
        }
      });
    }
  );
};




exports.updateAcc = async (req, res) => {
    const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      ); //j�mf�r userns cookie med l�senordet vi anv�nde f�r att skapa token vi har sparat i env
      console.log(decoded);
    
      //skapar variabler f�r varje ruta i register - AL
      const { newname, newemail, newpersonID, newaddress } = req.body;


      db.query('SELECT email FROM users WHERE id = ?', [decoded.id], async (error, results) => {
        if (error) {
            console.log(error);
        }

            if(newemail){
                var insertEmail = "UPDATE `users` SET `email` = '" + newemail + "' WHERE ID = " + decoded.id + ";"
                //skickar in namn, email och encryptad l�senord till databasen - AL
                db.query(insertEmail,  (error, results) => {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log(results);
                        return res.render('settings', {
                            message: 'email changed'
                        });
                    }
                })
            }
            /* 
                                            !!!!!!!!
                                            !!!!!!!!
            !!!!!!!! ---- Avändarna får inte byta namn, adress eller ID bara sådär, men det går att göra om man verkligen verkligen vill nedan :) - CM 
                                            !!!!!!!!
                                            !!!!!!!!
            if(newname){
                var insertName = "UPDATE `users` SET `name` = '" + newname + "' WHERE ID = " + decoded.id + ";"
                //skickar in namn, email och encryptad l�senord till databasen - AL
                db.query(insertName,  (error, results) => {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log(results);
                        return res.render('settings', {
                            message: 'name changed'
                        });
                    }
                })
            }

            if(newpersonID){
                var insertPersonID = "UPDATE `users` SET `personid` = '" + newpersonID + "' WHERE ID = " + decoded.id + ";"
                //skickar in namn, email och encryptad l�senord till databasen - AL
                db.query(insertPersonID,  (error, results) => {
                        if (error) {
                            console.log(error);
                        } else {
                            console.log(results);
                            return res.render('settings', {
                                message: 'ID changed'
                            });
                        }
                })
            }
            
            Det går dock inte att byta adress...Vet inte varför och behöver inte veta varför - CM

            if(newAddress){
                var insertnewAddress = "UPDATE `users` SET `address` = '" + newAddress + "' WHERE ID = " + decoded.id + ";"
                //skickar in namn, email och encryptad l�senord till databasen - AL
                db.query(insertnewAddress,  (error, results) => {
                        if (error) {
                            console.log(error);
                        } else {
                            console.log(results);
                            return res.render('settings', {
                                message: 'address changed'
                            });
                        }
                })
            } */
      });
};


exports.addImage = async (req, res) => {
    const decoded = await promisify(jwt.verify)(
          req.cookies.jwt,
          process.env.JWT_SECRET
        ); //j�mf�r userns cookie med l�senordet vi anv�nde f�r att skapa token vi har sparat i env
        console.log(decoded);
        let sampleFile;
        let uploadPath;
      
        if (!req.files || Object.keys(req.files).length === 0) {
          return res.status(400).send("No files were uploaded.");
        }
      
        // name of the input is sampleFile
        sampleFile = req.files.sampleFile;
        uploadPath = path.join(__dirname, "..", "public", sampleFile.name);
      
        // Use mv() to place file on the server
        sampleFile.mv(uploadPath, function (error) {
          if (error) {
            console.log(error);
          }
      
          var sql = "UPDATE users SET ? WHERE ID = " + decoded.id + ";";
      
          var data = { safetylevel: 3,image: sampleFile.name };
          db.query(sql, data, (error, results) => {
            if (error) {
              console.log(error);
            } else {
              console.log(results);
              return res.redirect("/profile");
            }
          });
        });
      };

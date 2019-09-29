import express from 'express';
import dba from '../modules/database.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'

import { registerValidation, loginValidation } from "../modules/inputValidation";

const router = express.Router();


const database = new dba();


const login = (username, password) => {
    return new Promise((resolve, reject) => {
        // const { error } = loginValidation({ username: username, password: password });
        // if (error) return reject(error.details[0].context.label);

        database.query('SELECT password FROM users WHERE username=?', [username])
            .then(result => {               
                if (result.length === 0) 
                    throw "Wrong Username or Password";                    

                console.log(result);
                return bcrypt.compare(password, result[0].password);
            })
            .then(bcryptResult => {
                if (bcryptResult) {
                    const token = jwt.sign({ username: username }, process.env.TOKEN_SECRET)
                    
                    return resolve({
                        username: username,
                        token: token
                    });
                }
                else {
                    throw "Wrong Username or Password";
                }
            })
            .catch(err => {
                return reject(err);
            });
    });
}


const register = (username, password, email) => {
    return new Promise((resolve, reject) => {
        const { error } = registerValidation({ username: username, password: password, email: email }); //Validate the input
        if (error) return reject(error.details[0].context.label);

        
        database.query('SELECT EXISTS(SELECT * FROM users WHERE username=?)', [username]) //Check if the user exists in the database
            .then(result => {
                if (Object.values(result[0])[0])
                    throw 'This username is already taken';                    

                return database.query('SELECT EXISTS(SELECT * FROM users WHERE email=?)', [email]); //Check if the e-mail exists in the database
            })
            .then(result => {
                if (Object.values(result[0])[0])
                    throw 'This e-mail is already used';

                return bcrypt.hash(password, 10);   //Hash the password with 10 salt    
            })
            .then((hashedPassword) => {
                return database.query('INSERT INTO users (uid, email, username, password, role) VALUES (?, ?, ?, ?, ?)', 
                [3, email, username, hashedPassword, 'user'])   //Insert the user to the database
            })
            .then(() => {
                return resolve({username:username});
            })
            .catch((err) => {
                return reject(err);
            })
    })
}



router.post('/register', async (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;

    register(username, password, email)
        .then(() => {
            return login(username, password)
        }, err => {
            throw err;
        })
        .then((loginResult) => {
            res.cookie('token', loginResult.token, { maxAge: 900000, httpOnly: true });
            res.send({username: loginResult.username});
        })
        .catch(err => {
            return console.error(err);
        });

});

router.post('/login', async (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;

    

    console.log(process.env.DB_HOST);

    login(username, password)
        .then((loginResult) => {
            res.cookie('token', loginResult.token, { maxAge: 900000, httpOnly: true });
            res.send({username: loginResult.username});
        })
        .catch(err => {
            return console.error(err);
        });

});


export default router;
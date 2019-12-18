import dba from '../modules/database.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'

import { registerValidation, loginValidation } from "../modules/inputValidation";

const database = new dba();

export const login = (username, password) => {
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
                    const token = jwt.sign({
                            username: username 
                        }, 
                        process.env.TOKEN_SECRET,
                        {
                            algorithm: 'HS256',
                            expiresIn: 60*10
                        });
                    
                    database.query('UPDATE users SET last_login = NOW() WHERE username = ?', [username]) //Update the last_login time
                        .catch(err => {
                            throw err;
                        });

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


export const register = (username, password, email) => {
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
                console.log(hashedPassword);
                return database.query('INSERT INTO users (username, password, email, created_at) VALUES (?, ?, ?, NOW())', 
                [username, hashedPassword, email, 'user']);   //Insert the user to the database                
            })
            .then(() => {
                return resolve({username:username});
            })
            .catch((err) => {
                return reject(err);
            })
    })
}

export const checkAuth = (token) => 
{
    if(token)
    {
        try{
            let decoded = jwt.verify(token, process.env.TOKEN_SECRET, {algorithm: ['HS256']});
            console.log("Decoded: " + decoded);
            if(decoded)
            {
                return true;
            }
        }
        catch(err)
        {
            console.log(err);
            return false;
        }
    }
    return false;
}

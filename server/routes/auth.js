import express from 'express';
import {register, login, checkAuth} from '../modules/authentication';
var cookie = require('cookie');

const router = express.Router();

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
            res.send({error: err});
            return console.error(err);
        });

});

router.post('/login', async (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;

    

    console.log(process.env.DB_HOST);

    login(username, password)
        .then((loginResult) => {
            console.log("logged");
            res.cookie('token', loginResult.token, { maxAge: 900000, httpOnly: true });
            res.send({username: loginResult.username});
        })
        .catch(err => {
            res.send({error: err});
            return console.error(err);
        });

});

router.post('/checkAuth', (req, res, next) => {   
    console.log(req.cookies['token']) 
    res.send({logged: checkAuth(req.cookies['token'])})
})


export default router;
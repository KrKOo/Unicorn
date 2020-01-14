import express from 'express'
import jwt from 'jsonwebtoken';
const router = express.Router()
var cookie = require('cookie');

import dba from '../modules/Database.js';

const database = new dba();

router.get('/', function(req, res, next) {   //get all servers
    database.query('SELECT id, name, size FROM servers')
        .then(result => {
            res.send(result);
        })
        .catch(err => {
            console.log(err);
        })

    
});

router.get('/get/:id', function(req, res, next) {   //get the map by ID
    database.query('SELECT users_id, position FROM user_position WHERE servers_id = ?', [req.params.id])
        .then(result => {
            res.send(result);
        })
        .catch(err => {
            console.log(err);
        })
});


export default router;

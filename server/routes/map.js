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
    const mapID = req.params.id;
    let resData = {};
    
    /*const sql = `SELECT
                    user_position.users_id, 
                    user_position.position, 
                    rooms.id, 
                    rooms.background, 
                    room_fields.field_id, 
                    room_fields.rooms_id
                FROM
                    user_position
                INNER JOIN rooms
                    ON user_position.servers_id = rooms.servers_id
                INNER JOIN room_fields
                    ON user_position.servers_id = room_fields.servers_id
                WHERE user_position.servers_id = ?`

    database.query(sql, [mapID])


    
    .then(result => {
        console.log(result);
        res.send(result);
        //resData.users = result;
        //return database.query('SELECT id, background FROM rooms WHERE servers_id = ?', [mapID])    
    })
    .catch(err => {
        console.log(err);
    })*/


    database.query('SELECT users_id, position FROM user_position WHERE servers_id = ?', [mapID])
    .then(result => {
        resData.users = result;
        return database.query('SELECT id, background FROM rooms WHERE servers_id = ?', [mapID])    
    })
    .then((result) => {
        resData.colors = result;
        return database.query('SELECT field_id, rooms_id FROM room_fields WHERE servers_id = ?', [mapID])
    })
    .then(result => {
        resData.fields = result;
        console.log(resData);
        res.send(resData);
    })
    .catch(err => {
        console.log(err);
    })
});

export default router;

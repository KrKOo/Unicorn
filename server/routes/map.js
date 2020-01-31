import express from 'express'
import jwt from 'jsonwebtoken';
const router = express.Router()
var cookie = require('cookie');

import dba from '../modules/Database.js';

const database = new dba();

router.get('/', function(req, res, next) {   //get all servers
    database.query('SELECT id, name, size FROM server')
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

    /*SELECT room_fields.field_id, room_fields.rooms_id, room_fields.servers_id, user_position.users_id, rooms.background
FROM room_fields 
LEFT JOIN user_position ON user_position.position = room_fields.field_id AND user_position.servers_id = 0
LEFT JOIN rooms ON rooms.id = room_fields.rooms_id
WHERE room_fields.servers_id = 0 */

    database.query(`SELECT field.id, field.room_id, field.server_id, user_position.user_id, room.background
                    FROM field 
                    LEFT JOIN user_position ON user_position.position = field.id AND user_position.server_id = ?
                    LEFT JOIN room ON room.id = field.room_id
                    WHERE field.server_id = ? `, [mapID, mapID])
    .then(result => {
        res.send(result);
    })
    .catch(err => {
        console.log(err);
    })

    /*database.query('SELECT user_id, position FROM user_position WHERE server_id = ?', [mapID])
    .then(result => {
        resData.users = result;
        return database.query('SELECT id, background FROM room WHERE server_id = ?', [mapID])    
    })
    .then((result) => {
        resData.colors = result;
        return database.query('SELECT id, room_id FROM field WHERE server_id = ?', [mapID])
    })
    .then(result => {
        resData.fields = result;
        console.log(resData);
        res.send(resData);
    })
    .catch(err => {
        console.log(err);
    })*/
});

export default router;

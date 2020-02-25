import express from 'express'
import jwt from 'jsonwebtoken';
const router = express.Router()
var cookie = require('cookie');

import dba from '../modules/Database.js';

const database = new dba();

router.get('/', (req, res, next) => {   //get all servers
    database.query('SELECT id, name, size FROM server')
    .then(result => {
        res.send(result);
    })
    .catch(err => {
        console.log(err);
    })   
});

router.get('/getRooms/:id', (req, res, next) => {
    const mapID = req.params.id;
    database.query(`SELECT id, name FROM room 
                    WHERE server_id = ? AND 
                    (SELECT COUNT(*) FROM field WHERE room_id=room.id) > 0;`, [mapID])
    .then(result => {
        res.send(result);
    })    
    .catch(err => {
        console.log(err);
    })
});

router.get('/getRoomSettings/:mapID', (req, res, next) => {
    const mapID = req.params.mapID;

    try {
		const cookies = cookie.parse(req.headers.cookie);
		const decodedToken = jwt.verify(cookies.token, process.env.TOKEN_SECRET, { algorithm: ['HS256'] });
		var userID = decodedToken.userID;
    
        database.query(`SELECT id, name, background, save_messages FROM room 
                        WHERE server_id = ? AND user_id = ?`, [mapID, userID])
        .then(result => {
            res.send(result[0]);
        })    
        .catch(err => {
            console.log(err);
        })
    }catch(err)
    {
        console.log(err);
    }
});



router.get('/get/:id', (req, res, next) => {   //get the map by ID
    const mapID = req.params.id;
    let resData = {};

    database.query(`SELECT field.id, field.server_id, field.room_id, null AS user_id, room.background, null as username, null as profileImg
                    FROM field
                    LEFT JOIN room ON room.id = field.room_id
                    WHERE field.server_id = ?
                    UNION
                    SELECT user_position.position, user_position.server_id, null, user_position.user_id, room.background, user.username, user.profileImg
                    FROM user_position
                    LEFT JOIN room ON room.id = (SELECT field.room_id FROM field WHERE field.id = user_position.position AND field.server_id = user_position.server_id)
                    LEFT JOIN user ON user.id = user_position.user_id
                    WHERE user_position.server_id = ?`, [mapID, mapID])
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

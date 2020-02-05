import express from 'express'
const router = express.Router()
import dba from '../modules/Database.js';

const database = new dba();

router.get('/', function(req, res, next) {
    
});

router.get('/get/:mapID/:roomID*?', function(req, res, next) {
    const mapID = req.params.mapID;
    const roomID = req.params.roomID;
    let resData = {};

    if(roomID !== undefined)
    {
        database.query(`
            SELECT message.text, message.sent_at, user.username
            FROM message
            LEFT JOIN user ON user.id = message.user_id
            WHERE message.server_id=? AND message.room_id=?`, [mapID, roomID])
        .then(result => {
            console.log(result);
            res.send(result);        
        })
        .catch(err => {
            console.log(err);
        })
    }
    else
    {
        database.query(`
            SELECT message.text, message.sent_at, user.username
            FROM message
            LEFT JOIN user ON user.id = message.user_id
            WHERE message.server_id=? AND message.room_id IS NULL`, [mapID])
        .then(result => {
            console.log(result);
            res.send(result);        
        })
        .catch(err => {
            console.log(err);
        })
    }

    
});

export default router;

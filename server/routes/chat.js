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
            SELECT message.text, DATE_FORMAT(sent_at,'%d.%m.%Y %H:%i') AS sent_at, user.username, user.profileImg
            FROM message
            LEFT JOIN user ON user.id = message.user_id
            WHERE message.server_id=? AND message.room_id=?`, [mapID, roomID])
        .then(result => {
            res.send(result);        
        })
        .catch(err => {
            console.log(err);
        })
    }
    else
    {
        database.query(`
            SELECT message.text, DATE_FORMAT(sent_at,'%d.%m.%Y %H:%i') AS sent_at, user.username, user.profileImg
            FROM message
            LEFT JOIN user ON user.id = message.user_id
            WHERE message.server_id=? AND message.room_id IS NULL`, [mapID])
        .then(result => {
            res.send(result);        
        })
        .catch(err => {
            console.log(err);
        })
    }

    
});

export default router;

import jwt from 'jsonwebtoken';
import decodeToken from '../modules/authentication';
import dba from './Database.js';
var cookie = require('cookie');

const database = new dba();

export default (io) => {
    io.on('connection', function (socket) {

        socket.on('join', async room => {
            socket.join(room);
            console.log('Joined to room: ' + room);
        });

        socket.on('leaveServer', async room => {
            socket.leave(room, (err) => {
                console.log(err);
            });
            console.log('Left room: ' + room);
        });

        socket.on('leaveRoom', async room => {
            socket.leave(room, (err) => {
                console.log(err);
            });
            console.log('Left room: ' + room);
        });



        socket.on('Test', function (data) {
            const cookies = cookie.parse(socket.handshake.headers.cookie);
            
            try
            {
                var decodedToken = jwt.verify(cookies.token, process.env.TOKEN_SECRET, {algorithm: ['HS256']});
                data.username = decodedToken.username;
                //io.emit('Test', data);
                io.in(data.mapID).emit('Test', data);
            }
            catch(err) {
                console.log(err);
            }

            
        });

        socket.on('move', (data) => {
            const cookies = cookie.parse(socket.handshake.headers.cookie);
            try{
                var decodedToken = jwt.verify(cookies.token, process.env.TOKEN_SECRET, {algorithm: ['HS256']});
                var username = decodedToken.username;   
                var userID = decodedToken.userID;
                            
                database.query(`SELECT position FROM user_position WHERE users_id IN (SELECT id FROM users WHERE username = ?)`, [username])
                    .then(result => {
                        data.lastPosition = result[0].position;
                    })
                    .then(() => {
                        return database.query(`INSERT INTO user_position (users_id, servers_id, position) 
                            VALUES ((SELECT id FROM users WHERE username=?), ?, ?) ON DUPLICATE KEY UPDATE servers_id=?, position=?`, 
                            [username, data.mapID, data.position, data.mapID, data.position])                       
                    })
                    .then(() => {
                        data.username = username;
                        data.userID = userID;
                        console.log(data);
                        io.in(data.mapID).emit('move', data);
                    })
                    .catch(err => {
                        console.log(err);
                    });
            }
            catch(err) {
                console.log(err);
            }
        });

            
    });
}
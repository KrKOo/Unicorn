import jwt from 'jsonwebtoken';
import decodeToken from '../modules/authentication';
import dba from '../modules/database.js';
var cookie = require('cookie');

const database = new dba();

export default (io) => {
    io.on('connection', function (socket) {
        
        socket.on('Test', function (data) {
            const cookies = cookie.parse(socket.handshake.headers.cookie);
            const decodedToken = decodeToken(cookies);

            data.username = decodedToken.username;
            io.emit('Test', data);
        });

        socket.on('move', (data) => {
            const cookies = cookie.parse(socket.handshake.headers.cookie);
            try{
                var decodedToken = jwt.verify(cookies.token, process.env.TOKEN_SECRET, {algorithm: ['HS256']});
                var username = decodedToken.username;   
                            
                database.query(`SELECT position FROM user_position WHERE users_id IN (SELECT id FROM users WHERE username = ?)`, [username])
                    .then(result => {
                        data.lastPosition = result[0].position;
                    })
                    .then(() => {
                        database.query(`INSERT INTO user_position (users_id, servers_id, position) 
                            VALUES ((SELECT id FROM users WHERE username=?), ?, ?) ON DUPLICATE KEY UPDATE servers_id=?, position=?`, 
                            [username, data.server, data.position, data.server, data.position])                        
                    })
                    .then(result => {
                        data.username = username
                        console.log(data);
                        io.emit('move', data);
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
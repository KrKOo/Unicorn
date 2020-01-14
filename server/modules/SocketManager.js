import Database from "./Database";
import jwt from 'jsonwebtoken';
var cookie = require('cookie');

export default class SocketManager {
    constructor(io) {
        this.io = io;
        this.db = new Database();

        this.io.on('connection', (socket) => {
            socket.on('joinMap', async (mapID) => {
                this.mapEvent(socket, mapID, true);
            });

            socket.on('joinRoom', async roomID => {
                this.roomEvent(socket, roomID, true);
            });

            socket.on('leaveMap', async mapID => {
                this.mapEvent(socket, mapID, false);
            })

            socket.on('leaveRoom', async roomID => {
                this.roomEvent(socket, roomID, false);
            })

            socket.on('message', data => {
                this.message(socket, data);
            })

            socket.on('move', data => {
                this.move(socket, data);
            })
        })
    }

    mapEvent(socket, mapID, isJoin) {
        if(isJoin)
        {
            socket.join(`map${mapID}`);
        }
        
        const cookies = cookie.parse(socket.handshake.headers.cookie);
        try {
            var decodedToken = jwt.verify(cookies.token, process.env.TOKEN_SECRET, {algorithm: ['HS256']});
            var username = decodedToken.username;   
            var userID = decodedToken.userID;

            var data = {
                userID: userID,
                username: username,
                mapID: mapID,
                isJoin: isJoin
            }

            if(!isJoin)
            {
                this.db.query(`SELECT position FROM user_position WHERE users_id = ?`, [userID])
                .then(result => {
                    if(result[0] != undefined)
                    {
                        data.lastPosition = result[0].position;
                    }                    
                    this.io.in(`map${mapID}`).emit('mapEvent', data);

                    this.db.query(`DELETE FROM user_position WHERE users_id = ?`, [userID]);
                })
                .catch((err) => {
                    throw err;
                })
            }
            else
            {
                this.io.in(`map${mapID}`).emit('mapEvent', data);
            }
            
            console.log((isJoin ? 'Joined':'Left') + ' map ' + mapID);
        }
        catch(error)
        {
            console.log(error);
        }   
        
        if(!isJoin)
        {
            socket.leave(`map${mapID}`);
        }
    }

    roomEvent(socket, roomID, isJoin) {
        if(isJoin)
        {
            socket.join(`room${roomID}`);
        }
        else
        {
            socket.leave(`room${roomID}`);
        }
        
        const cookies = cookie.parse(socket.handshake.headers.cookie);
        try {
            var decodedToken = jwt.verify(cookies.token, process.env.TOKEN_SECRET, {algorithm: ['HS256']});
            var username = decodedToken.username;   
            var userID = decodedToken.userID;

            const data = {
                userID: userID,
                username: username,
                roomID: roomID,
                isJoin: isJoin
            }
            this.io.in(roomID).emit('roomEvent', data);
            console.log((isJoin ? 'Joined':'Left') + ' room ' + roomID);
        }
        catch(error)
        {
            console.log(error);
        }        
    }

    message(socket, data) {
        const cookies = cookie.parse(socket.handshake.headers.cookie);
            
        try
        {
            const decodedToken = jwt.verify(cookies.token, process.env.TOKEN_SECRET, {algorithm: ['HS256']});
            console.log(cookies.token);
            data.username = decodedToken.username;
            this.io.in(`map${data.mapID}`).emit('message', data);
            console.log(data);
        }
        catch(err) {
            console.log(err);
        }
    }

    move(socket, data) {
        const cookies = cookie.parse(socket.handshake.headers.cookie);
            
        try{
            var decodedToken = jwt.verify(cookies.token, process.env.TOKEN_SECRET, {algorithm: ['HS256']});
            var username = decodedToken.username;   
            var userID = decodedToken.userID;
                        
            this.db.query(`SELECT position FROM user_position WHERE users_id IN (SELECT id FROM users WHERE username = ?)`, [username])
                .then(result => {
                    if(result[0] != undefined)
                    {
                        data.lastPosition = result[0].position;
                        if(data.lastPosition == data.position)
                        {
                            throw 'Last Position is the Same as New Position';
                        }
                    }                    
                })
                .then(() => {
                    return this.db.query(`INSERT INTO user_position (users_id, servers_id, position) 
                        VALUES ((SELECT id FROM users WHERE username=?), ?, ?) ON DUPLICATE KEY UPDATE servers_id=?, position=?`, 
                        [username, data.mapID, data.position, data.mapID, data.position])                       
                })
                .then(() => {
                    data.username = username;
                    data.userID = userID;
                    console.log(data);
                    this.io.in(`map${data.mapID}`).emit('move', data);
                })
                .catch(err => {
                    console.log(err);
                });
        }
        catch(err) {
            console.log(err);
        }
    }


}
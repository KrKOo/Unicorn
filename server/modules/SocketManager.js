import Database from "./Database";
import jwt from 'jsonwebtoken';
var cookie = require('cookie');
import bcrypt from 'bcrypt';

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
            });

            socket.on('leaveRoom', async roomID => {
                this.roomEvent(socket, roomID, false);
            });

            socket.on('message', async data => {
                this.message(socket, data);
            });

            socket.on('move', async data => {
                this.move(socket, data);
            });

            socket.on('roomCreate', async data => {
                this.roomCreate(socket, data);
            });

            socket.on('roomEdit', async data => {
                this.roomEdit(socket, data);
            });

            socket.on('disconnect', () => {
                this.disconnect(socket);
            });


        })
    }

    disconnect(socket) {

        console.log("diconnected");
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
                    console.log(data);
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
            this.io.in(`room${roomID}`).emit('roomEvent', data);
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

            console.log(data.roomName);

            this.io.in(data.roomName).emit('message', data); //Room name is used instead of ID => can be used on both MAPs and ROOMs
            
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

    roomCreate(socket, data)
    {
        const roomName = data.roomName;
        const mapID = data.mapID;
        const roomBackground = data.roomBackground;
        const password = data.password;
        const saveMessages = data.saveMessages;
    
        const cookies = cookie.parse(socket.handshake.headers.cookie);
    
        var decodedToken = jwt.verify(cookies.token, process.env.TOKEN_SECRET, {algorithm: ['HS256']});
        const userID = decodedToken.userID;

        let hashPassword = new Promise((resolve, reject) => 
        {            
            if(password)
            {
                resolve(bcrypt.hash(password, 10));
            }
            resolve(null);
        })

        hashPassword.then(hashedPassword => {
            return this.db.query('INSERT INTO rooms (name, background, password, saveMessages, servers_id, users_id) VALUES (?, ?, ?, ?, ?, ?)', 
            [roomName, roomBackground, hashedPassword, saveMessages, mapID, userID])
        })        
        .then((result) => 
        {
            const resData = {
                roomID: result.insertId,
                background: roomBackground
            }
            this.io.in(`map${data.mapID}`).emit('roomCreate', resData);
        })
        .catch(err => {
            console.log(err);
        })
    }

    roomEdit(socket, data){
        const cookies = cookie.parse(socket.handshake.headers.cookie);
            
        try{
            var decodedToken = jwt.verify(cookies.token, process.env.TOKEN_SECRET, {algorithm: ['HS256']}); 
            var userID = decodedToken.userID;

            let roomID;

            this.db.query("SELECT id FROM rooms WHERE users_id=?", [userID])
            .then(result => {
                if(result[0] != undefined)
                {
                    roomID = result[0].id;
                    return this.db.query("SELECT rooms_id FROM room_fields WHERE field_id = ? AND servers_id = ?", 
                        [data.cell, data.mapID])
                }
                else
                {
                    throw "Create a room first";
                }
            })
            .then(result => {
                if(result[0] === undefined) //The field is not owned by anyone
                {
                    return this.db.query("INSERT INTO room_fields (rooms_id, servers_id, field_id) VALUES (?, ?, ?)",
                        [roomID, data.mapID, data.cell]);
                }
                else if(result[0].rooms_id == roomID)  //The room is owned by this user
                {
                    data.isDelete = true;
                    return this.db.query("DELETE FROM room_fields WHERE rooms_id = ? AND servers_id = ? AND field_id = ?", 
                        [roomID, data.mapID, data.cell])
                }
                else if(result[0].rooms_id != roomID) //The room is owned by another user
                {
                    throw 'The cell does not belong to the user';
                }                
            })
            .then(() => {
                data.roomID = roomID;
                console.log(data);
                this.io.in(`map${data.mapID}`).emit('roomEdit', data);
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
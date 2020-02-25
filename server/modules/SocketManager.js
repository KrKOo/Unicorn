import Database from "./Database";
import jwt from 'jsonwebtoken';
var cookie = require('cookie');
import bcrypt from 'bcrypt';

export default class SocketManager {
    constructor(io) {
        this.io = io;
        this.db = new Database();

        this.setup();

        this.io.on('connection', (socket) => {            
            socket.on('setup', () => {
                this.connect(socket);
            });

            socket.on('joinMap', async (mapID) => {
                this.mapEvent(socket, mapID, true);
            });

            socket.on('joinRoom', async roomID => {
                this.roomEvent(socket, roomID, true);
            });

            socket.on('leaveMap', async (mapID, unsubscribe) => {
                this.mapEvent(socket, mapID, false, unsubscribe);
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

            socket.on('roomManage', async data => {
                this.roomManage(socket, data);
            });

            socket.on('roomEdit', async data => {
                this.roomEdit(socket, data);
            });

            socket.on('manageFriend', async data => {
                this.manageFriend(socket, data);
            });


            socket.on('disconnect', () => {
                this.disconnect(socket);
            });


        })
    }

    setup()
    {
        this.db.query(`TRUNCATE user_position`)
        .catch(err => {
            console.log(err);
        });
    }

    connect(socket)
    {
        console.log("Connect asdfahsfghaig");
        const cookies = cookie.parse(socket.handshake.headers.cookie);
        try {
            var decodedToken = jwt.verify(cookies.token, process.env.TOKEN_SECRET, {algorithm: ['HS256']});
            //var username = decodedToken.username;   
            var userID = decodedToken.userID;  

            let data = {
                userID: userID
            }

            socket.emit('setup', data);
        }
        catch(error)
        {
            console.log(error);
        } 
    }

    disconnect(socket) {   
        console.log("Disconnect");
        this.mapEvent(socket, null, false) //leave the map the user is currently joined
    }

    mapEvent(socket, mapID, isJoin, unsubscribe) {     
        console.log("Map join")
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

            if(isJoin)
            {
                socket.join(`map${mapID}`);
                this.io.in(`map${mapID}`).emit('mapEvent', data);
            }
            else
            {
                this.db.query(`SELECT server_id, position FROM user_position WHERE user_id = ?`, [userID])
                .then(result => {
                    if(result[0] != undefined)
                    {
                        data.lastPosition = result[0].position;
                        this.io.in(`map${result[0].server_id}`).emit('mapEvent', data);
                    }                    
                    console.log(data);                    

                    this.db.query(`DELETE FROM user_position WHERE user_id = ?`, [userID]);
                })
                .catch((err) => {
                    throw err;
                })
            }
            
            console.log((isJoin ? 'Joined':'Left') + ' map ' + mapID);
        }
        catch(error)
        {
            console.log(error);
        }   
        
        if(!isJoin && unsubscribe)
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
            var userID = decodedToken.userID;

            data.username = decodedToken.username;

            this.db.query(`INSERT INTO message (text, sent_at, server_id, room_id, user_id)
                            SELECT ?, NOW(), ?, ?, ?
                            FROM room
                            WHERE (room.save_messages=1 AND room.id = ?) OR (? IS NULL) LIMIT 1`, 
                            [data.text, data.mapID, data.roomID, userID, data.roomID, data.roomID])
            .then((result) => 
            {
                console.log(result);
                if(result.affectedRows)
                {
                    return this.db.query(`SELECT DATE_FORMAT(message.sent_at,'%d.%m.%Y %H:%i') as sent_at, user.profileImg
                                            FROM message 
                                            LEFT JOIN user ON user.id = message.user_id
                                            WHERE message.id=?`, [result.insertId]);
                }
                else
                {
                    return this.db.query(`SELECT DATE_FORMAT(NOW(),'%d.%m.%Y %H:%i') as sent_at, user.profileImg
                                            FROM user WHERE id = ? `, [userID]);
                }
                
            })
            .then((result) =>
            {
                if(result[0] != undefined)
                {
                    data.sent_at = result[0].sent_at;
                    data.profileImg = result[0].profileImg;
                }

                if(data.roomID != undefined)
                {
                    this.io.in(`room${data.roomID}`).emit('message', data);
                }
                else
                {
                    this.io.in(`map${data.mapID}`).emit('message', data);
                }
            })
            .catch(err => {
                console.log(err);
            });

            
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
                        
            this.db.query(`
                SELECT position 
                FROM user_position 
                WHERE user_id IN (SELECT id FROM user WHERE username = ?) OR position = ?`, [username, data.position])
                .then(result => {
                    if(result[1] != undefined)
                    {
                        throw 'The field is occupied';
                    }
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
                    return this.db.query(`INSERT INTO user_position (user_id, server_id, position) 
                        VALUES ((SELECT id FROM user WHERE username=?), ?, ?) ON DUPLICATE KEY UPDATE server_id=?, position=?`, 
                        [username, data.mapID, data.position, data.mapID, data.position])                       
                })
                .then(() =>{
                    return this.db.query(`SELECT profileImg FROM user WHERE id=?`, [userID]) 
                })
                .then((result) => {
                    data.profileImg = result[0].profileImg;
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

    roomManage(socket, data)
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
            return this.db.query(`INSERT INTO room (name, background, password, save_messages, server_id, user_id) 
                                VALUES (?, ?, ?, ?, ?, ?) 
                                ON DUPLICATE KEY UPDATE name = ?, background = ?, save_messages = ?`,
            [roomName, roomBackground, hashedPassword, saveMessages, mapID, userID, roomName, roomBackground, saveMessages]);
        })        
        .then((result) => 
        {
            console.log(result)
            const resData = {
                roomID: result.insertId,
                background: roomBackground,
                name: roomName,
                saveMessages: saveMessages
            }
            this.io.in(`map${data.mapID}`).emit('roomManage', resData);
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

            this.db.query(`SELECT room.id, room.background, room.name FROM room WHERE room.user_id=? AND room.server_id=?`, [userID, data.mapID])
            .then(result => {
                if(result[0] != undefined)
                {
                    data.roomID = result[0].id;
                    data.background = result[0].background;
                    data.roomName = result[0].name;
                    return this.db.query("SELECT room_id FROM field WHERE id = ? AND server_id = ?", 
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
                    return this.db.query(`INSERT INTO field (id, room_id, server_id)
                        SELECT ?, ?, ?
                        WHERE (SELECT COUNT(*) FROM field WHERE room_id=?) < ?`,
                        [data.cell, data.roomID, data.mapID, data.roomID, 5]);
                }
                else if(result[0].room_id == data.roomID)  //The room is owned by this user
                {
                    data.isDelete = true;
                    return this.db.query("DELETE FROM field WHERE room_id = ? AND server_id = ? AND id = ?", 
                        [data.roomID, data.mapID, data.cell])
                }
                else if(result[0].room_id != data.roomID) //The room is owned by another user
                {
                    throw 'The cell does not belong to the user';
                }                
            })
            .then((result) => {
                console.log(result);
                if(result.affectedRows != 0)
                {
                    this.io.in(`map${data.mapID}`).emit('roomEdit', data);
                }
                
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
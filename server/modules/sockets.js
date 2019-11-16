var cookie = require('cookie');
import jwt from 'jsonwebtoken';

export default (io) => {
    io.on('connection', function (socket) {
        
        socket.on('Test', function (data) {
            
            
            
            //var cookief = io.handshake.headers.cookie; 

            var cookies = cookie.parse(socket.handshake.headers.cookie);

            try {
                console.log(cookies.token);
                var decoded = jwt.verify(cookies.token, process.env.TOKEN_SECRET, {algorithm: ['HS256']});
                data.username = decoded.username;
                console.log(data);
                io.emit('Test', data);

            } catch(err) {
                console.log(err);
            }
            //jwt.verify(cookies.token)
            


        });
    });
}
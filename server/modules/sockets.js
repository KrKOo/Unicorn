export default (io) => {
    io.on('connection', function (socket) {
        
        socket.on('Test', function (data) {
            io.emit('Test', data);
            console.log(data);
        });
    });
}
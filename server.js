const WebSocket = require('ws');

const server = new WebSocket.Server({ port: 8080 });
console.clear()
var arr = [] 
var connectionCount = 0;

server.on('connection', (socket) => {
    arr.push(socket);
    connectionCount++;
    console.log('Client connected count: ' + arr.length);

    // Send the current time to the client every second
    const interval = setInterval(() => {
        var date = new Date();

        var dateStr = `${date.getFullYear()}/${date.getMonth()}/${date.getDay()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
        socket.send(JSON.stringify(dateStr));

    }, 1000);

    socket.on('close', () => {
        arr = arr.filter((item) => item != socket);
        console.log('Client disconnected count: ' + arr.length);
        clearInterval(interval);
    });
});

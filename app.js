// Including libraries
var static = require('node-static');

var file = new static.Server('./');

var app = require('http').createServer(function (request, response) {
    request.addListener('end', function () {
        //
        // Serve files!
        //
        file.serve(request, response);
    }).resume();
});
var io = require('socket.io').listen(app);
app.listen(8082);

// If the URL of the socket server is opened in a browser

// Delete this row if you want to see debug messages
io.set('log level', 1);

// Listen
// for incoming connections from clients
io.sockets.on('connection', function (socket) {
    console.log('connect');
    // Start listening for mouse move events
    socket.on('mousemove', function (data) {
        console.log('data: ', data);
        // This line sends the event (broadcasts it)
        // to everyone except the originating client.
        socket.broadcast.emit('moving', data);
    });
});

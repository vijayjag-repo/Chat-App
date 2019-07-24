const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const app = express();
//This is something that node does on the background if we normally use express.
const server = http.createServer(app);
//socket.io requires a http server. If we use express normally, we don't have access to this.
//That is why we create the server explicitly and pass it to socket.io.
const io = socketio(server);

const port = process.env.PORT || 3000;
const publicId = path.join(__dirname,'../public');

app.use(express.static(publicId));

var count = 0;
//socket is an object and contains information about the connection.
io.on('connection',function(socket){
  console.log("New connection");
    //socket.emit() will emit only to the current connection.
    //io.emit() will emit to all connections.
  socket.emit('message',"Hello");
  socket.on('sendmessage',function(message){
    io.emit('message',message);
  });


});
//just change app.listen() to server.listen().
server.listen(port,function(){
  console.log("Server started");
});

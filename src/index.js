const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const Filter = require('bad-words');
const app = express();
//This is something that node does on the background if we normally use express.
const server = http.createServer(app);
//socket.io requires a http server. If we use express normally, we don't have access to this.
//That is why we create the server explicitly and pass it to socket.io.
const io = socketio(server);

const port = process.env.PORT || 3000;
const publicId = path.join(__dirname,'../public');

app.use(express.static(publicId));

//socket is an object and contains information about the connection.
io.on('connection',function(socket){
  console.log("New connection");
    //socket.emit() will emit only to the current connection.
    //io.emit() will emit to all connections.
  socket.emit('message',"Hello");
  //socket.broadcast.emit() sends to everyone except the one sending.
  socket.broadcast.emit('message',"A new user has joined");
  //The callback function is to acknowlegde that the server has received the message.
  socket.on('sendmessage',function(message,callback){
    const filter = new Filter();
    if(filter.isProfane(message)){
      return(callback("Profanity is not allowed"));
    }
    io.emit('message',message);
    callback();
  });

  //server gets the lat long from client
  socket.on('sendlocation',function(coords,callback){
    io.emit('locationMessage',`https://google.com/maps?q=${coords.lat},${coords.lng}`);
    callback();
  });

  //client disconnects so inform other clients.
  socket.on('disconnect',function(){
    io.emit('message',"One user has left");
  });

});
//just change app.listen() to server.listen().
server.listen(port,function(){
  console.log("Server started");
});

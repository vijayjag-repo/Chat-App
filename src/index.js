const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const Filter = require('bad-words');
const {generateMessage,generateLocationMessage} = require('./messages.js');
const{addUser,removeUser,getUser,getUsersinRoom} = require('./users.js');
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
    

  socket.on('join',function({username,room}){

    const {error,user} = addUser({id:socket.id,username,room});
    if(error){
      return(callback(error));
    }
    socket.join(user.room);
    //socket.emit() will emit only to the current connection.
    //io.emit() will emit to all connections.
    socket.emit('message',generateMessage('Admin','Welcome!'));
    //socket.broadcast.emit() sends to everyone except the one sending.
    //socket.broadcast.to().emit() will send to everyone except the sender but only in that room.
    socket.broadcast.to(user.room).emit('message',generateMessage('Admin',`${user.username} has joined`));
  });

  //The callback function is to acknowlegde that the server has received the message.
  socket.on('sendmessage',function(message,callback){
    const user = getUser(socket.id);
    const filter = new Filter();
    if(filter.isProfane(message)){
      return(callback("Profanity is not allowed"));
    }
    io.to(user.room).emit('message',generateMessage(user.username,message));
    callback();
  });

  //server gets the lat long from client
  socket.on('sendlocation',function(coords,callback){
    const user = getUser(socket.id);
    io.to(user.room).emit('locationMessage',generateLocationMessage(user.username,`https://google.com/maps?q=${coords.lat},${coords.lng}`));
    callback();
  });

  //client disconnects so inform other clients.
  socket.on('disconnect',function(){
    const person = removeUser(socket.id);
    if(person){
      io.to(person.room).emit('message',generateMessage('Admin',`${person.username} has left`));
    }
    
  });

});
//just change app.listen() to server.listen().
server.listen(port,function(){
  console.log("Server started");
});

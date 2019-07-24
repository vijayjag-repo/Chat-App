//call to connect to the socket.
// ans is the return value from the server or socket.
const socket = io();

socket.on('countupdated',function(count){
  console.log("Updated",count);
});

document.getElementById("inc").addEventListener('click',function(){
  console.log("Clicked");
  socket.emit('increment');
});

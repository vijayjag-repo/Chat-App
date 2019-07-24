//call to connect to the socket.
// ans is the return value from the server or socket.
const socket = io();


socket.on('message',function(msg){
  console.log(msg);
});

document.querySelector('#message-form').addEventListener('submit',function(e){
  e.preventDefault();

  //e.target gets you to the form and elements gets you to the elements.
  const message = e.target.elements.tell.value;
  socket.emit('sendmessage',message);
});

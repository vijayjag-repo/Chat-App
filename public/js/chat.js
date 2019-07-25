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

//using geolocation api using browser
document.querySelector('#send-location').addEventListener('click',function(){
  //position object contains the location that we want to share.

  // function success(pos){
  //
  // }
  navigator.geolocation.getCurrentPosition(function success(pos){
    socket.emit('sendlocation',{
      lat: pos.coords.latitude,
      lng: pos.coords.longitude
    });
  });


});

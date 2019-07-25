//call to connect to the socket.
// ans is the return value from the server or socket.
const socket = io();

//elements
const $messageForm = document.querySelector('#message-form');
const $messageFormInput = document.querySelector('input');
const $messageFormButton = document.querySelector('button');
const $sendLocationButton = document.querySelector('#send-location');
socket.on('message',function(msg){
  console.log(msg);
});

$messageForm.addEventListener('submit',function(e){
  e.preventDefault();
  //e.target gets you to the form and elements gets you to the elements.

  //disable form
  $messageFormButton.setAttribute('disabled','disabled');
  const message = e.target.elements.tell.value;
  //callback function to know whether the message was delivered.
  //whoever is emitting an event sets up a callback function.
  socket.emit('sendmessage',message,function(error){
    //enable form
    $messageFormButton.removeAttribute('disabled');
    $messageFormInput.value = '';
    $messageFormInput.focus();
    if(error){
      return(console.log(error));
    }
    console.log("The message was delivered");
  });
});

//using geolocation api using browser
$sendLocationButton.addEventListener('click',function(){
  //position object contains the location that we want to share.

  //disable send location button until you receive acknowlegdement
  $sendLocationButton.setAttribute('disabled','disabled');
  navigator.geolocation.getCurrentPosition(function success(pos){
    socket.emit('sendlocation',{
      lat: pos.coords.latitude,
      lng: pos.coords.longitude
    },function(ack){
      $sendLocationButton.removeAttribute('disabled');
      console.log("Location shared");
    });
  });


});

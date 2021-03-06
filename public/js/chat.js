//call to connect to the socket.
// ans is the return value from the server or socket.
const socket = io();

//elements
const $messageForm = document.querySelector('#message-form');
const $messageFormInput = document.querySelector('input');
const $messageFormButton = document.querySelector('button');
const $sendLocationButton = document.querySelector('#send-location');
const $messages = document.querySelector('#messages');

//Templates
//Render something to browser when something comes in.
const messageTemplate = document.querySelector('#message-template').innerHTML;
const locationMessageTemplate = document.querySelector('#location-message-template').innerHTML;
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML;

//query string processing
const {username,room} = Qs.parse(location.search,{ignoreQueryPrefix: true});

const autoscroll = function(){
  //New message
  const $newMessage = $messages.lastElementChild

  // Height of the new message
  const newMessageStyles = getComputedStyle($newMessage); 
  const newMessageMargin = parseInt(newMessageStyles.marginBottom);
  const newMessageHeight = $newMessage.offsetHeight + newMessageMargin;

  //visible height
  const visibleHeight = $messages.offsetHeight;

  //height of msgs container
  const containerHeight = $messages.scrollHeight;

  //how far have I scrolled - if the scroll is at the top, then this value is 0
  const scrollOffset = $messages.scrollTop + visibleHeight;

  if(containerHeight-newMessageHeight<=scrollOffset){
    $messages.scrollTop = $messages.scrollHeight;
  }
};

socket.on('message',function(msg){
  console.log(msg);
  //mustache is passing the actual message to render on the browser.
  const html = Mustache.render(messageTemplate,{
    username: msg.username,
    message: msg.text,
    //moment library will format this timestamp for us.
    createdAt: moment(msg.createdAt).format('h:mm A')
  });
  //append messages to the bottom
  $messages.insertAdjacentHTML('beforeend',html);
  autoscroll();
});

socket.on('locationMessage',function(url){
  console.log(url);

  const html = Mustache.render(locationMessageTemplate,{
    username: url.username,
    url: url.url,
    createdAt: moment(url.createdAt).format('h:mm A')
  });
  //append messages to the bottom
  $messages.insertAdjacentHTML('beforeend',html);
});

socket.on('roomData',function({room,users}){
  const html = Mustache.render(sidebarTemplate,{
    room,users
  });
  document.querySelector('#sidebar').innerHTML = html;
});

$messageForm.addEventListener('submit',function(e){
  e.preventDefault();
  //e.target gets you to the form and elements gets you to the elements.

  //disable form
  $messageFormButton.setAttribute('disabled','disabled');
  const message = e.target.elements.message.value;
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

socket.emit('join',{username,room},function(error){
  if(error){
    alert(error);
    location.href = '/';
  }
});
var jwt = sessionStorage.getItem('jwtToken');

function createRoom() {
  fetch('https://localhost:7179/api/menu/CreateRoom', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      'Authorization': 'Bearer ' + jwt
    },      
  })
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    sessionStorage.setItem('roomData', JSON.stringify(data))
    var roomId = data.roomId;
    var url = 'http://127.0.0.1:5500/room.html?roomId=' + roomId;
    setTimeout( function(){
      window.location.href = url, 100
    }, 100);
  })
  .catch(function (error) {
    messageBox.removeAttribute('hidden');
    messageBox.style.display = 'flex';
  
    messageBox.classList.add('shake-vertical');

    setTimeout(function(){
    messageBox.classList.remove('shake-vertical');
    }, 600);

    messageBox.textContent = ('Somethig went wrong.');
  });
};



function joinRoomById() {
  let roomIdRequest = document.querySelector('#room-id').value;

  let roomIdRequestData = {
    roomId: roomIdRequest
  }

  fetch('https://localhost:7179/api/menu/JoinRoomById', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      'Authorization': 'Bearer ' + jwt
    },
    body: JSON.stringify(roomIdRequestData)
  }).then(async function(response) {
    if(response.ok){
      var data = await response.json();
      sessionStorage.setItem('roomId', data.roomId)
    }
    else{
      messageBox.removeAttribute('hidden');
      messageBox.style.display = 'flex';
    
      messageBox.classList.add('shake-vertical');
  
      setTimeout(function(){
      messageBox.classList.remove('shake-vertical');
      }, 600);
  
      messageBox.textContent = ('Room not exist.');
    }
  }).then(function () {
    if(sessionStorage.getItem('roomId') !== null){

      roomId = sessionStorage.getItem('roomId');

      var url = 'http://127.0.0.1:5500/room.html?roomId=' + roomId;
      
      window.location.href = url;
    }
  })
};

function joinByIdSection() {
    var mainCard = document.querySelector('.main-card-form'); 
    var mainCardElements = mainCard.elements; 
  
    var joinByIdFrom = document.querySelector('.join-by-id-form');
    var joinByIdFormElements = joinByIdFrom.elements;
  
    for (var i = 0; i < mainCardElements.length; i++) { 
      mainCardElements[i].setAttribute('disabled', '');
    }
  
    for (var i = 0; i < joinByIdFormElements.length; i++) { 
        joinByIdFormElements[i].removeAttribute('disabled'); 
    }
    var secondSection = document.querySelector('.second-card');
    var mainSection = document.querySelector('.main-card');
  
    secondSection.classList.add('rotate-card');
    setTimeout(function(){
        secondSection.classList.remove('rotate-card');
        }, 600);
  
    mainSection.style.zIndex = "1";
    secondSection.style.zIndex = "2";
    }

    function backToMenuSection() {
        var mainCardForm = document.querySelector('.main-card-form'); 
        var mainCardFormElements = mainCardForm.elements; 
      
        var joinByIdFrom = document.querySelector('.join-by-id-form');
        var joinByIdFormElements = joinByIdFrom.elements;
      
        for (var i = 0; i < mainCardFormElements.length; i++) { 
          mainCardFormElements[i].removeAttribute('disabled',);
        }
      
        for (var i = 0; i < joinByIdFormElements.length; i++) { 
            joinByIdFormElements[i].setAttribute('disabled', ''); 
        }
        var secondSection = document.querySelector('.second-card');
        var mainSection = document.querySelector('.main-card');
      
        mainSection.classList.add('rotate-card');

        setTimeout(function(){
            mainSection.classList.remove('rotate-card');
            }, 600);

        mainSection.style.zIndex = "2";
        secondSection.style.zIndex = "1";
        }
    
    function rulesSection() {
        var mainCardForm = document.querySelector('.main-card-form');
        var rulesSectionButton = document.querySelector('.rules-button');

        var mainCardFormElements = mainCardForm.elements;

        for (var i = 0; i < mainCardFormElements.length; i++) { 
            mainCardFormElements[i].setAttribute('disabled','');
          }

          rulesSectionButton.removeAttribute('disabled');

          var rulesSectionCard = document.querySelector('.blank-card');
          var mainSectionCard = document.querySelector('.main-card');

          rulesSectionCard.classList.add('rotate-card');
          
          setTimeout(function(){
            rulesSectionCard.classList.remove('rotate-card');
            }, 600);

          mainSectionCard.style.zIndex = "1";
          rulesSectionCard.style.zIndex = "2";
    }
    
    function returnFromRulesSection() {
        var mainCardForm = document.querySelector('.main-card-form');
        var rulesSectionButton = document.querySelector('.rules-button');

        var mainCardFormElements = mainCardForm.elements;

        for (var i = 0; i < mainCardFormElements.length; i++) { 
            mainCardFormElements[i].removeAttribute('disabled');
          }

          rulesSectionButton.setAttribute('disabled', '');
          
          var rulesSectionCard = document.querySelector('.blank-card');
          var mainSectionCard = document.querySelector('.main-card');

          mainSectionCard.classList.add('rotate-card');
          setTimeout(function(){
            mainSectionCard.classList.remove('rotate-card');
            }, 600);

          mainSectionCard.style.zIndex = "2";
          rulesSectionCard.style.zIndex = "1";
    }

    function logout() {
      sessionStorage.clear();
      connection.stop();
      window.location.href = 'http://127.0.0.1:5500/index.html';
    }

var token = sessionStorage.getItem('jwtPayload');
var decodedToken = JSON.parse(token);

var userName = decodedToken.Name;
var userScore = decodedToken.UserScore;

document.getElementById('player-name').textContent = '' + userName;
document.getElementById('player-score').textContent = 'Personal score: ' + userScore;

var joinByIdInput = document.querySelector('#room-id');
var joinByIdButton = document.querySelector('#join-room-button');

joinByIdInput.addEventListener('keydown', function(event) {
  if(event.key === 'Enter'){
    event.preventDefault();
    joinByIdButton.click();
  }
});

document.title = "Dikky - " + userName;

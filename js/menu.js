var jwt = sessionStorage.getItem('jwtToken');

function createRoom() {

  fetch('https://localhost:7179/api/menu/CreateRoom', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        'Authorization': 'Bearer ' + jwt
      },      
    }).then(function (roomData) {
      if(roomData){
      sessionStorage.setItem('roomData', JSON.stringify(roomData))

      var data = sessionStorage.getItem('roomData');
      var decodedData = JSON.parse(data);

      var roomId = decodedData.roomId;

      var url = 'http://127.0.0.1:5500/room.html?roomId=' + roomId;
      
      window.location.href = url;
      }else {
        console.log('error.');
      }
  })};

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


async function loginRequest() {
  var name = document.querySelector('#name').value;
  var password = document.querySelector('#password').value;

  var loginRequestData = {
    Name: name,
    Password: password
  };

  fetch('https://localhost:7179/api/account/isOnline', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(loginRequestData)
  }).then(function(response) {
    if (response.ok) {
      fetch('https://localhost:7179/api/account/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(loginRequestData)
      })
      .then(function(response) {
        if (response.ok) {
          return response.text();
        } else {
          return response.text;
        }
      })
      .then(function(token) {
        if (token) {
          sessionStorage.setItem('jwtToken', token);
          var decodedToken = JSON.parse(atob(token.split('.')[1]));
          sessionStorage.setItem('jwtPayload', JSON.stringify(decodedToken));
    
          var mainCardAnim = document.querySelector('.menu-window');
          mainCardAnim.classList.add('exit-anim');
    
          setTimeout(function(){
           window.location.href = 'http://127.0.0.1:5500/menu.html';
          }, 600);
    
        } else {
          var messageBox = document.querySelector('#message-container-menu');
          messageBox.removeAttribute('hidden');
          messageBox.style.display = 'flex';
        
          messageBox.classList.add('shake-vertical');
          setTimeout(function(){
            messageBox.classList.remove('shake-vertical');
            }, 600);
    
          messageBox.textContent = ('Wrong name or password.');
        }
      })
      .catch(function(error) {
        var messageBox = document.querySelector('#message-container-menu');
        messageBox.removeAttribute('hidden');
        messageBox.style.display = 'flex';
      
        messageBox.classList.add('shake-vertical');
    
        setTimeout(function(){
        messageBox.classList.remove('shake-vertical');
        }, 600);
    
        messageBox.textContent = ('Wrong name or password.');
      });
      }else
      {
        messageBox.removeAttribute('hidden');
        messageBox.style.display = 'flex';
      
        messageBox.classList.add('shake-vertical');
    
        setTimeout(function(){
        messageBox.classList.remove('shake-vertical');
        }, 600);
    
        messageBox.textContent = ('User already online.');
      }
    }
  )}


  async function registerRequest() {
  var name = document.querySelector('#register-name').value;
  var password = document.querySelector('#register-password').value;
  var confPassword = document.querySelector('#confirm-password').value;

  var nameValidateData = {
    Name: name
  }
  fetch('https://localhost:7179/api/account/NameValidate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(nameValidateData)
  })
  .then(function(response) {
    if(response.ok) {

    var registerRequestData = {
    Name: name,
    Password: password,
    ConfirmPassowrd: confPassword
  };

  fetch('https://localhost:7179/api/account/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(registerRequestData)
  })
  .then(function(response) {
    if(response.ok) {
      var messageBox = document.querySelector('#message-container-menu');
      messageBox.removeAttribute('hidden');
      messageBox.style.display = 'flex';
    
      messageBox.classList.add('shake-vertical');
  
      setTimeout(function(){
      messageBox.classList.remove('shake-vertical');
      }, 600);     

      document.querySelector('#register-name').value = '';
      document.querySelector('#register-password').value = '';
      document.querySelector('#confirm-password').value = '';

      messageBox.textContent = ('Register complete.');

    } else {
      var messageBox = document.querySelector('#message-container-menu');
      messageBox.removeAttribute('hidden');
      messageBox.style.display = 'flex';
    
      messageBox.classList.add('shake-vertical');
  
      setTimeout(function(){
      messageBox.classList.remove('shake-vertical');
      }, 600);

      messageBox.textContent = ('Passwords must match.');
    }}) 
} else {
  var messageBox = document.querySelector('#message-container-menu');
  messageBox.removeAttribute('hidden');
  messageBox.style.display = 'flex';

  messageBox.classList.add('shake-vertical');

  setTimeout(function(){
  messageBox.classList.remove('shake-vertical');
  }, 600);

  messageBox.textContent = ('Name already taken.');
}
})}

function enableRegisterForm() {
  var registerForm = document.querySelector('#register-form'); 
  var registerElements = registerForm.elements; 

  var loginFrom = document.querySelector('#login-form');
  var loginElements = loginFrom.elements;

  for (var i = 0; i < registerElements.length; i++) { 
    registerElements[i].removeAttribute('disabled'); 
  }

  for (var i = 0; i < loginElements.length; i++) { 
    loginElements[i].setAttribute('disabled', ''); 
  }

  var registerCard = document.querySelector('.second-card');
  var loginCard = document.querySelector('.main-card');

  loginCard.classList.remove('rotate-card');
  registerCard.classList.add('rotate-card');

  registerCard.style.zIndex = "2";
  loginCard.style.zIndex = "1";
} 



function disableRegisterForm() {
  var form = document.querySelector('#register-form'); 
  var elements = form.elements; 

  var loginFrom = document.querySelector('#login-form');
  var loginElements = loginFrom.elements;

  for (var i = 0; i < elements.length; i++) { 
    elements[i].setAttribute('disabled', '');
  }

  for (var i = 0; i < loginElements.length; i++) { 
    loginElements[i].removeAttribute('disabled'); 
  }
  var registerCard = document.querySelector('.second-card');
  var loginCard = document.querySelector('.main-card');

  registerCard.classList.remove('rotate-card');
  loginCard.classList.add('rotate-card');

  registerCard.style.zIndex = "0";
  loginCard.style.zIndex = "2";
  }

  var messageBox = document.querySelector('#message-container-menu');

  messageBox.addEventListener('click', function() {
    messageBox.classList.add('scale-out-center');

    setTimeout(function(){
      messageBox.classList.remove('scale-out-center');
      messageBox.style.display = 'none';
      }, 250);
  });
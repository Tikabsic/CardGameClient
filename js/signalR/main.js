
    connection.on("AlreadyInGame", response => {
        var messageBox = document.querySelector('#message-container-menu');
        messageBox.removeAttribute('hidden');
        messageBox.style.display = 'flex';
    
        messageBox.classList.add('shake-vertical');

        setTimeout(function(){
        messageBox.classList.remove('shake-vertical');
        }, 600);

        messageBox.textContent = ('You are already in lobby.');
    });

document.getElementById('join-room-button').addEventListener('click', () => {
    var request = document.querySelector('#room-id').value;
        connection.invoke("JoinRoomById", request).then(roomData => {
            if(roomData !== false){
            sessionStorage.setItem('roomData', JSON.stringify(roomData))

            var data = sessionStorage.getItem('roomData');
            var decodedData = JSON.parse(data);

            roomId = decodedData.roomId;

            var url = 'http://127.0.0.1:5500/room.html?roomId=' + roomId;
            
            window.location.href = url;
            }
            else
            {
            var messageBox = document.querySelector('#message-container-menu');
            messageBox.removeAttribute('hidden');
            messageBox.style.display = 'flex';
                
            messageBox.classList.add('shake-vertical');
            
            setTimeout(function(){
            messageBox.classList.remove('shake-vertical');
            }, 600);
            
            messageBox.textContent = ('Room not exist.');
            }
            });
        });

var messageBox = document.querySelector('#message-container-menu');

messageBox.addEventListener('click', function() {
    messageBox.classList.add('scale-out-center');
  
    setTimeout(function(){
    messageBox.classList.remove('scale-out-center');
    messageBox.style.display = 'none';
    }, 250);
});



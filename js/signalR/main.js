var token = sessionStorage.getItem('jwtToken');

const headers = new Headers();
headers.append("Authorization", "Bearer "+ token);

const options = {
    transport: signalR.HttpTransportType.WebSockets,
    skipNegotiation: true,
    accessTokenFactory: () => token,
    headers: headers 
};

const connection = new signalR.HubConnectionBuilder()
    .configureLogging(signalR.LogLevel.Debug)
    .withUrl("https://localhost:7179/Room")
    .withHubProtocol(new signalR.JsonHubProtocol())
    .withAutomaticReconnect()
    .configureLogging(signalR.LogLevel.Information)
    .withUrl("https://localhost:7179/Room", options)
    .build();
    
    connection.start().then(() => {
        connection.invoke("OnlinePlayersCount").then(playersOnlineCount => {
            document.getElementById('total-players').textContent = 'Total players online : ' +  playersOnlineCount;
        })
        });

        document.getElementById('create-room-button').addEventListener('click', function(response) {
            connection.invoke("CreateRoom").then(roomData => {
                sessionStorage.setItem('roomData', JSON.stringify(roomData))

                var data = sessionStorage.getItem('roomData');
                var decodedData = JSON.parse(data);

                roomId = decodedData.roomId;

                var url = 'http://127.0.0.1:5500/room.html?roomId=' + roomId;
                
                window.location.href = url;
            })});
          
            connection.on("RoomCreated", createdRoom => {
                console.log(createdRoom)
            });

        connection.on("PlayersOnline", playersOnline => {
            document.getElementById('total-players').textContent = 'Total players online : ' +  playersOnline;
        });
    
        connection.on("UpdatePlayersCount", updatedCount => {
            document.getElementById('total-players').textContent = 'Total players online : ' + updatedCount;
        });
        
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


    var messageBox = document.querySelector('#message-container-menu');

    messageBox.addEventListener('click', function() {
        messageBox.classList.add('scale-out-center');
      
        setTimeout(function(){
        messageBox.classList.remove('scale-out-center');
        messageBox.style.display = 'none';
        }, 250);
    });

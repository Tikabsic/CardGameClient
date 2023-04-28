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
    .withUrl("https://localhost:7179/Main")
    .withHubProtocol(new signalR.JsonHubProtocol())
    .withAutomaticReconnect()
    .configureLogging(signalR.LogLevel.Information)
    .withUrl("https://localhost:7179/Main", options)
    .build();
    
    connection.start().then(() => {
        connection.invoke("OnlinePlayersCount").then(playersOnlineCount => {
            document.getElementById('total-players').textContent = 'Total players online : ' +  playersOnlineCount;
        })});

        connection.on("PlayersOnline", playersOnline => {
            document.getElementById('total-players').textContent = 'Total players online : ' +  playersOnline;
        });
    
        connection.on("UpdatePlayersCount", updatedCount => {
            document.getElementById('total-players').textContent = 'Total players online : ' + updatedCount;
        });
        
        connection.on("TotalRoomsCount", totalRoomsCount => {
            document.getElementById('total-rooms'.textContent = 'Total rooms available : ' +totalRoomsCount)
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

    

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
        }).catch(error => {
            console.error(error);
        });
                    document.getElementById('show-player-online').addEventListener('click', function(event) {
            connection.invoke("ShowPlayerName").then(playerNameData => {
                document.getElementById('player-name-request').textContent = 'Player name ' + playerNameData;                })
            });
    
        connection.on("PlayersOnline", playersOnline => {
            document.getElementById('total-players').textContent = 'Total players online : ' +  playersOnline;
        });
    
        connection.on("UpdatePlayersCount", updatedCount => {
            document.getElementById('total-players').textContent = 'Total players online : ' + updatedCount;
        });       
    }).catch(error => {
        console.error(error);
        });



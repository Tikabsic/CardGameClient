var token = sessionStorage.getItem('jwtToken');

var header = {
    Authorization: 'Bearer ' + token
};

const connection = new signalR.HubConnectionBuilder()
    .configureLogging(signalR.LogLevel.Debug)
    .withUrl("https://localhost:7179/room", {headers: header})
    .build();

    connection.start().then(() => {
        connection.invoke("OnlinePlayersCount").then(playersOnlineCount => {
            document.getElementById('total-players').textContent = 'Total players online : ' +  playersOnlineCount;
        }).catch(error => {
            console.error(error);
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

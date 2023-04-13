const connection = new signalR.HubConnectionBuilder()
    .configureLogging(signalR.LogLevel.Debug)
    .withUrl("https://localhost:7179/room")
    .build();

    connection.start().then(() => {
        connection.invoke("OnlinePlayersCount").then(playersOnlineCount => {
            document.getElementById('total-players').textContent = playersOnlineCount;
        }).catch(error => {
            console.error(error);
        });
    
        connection.on("PlayersOnline", playersOnline => { // Update hub method name to 'PlayersOnline'
            document.getElementById('total-players').textContent = playersOnline;
        });
    
        connection.on("UpdatePlayersCount", updatedCount => { // Update hub method name to 'UpdatePlayersCount'
            document.getElementById('total-players').textContent = updatedCount;
        });
    
    }).catch(error => {
        console.error(error);
    });
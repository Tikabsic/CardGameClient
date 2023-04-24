var token = sessionStorage.getItem('jwtToken');
var urlParams = new URLSearchParams(window.location.search);
var roomId = urlParams.get('roomId');

const headers = new Headers();
headers.append("Authorization", "Bearer "+ token);

const options = {
    transport: signalR.HttpTransportType.WebSockets,
    skipNegotiation: true,
    accessTokenFactory: () => token,
    headers: headers 
};

const connection = new signalR.HubConnectionBuilder()
    .withHubProtocol(new signalR.JsonHubProtocol())
    .withAutomaticReconnect()
    .configureLogging(signalR.LogLevel.Information)
    .withUrl("https://localhost:7179/Room", options)
    .build();
    
connection.start().then(() => {
    //connection.invoke("RoomUpdate", roomId).then(data => {
    //    console.log(data);
    //});

    connection.invoke("TotalRoomsCount").then(roomsCount => {
        document.getElementById('total-players').textContent = 'Total players online : ' +  roomsCount;
    })
    
    connection.on("PlayersOnline", playersOnline => {
        document.getElementById('total-players').textContent = 'Total players online : ' +  playersOnline;
    });
        
    connection.on("UpdatePlayersCount", updatedCount => {
        document.getElementById('total-players').textContent = 'Total players online : ' + updatedCount;
    });

    connection.on("PlayerJoined", response => {
        var player = JSON.stringify(response);
        var playerName = player.name;
        var chatBox = document.getElementById('chat-box');
        var newParagraph = document.createElement('p');
        var textNode = document.createTextNode(playerName + ' has joined the game!');

        newParagraph.appendChild(textNode);
        chatBox.appendChild(newParagraph);
    });

    connection.on("RoomUpdated", response => {

        var roomData = sessionStorage.getItem('roomData');
        var decodedRoomData = JSON.parse(roomData);

        document.querySelector('#room-id').textContent = decodedRoomData.roomId;
        document.querySelector('#player-one-info').textContent = decodedRoomData.roomAdmin.name;
        document.querySelector('#player-two-info').textContent = decodedRoomData.players[1].name;
        document.querySelector('#player-three-info').textContent = decodedRoomData.players[2].name;
        document.querySelector('#player-four-info').textContent = decodedRoomData.players[3].name;
        });
    });











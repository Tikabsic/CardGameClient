var token = sessionStorage.getItem('jwtToken');
var payload = sessionStorage.getItem('jwtPayload');
var decodedPayload = JSON.parse(payload);
var urlParams = new URLSearchParams(window.location.search);
var roomIdData = urlParams.get('roomId');

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
    .withUrl("https://localhost:7179/room")
    .withHubProtocol(new signalR.JsonHubProtocol())
    .withAutomaticReconnect()
    .configureLogging(signalR.LogLevel.Information)
    .withUrl("https://localhost:7179/room", options)
    .build();
    
connection.start().then(() => {

    connection.invoke("JoinRoomById", roomIdData)
        .then(data => {
       document.getElementById('room-id').textContent = data.roomId;

       const players = data.players.$values;

       const container = document.getElementById('players-names');

       players.forEach(player => {
           const p = document.createElement('p');
           p.classList.add('player-name');
           p.textContent = player.name;
           container.appendChild(p);
       });
    });

       connection.on("PlayerJoined", response => {
        var playerName = response;
        var chatBox = document.getElementById('chat-box');
        var newParagraph = document.createElement('p');
        var textNode = document.createTextNode(playerName + ' has join the game!');

        newParagraph.appendChild(textNode);
        chatBox.appendChild(newParagraph);
    });

    connection.on("PlayerLeft", response => {
        var playerName = response;
        var chatBox = document.getElementById('chat-box');
        var newParagraph = document.createElement('p');
        var textNode = document.createTextNode(playerName + ' has left the game!');

        newParagraph.appendChild(textNode);
        chatBox.appendChild(newParagraph);
    });
  
    connection.on("ReciveMessage", response => {
        var playerName = response.authorName;
        var playerMessage = response.playerMessage;

        var chatBox = document.getElementById('chat-box');
        var newParagraph = document.createElement('p');
        var textNode = document.createTextNode(playerName + ': ' + playerMessage);

        newParagraph.appendChild(textNode);
        chatBox.appendChild(newParagraph);
        chatBox.scrollTop = chatBox.scrollHeight;
    });

    connection.on("RoomUpdate", response => {
        var roomData = response;

       const players = roomData.players.$values;

       const container = document.getElementById('players-names');

       while (container.firstChild) {
        container.removeChild(container.firstChild);
        }

       players.forEach(player => {
           const p = document.createElement('p');
           p.classList.add('player-name');
           p.textContent = player.name;
           container.appendChild(p);
        });
    });

    connection.on("PlayersOnline", playersOnline => {
        document.getElementById('total-players').textContent = 'Total players online : ' +  playersOnline;
    });
        
    connection.on("UpdatePlayersCount", updatedCount => {
        document.getElementById('total-players').textContent = 'Total players online : ' + updatedCount;
    });

});

    function sendMessage() {
    var chatInput = document.querySelector('#chat-input');
    var authorNameData = decodedPayload.Name;
    var playerMessageData = chatInput.value

    connection.invoke("SendMessage", playerMessageData, authorNameData, roomIdData);
    chatInput.value = '';
    }













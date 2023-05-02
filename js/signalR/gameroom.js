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

       var roomAdmin = data.players.$values.find(p => p.name === decodedPayload.Name && p.role === 2);
       if (roomAdmin) {
         document.getElementById('start-game-button').style.display = 'block';
       } 

       const players = data.players.$values;
       const container = document.getElementById('players-names');
       const admin = data.players.$values.find(p => p.role ===2);      

       while (container.firstChild) {
        container.removeChild(container.firstChild);
        }

       players.forEach(player => {
           const p = document.createElement('p');
           p.classList.add('player-name');
           p.textContent = player.name + ' ' + player.userScore;
           if(player === admin) {
            p.classList.add('room-admin');
           }
           container.appendChild(p);
       });

        var cardsObj = data.deck.cards;
        var cardsArray = Object.values(cardsObj);
        var cards = cardsArray[1];

        console.log(cardsArray);

        cards.forEach( card => {
            const dealerCards = document.getElementById('dealer-cards');
            const dealerCard = document.createElement('div');   
            dealerCard.classList.add('dealer-card');
            dealerCard.style.zIndex = card.index;
            dealerCards.appendChild(dealerCard);
        })
    });

       connection.on("PlayerJoined", response => {
        var playerName = response;
        var chatBox = document.getElementById('chat-box');
        var newParagraph = document.createElement('p');
        var textNode = document.createTextNode(playerName + ' has join the game!');

        newParagraph.appendChild(textNode);
        chatBox.appendChild(newParagraph);
        chatBox.scrollTop = chatBox.scrollHeight;

    });

    connection.on("PlayerLeft", response => {
        var playerName = response;
        var chatBox = document.getElementById('chat-box');
        var newParagraph = document.createElement('p');
        var textNode = document.createTextNode(playerName + ' has left the game!');

        newParagraph.appendChild(textNode);
        chatBox.appendChild(newParagraph);
        chatBox.scrollTop = chatBox.scrollHeight;

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
        const admin = roomData.players.$values.find(p => p.role ===2); 

        while (container.firstChild) {
            container.removeChild(container.firstChild);
            }

        players.forEach(player => {
            const p = document.createElement('p');
            p.classList.add('player-name');
            p.textContent = player.name;
            if(player === admin) {
             p.classList.add('room-admin');
            }
            container.appendChild(p);
        });

        var roomAdmin = response.players.$values.find(p => p.name === decodedPayload.Name && p.role === 2);
        if (roomAdmin) {
          document.getElementById('start-game-button').style.display = 'block';
        }     
    });

    connection.on("GameAlreadyStartedAlert", alert => {
        reciveAlert(alert);
    });

    connection.on("unauthorizedStartAlert", alert => {
        reciveAlert(alert);
    });

    connection.on("unauthorizedStartAlert", alert => {
        reciveAlert(alert);
    });

    connection.on("GameStarted", alert => {
        reciveAlert(alert);
    });

    connection.on("GameNotStartedAlert", alert => {
        reciveAlert(alert);
    });

    connection.on("NotYourTurnAlert", alert => {
        reciveAlert(alert);
    });

    connection.on("MustDrawAlert", alert => {
        reciveAlert(alert);
    });

    connection.on("PlayerTurnErrorAlert", alert => {
        reciveAlert(alert);
    });

    connection.on("NextTrun", alert => {
        reciveAlert(alert);
    });

    connection.on("DeckCheck", alert => {
        var message = JSON.stringify(alert);
        var chatBox = document.getElementById('chat-box');
        var newParagraph = document.createElement('p');
        var textNode = document.createTextNode(message);
        newParagraph.appendChild(textNode);
        chatBox.appendChild(newParagraph);
        chatBox.scrollTop = chatBox.scrollHeight;
    });
});

function reciveAlert(message) {
        var chatBox = document.getElementById('chat-box');
        var newParagraph = document.createElement('p');
        var textNode = document.createTextNode(message);
        newParagraph.appendChild(textNode);
        chatBox.appendChild(newParagraph);
        chatBox.scrollTop = chatBox.scrollHeight;
}

function sendMessage() {    
var chatInput = document.querySelector('#chat-input');
var authorNameData = decodedPayload.Name;
var playerMessageData = chatInput.value

connection.invoke("SendMessage", playerMessageData, authorNameData, roomIdData);
chatInput.value = '';
}










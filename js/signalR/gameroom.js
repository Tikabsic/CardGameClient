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
       
       rotateTable(data)

       var roomAdmin = data.players.$values.find(p => p.name === decodedPayload.Name && p.role === 2);
       if (roomAdmin) {
         document.getElementById('start-game-button').style.display = 'block';
       } 

       const players = data.players.$values;
       const container = document.getElementById('players-names');
       const admin = data.players.$values.find(p => p.role === 2);      

       while (container.firstChild) {
        container.removeChild(container.firstChild);
        }

       players.forEach(player => {
           const p = document.createElement('p');
           p.classList.add('player-name');
           p.textContent = player.listIndex + '.' + ' ' + player.name + ' ' + player.userScore + 'pts.';
           if(player === admin) {
            p.classList.add('room-admin');
           }
           container.appendChild(p);
       });

        var cardsObj = data.deck;
        var cardsArray = Object.values(cardsObj);
        var cards = cardsArray[1];

        console.log(data);

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
            p.textContent = player.listIndex + '.' + ' ' + player.name + ' ' + player.userScore + 'pts.';
            if(player === admin) {
             p.classList.add('room-admin');
            }
            container.appendChild(p);
        });

        var roomAdmin = response.players.$values.find(p => p.name === decodedPayload.Name && p.role === 2);
        if (roomAdmin) {
          document.getElementById('start-game-button').style.display = 'block';
        }
        
        rotateTable(response);
    });

    connection.on("GameAlreadyStartedAlert", alert => {
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

    connection.on("NextTurn", alert => {
        reciveAlert(alert);
    });

    connection.on("AlreadyDrewAlert", alert => {
        reciveAlert(alert);
    });

    connection.on("AlreadyThrewAlert", alert => {
        reciveAlert(alert);
    });

    connection.on("AlreadyDrewStackAlert", alert => {
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

function startGame() {
    connection.invoke("StartGame", roomIdData)
}
function endTurn() {
    connection.invoke("EndTurn", roomIdData)
}
function drawACardFromDeck() {
    connection.invoke("DrawACardFromDeck", roomIdData)
    .then(function(data) {
        console.log(data);
        var cards = document.getElementById('player-bottom');
        var newCard = document.createElement('div');
        newCard.classList.add('player-front-card');
        newCard.style.backgroundImage = `url('/src/img/cards_front/${data.suit}/${data.value}.svg')`;
        cards.appendChild(newCard);

        newCard.addEventListener('click', function(event) {
            var backgroundImage = event.target.style.backgroundImage;
            var match = backgroundImage.match(/\/src\/img\/cards_front\/(\w+)\/(\w+)\.svg/);
            var suit = match[1];
            var value = match[2];
            var cardData = { Suit: suit, Value: value };
            var cardDataJSON = JSON.stringify(cardData);
            console.log(cardDataJSON);

            connection.invoke("ThrowACardToStack", cardDataJSON)          
          });
    })
}

function rotateTable(data){
    var player = data.players.$values.find(p => p.name === decodedPayload.Name);
    var playerPossition = player.listIndex;


    var playerBottom = document.getElementById('player-bottom');
    var playerLeft = document.getElementById('player-left');
    var playerTop = document.getElementById('player-top');
    var playerRight = document.getElementById('player-right');

    playerBottom.textContent = 'Player 1';
    playerLeft.textContent = 'Player 2';
    playerTop.textContent = 'Player 3';
    playerRight.textContent = 'Player 4';

    playerBottom.textContent = data.players.$values.find(p => p.listIndex === 1).name;

    if(data.players.$values.find(p => p.listIndex === 2)?.name !== undefined){
            playerLeft.textContent = data.players.$values.find(p => p.listIndex === 2).name;
    }
    if(data.players.$values.find(p => p.listIndex === 3)?.name !== undefined){
            playerTop.textContent = data.players.$values.find(p => p.listIndex === 3).name;
    }
    if(data.players.$values.find(p => p.listIndex === 4)?.name !== undefined){
            playerRight.textContent = data.players.$values.find(p => p.listIndex === 4).name;
    }

    if(playerPossition === 2){
     playerBottom.id = 'player-right';
     playerLeft.id = 'player-bottom';
     playerTop.id = 'player-left';
     playerRight.id = 'player-top'  
    }

    if(playerPossition === 3){
     playerBottom.id = 'player-top';
     playerLeft.id = 'player-right';
     playerTop.id = 'player-bottom';
     playerRight.id = 'player-left'  
    }

    if(playerPossition === 4){
     playerBottom.id = 'player-left';
     playerLeft.id = 'player-top';
     playerTop.id = 'player-right';
     playerRight.id = 'player-bottom'  
    }
}









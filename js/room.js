var sendButton = document.querySelector('#send-button');
var chatInput = document.querySelector('#chat-input');

chatInput.addEventListener('keydown', function(event) {
    if(event.key === 'Enter') {
        event.preventDefault();
        sendButton.click();

        chatInput.value = '';
    }
});


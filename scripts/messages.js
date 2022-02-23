var entityObj = JSON.parse(localStorage.entity);

var users;
var dataRef = firebase.database().ref('users');
dataRef.on('value', (snapshot) => {
    const data = snapshot.val();
    users = data;
});

var allContacts;
var dataRef2 = firebase.database().ref('contacts');
dataRef2.on('value', (snapshot) => {
    const data = snapshot.val();
    allContacts = data;

    if (allContacts != null) {
        var tempContact = document.querySelector(".dmItem");

        if (typeof(tempContact) == "undefined" || typeof(tempContact) == null) {
            $(".chat").hide();
        } else {
            openChat(users[allContacts[entityObj.id].contacts[0]].id)
        }

        var allItems = document.querySelectorAll(".dmItem");

        for (i = 0; i < allItems.length; i++) {
            allItems[i].addEventListener("click", function () {
                openChat(this.id);
            });
        }
    }
});

var chats;
var dataRef = firebase.database().ref('messages');
dataRef.on('value', (snapshot) => {
    const data = snapshot.val();
    chats = data;

    if(chats != null) {
        var chatID = (parseInt(entityObj.id.slice(0, 15)) + parseInt(document.querySelector(".topBar").id.slice(0, 15))).toString();

        loadChat(document.querySelector(".topBar").id, 
            Object.values(chats[chatID].deleted),
            Object.values(chats[chatID].ids),
            Object.values(chats[chatID].images),
            Object.values(chats[chatID].messages),
            Object.values(chats[chatID].names),
            Object.values(chats[chatID].reactions),
            Object.values(chats[chatID].times)
        );
    }
});

function openChat(targetID) {
    $(".chat").show();
    $(".topBar").html(users[targetID].name);
    document.querySelector(".topBar").id = targetID;
}

function loadChat(targetID, deleted, ids, images, messages, names, reactions, times) {
    $(".messages").html("");

    for(i = 0; i < messages.length; i++) {
        var message = document.createElement("div");
        message.classList.add("message");

        if(ids[i] == entityObj.id) {
            message.id = "user";
        }

        var messageText = document.createElement("div");
        messageText.classList.add("messageText");
        messageText.innerHTML = window.atob(messages[i]);

        if(ids[i] != entityObj.id) {
            var messageDetails = document.createElement("div");
            messageDetails.classList.add("messageDetails");

            var messageName = document.createElement("div");
            messageName.classList.add("messageName");
            messageName.innerHTML = names[i];

            messageDetails.appendChild(messageName);

            var messageImage = document.createElement("div");
            messageImage.classList.add("messageImage");
            messageImage.style.backgroundImage = "url(" + images(i) + ")";

            messageDetails.appendChild(messageImage);

            message.appendChild(messageDetails);
        }

        message.appendChild(messageText);

        document.querySelector(".messages").appendChild(message);
    }
}
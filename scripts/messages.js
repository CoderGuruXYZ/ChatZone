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

        if (typeof (tempContact) == "undefined" || typeof (tempContact) == null) {
            $(".chat").hide();
        } else {
            openChat(users[allContacts[entityObj.id].contacts[0]].id)
        }

        var allItems = document.querySelectorAll(".dmItem");

        for (i = 0; i < allItems.length; i++) {
            allItems[i].addEventListener("click", function () {
                openChat(this.id);

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
            });
        }
    }
});

var chats;
var dataRef = firebase.database().ref('messages');
dataRef.on('value', (snapshot) => {
    const data = snapshot.val();
    chats = data;

    if (chats != null) {
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

function loadChat(targetID, deleted, ids, images, messagesARRAY, names, reactions, times) {
    $(".messages").html("");

    for (i = 0; i < messagesARRAY.length; i++) {
        var message = document.createElement("div");
        message.classList.add("message");

        if (ids[i] == entityObj.id) {
            message.id = "user";
        }

        if (!JSON.parse(deleted[i])) {
            var messageText = document.createElement("div");
            messageText.classList.add("messageText");
            messageText.innerHTML = window.atob(messagesARRAY[i]);

            if (ids[i] != entityObj.id) {
                var messageDetails = document.createElement("div");
                messageDetails.classList.add("messageDetails");

                var messageName = document.createElement("div");
                messageName.classList.add("messageName");
                messageName.innerHTML = names[i];

                messageDetails.appendChild(messageName);

                var messageImage = document.createElement("div");
                messageImage.classList.add("messageImage");
                messageImage.style.backgroundImage = "url(" + images[i] + ")";

                messageDetails.appendChild(messageImage);

                message.appendChild(messageDetails);
            }

            message.appendChild(messageText);

            var messageInfo = document.createElement("div");
            messageInfo.classList.add("messageInfo");
            messageInfo.innerHTML = '<i class="fa-solid fa-ellipsis-vertical"></i>';
            if (ids[i] == entityObj.id) {
                messageInfo.id = "user";
            }

            message.appendChild(messageInfo);
        } else {
            message.style.display = "none";
        }

        document.querySelector(".messages").appendChild(message);
    }

    document.querySelector(".messages").scrollTop = document.querySelector(".messages").scrollHeight - document.querySelector(".messages").clientHeight
}

function sendMessage(message, targetID) {
    if (message.length > 0) {
        var chatID = (parseInt(entityObj.id.slice(0, 15)) + parseInt(targetID.slice(0, 15))).toString();

        var deleted = Object.values(chats[chatID].deleted);
        var ids = Object.values(chats[chatID].ids);
        var images = Object.values(chats[chatID].images);
        var messages = Object.values(chats[chatID].messages);
        var names = Object.values(chats[chatID].names);
        var reactions = Object.values(chats[chatID].reactions);
        var times = Object.values(chats[chatID].times);

        deleted.push(JSON.stringify(false));
        ids.push(entityObj.id);
        images.push(entityObj.image);
        messages.push(window.btoa(message));
        names.push(entityObj.name);
        reactions.push("none");
        times.push(Date.now())

        firebase.database().ref('messages/' + chatID).set({
            messages: messages,
            images: images,
            names: names,
            ids: ids,
            times: times,
            deleted: deleted,
            reactions: reactions,
        });

        document.getElementById("userText").value = "";

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
}

document.querySelector(".sendBtn").addEventListener("click", function () {
    sendMessage(document.getElementById("userText").value, document.querySelector(".topBar").id);
});

window.onkeypress = function (event) {
    if (event.keyCode == "13" && document.getElementById("userText").value.length > 0) {
        sendMessage(document.getElementById("userText").value, document.querySelector(".topBar").id);
    }
};
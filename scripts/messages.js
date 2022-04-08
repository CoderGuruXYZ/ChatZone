var entityObj = JSON.parse(localStorage.entity);

var users;
var dataRef = firebase.database().ref('users');
dataRef.on('value', (snapshot) => {
    const data = snapshot.val();
    users = data;
});

var chats;
var dataRef = firebase.database().ref('messages');
dataRef.once('value', (snapshot) => {
    const data = snapshot.val();
    chats = data;

    var chatID = (parseInt(entityObj.id.slice(0, 15)) + parseInt(document.querySelector(".topBar").id.slice(0, 15))).toString();

    if (chats[chatID].empty != "") {
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
dataRef.on('value', (snapshot) => {
    const data = snapshot.val();
    chats = data;

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
            openChat((allContacts[entityObj.id]).contacts[0]);
        }

        var allItems = document.querySelectorAll(".dmItem");

        for (i = 0; i < allItems.length; i++) {
            allItems[i].addEventListener("click", function (event) {
                if (!event.target.id.includes("del")) {
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
                }
            });
        }

        var allDelContacts = document.querySelectorAll(".dmItemDelete")
        for (i = 0; i < allDelContacts.length; i++) {
            allDelContacts[i].addEventListener("click", function () {
                if (confirm("Are You Sure You Want to Delete this Contact?")) {
                    var parts = this.id.split(",");

                    var targetObj = users[parts[1]];

                    console.log(allContacts);

                    var entityContacts = allContacts[entityObj.id];
                    var targetContacts = allContacts[targetObj.id];

                    allContacts[entityObj.id].contacts.splice(entityContacts['contacts'].indexOf(targetObj.id));
                    allContacts[targetObj.id].contacts.splice(targetContacts['contacts'].indexOf(entityObj.id));

                    if (entityContacts.length < 1) {
                        $(".messages").html("");
                    } else {
                        firebase.database().ref('contacts/' + entityObj.id).set({
                            contacts: entityContacts,
                        });
                    }

                    if (targetContacts.length < 1) {
                        $(".messages").html("");
                    } else {
                        firebase.database().ref('contacts/' + targetObj.id).set({
                            contacts: targetContacts,
                        });
                    }

                    var delMessagesIdx = (parseInt((entityObj.id).slice(0, 15)) + parseInt((document.querySelector(".topBar").id).slice(0, 15))).toString();
                    var delMessagesRef = chats[delMessagesIdx];

                    firebase.database().ref('messages/' + delMessagesIdx).set({
                        empty: "",
                    });

                    window.location.reload();
                }
            });
        }
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
            if (ids[i] == entityObj.id) {
                messageInfo.classList.add("messageInfoUser");
            } else {
                messageInfo.classList.add("messageInfo");
            }
            messageInfo.innerHTML = '<i class="fa-solid fa-ellipsis-vertical"></i>';
            messageInfo.id = i;

            var msgPopup = document.createElement("div");
            msgPopup.classList.add("messagePopup");
            msgPopup.id = "popup" + i.toString();

            var popupPart = document.createElement("div");
            popupPart.classList.add("messagePopupPart");
            popupPart.innerHTML = "Delete Message";
            if (ids[i] == entityObj.id) {
                popupPart.id = "userdel" + i.toString();
            } else {
                popupPart.id = "contdel" + i.toString();
            }

            msgPopup.appendChild(popupPart);

            messageInfo.appendChild(msgPopup);

            message.appendChild(messageInfo);
        } else {
            message.style.display = "none";
        }

        document.querySelector(".messages").appendChild(message);
    }

    document.querySelector(".messages").scrollTop = document.querySelector(".messages").scrollHeight - document.querySelector(".messages").clientHeight

    var allInfos = document.querySelectorAll(".messageInfo");
    for (i = 0; i < allInfos.length; i++) {
        allInfos[i].addEventListener("click", function () {
            document.getElementById("popup" + this.id).style.display = "block";
        });
    }

    var allInfosUser = document.querySelectorAll(".messageInfoUser");
    for (i = 0; i < allInfosUser.length; i++) {
        allInfosUser[i].addEventListener("click", function () {
            if (document.getElementById("popup" + this.id).style.display == "block") {
                document.getElementById("popup" + this.id).style.display = "none";
            } else {
                document.getElementById("popup" + this.id).style.display = "block";
            }
        });
    }

    var allDels = document.querySelectorAll(".messagePopupPart");
    for (i = 0; i < allDels.length; i++) {
        allDels[i].addEventListener("click", function () {
            var temp = split_at_index(this.id, 7);
            var parts = temp.split(",");

            if (parts[0].includes("user")) {
                var entityObj2 = JSON.parse(localStorage.entity);

                var chatID = (parseInt(entityObj2.id.slice(0, 15)) + parseInt(document.querySelector(".topBar").id.slice(0, 15))).toString();

                var deleted = Object.values(chats[chatID].deleted);
                var ids = Object.values(chats[chatID].ids);
                var images = Object.values(chats[chatID].images);
                var messages = Object.values(chats[chatID].messages);
                var names = Object.values(chats[chatID].names);
                var reactions = Object.values(chats[chatID].reactions);
                var times = Object.values(chats[chatID].times);

                deleted[parseInt(parts[1])] = JSON.parse(true);

                firebase.database().ref('messages/' + chatID).set({
                    messages: messages,
                    images: images,
                    names: names,
                    ids: ids,
                    times: times,
                    deleted: deleted,
                    reactions: reactions,
                });

                var allPopups = document.querySelectorAll(".messagePopup");
                for (i = 0; i < allPopups.length; i++) {
                    allPopups[i].style.display = "none;"
                }

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
        })
    }
}

window.addEventListener("click", function (event) {
    if (!event.target.id.includes("popup")) {
        var allPopups = this.document.querySelectorAll(".messagePopup");
        for (i = 0; i < allPopups.length; i++) {
            allPopups[i].style.display = "none;"
        }
    }
});

function split_at_index(value, index) {
    return value.substring(0, index) + "," + value.substring(index);
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

        firebase.database().ref('typing/' + JSON.parse(localStorage.entity).id).set({
            isTyping: JSON.stringify(false),
        });

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

$(function () {
    $('#userText').focus(function () {
        firebase.database().ref('typing/' + JSON.parse(localStorage.entity).id).set({
            isTyping: JSON.stringify(true),
        });
    }).blur(function () {
        firebase.database().ref('typing/' + JSON.parse(localStorage.entity).id).set({
            isTyping: JSON.stringify(false),
        });
    });
});

document.getElementById("userText").oninput = function () {
    if (document.getElementById("userText").value.length < 1) {
        firebase.database().ref('typing/' + JSON.parse(localStorage.entity).id).set({
            isTyping: JSON.stringify(false),
        });
    } else {
        firebase.database().ref('typing/' + JSON.parse(localStorage.entity).id).set({
            isTyping: JSON.stringify(true),
        });
    }
}

var typing;
var dataRef4 = firebase.database().ref('typing/');
dataRef4.on('value', (snapshot) => {
    if (allContacts != null) {
        const data = snapshot.val();
        typing = data;
        var isTargetTyping = typing[document.querySelector(".topBar").id].isTyping;

        if (typing == null) {
            firebase.database().ref('typing/' + JSON.parse(localStorage.entity).id).set({
                isTyping: JSON.stringify(false),
            });

            firebase.database().ref('typing/' + document.querySelector(".topBar").id).set({
                isTyping: JSON.stringify(false),
            });
        } else {
            if (JSON.parse(isTargetTyping)) {
                $(".isTyping").show();
            } else {
                $(".isTyping").hide();
            }
        }
    }
});
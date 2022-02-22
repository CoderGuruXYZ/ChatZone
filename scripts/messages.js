var entityObj = JSON.parse(localStorage.entity);

var users;
var dataRef = firebase.database().ref('users');
dataRef.on('value', (snapshot) => {
    const data = snapshot.val();
    users = data;
});

var allContacts;
var dataRef2 = firebase.database().ref('contacts');
dataRef2.once('value', (snapshot) => {
    const data = snapshot.val();
    allContacts = data;

    var tempContact = document.querySelector(".dmItem");

    if(typeof(tempContact) == "undefined" || typeof(tempContact) == null) {
        $(".chat").hide();
    } else {
        openChat(users[allContacts[entityObj.id].contacts[0]].id)
    }

    var allItems = document.querySelectorAll(".dmItem");

    for(i = 0; i < allItems.length; i++) {
        allItems[i].addEventListener("click", function() {
            openChat(this.id);
        });
    }
});

function openChat(targetID) {
    $(".topBar").html(users[targetID].name);
}
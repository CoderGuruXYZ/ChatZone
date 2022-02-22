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
});

var entityObj = JSON.parse(localStorage.entity);

if(allContacts == null) {
    $(".chat").hide();
} else {
    openChat(users[allContacts[entityObj.id].contacts[i]].id)
}

function openChat(targetID) {
    $(".topBar").html(users[targetID].name);
}
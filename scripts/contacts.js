var isPopup;

document.querySelector(".newDM").addEventListener("click", function () {
    $(".overlay").show();
    $(".newMessage").show();

    isPopup = true;
});

document.querySelector(".cancelContact").addEventListener("click", function () {
    if (isPopup) {
        $(".overlay").hide();
        $(".newMessage").hide();
        $(".errorMsg").hide();

        document.querySelector(".contact").value = "";

        isPopup = false;
    }
});

document.querySelector(".confirmContact").addEventListener("click", function () {
    addNewContact();
});

window.onkeypress = function (event) {
    if (event.keyCode == "13" && isPopup) {
        addNewContact();
    }
};

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

    loadContacts();
    window.location.reload();
});

let contactVar, contactVar2;

function addNewContact() {
    var entityObj = JSON.parse(localStorage.entity);

    if (isPopup) {
        var test = document.querySelector(".contact").value.toLowerCase();

        if (test.length < 0) {
            document.querySelector(".errorMsg").innerHTML = "Please Enter an Email";
            $(".errorMsg").show();
        } else {
            if (test.indexOf("@") < 0) {
                document.querySelector(".errorMsg").innerHTML = "Please Enter a Valid Email";
                $(".errorMsg").show();
            } else {
                if (test.indexOf(".") < 0) {
                    document.querySelector(".errorMsg").innerHTML = "Please Enter a Valid Email";
                    $(".errorMsg").show();
                }
            }
        }
        
        var verif = false;

        var neededID;

        var usersArray = Object.keys(users);

        for (i = 0; i < usersArray.length; i++) {
            var emailTest;
            var emailRef = firebase.database().ref('users/' + usersArray[i] + '/email');
            emailRef.on('value', (snapshot) => {
                const data = snapshot.val();
                emailTest = data;
            });

            if (emailTest == test) {
                var emailRef = firebase.database().ref('users/' + usersArray[i] + '/id');
                emailRef.on('value', (snapshot) => {
                    const data = snapshot.val();
                    neededID = data;
                });

                verif = true;

                break;
            }
        }

        if (!verif) {
            document.querySelector(".errorMsg").innerHTML = "Address Not Registered";
            $(".errorMsg").show();
        }

        var verif2 = true;

        if(allContacts != null && allContacts[entityObj.id] != null) {
            for(i = 0; i < (allContacts[entityObj.id].contacts).length; i++) {
                if(users[allContacts[entityObj.id].contacts[i]].email == test) {
                    verif2 = false;
                    break;
                }
            }
        }
        
        if (!verif2) {
            document.querySelector(".errorMsg").innerHTML = "Can't Add Existing Contact";
            $(".errorMsg").show();
        }

        var verif3 = true;

        if(test == entityObj.email) {
            verif3 = false;
        }

        if (!verif3) {
            document.querySelector(".errorMsg").innerHTML = "You Can't Add Yourself";
            $(".errorMsg").show();
        }

        if (verif && verif2 && verif3) {
            var targetID2;

            var emailRef25 = firebase.database().ref('users/' + neededID + '/id');
            emailRef25.on('value', (snapshot) => {
                const data = snapshot.val();
                targetID2 = data;
            });

            var check = firebase.database().ref("contacts/" + entityObj.id.toString());
            check.once("value", function (snapshot) {
                if (snapshot.exists()) {
                    contactVar = allContacts[entityObj.id].contacts;

                    var personContacts = contactVar;

                    personContacts.push(targetID2);

                    firebase.database().ref('contacts/' + entityObj.id).set({
                        contacts: personContacts,
                    });
                } else {
                    firebase.database().ref('contacts/' + entityObj.id).set({
                        contacts: [targetID2],
                    });
                }
            });

            var targetID;

            var emailRef3 = firebase.database().ref('users/' + entityObj.id + '/id');
            emailRef3.on('value', (snapshot) => {
                const data = snapshot.val();
                targetID = data;
            });

            var check2 = firebase.database().ref("contacts/" + neededID);
            check2.once("value", function (snapshot) {
                if (snapshot.exists()) {
                    var dataRef2 = firebase.database().ref('contacts/' + neededID.toString());
                    dataRef2.on('value', (snapshot) => {
                        contactVar2 = snapshot.val().contacts;
                    });

                    var personContacts = contactVar2;

                    personContacts.push(targetID);

                    firebase.database().ref('contacts/' + neededID).set({
                        contacts: personContacts,
                    });
                } else {
                    firebase.database().ref('contacts/' + neededID).set({
                        contacts: [targetID],
                    });
                }
            });

            firebase.database().ref('messages/' + (parseInt(entityObj.id.slice(0, 15)) + parseInt(neededID.slice(0, 15))).toString()).set({
                messages: [window.btoa("Hi!")],
                images: [entityObj.image],
                names: [entityObj.name],
                ids: [entityObj.id],
                times: [Date.now()],
                deleted: [JSON.stringify(false)],
                reactions: ["none"],
            });

            $(".overlay").hide();
            $(".newMessage").hide();
            $(".errorMsg").hide();

            document.querySelector(".contact").value = "";

            isPopup = false;

            window.location.reload();
        }
    }
}

loadContacts();

function loadContacts() {
    function createContact(name, email, id) {
        var dmItem = document.createElement("div");
        dmItem.classList.add("dmItem");
        dmItem.id = id;

        var dmItemDelete = document.createElement("div");
        dmItemDelete.classList.add("dmItemDelete");
        dmItemDelete.id = "del," + id;
        dmItemDelete.innerHTML = '<i class="fa-solid fa-trash"></i>';

        dmItem.appendChild(dmItemDelete);

        var dmItemName = document.createElement("div");
        dmItemName.classList.add("dmItemName");
        dmItemName.innerHTML = name;

        dmItem.appendChild(dmItemName);

        var dmItemEmail = document.createElement("div");
        dmItemEmail.classList.add("dmItemEmail");
        dmItemEmail.innerHTML = email;

        dmItem.appendChild(dmItemEmail);

        return dmItem;
    }

    document.querySelector(".dmList").innerHTML = "";

    var entityObj = JSON.parse(localStorage.entity);

    var check = firebase.database().ref("contacts/" + entityObj.id.toString());
    check.once("value", function (snapshot) {
        if (snapshot.exists()) {
            var tempVar;

            var dataRef2 = firebase.database().ref('contacts/' + entityObj.id.toString());
            dataRef2.on('value', (snapshot) => {
                tempVar = snapshot.val().contacts;
            });

            var personContacts = tempVar;

            for (i = 0; i < personContacts.length; i++) {
                var tempName = users[personContacts[i]].name;
                var tempEmail = users[personContacts[i]].email;
                var tempID = users[personContacts[i]].id;

                document.querySelector(".dmList").appendChild(createContact(tempName, tempEmail, tempID));
            }
        }
    });
}
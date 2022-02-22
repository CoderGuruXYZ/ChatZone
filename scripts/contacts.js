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
});

let contactVar, contactVar2;

function addNewContact() {
    if (isPopup) {
        var test = document.querySelector(".contact").value;

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

        if (verif) {
            var entityObj = JSON.parse(localStorage.entity);

            var targetID2;

            var emailRef25 = firebase.database().ref('users/' + entityObj.id + '/id');
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

            var emailRef3 = firebase.database().ref('users/' + neededID + '/id');
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

            $(".overlay").hide();
            $(".newMessage").hide();
            $(".errorMsg").hide();

            document.querySelector(".contact").value = "";

            isPopup = false;
        }
    }
}
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

var conts, conts2;

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

            var check = firebase.database().ref("contacts/" + entityObj.id.toString());
            check.once("value", function (snapshot) {
                if (snapshot.exists()) {
                    var dataRef = firebase.database().ref('contacts/' + entityObj.id);
                    dataRef.on('value', (snapshot) => {
                        const data = snapshot.val().contacts;
                        conts = data;
                    });

                    var personContacts = Object.values(conts);

                    personContacts.push(test);

                    firebase.database().ref('contacts/' + entityObj.id).set({
                        contacts: personContacts,
                    });
                } else {
                    firebase.database().ref('contacts/' + entityObj.id).set({
                        contacts: [test],
                    });
                }
            });

            var targetEmail;

            var emailRef3 = firebase.database().ref('users/' + entityObj.id + '/email');
            emailRef3.on('value', (snapshot) => {
                const data = snapshot.val();
                targetEmail = data;
            });

            var check2 = firebase.database().ref("contacts/" + neededID);
            check2.once("value", function (snapshot) {
                if (snapshot.exists()) {
                    var dataRef2 = firebase.database().ref('contacts/' + neededID.toString());
                    dataRef2.on('value', (snapshot) => {
                        conts2 = snapshot.val().contacts;
                    });

                    console.log(conts2);

                    var personContacts = Object.values(conts2);

                    personContacts.push(targetEmail);

                    firebase.database().ref('contacts/' + neededID).set({
                        contacts: personContacts,
                    });
                } else {
                    firebase.database().ref('contacts/' + neededID).set({
                        contacts: [targetEmail],
                    });
                }
            });

            $(".overlay").hide();
            $(".newMessage").hide();

            document.querySelector(".contact").value = "";

            isPopup = false;
        }
    }
}
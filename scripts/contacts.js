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

        var users, neededID;

        var dataRef = firebase.database().ref('users');
        console.log(dataRef);
        dataRef.on('value', (snapshot) => {
            const data = snapshot.val();
            users = data;
        });

        console.log(users);

        var usersArray = Object.keys(users);

        console.log(usersArray)

        for (i = 0; i < usersArray.length; i++) {
            var emailTest;
            var emailRef = firebase.database().ref('users/' + i + '/email');
            emailRef.on('value', (snapshot) => {
                const data = snapshot.val();
                emailTest = data;
            });

            console.log(emailTest);

            if (emailTest == test) {
                var emailRef = firebase.database().ref('users/' + i + '/id');
                emailRef.on('value', (snapshot) => {
                    const data = snapshot.val();
                    neededID = data;
                });

                console.log(neededID);
                
                verif = true;

                break;
            }
        }

        if(!verif) {
            document.querySelector(".errorMsg").innerHTML = "Address Not Registered";
            $(".errorMsg").show();
        }

        if (verif) {
            var entityObj = JSON.parse(localStorage.entity);

            var check = firebase.database().ref("contacts/" + entityObj.id);
            check.once("value", function (snapshot) {
                if (snapshot.exists()) {
                    var conts;

                    var dataRef = firebase.database().ref('contacts/' + entityObj.id);
                    dataRef.on('value', (snapshot) => {
                        const data = snapshot.val();
                        conts = data;
                    });

                    var personContacts = Object.values(conts.contacts);

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

            $(".overlay").hide();
            $(".newMessage").hide();

            document.querySelector(".contact").value = "";

            isPopup = false;
        }
    }
}
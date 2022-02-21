var isPopup;

document.querySelector(".newDM").addEventListener("click", function() {
    $(".overlay").show();
    $(".newMessage").show();

    isPopup = true;
});

document.querySelector(".cancelContact").addEventListener("click", function() {
    if(isPopup) {
        $(".overlay").hide();
        $(".newMessage").hide();

        isPopup = false;
    }
});

document.querySelector(".confirmContact").addEventListener("click", function() {
    if(isPopup) {
        var test = document.querySelector(".contact").value;

        if(test.length < 0) {
            document.querySelector(".errorMsg").innerHTML = "Please Enter an Email";
            $(".errorMsg").show();
        } else {
            if(test.indexOf("@") < 0) {
                document.querySelector(".errorMsg").innerHTML = "Please Enter a Valid Email";
                $(".errorMsg").show(); 
            } else {
                if(test.indexOf(".") < 0) {
                    document.querySelector(".errorMsg").innerHTML = "Please Enter a Valid Email";
                    $(".errorMsg").show(); 
                }
            }
        }

        var verif = true;

        if(verif) {
            var entityObj = JSON.parse(localStorage.entity);

            var check = firebase.database().ref().orderByKey().equalTo("contacts/" + entityObj.id).once("value", function (snapshot) {
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

            isPopup = false;
        }
    }
});
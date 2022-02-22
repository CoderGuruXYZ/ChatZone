const firebaseConfig = {
    apiKey: "AIzaSyCpJKBYr3gFkRfccnY9DymrU14P__-k9Xc",
    authDomain: "chatzone-342009.firebaseapp.com",
    projectId: "chatzone-342009",
    storageBucket: "chatzone-342009.appspot.com",
    messagingSenderId: "632326632383",
    appId: "1:632326632383:web:f3ccd9cb464123a859e70a"
}

firebase.initializeApp(firebaseConfig);

if (window.location.href.includes("messages")) {
    var contactsJS = document.createElement("script");
    contactsJS.src = "scripts/contacts.js";
    document.body.appendChild(contactsJS);

    window.setTimeout(function () {
        var messagesJS = document.createElement("script");
        messagesJS.src = "scripts/messages.js";
        document.body.appendChild(messagesJS);
    }, 250);
}
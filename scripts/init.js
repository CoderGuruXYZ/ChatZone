const firebaseConfig = {
    apiKey: "AIzaSyCpJKBYr3gFkRfccnY9DymrU14P__-k9Xc",
    authDomain: "chatzone-342009.firebaseapp.com",
    projectId: "chatzone-342009",
    storageBucket: "chatzone-342009.appspot.com",
    messagingSenderId: "632326632383",
    appId: "1:632326632383:web:f3ccd9cb464123a859e70a"
}

firebase.initializeApp(firebaseConfig);

// function randomInRange(min, max) {
//     return Math.floor(Math.random() * (max - min + 1) + min);
// }

// if (localStorage.user == null) {
//     localStorage.setItem("user", window.btoa(randomInRange(0, 1000000)));

//     var colours = ["green", "blue", "red", "yellow", "purple", "orange", "pink"];

//     var idx = randomInRange(0, colours.length);
//     localStorage.setItem("userColour", colours[idx]);
// }

// if(localStorage.userName == null) {
//     var userName = prompt("Enter a Username: ");

//     localStorage.setItem("userName", userName);
// }
const firebaseConfig = {
    apiKey: "AIzaSyAkvxXnTTPEaL02E4yLPSCIN4nqjpEGs-M",
    authDomain: "chatzone-e027a.firebaseapp.com",
    projectId: "chatzone-e027a",
    storageBucket: "chatzone-e027a.appspot.com",
    messagingSenderId: "618566330402",
    appId: "1:618566330402:web:116af9aacdf4ad308cc27b"
};

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
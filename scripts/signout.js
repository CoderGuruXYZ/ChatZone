function signOut() {
    // var auth2 = gapi.auth2.getAuthInstance();
    // auth2.signOut().then(function () {
    //     console.log('User Signed Out.');
    // });

    GoogleAuth.signOut();
};

document.getElementById("signoutBtn").addEventListener("click", function() {
    localStorage.setItem("loggedIn", JSON.stringify(false));

    signOut();

    window.setTimeout(function() {
        window.location.href = "login.html";
    }, 100);
})
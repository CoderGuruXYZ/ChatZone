gapi.load('auth2', function() {
    gapi.auth2.init();
});

document.getElementById("signoutBtn").addEventListener("click", function() {
    localStorage.setItem("loggedIn", JSON.stringify(false));

    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        localStorage.removeItem("entity");
    });

    window.setTimeout(function() {
        window.location.href = "login.html";
    }, 100);
})
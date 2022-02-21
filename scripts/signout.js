document.getElementById("signoutBtn").addEventListener("click", function() {
    localStorage.setItem("loggedIn", JSON.stringify(false));

    window.setTimeout(function() {
        window.location.href = "login.html";
    }, 100);
})
if(localStorage.loggedIn == null) {
    localStorage.setItem("loggedIn", JSON.stringify(false));
}

if(window.location.href == "login.html") {
    if(JSON.parse(localStorage.loggedIn)) {
        window.location.href = "home.html";
    }
} else {
    if(JSON.parse(localStorage.loggedIn)) {
        window.location.href = "home.html";
    } else {
        window.location.href = "login.html";
    }
}
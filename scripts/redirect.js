if(localStorage.loggedIn == null) {
    localStorage.setItem("loggedIn", JSON.stringify(false));
}

if(window.location.href.includes("login.html")) {
    if(JSON.parse(localStorage.loggedIn)) {
        window.location.href = "home.html";
    }
} else if(window.location.href.includes("home.html")) {
    if(!window.location.href.includes("127")) {
        if(!JSON.parse(localStorage.loggedIn)) {
            window.location.href = "login.html";
        }
    }
} else {
    if(JSON.parse(localStorage.loggedIn)) {
        window.location.href = "home.html";
    } else {
        window.location.href = "login.html";
    }
}
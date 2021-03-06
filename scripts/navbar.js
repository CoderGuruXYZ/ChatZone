var nav = document.querySelector("nav");
nav.innerHTML = "";

var title = document.createElement("div");
title.classList.add("title");
title.innerHTML = '<i class="fa-solid fa-comment"></i><div class="titleTextContainer">ChatZone</div>';

nav.appendChild(title);

var user = document.createElement("div");
user.classList.add("user");

var userName = document.createElement("div");
userName.classList.add("userName");
userName.innerHTML = "Username";

user.appendChild(userName);

var userImage = document.createElement("div");
userImage.classList.add("userImage");

user.appendChild(userImage);

nav.appendChild(user);

var links = document.createElement("div");
links.classList.add("links");

var names = ["Messages", "Groups", "Settings"];
var hrefs = ["messages.html", "#", "#"];
var icons = ['<i class="fa-solid fa-message"></i>', '<i class="fa-solid fa-users"></i>', '<i class="fa-solid fa-gear"></i>']

for (i = 0; i < names.length; i++) {
    var link = document.createElement("a");
    link.classList.add("link");
    link.href = hrefs[i];
    link.innerHTML = '<div class = "linkTextContainer">' + names[i]  + '</div> ' + icons[i];

    links.appendChild(link);
}

nav.appendChild(links);

var bottomNav = document.createElement("div");
bottomNav.classList.add("bottomNav");

var signout = document.createElement("div");
signout.classList.add("signout");

var signoutBtn = document.createElement("button");
signoutBtn.id = "signoutBtn";
signoutBtn.innerHTML = "Sign Out";

signout.appendChild(signoutBtn);

bottomNav.appendChild(signout);

var collapse = document.createElement("div");
collapse.classList.add("collapse");

var collapseBtn = document.createElement("div");
collapseBtn.id = "collapseBtn";
collapseBtn.innerHTML = '<i class="fa-solid fa-circle-chevron-left"></i>';

collapse.appendChild(collapseBtn);

bottomNav.appendChild(collapse);

nav.appendChild(bottomNav);

function collapseNav() {
    $(".userName").toggleClass("collapsed");
    $("nav").toggleClass("collapsed");
    $(".linkTextContainer").toggleClass("collapsed");
    $(".signout").toggleClass("collapsed");
    $(".collapse").toggleClass("collapsed");
    $("#signoutBtn").toggleClass("collapsed");
    $(".link").toggleClass("collapsed");
    $(".titleTextContainer").toggleClass("collapsed");
    $(".title").toggleClass("collapsed");

    if (document.getElementById("collapseBtn").innerHTML.includes("left")) {
        document.getElementById("collapseBtn").innerHTML = '<i class="fa-solid fa-circle-chevron-right"></i>';
        localStorage.setItem("collapse", "collapsed");
    } else {
        document.getElementById("collapseBtn").innerHTML = '<i class="fa-solid fa-circle-chevron-left"></i>';
        localStorage.setItem("collapse", "uncollapsed");
    }

    if(window.location.href.includes("messages")) {
        $(".dmWindow").toggleClass("collapsed");
        $(".dms").toggleClass("collapsed");
        $(".chat").toggleClass("collapsed");
    }
}

document.getElementById("collapseBtn").onclick = function () {
    collapseNav();
}

if (window.location.href.includes("home") || window.location.href.includes("messages")) {
    var signout = document.createElement("script");
    signout.src = "scripts/signout.js";
    document.body.appendChild(signout);
}

var entity = JSON.parse(localStorage.entity);

$(".userName").html(entity.name);
document.querySelector(".userImage").style.backgroundImage = 'url(' + entity.image + ')';

if(localStorage.collapse == null) {
    localStorage.setItem("collapse", "uncollapsed");
} else if(localStorage.collapse == "collapsed") {
    collapseNav();
}
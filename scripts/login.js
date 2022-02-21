const queryString = window.location.search;

if (queryString.indexOf("?") > -1) {
    const urlParams = new URLSearchParams(queryString);

    var check = urlParams.get("signout");

    if (JSON.parse(check)) {
        var auth2 = gapi.auth2.getAuthInstance();
        auth2.signOut();
    }
}

function onSignIn(googleUser) {
    var profile = googleUser.getBasicProfile();

    var entity = {
        id: profile.getId(),
        name: profile.getName(),
        image: profile.getImageUrl(),
        email: profile.getEmail(),
    }

    localStorage.setItem("entity", JSON.stringify(entity));
    localStorage.setItem("loggedIn", JSON.stringify(true));

    setData(entity);

    window.setTimeout(function () {
        window.location.href = "home.html";
    }, 100);
}

function setData(entityObj) {
    firebase.database().ref('users/' + entityObj.id).set({
        id: entityObj.id,
        name: entityObj.name,
        image: entityObj.image,
        email: entityObj.email,
    });
}
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

    firebase.database().ref('typing/' + entityObj.id).set({
        isTyping: JSON.stringify(false),
    });

    firebase.database().ref('contacts/' + entityObj.id).set({
        contacts: [],
    });
}
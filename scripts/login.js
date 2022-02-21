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
}
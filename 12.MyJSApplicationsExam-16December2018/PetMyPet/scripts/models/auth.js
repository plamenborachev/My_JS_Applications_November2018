let auth = (() => {
    function saveSession(userInfo) {
        sessionStorage.setItem('authtoken', userInfo._kmd.authtoken);
        sessionStorage.setItem('userId', userInfo._id);
        sessionStorage.setItem('username', userInfo.username);
    }

    function login(username, password) {
        let userData = { username, password };
        return requester.post('user', 'login', 'basic', userData);
    }

    function register(username, password) {
        let userData = { username, password };
        return requester.post('user', '', 'basic', userData);
    }

    function logout() {
        let logoutData = {
            authtoken: sessionStorage.getItem('authtoken')
        };

        return requester.post('user', '_logout', 'kinvey', logoutData);
    }

    return {
        saveSession,
        login,
        register,
        logout
    }
})();
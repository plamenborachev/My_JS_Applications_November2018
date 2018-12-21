let advertsService = (() => {
    function loadAdverts() {
        // Request {{teams}} from db
        return requester.get('appdata', 'adverts', 'kinvey');
    }

    function loadAdDetails(adId) {
        return requester.get('appdata', 'adverts/' + adId, 'kinvey');
    }

    function createAdvert(title, description, publisher, price, imageUrl) {
        let advertData = {title, description, publisher, price, imageUrl};

        return requester.post('appdata', 'adverts', 'kinvey', advertData);
    }

    function edit(advertId, title, description, publisher, price, imageUrl) {
        let advertData = {
            title: title,
            description: description,
            publisher: sessionStorage.getItem('username'),
            price: price,
            imageUrl: imageUrl
        };
        return requester.update('appdata', 'adverts/' + advertId, 'kinvey', advertData);
    }

    function remove(advertId) {
        return requester.remove('appdata', 'adverts/' + advertId, 'kinvey');
    }

    // function joinTeam(adId) {
    //     let userData = {
    //         username: sessionStorage.getItem('username'),
    //         adId: adId
    //     };
    //     return requester.update('user', sessionStorage.getItem('userId'), 'kinvey', userData);
    // }

    // function leaveTeam() {
    //     let userData = {
    //         username: sessionStorage.getItem('username'),
    //         adId: ''
    //     };
    //
    //    return requester.update('user', sessionStorage.getItem('userId'), userData, 'kinvey');
    // }

    return {
        loadAdverts,
        loadAdDetails,
        createAdvert,
        edit,
        remove
        // joinTeam,
        // leaveTeam
    }
})();
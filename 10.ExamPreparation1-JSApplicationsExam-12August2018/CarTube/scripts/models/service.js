let service = (() => {
    function loadItems() {
        return requester.get('appdata', 'cars', 'kinvey');
    }

    function loadItemDetails(carId) {
        return requester.get('appdata', 'cars/' + carId, 'kinvey');
    }

    function createItem(seller, title, description, imageUrl, brand, model, fuel, year, price) {
        let data = {seller, title, description, imageUrl, brand, model, fuel, year, price};

        return requester.post('appdata', 'cars', 'kinvey', data);
    }

    function edit(carId, seller, title, description, imageUrl, brand, model, fuel, year, price) {
        let data = {seller, title, description, imageUrl, brand, model, fuel, year, price};
        return requester.update('appdata', 'cars/' + carId, 'kinvey', data);
    }

    function remove(carId) {
        return requester.remove('appdata', 'cars/' + carId, 'kinvey');
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
        loadItems,
        loadItemDetails,
        createItem,
        edit,
        remove
        // joinTeam,
        // leaveTeam
    }
})();
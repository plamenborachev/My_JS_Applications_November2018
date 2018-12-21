//Change "collectionName" and parameters of "createItem" and "edit"

let service = (() => {
    let collectionName = 'flights';

    function loadItems() {
        return requester.get('appdata', collectionName, 'kinvey');
    }

    function loadPublicItems() {
        return requester.get('appdata', collectionName, 'kinvey');
    }

    function loadItemDetails(itemId) {
        return requester.get('appdata', collectionName + '/' + itemId, 'kinvey');
    }

    function createItem(destination, origin, departureDate, departureTime, seats, cost, img, isPublic) {
        let data = {destination, origin, departureDate, departureTime, seats, cost, img, isPublic};

        return requester.post('appdata', collectionName, 'kinvey', data);
    }

    function edit(itemId, destination, origin, departureDate, departureTime, seats, cost, img, isPublic) {
        let data = {destination, origin, departureDate, departureTime, seats, cost, img, isPublic};
        return requester.update('appdata', collectionName + '/' + itemId, 'kinvey', data);
    }

    function remove(itemId) {
        return requester.remove('appdata', collectionName + '/' + itemId, 'kinvey');
    }

    // function joinTeam(adId) {
    //     let userData = {
    //         username: sessionStorage.getItem('username'),
    //         adId: adId
    //     };
    //     return requester.update('user', sessionStorage.getItem('userId'), 'kinvey', userData);
    // }
    //
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
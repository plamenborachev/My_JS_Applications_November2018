let service = (() => {
    let collectionName = 'pets';

    function loadItems() {
        return requester.get('appdata', collectionName, 'kinvey');
    }

    function loadItemDetails(itemId) {
        return requester.get('appdata', collectionName + '/' + itemId, 'kinvey');
    }

    function createItem(name, description, imageURL, category, likes) {
        let data = {name, description, imageURL, category, likes};

        return requester.post('appdata', collectionName, 'kinvey', data);
    }

    function edit(itemId, name, description, imageURL, category, likes) {
        let data = { name, description, imageURL, category, likes };
        return requester.update('appdata', collectionName + '/' + itemId, 'kinvey', data);
    }

    function remove(itemId) {
        return requester.remove('appdata', collectionName + '/' + itemId, 'kinvey');
    }

    return {
        loadItems,
        loadItemDetails,
        createItem,
        edit,
        remove
    }
})();
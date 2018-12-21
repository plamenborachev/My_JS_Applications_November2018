let handlers = (() => {
    function displayHome(ctx) {
        ctx.loggedIn = sessionStorage.getItem("authtoken") !== null;
        ctx.username = sessionStorage.getItem("username");
        ctx.loadPartials({
            header: "./templates/common/header.hbs",
            footer: "./templates/common/footer.hbs"
        }).then(function () {
            this.partial("./templates/home/home.hbs")
        })
    }

    function getLogin(ctx) {
        ctx.loggedIn = sessionStorage.getItem("authtoken") !== null;
        ctx.username = sessionStorage.getItem("username");

        ctx.loadPartials({
            header: "./templates/common/header.hbs",
            footer: "./templates/common/footer.hbs",
            loginForm: "./templates/login/loginForm.hbs"
        }).then(function () {
            this.partial("./templates/login/loginPage.hbs")
        })
    }

    function postLogin(ctx) {
        let username = ctx.params.username;
        let password = ctx.params.password;

        if (username.length < 3) {
            notifications.showError("Username must be at least 3 symbols");
        } else if (password.length < 6) {
            notifications.showError("Password must be at least 6 symbols");
        } else if (username === "") {
            notifications.showError("Username should be non-empty");
        } else if (password === "") {
            notifications.showError("Password should be non-empty");
        } else {
            auth.login(username, password)
                .then(function (userInfo) {
                    auth.saveSession(userInfo);
                    notifications.showInfo("Login successful.");
                    ctx.redirect("#/home");
                }).catch(notifications.handleError);
        }
    }

    function logout(ctx) {
        auth.logout()
            .then(function () {
                sessionStorage.clear();
                notifications.showInfo("Logout successful.");
                ctx.redirect("#/home");
                // getLogin(ctx);
            }).catch(notifications.handleError)
    }

    function getRegister(ctx) {
        ctx.loggedIn = sessionStorage.getItem("authtoken") !== null;
        ctx.username = sessionStorage.getItem("username");

        this.loadPartials({
            header: "./templates/common/header.hbs",
            footer: "./templates/common/footer.hbs",
            registerForm: "./templates/register/registerForm.hbs"
        }).then(function () {
            this.partial("./templates/register/registerPage.hbs")
        })
    }

    function postRegister(ctx) {
        let username = ctx.params.username;
        let password = ctx.params.password;

        if (username.length < 3) {
            notifications.showError("Username must be at least 3 symbols");
        } else if (password.length < 6) {
            notifications.showError("Password must be at least 6 symbols");
        } else if (username === "") {
            notifications.showError("Username should be non-empty");
        } else if (password === "") {
            notifications.showError("Password should be non-empty");
        } else {
            auth.register(username, password)
                .then(function (userInfo) {
                    auth.saveSession(userInfo);
                    notifications.showInfo("User registration successful.");
                    ctx.redirect("#/home");
                }).catch(notifications.handleError);
        }
    }

    function getCreate(ctx) {
        ctx.loggedIn = sessionStorage.getItem("authtoken") !== null;
        ctx.username = sessionStorage.getItem("username");

        ctx.loadPartials({
            header: "./templates/common/header.hbs",
            footer: "./templates/common/footer.hbs",
            createForm: "./templates/create/createForm.hbs"
        }).then(function () {
            this.partial("./templates/create/createPage.hbs")
        })
    }

    function postCreate(ctx) {
        let name = ctx.params.name;
        let description = ctx.params.description;
        let imageURL = ctx.params.imageURL;
        let category = ctx.params.category;

        service.createItem(name, description, imageURL, category, 0)
            .then(function (adInfo) {
                notifications.showInfo("Pet created.");
                ctx.redirect("#/home");
                // displayCatalog(ctx);
            })
            .catch(notifications.handleError);
    }

    function getEdit(ctx) {
        ctx.loggedIn = sessionStorage.getItem("authtoken") !== null;
        ctx.username = sessionStorage.getItem("username");
        let itemId = ctx.params.id.substr(1);
        service.loadItemDetails(itemId)
            .then(function (itemInfo) {
                ctx.itemId = itemId;
                ctx.description = itemInfo.description;
                ctx.name = itemInfo.name;
                ctx.category = itemInfo.category;
                ctx.likes = itemInfo.likes;
                ctx.imageURL = itemInfo.imageURL;

                ctx.loadPartials({
                    header: "./templates/common/header.hbs",
                    footer: "./templates/common/footer.hbs",
                    editForm: "./templates/edit/editForm.hbs"
                }).then(function () {
                    this.partial("./templates/edit/editPage.hbs")
                })
            })
            .catch(notifications.handleError);
    }

    function postEdit(ctx) {
        let itemId = ctx.params.id.substr(1);
        let description = ctx.params.description;
        let name = ctx.params.name;
        let category = ctx.params.category;
        let likes = ctx.params.likes;
        let imageURL = ctx.params.imageURL;

        service.edit(itemId, name, description, imageURL, category, likes)
            .then(function (adInfo) {
                notifications.showInfo("Updated successfully!");
                ctx.redirect("#/viewCatalog");
            })
            .catch(notifications.handleError);
    }

    function getRemove(ctx) {
        ctx.loggedIn = sessionStorage.getItem("authtoken") !== null;
        ctx.username = sessionStorage.getItem("username");
        let itemId = ctx.params.id.substr(1);
        service.loadItemDetails(itemId)
            .then(function (itemInfo) {
                ctx.itemId = itemId;
                ctx.description = itemInfo.description;
                ctx.name = itemInfo.name;
                ctx.category = itemInfo.category;
                ctx.likes = itemInfo.likes;
                ctx.imageURL = itemInfo.imageURL;

                ctx.loadPartials({
                    header: "./templates/common/header.hbs",
                    footer: "./templates/common/footer.hbs",
                    deleteForm: "./templates/delete/deleteForm.hbs"
                }).then(function () {
                    this.partial("./templates/delete/deletePage.hbs")
                })
            })
            .catch(notifications.handleError);
    }

    function postRemove(ctx) {
        let itemId = ctx.params.id.substr(1);
        let description = ctx.params.description;
        let name = ctx.params.name;
        let category = ctx.params.category;
        let likes = ctx.params.likes;
        let imageURL = ctx.params.imageURL;

        service.remove(itemId)
            .then(function (itemInfo) {
                notifications.showInfo("Pet removed successfully!");
                ctx.redirect("#/viewCatalog");
            })
            .catch(notifications.handleError);
    }

    function displayCatalog(ctx) {
        ctx.loggedIn = sessionStorage.getItem("authtoken") !== null;
        ctx.username = sessionStorage.getItem("username");

        service.loadItems()
            .then(function (items) {
                ctx.items = items.filter(item => item._acl.creator !== sessionStorage.getItem("userId"));
                ctx.loadPartials({
                    header: "./templates/common/header.hbs",
                    footer: "./templates/common/footer.hbs",
                    itemBox: "./templates/catalog/items/itemBox.hbs",
                    itemsCatalog: "./templates/catalog/items/itemsCatalog.hbs"
                }).then(function () {
                    this.partial("./templates/catalog/items/itemsPage.hbs");
                })
            });
    }

    function displayCatalogCats(ctx) {
        ctx.loggedIn = sessionStorage.getItem("authtoken") !== null;
        ctx.username = sessionStorage.getItem("username");

        service.loadItems()
            .then(function (items) {
                ctx.items = items.filter(item => item._acl.creator !== sessionStorage.getItem("userId")
                    && item.category === "Cat")
                    .sort((a,b) => b.likes - a.likes);
                ctx.loadPartials({
                    header: "./templates/common/header.hbs",
                    footer: "./templates/common/footer.hbs",
                    itemBox: "./templates/catalog/items/itemBox.hbs",
                    itemsCatalog: "./templates/catalog/items/itemsCatalog.hbs"
                }).then(function () {
                    this.partial("./templates/catalog/items/itemsPage.hbs");
                })
            });
    }

    function displayCatalogDogs(ctx) {
        ctx.loggedIn = sessionStorage.getItem("authtoken") !== null;
        ctx.username = sessionStorage.getItem("username");

        service.loadItems()
            .then(function (items) {
                ctx.items = items.filter(item => item._acl.creator !== sessionStorage.getItem("userId")
                    && item.category === "Dog")
                    .sort((a,b) => b.likes - a.likes);
                ctx.loadPartials({
                    header: "./templates/common/header.hbs",
                    footer: "./templates/common/footer.hbs",
                    itemBox: "./templates/catalog/items/itemBox.hbs",
                    itemsCatalog: "./templates/catalog/items/itemsCatalog.hbs"
                }).then(function () {
                    this.partial("./templates/catalog/items/itemsPage.hbs");
                })
            });
    }

    function displayCatalogParrots(ctx) {
        ctx.loggedIn = sessionStorage.getItem("authtoken") !== null;
        ctx.username = sessionStorage.getItem("username");

        service.loadItems()
            .then(function (items) {
                ctx.items = items.filter(item => item._acl.creator !== sessionStorage.getItem("userId")
                    && item.category === "Parrot")
                    .sort((a,b) => b.likes - a.likes);
                ctx.loadPartials({
                    header: "./templates/common/header.hbs",
                    footer: "./templates/common/footer.hbs",
                    itemBox: "./templates/catalog/items/itemBox.hbs",
                    itemsCatalog: "./templates/catalog/items/itemsCatalog.hbs"
                }).then(function () {
                    this.partial("./templates/catalog/items/itemsPage.hbs");
                })
            });
    }

    function displayCatalogReptiles(ctx) {
        ctx.loggedIn = sessionStorage.getItem("authtoken") !== null;
        ctx.username = sessionStorage.getItem("username");

        service.loadItems()
            .then(function (items) {
                ctx.items = items.filter(item => item._acl.creator !== sessionStorage.getItem("userId")
                    && item.category === "Reptile")
                    .sort((a,b) => b.likes - a.likes);
                ctx.loadPartials({
                    header: "./templates/common/header.hbs",
                    footer: "./templates/common/footer.hbs",
                    itemBox: "./templates/catalog/items/itemBox.hbs",
                    itemsCatalog: "./templates/catalog/items/itemsCatalog.hbs"
                }).then(function () {
                    this.partial("./templates/catalog/items/itemsPage.hbs");
                })
            });
    }

    function displayCatalogOther(ctx) {
        ctx.loggedIn = sessionStorage.getItem("authtoken") !== null;
        ctx.username = sessionStorage.getItem("username");

        service.loadItems()
            .then(function (items) {
                ctx.items = items.filter(item => item._acl.creator !== sessionStorage.getItem("userId")
                    && item.category === "Other")
                    .sort((a,b) => b.likes - a.likes);
                ctx.loadPartials({
                    header: "./templates/common/header.hbs",
                    footer: "./templates/common/footer.hbs",
                    itemBox: "./templates/catalog/items/itemBox.hbs",
                    itemsCatalog: "./templates/catalog/items/itemsCatalog.hbs"
                }).then(function () {
                    this.partial("./templates/catalog/items/itemsPage.hbs");
                })
            });
    }

    function displayItemDetailsPage(ctx) {
        ctx.loggedIn = sessionStorage.getItem("authtoken") !== null;
        ctx.username = sessionStorage.getItem("username");
        let itemId = ctx.params.id.substr(1);

        service.loadItemDetails(itemId)
            .then(function (itemInfo) {
                ctx.itemId = itemId;
                ctx.name = itemInfo.name;
                ctx.likes = itemInfo.likes;
                ctx.imageURL = itemInfo.imageURL;
                ctx.description = itemInfo.description;

                ctx.loadPartials({
                    header: "./templates/common/header.hbs",
                    footer: "./templates/common/footer.hbs",
                    itemDetails: "./templates/catalog/itemDetails/itemDetails.hbs"
                }).then(function () {
                    this.partial("./templates/catalog/itemDetails/itemDetailsPage.hbs")
                })
            }).catch(notifications.handleError);
    }

    function displayMyItems(ctx) {
        ctx.loggedIn = sessionStorage.getItem("authtoken") !== null;
        ctx.username = sessionStorage.getItem("username");
        service.loadItems()
            .then(function (items) {
                ctx.items = items.filter(item => item._acl.creator === sessionStorage.getItem("userId"));
                ctx.loadPartials({
                    header: "./templates/common/header.hbs",
                    footer: "./templates/common/footer.hbs",
                    myItemBox: "./templates/catalog/myItems/myItemBox.hbs",
                    myItemsCatalog: "./templates/catalog/myItems/myItemsCatalog.hbs"
                }).then(function () {
                    this.partial("./templates/catalog/myItems/myItemsPage.hbs");
                })
            });
    }

    function petAPet(ctx) {
        // let itemId = ctx.params.id.substr(1);
        // let description = ctx.params.description;
        // let name = ctx.params.name;
        // let category = ctx.params.category;
        // let likes = +ctx.params.likes + 1;
        // let imageURL = ctx.params.imageURL;
        //
        // service.edit(itemId, name, description, imageURL, category, likes)
        //     .then(function (adInfo) {
        //         ctx.redirect("#/viewCatalog");
        //     })
        //     .catch(notifications.handleError);
    }

    return {
        displayHome,
        getLogin,
        postLogin,
        logout,
        getRegister,
        postRegister,
        getCreate,
        postCreate,
        getEdit,
        postEdit,
        getRemove,
        postRemove,
        displayCatalog,
        displayCatalogCats,
        displayCatalogDogs,
        displayCatalogParrots,
        displayCatalogReptiles,
        displayCatalogOther,
        displayItemDetailsPage,
        displayMyItems,
        petAPet
    }
})();
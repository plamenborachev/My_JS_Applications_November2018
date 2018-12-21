let handlers = (() => {
    function displayHome(ctx) {
        ctx.loggedIn = sessionStorage.getItem("authtoken") !== null;
        ctx.username = sessionStorage.getItem("username");
        // ctx.hasNoTeam = sessionStorage.getItem("adId") === null
        //     || sessionStorage.getItem("adId") === "undefined";
        // ctx.adId = sessionStorage.getItem("adId");
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
        let password = ctx.params.pass;

        if (username.length === 0){
            notifications.showError("Username is required")
        } else if (password.length === 0){
            notifications.showError("Password is required")
        } else {
            auth.login(username, password)
                .then(function (userInfo) {
                    auth.saveSession(userInfo);
                    notifications.showInfo("Login successful.");
                    ctx.redirect("#/home");
                    // displayHome(ctx);
                }).catch(notifications.handleError);
        }
    }

    function logout(ctx) {
        auth.logout()
            .then(function () {
                sessionStorage.clear();
                notifications.showInfo("Logout successful.");
                ctx.redirect("#/login");
                // getLogin(ctx);
            }).catch(notifications.handleError)
    }

    function getRegister (ctx) {
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
        let password = ctx.params.pass;
        let repeatPassword = ctx.params.checkPass;

        if (password !== repeatPassword) {
            notifications.showError("Both passwords should match");
        } else if (username.length < 5) {
            notifications.showError("A username should be at least 5 characters long");
        } else if (password === "" || repeatPassword === "") {
            notifications.showError("Passwords input fields shouldn’t be empty");
        } else {
            auth.register(username, password)
                .then(function (userInfo) {
                    auth.saveSession(userInfo);
                    notifications.showInfo("User registration successful.");
                    ctx.redirect("#/home");
                    // displayHome(ctx);
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
        let destination = ctx.params.destination;
        let origin = ctx.params.origin;
        let departureDate = ctx.params.departureDate;
        let departureTime = ctx.params.departureTime;
        let seats = +ctx.params.seats;
        let cost = +ctx.params.cost;
        let img = ctx.params.img;
        let isPublic = !!ctx.params.public;

        if (destination === "" || origin === "") {
            notifications.showError("Destination and origin station should be non-empty strings");
        } else if (seats <= 0 || cost <= 0) {
            notifications.showError("Number of seats and cost per seat should be positive numbers");
        } else {
            service.createItem(destination, origin, departureDate, departureTime, seats, cost, img, isPublic)
                .then(function (adInfo) {
                    notifications.showInfo("Created flight.");
                    ctx.redirect("#/viewCatalog");
                    // displayCatalog(ctx);
                })
                .catch(notifications.handleError);
        }
    }

    function getEdit(ctx) {
        ctx.loggedIn = sessionStorage.getItem("authtoken") !== null;
        ctx.username = sessionStorage.getItem("username");
        let itemId = ctx.params.id.substr(1);
        service.loadItemDetails(itemId)
            .then(function (itemInfo) {
                ctx.itemId = itemId;
                ctx.destination = itemInfo.destination;
                ctx.origin = itemInfo.origin;
                ctx.departureDate = itemInfo.departureDate;
                ctx.departureTime = itemInfo.departureTime;
                ctx.seats = itemInfo.seats;
                ctx.cost = itemInfo.cost;
                ctx.img = itemInfo.img;

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
        let destination = ctx.params.destination;
        let origin = ctx.params.origin;
        let departureDate = ctx.params.departureDate;
        let departureTime = ctx.params.departureTime;
        let seats = +ctx.params.seats;
        let cost = +ctx.params.cost;
        let img = ctx.params.img;
        let isPublic = !!ctx.params.public;

        service.edit(itemId, destination, origin, departureDate, departureTime, seats, cost, img, isPublic)
            .then(function (adInfo) {
                notifications.showInfo("Successfully edited flight.");
                displayItemDetailsPage(ctx);
            })
            .catch(notifications.handleError);
    }

    function remove(ctx) {
        let itemId = ctx.params.id.substr(1);

        service.remove(itemId)
            .then(function (itemInfo) {
                notifications.showInfo("Flight deleted.");
                ctx.redirect("#/viewMyCatalog");
                // displayMyItems(ctx);
            })
            .catch(notifications.handleError);
    }

    function displayCatalog(ctx) {
        ctx.loggedIn = sessionStorage.getItem("authtoken") !== null;
        ctx.username = sessionStorage.getItem("username");

        service.loadItems()
            .then(function (items) {
                // ctx.hasNoTeam = sessionStorage.getItem("adId") === null
                //     || sessionStorage.getItem("adId") === "undefined";
                // items.forEach(a => {
                //     if (a._acl.creator === sessionStorage.getItem("userId")) {
                //         a.isAuthor = true;
                //     }
                // });
                // ctx.noCars = items.length === 0;
                ctx.items = items.filter(item => item._acl.creator === sessionStorage.getItem("userId")
                    || item.isPublic === "true");
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
                ctx.img = itemInfo.img;
                ctx.destination = itemInfo.destination;
                ctx.origin = itemInfo.origin;
                ctx.departureDate = itemInfo.departureDate;
                ctx.departureTime = itemInfo.departureTime;
                ctx.seats = itemInfo.seats;
                ctx.cost = itemInfo.cost;
                ctx.isAuthor = itemInfo._acl.creator === sessionStorage.getItem("userId");

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
                // ctx.hasNoTeam = sessionStorage.getItem("adId") === null
                //     || sessionStorage.getItem("adId") === "undefined";
                // ctx.noCars = items.length === 0;
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

    // function displayAboutPage(ctx) {
    //     ctx.loggedIn = sessionStorage.getItem("authtoken") !== null;
    //     ctx.username = sessionStorage.getItem("username");
    //
    //     this.loadPartials({
    //         header: "./templates/common/header.hbs",
    //         footer: "./templates/common/footer.hbs"
    //     }).then(function () {
    //         this.partial("./templates/about/about.hbs")
    //     })
    // }
    //
    // function joinTeam(ctx) {
    //     let adId = ctx.params.id.substr(1);
    //     service.joinTeam(adId)
    //         .then(function (userInfo) {
    //             auth.saveSession(userInfo);
    //             notifications.showInfo(`Joined Team`);
    //             displayCatalog(ctx);
    //         })
    //         .catch(auth.handleError);
    // }
    //
    // function leaveTeam(ctx) {
    //     service.leaveTeam()
    //         .then(function (userInfo) {
    //             auth.saveSession(userInfo);
    //             notifications.showInfo(`Team Left`);
    //             displayCatalog(ctx);
    //         })
    //         .catch(notifications.handleError);
    // }

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
        remove,
        displayCatalog,
        displayItemDetailsPage,
        displayMyItems
        // displayAboutPage,
        // joinTeam,
        // leaveTeam
    }
})();
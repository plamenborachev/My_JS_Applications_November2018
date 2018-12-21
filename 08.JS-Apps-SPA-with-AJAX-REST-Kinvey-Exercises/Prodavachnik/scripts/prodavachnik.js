function startApp() {
    const app = Sammy('#main', function () {
        this.use('Handlebars', 'hbs');

        //HOME PAGE
        this.get("index.html", displayHome);
        this.get("#/home", displayHome);

        //LOGIN PAGE
        this.get("#/login", function (ctx) {
            ctx.loggedIn = sessionStorage.getItem("authtoken") !== null;
            ctx.username = sessionStorage.getItem("username");

            this.loadPartials({
                header: "./templates/common/header.hbs",
                footer: "./templates/common/footer.hbs",
                loginForm: "./templates/login/loginForm.hbs"
            }).then(function () {
                this.partial("./templates/login/loginPage.hbs")
            })
        });

        this.post("#/login", function (ctx) {
            let username = ctx.params.username;
            let password = ctx.params.password;

            auth.login(username, password)
                .then(function (userInfo) {
                    auth.saveSession(userInfo);
                    notifications.showInfo("Logged In");
                    displayHome(ctx);
                }).catch(notifications.handleError);
        });

        //LOGOUT LOGIC
        this.get("#/logout", function (ctx) {
            auth.logout()
                .then(function () {
                    sessionStorage.clear();
                    notifications.showInfo("Logged Out");
                    displayHome(ctx);
                }).catch(notifications.handleError)
        });

        //REGISTER PAGE
        this.get("#/register", function (ctx) {
            ctx.loggedIn = sessionStorage.getItem("authtoken") !== null;
            ctx.username = sessionStorage.getItem("username");

            this.loadPartials({
                header: "./templates/common/header.hbs",
                footer: "./templates/common/footer.hbs",
                registerForm: "./templates/register/registerForm.hbs"
            }).then(function () {
                this.partial("./templates/register/registerPage.hbs")
            })
        });

        this.post("#/register", function (ctx) {
            let username = ctx.params.username;
            let password = ctx.params.password;
            // let repeatPassword = ctx.params.repeatPassword;

            // if (password !== repeatPassword){
            //     notifications.showError("Passwords Do Not Match!")
            // } else {
            auth.register(username, password)
                .then(function (userInfo) {
                    auth.saveSession(userInfo);
                    notifications.showInfo("Registered");
                    displayHome(ctx);
                }).catch(notifications.handleError);
            // }
        });

        //CATALOG PAGE
        this.get("#/viewAds", displayCatalog);

        //CREATE {{AD}} PAGE
        this.get("#/createAd", function (ctx) {
            ctx.loggedIn = sessionStorage.getItem("authtoken") !== null;
            ctx.username = sessionStorage.getItem("username");

            ctx.loadPartials({
                header: "./templates/common/header.hbs",
                footer: "./templates/common/footer.hbs",
                createForm: "./templates/create/createForm.hbs"
            }).then(function () {
                this.partial("./templates/create/createPage.hbs")
            })
        });

        this.post("#/createAd", function (ctx) {
            let title = ctx.params.title;
            let description = ctx.params.description;
            let publisher = sessionStorage.getItem('username');
            let price = ctx.params.price;
            let imageUrl = ctx.params.imageUrl;

            carService.createAdvert(title, description, publisher, price, imageUrl)
                .then(function (adInfo) {
                    notifications.showInfo(`Advert created`);
                    displayCatalog(ctx);
                })
                .catch(notifications.handleError);
        });

        //EDIT {{AD}} PAGE
        this.get("#/edit/:id", function (ctx) {
            ctx.loggedIn = sessionStorage.getItem("authtoken") !== null;
            ctx.username = sessionStorage.getItem("username");
            let adId = ctx.params.id.substr(1);

            carService.loadAdDetails(adId)
                .then(function (adInfo) {
                    ctx.adId = adId;
                    ctx.title = adInfo.title;
                    ctx.description = adInfo.description;
                    ctx.price = adInfo.price;
                    ctx.imageUrl = adInfo.imageUrl;

                    ctx.loadPartials({
                        header: "./templates/common/header.hbs",
                        footer: "./templates/common/footer.hbs",
                        editForm: "./templates/edit/editForm.hbs"
                    }).then(function () {
                        this.partial("./templates/edit/editPage.hbs")
                    })
                })
                .catch(notifications.handleError);
        });

        this.post("#/edit/:id", function (ctx) {
            let adId = ctx.params.id.substr(1);
            let title = ctx.params.title;
            let description = ctx.params.description;
            let publisher = sessionStorage.getItem('username');
            let price = ctx.params.price;
            let imageUrl = ctx.params.imageUrl;

            carService.edit(adId, title, description, publisher, price, imageUrl)
                .then(function (adInfo) {
                    notifications.showInfo(`Ad edited`);
                    displayCatalog(ctx);
                })
                .catch(notifications.handleError);
        });

        //DELETE AD
        this.get("#/delete/:id", function (ctx) {
            let adId = ctx.params.id.substr(1);

            carService.remove(adId)
                .then(function (adInfo) {
                    notifications.showInfo(`Ad deleted`);
                    displayCatalog(ctx);
                })
                .catch(notifications.handleError);
        });

        //DISPLAY HOME PAGE
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

        //DISPLAY ITEMS
        function displayCatalog(ctx) {
            ctx.loggedIn = sessionStorage.getItem("authtoken") !== null;
            ctx.username = sessionStorage.getItem("username");

            carService.loadAdverts()
                .then(function (ads) {
                    // ctx.hasNoTeam = sessionStorage.getItem("adId") === null
                    //     || sessionStorage.getItem("adId") === "undefined";
                    ads.forEach(a => {
                        if (a._acl.creator === sessionStorage.getItem("userId")) {
                            a.isAuthor = true;
                        }
                    });
                    ctx.ads = ads;
                    ctx.loadPartials({
                        header: "./templates/common/header.hbs",
                        footer: "./templates/common/footer.hbs",
                        adBox: "./templates/cars/carBox.hbs",
                        adsCatalog: "./templates/cars/carsCatalog.hbs"
                    }).then(function () {
                        this.partial("./templates/cars/carsPage.hbs")
                    })
                });
        }

        //ABOUT PAGE
        // this.get("#/about", function (ctx) {
        //     ctx.loggedIn = sessionStorage.getItem("authtoken") !== null;
        //     ctx.username = sessionStorage.getItem("username");
        //
        //     this.loadPartials({
        //         header: "./templates/common/header.hbs",
        //         footer: "./templates/common/footer.hbs"
        //     }).then(function () {
        //         this.partial("./templates/about/about.hbs")
        //     })
        // });

        //TEAM DETAILS PAGE
        // this.get("#/catalog/:id", function (ctx) {
        //     ctx.loggedIn = sessionStorage.getItem("authtoken") !== null;
        //     ctx.username = sessionStorage.getItem("username");
        //
        //     let adId = ctx.params.id.substr(1);
        //
        //     carService.loadTeamDetails(adId)
        //         .then(function (teamInfo) {
        //             ctx.adId = adId;
        //             ctx.name = teamInfo.name;
        //             ctx.comment = teamInfo.comment;
        //             ctx.isOnTeam = teamInfo._id === sessionStorage.getItem("adId");
        //             ctx.isAuthor = teamInfo._acl.creator === sessionStorage.getItem("userId");
        //             ctx.loadPartials({
        //                 header: "./templates/common/header.hbs",
        //                 footer: "./templates/common/footer.hbs",
        //                 teamControls: "./templates/catalog/teamControls.hbs"
        //             }).then(function () {
        //                 this.partial("./templates/catalog/details.hbs")
        //             })
        //         }).catch(notifications.handleError);
        // });

        //JOIN TEAM (BY ID)
        // this.get("#/join/:id", function (ctx) {
        //     let adId = ctx.params.id.substr(1);
        //
        //     carService.joinTeam(adId)
        //         .then(function (userInfo) {
        //             auth.saveSession(userInfo);
        //             notifications.showInfo(`Joined Team`);
        //             displayCatalog(ctx);
        //         })
        //         .catch(auth.handleError);
        // });

        //LEAVE TEAM
        // this.get("#/leave", function (ctx) {
        //     carService.leaveTeam()
        //         .then(function (userInfo) {
        //             auth.saveSession(userInfo);
        //             notifications.showInfo(`Team Left`);
        //             displayCatalog(ctx);
        //         })
        //         .catch(notifications.handleError);
        // });
    });
    app.run();
}
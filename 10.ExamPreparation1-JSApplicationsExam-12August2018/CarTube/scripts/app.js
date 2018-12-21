function startApp() {
    const app = Sammy('#container', function () {
        this.use('Handlebars', 'hbs');

        //HOME PAGE
        this.get("index.html", displayHome);
        this.get("#/home", displayHome);

        //LOGIN PAGE
        this.get("#/login", getLogin);

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

        this.post("#/login", function (ctx) {
            let username = ctx.params.username;
            let password = ctx.params.password;

            auth.login(username, password)
                .then(function (userInfo) {
                    auth.saveSession(userInfo);
                    notifications.showInfo("Login successful.");
                    displayCatalog(ctx);
                }).catch(notifications.handleError);
        });

        //LOGOUT LOGIC
        this.get("#/logout", function (ctx) {
            auth.logout()
                .then(function () {
                    sessionStorage.clear();
                    notifications.showInfo("Logout successful.");
                    getLogin(ctx);
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
            let repeatPassword = ctx.params.repeatPass;

            if (password !== repeatPassword){
                notifications.showError("Passwords Do Not Match!");
            } else if (!/^[a-zA-Z]{3,}$/.test(username)){
                notifications.showError("Username should be at least 3 characters long and should contain only english alphabet letters");
            } else if (!/^[a-zA-Z0-9]{6,}$/.test(password)) {
                notifications.showError("Password should be at least 6 characters long and should contain only english alphabet letters and digit");
            } else {
                auth.register(username, password)
                    .then(function (userInfo) {
                        auth.saveSession(userInfo);
                        notifications.showInfo("User registration successful.");
                        displayCatalog(ctx);
                    }).catch(notifications.handleError);
            }
        });

        //CATALOG PAGE
        this.get("#/viewCars", displayCatalog);

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
            let brand = ctx.params.brand;
            let model = ctx.params.model;
            let year = ctx.params.year;
            let imageUrl = ctx.params.imageUrl;
            let fuelType = ctx.params.fuelType;
            let price = ctx.params.price;
            let seller = sessionStorage.getItem("username");

            if (title.length > 33){
                notifications.showError("The title length must not exceed 33 characters!");
            } else if (description.length > 450 || description.length < 30){
                notifications.showError("The description length must not exceed 450 characters and should be at least 30");
            } else if (brand.length > 11 || fuelType.length > 11 || model.length > 11){
                notifications.showError("The brand,fuelType and model length must not exceed 11 characters!");
            } else if (model.length < 4){
                notifications.showError("The model length should be at least 4 characters!");
            } else if (year.length !== 4){
                notifications.showError("The year must be only 4 chars long!");
            } else if (+price > 1000000){
                notifications.showError("The maximum price is 1000000$");
            } else if (!imageUrl.startsWith("http")){
                notifications.showError("Link url should always start with \"http\"");
            }  else if (title === '' || description === '' || brand === '' || model === '' ||
                year === '' || imageUrl === '' || fuelType === '' || price === '') {
                notifications.showError('All fields have to be full!');
            } else {
                service.createItem(seller, title, description, imageUrl, brand, model, fuelType, year, price)
                    .then(function (adInfo) {
                        notifications.showInfo(`listing created.`);
                        displayCatalog(ctx);
                    })
                    .catch(notifications.handleError);
            }
        });

        //EDIT {{AD}} PAGE
        this.get("#/edit/:id", function (ctx) {


            ctx.loggedIn = sessionStorage.getItem("authtoken") !== null;
            ctx.username = sessionStorage.getItem("username");
            let carId = ctx.params.id.substr(1);

            service.loadItemDetails(carId)
                .then(function (carInfo) {

                    ctx.carId = carId;
                    ctx.title = carInfo.title;
                    ctx.description = carInfo.description;
                    ctx.brand = carInfo.brand;
                    ctx.model = carInfo.model;
                    ctx.year = carInfo.year;
                    ctx.imageUrl = carInfo.imageUrl;
                    ctx.fuelType = carInfo.fuel;
                    ctx.price = carInfo.price;
                    ctx.seller = sessionStorage.getItem("username");

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
            let carId = ctx.params.id.substr(1);
            let title = ctx.params.title;
            let description = ctx.params.description;
            let brand = ctx.params.brand;
            let model = ctx.params.model;
            let year = ctx.params.year;
            let imageUrl = ctx.params.imageUrl;
            let fuelType = ctx.params.fuelType;
            let price = ctx.params.price;
            let seller = sessionStorage.getItem("username");

            service.edit(carId, seller, title, description, imageUrl, brand, model, fuelType, year, price)
                .then(function (adInfo) {
                    notifications.showInfo(`Listing ${title} updated.`);
                    displayCatalog(ctx);
                })
                .catch(notifications.handleError);
        });

        //DELETE AD
        this.get("#/delete/:id", function (ctx) {
            let adId = ctx.params.id.substr(1);

            service.remove(adId)
                .then(function (adInfo) {
                    notifications.showInfo(`Listing deleted.`);
                    displayCatalog(ctx);
                })
                .catch(notifications.handleError);
        });

        // {{CAR}} DETAILS PAGE
        this.get("#/details/:id", function (ctx) {
            ctx.loggedIn = sessionStorage.getItem("authtoken") !== null;
            ctx.username = sessionStorage.getItem("username");

            let carId = ctx.params.id.substr(1);


            service.loadItemDetails(carId)
                .then(function (carInfo) {
                    ctx.carId = carId;
                    ctx.title = carInfo.title;
                    ctx.description = carInfo.description;
                    ctx.brand = carInfo.brand;
                    ctx.model = carInfo.model;
                    ctx.year = carInfo.year;
                    ctx.imageUrl = carInfo.imageUrl;
                    ctx.fuelType = carInfo.fuel;
                    ctx.price = carInfo.price;
                    ctx.seller = sessionStorage.getItem("username");
                    ctx.isAuthor = carInfo._acl.creator === sessionStorage.getItem("userId");

                    ctx.loadPartials({
                        header: "./templates/common/header.hbs",
                        footer: "./templates/common/footer.hbs",
                        carDetails: "./templates/carDetails/carDetails.hbs"
                    }).then(function () {
                        this.partial("./templates/carDetails/carDetailsPage.hbs")
                    })
                }).catch(notifications.handleError);
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

        //DISPLAY ALL ITEMS
        function displayCatalog(ctx) {
            ctx.loggedIn = sessionStorage.getItem("authtoken") !== null;
            ctx.username = sessionStorage.getItem("username");

            service.loadItems()
                .then(function (cars) {
                    // ctx.hasNoTeam = sessionStorage.getItem("adId") === null
                    //     || sessionStorage.getItem("adId") === "undefined";
                    cars.forEach(a => {
                        if (a._acl.creator === sessionStorage.getItem("userId")) {
                            a.isAuthor = true;
                        }
                    });
                    ctx.noCars = cars.length === 0;
                    ctx.cars = cars;
                    ctx.loadPartials({
                        header: "./templates/common/header.hbs",
                        footer: "./templates/common/footer.hbs",
                        carBox: "./templates/cars/carBox.hbs",
                        carsCatalog: "./templates/cars/carsCatalog.hbs"
                    }).then(function () {
                        this.partial("./templates/cars/carsPage.hbs")
                    })
                });
        }

        //DISPLAY MY ITEMS
        this.get("#/myListings", myListings);

        function myListings(ctx) {
            ctx.loggedIn = sessionStorage.getItem("authtoken") !== null;
            ctx.username = sessionStorage.getItem("username");

            service.loadItems()
                .then(function (cars) {
                    // ctx.hasNoTeam = sessionStorage.getItem("adId") === null
                    //     || sessionStorage.getItem("adId") === "undefined";

                    cars = cars.filter(car => car._acl.creator === sessionStorage.getItem("userId"));

                    ctx.noCars = cars.length === 0;
                    ctx.cars = cars;
                    ctx.loadPartials({
                        header: "./templates/common/header.hbs",
                        footer: "./templates/common/footer.hbs",
                        myCarBox: "./templates/myCars/myCarBox.hbs",
                        myCarsCatalog: "./templates/myCars/myCarsCatalog.hbs"
                    }).then(function () {
                        this.partial("./templates/myCars/myCarsPage.hbs")
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



        //JOIN TEAM (BY ID)
        // this.get("#/join/:id", function (ctx) {
        //     let adId = ctx.params.id.substr(1);
        //
        //     service.joinTeam(adId)
        //         .then(function (userInfo) {
        //             auth.saveSession(userInfo);
        //             notifications.showInfo(`Joined Team`);
        //             displayCatalog(ctx);
        //         })
        //         .catch(auth.handleError);
        // });

        //LEAVE TEAM
        // this.get("#/leave", function (ctx) {
        //     service.leaveTeam()
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
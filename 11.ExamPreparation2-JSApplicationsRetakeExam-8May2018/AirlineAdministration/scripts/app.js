function startApp() {
    const app = Sammy('#container', function () {
        this.use('Handlebars', 'hbs');

        //HOME PAGE
        this.get("index.html", handlers.displayHome);
        this.get("#/home", handlers.displayHome);
        //LOGIN PAGE
        this.get("#/login", handlers.getLogin);
        this.post("#/login", handlers.postLogin);
        //LOGOUT LOGIC
        this.get("#/logout", handlers.logout);
        //REGISTER PAGE
        this.get("#/register", handlers.getRegister);
        this.post("#/register", handlers.postRegister);
        //VIEW CATALOG PAGE
        this.get("#/viewCatalog", handlers.displayCatalog);
        //CREATE PAGE
        this.get("#/create", handlers.getCreate);
        this.post("#/create", handlers.postCreate);
        //EDIT PAGE
        this.get("#/edit/:id", handlers.getEdit);
        this.post("#/edit/:id", handlers.postEdit);
        //DELETE
        this.get("#/delete/:id", handlers.remove);
        //ITEM DETAILS PAGE
        this.get("#/details/:id", handlers.displayItemDetailsPage);
        //MY ITEMS PAGE
        this.get("#/viewMyCatalog", handlers.displayMyItems);

        // // ABOUT PAGE
        // this.get("#/about", handlers.displayAboutPage);
        // // JOIN TEAM (BY ID)
        // this.get("#/join/:id", handlers.joinTeam);
        // // LEAVE TEAM
        // this.get("#/leave", handlers.leaveTeam);
    });
    app.run();
}
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
        this.get("#/viewCatalog/cats", handlers.displayCatalogCats);
        this.get("#/viewCatalog/dogs", handlers.displayCatalogDogs);
        this.get("#/viewCatalog/parrots", handlers.displayCatalogParrots);
        this.get("#/viewCatalog/reptiles", handlers.displayCatalogReptiles);
        this.get("#/viewCatalog/other", handlers.displayCatalogOther);
        //CREATE PAGE
        this.get("#/create", handlers.getCreate);
        this.post("#/create", handlers.postCreate);
        //EDIT PAGE
        this.get("#/edit/:id", handlers.getEdit);
        this.post("#/edit/:id", handlers.postEdit);
        //DELETE
        this.get("#/delete/:id", handlers.getRemove);
        this.post("#/delete/:id", handlers.postRemove);
        //ITEM DETAILS PAGE
        this.get("#/details/:id", handlers.displayItemDetailsPage);
        //MY ITEMS PAGE
        this.get("#/viewMyCatalog", handlers.displayMyItems);
        //PET A PET
        this.post("#/pet/:id", handlers.petAPet);
    });
    app.run();
}
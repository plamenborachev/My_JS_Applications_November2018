function attachEvents() {
    $("#btnLoadTowns").on("click", renderTowns);
    let inputTowns = $("#towns");
    let source = $("#towns-template").html();
    let template = Handlebars.compile(source);

    function renderTowns() {
        let townsNames = inputTowns.val().split(", ");
        let context = {
            towns: []
        };
        for (let town of townsNames) {
            context.towns.push({town});
        }
        $("#root").html(template(context));
        inputTowns.val("");
    }
}
$(() => {
    renderCatTemplate();

    function renderCatTemplate() {
        let source = $("#cat-template").html();
        let template = Handlebars.compile(source);
        let context = {cats};
        $("#allCats").html(template(context));

        $("button").each((index, button) => {
            $(button).on("click", showOrHideInfo)
        });

        function showOrHideInfo() {
            let btn = $(this);
            if (btn.text() === "Show status code") {
                btn.next().css("display", "block");
                btn.text("Hide status code");
            } else {
                btn.next().css("display", "none");
                btn.text("Show status code");
            }
        }
    }
});

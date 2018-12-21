function attachEvents() {
    let baseServiceUrl = "https://phonebook-nakov-116ba.firebaseio.com/messenger";

    function displayMessages(messages) {
        let result = "";
        for (let message in messages) {
            result += `${messages[message]["author"]}: ${messages[message]["content"]}\n`;
        }
        $("#messages").text(result.trim());
    }

    function displayError() {
        $("#messages").text("Error");
    }

    function reloadMessages() {
        $.get(baseServiceUrl + ".json")
            .then(displayMessages)
            .catch(displayError);
    }

    $("#refresh").on("click", reloadMessages);

    function submitMessage() {
        let newMessageJSON = JSON.stringify({
            author: $('#author').val(),
            content: $('#content').val(),
            timestamp: Date.now()
        });
        $.post(baseServiceUrl + '.json', newMessageJSON)
            .then(reloadMessages)
            .catch(displayError);
        $('#author').val('');
        $('#content').val('');
    }

    $("#submit").on("click", submitMessage);
}
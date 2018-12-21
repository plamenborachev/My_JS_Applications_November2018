function attachEvents() {
    const baseUrl = "https://judgetests.firebaseio.com/";
    let locationInput = $("#location");

    $("#submit").on("click", loadWeather);

    function loadWeather() {
        $.get(baseUrl + "locations.json")
            .then(getLocations)
            .catch(displayError);
    }

    function getLocations(locations) {
        let currentLocationName;
        let currentLocationCode;

        for (let location of locations) {
            if(location.name === locationInput.val()){
                currentLocationName = location.name;
                currentLocationCode = location.code;
                break;
            }
        }

        if (currentLocationName && currentLocationCode){
            $("#current").empty().append($("<div class='label'>Current conditions</div>"));
            $("#upcoming").empty().append($("<div class='label'>Three-day forecast</div>"));
            locationInput.val("");

            Promise.all([$.get(baseUrl + `forecast/today/${currentLocationCode}.json`),
                $.get(baseUrl + `forecast/upcoming/${currentLocationCode}.json`)])
                .then(displayWeather)
                .catch(displayError);

            function displayWeather([currentConditionInfo, upcomingConditionInfo]) {
                let conditionSymbol = checkConditionSymbol(currentConditionInfo["forecast"]["condition"]);
                let spanConditionSymbol = $(`<span class="condition symbol">${conditionSymbol}</span>`);
                $("#current").append(spanConditionSymbol);
                let spanCondition = $("<span class='condition'>");
                spanCondition
                    .append($(`<span class='forecast-data'>${currentConditionInfo["name"]}</span>`))
                    .append($(`<span class='forecast-data'>${currentConditionInfo["forecast"]["low"]}&#176;/${currentConditionInfo["forecast"]["high"]}&#176;</span>`))
                    .append($(`<span class='forecast-data'>${currentConditionInfo["forecast"]["condition"]}</span>`));
                $("#current").append(spanCondition);

                for (let i = 0; i < upcomingConditionInfo["forecast"].length; i++) {
                    let spanUpcoming = $("<span class='upcoming'>");
                    conditionSymbol = checkConditionSymbol(upcomingConditionInfo["forecast"][i]["condition"]);
                    spanUpcoming
                        .append($(`<span class='symbol'>${conditionSymbol}</span>`))
                        .append($(`<span class='forecast-data'>${upcomingConditionInfo["forecast"][i]["low"]}&#176;/${upcomingConditionInfo["forecast"][i]["high"]}&#176;</span>`))
                        .append($(`<span class='forecast-data'>${upcomingConditionInfo["forecast"][i]["condition"]}</span>`));
                    $("#upcoming").append(spanUpcoming);
                    $("#forecast").css("display", "block");
                }
            }

            function checkConditionSymbol(input) {
                let symbol;
                switch (input) {
                    case "Sunny": symbol = "&#x2600"; break;
                    case "Partly sunny": symbol = "&#x26C5"; break;
                    case "Overcast": symbol = "&#x2601"; break;
                    case "Rain": symbol = "&#x2614"; break;
                }
                return symbol;
            }
        } else {
            displayError();
        }
    }

    function displayError() {
        $("#forecast").css("display", "block").text("Error");
    }
}
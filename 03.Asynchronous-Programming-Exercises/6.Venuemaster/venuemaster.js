function attachEvents() {
    const appKey = "kid_BJ_Ke8hZg";
    const username = "guest";
    const password = "pass";
    const authHeaders = "Basic " + btoa(username + ":" + password);
    const host = "https://baas.kinvey.com";

    $("#getVenues").on("click", getVenues);

    function getVenues() {
        let date = $("#venueDate").val();
        $.ajax({
            method: "POST",
            url: `${host}/rpc/${appKey}/custom/calendar?query=${date}`,
            headers: {
                "Authorization": authHeaders
            },
            success: handleSuccess
        });
    }

    function handleSuccess(venues) {
        let venuesPromises = [];
        for (let venue of venues) {
            let currentPromis = $.ajax({
                method: "GET",
                url: `${host}/appdata/kid_BJ_Ke8hZg/venues/${venue}`,
                headers: {
                    "Authorization": authHeaders,
                },
            });
            venuesPromises.push(currentPromis);
        }
        Promise.all(venuesPromises).then(loadVenues);
    }

    function loadVenues(venues) {
        for (let venue of venues) {
            let html = $(`<div class="venue" id="${venue._id}">
                            <span class="venue-name">
                            <input class="info" type="button" value="More info">${venue.name}
                            </span>
                            <div class="venue-details" style="display: none;">
                            <table>
                            <tr><th>Ticket Price</th><th>Quantity</th><th></th></tr>
                            <tr>
                            <td class="venue-price">${venue.price} lv</td>
                            <td><select class="quantity">
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                            </select></td> 
                            <td><input class="purchase" type="button" value="Purchase"></td> 
                            </tr> 
                            </table> 
                            <span class="head">Venue description:</span> 
                            <p class="description">${venue.description}</p> 
                            <p class="description">Starting time: ${venue.startingHour}</p> 
                            </div> 
                            </div>`);

            $("#venue-info").append(html);

            html.find(".info").on("click", showMoreInfo);
            html.find(".purchase").on("click", buyTickets);

            function buyTickets() {
                let qty = html.find("select option:selected").text();

                let span = $(`<span class="head">Confirm purchase</span>
                                <div class="purchase-info">
                                <span>${venue.name}</span>
                                <span>${qty} x ${venue.price}</span>
                                <span>Total: ${qty * venue.price} lv</span>
                                <input type="button" value="Confirm">
                                </div>`);
                $("#venue-info").empty().append(span);

                span.find("input[type=\"button\"]").on("click", confirmPurchase);

                function confirmPurchase() {
                    $.ajax({
                        method: "POST",
                        url: `${host}/rpc/kid_BJ_Ke8hZg/custom/purchase?venue=${venue._id}&qty=${qty}`,
                        headers: {
                            "Authorization": authHeaders,
                        },
                        success: displayPurchase
                    });
                }
            }
        }
    }

    function showMoreInfo() {
        $(this).parent().next().show();
    }

    function displayPurchase(html) {
        $("#venue-info").text("You may print this page as your ticket");
        $("#venue-info").append($(html.html));
    }
}
function attachEvents() {
    const appKey = "kid_rk3m6bsAQ";
    const username = "guest";
    const password = "guest";
    const authHeaders = "Basic " + btoa(username + ":" + password);
    const baseUrl = `https://baas.kinvey.com/appdata/${appKey}/biggestCatches`;

    $(".load").on("click", loadCatches);
    $(".add").on("click", addCatch);

    function loadCatches() {
        $.ajax({
            method: "GET",
            url: baseUrl,
            headers: {
                "Authorization": authHeaders,
                "Content-type": "application/json"
            },
            success: handleSuccess
        });

        function handleSuccess(catches) {
            $("#catches").empty();

            for (const catchObj of catches) {
                let div = $(`<div class="catch" data-id="${catchObj._id}">`);
                let catchTemplate =
            $(`<label>Angler</label>
            <input type="text" class="angler" value="${catchObj.angler}"/>
            <label>Weight</label>
            <input type="number" class="weight" value="${catchObj.weight}"/>
            <label>Species</label>
            <input type="text" class="species" value="${catchObj.species}"/>
            <label>Location</label>
            <input type="text" class="location" value="${catchObj.location}"/>
            <label>Bait</label>
            <input type="text" class="bait" value="${catchObj.bait}"/>
            <label>Capture Time</label>
            <input type="number" class="captureTime" value="${catchObj.captureTime}"/>`);
                let updateBtn = $("<button class=\"update\">Update</button>");
                let deleteBtn = $("<button class=\"delete\">Delete</button>");

                updateBtn.on("click", updateCatch.bind(catchObj));
                deleteBtn.on("click", deleteCatch.bind(catchObj));

                div.append(catchTemplate);
                div.append(updateBtn);
                div.append(deleteBtn);
                $("#catches").append(div);

                function updateCatch() {
                    let angler = $(`div[data-id=${this._id}] .angler`).val();
                    let weight = +$(`div[data-id=${this._id}] .weight`).val();
                    let species = $(`div[data-id=${this._id}] .species`).val();
                    let location = $(`div[data-id=${this._id}] .location`).val();
                    let bait = $(`div[data-id=${this._id}] .bait`).val();
                    let captureTime = +$(`div[data-id=${this._id}] .captureTime`).val();

                    let catchObj = { angler, weight, species, location, bait, captureTime };

                    $.ajax({
                        method: "PUT",
                        url: baseUrl + "/" + this._id,
                        data: JSON.stringify(catchObj),
                        headers: {
                            "Authorization": authHeaders,
                            "Content-type": "application/json"
                        },
                        success: loadCatches
                    });
                }

                function deleteCatch(ev) {
                    $.ajax({
                        method: "DELETE",
                        url: baseUrl + "/" + this._id,
                        headers: {
                            "Authorization": authHeaders,
                            "Content-type": "application/json"
                        },
                        success: handleDelete.bind(ev)
                    });
                    
                    function handleDelete() {
                        $(this.target).parent().remove();
                    }
                }
            }
        }
    }

    function addCatch() {
        let angler = $("#addForm .angler").val();
        let weight = +$("#addForm .weight").val();
        let species = $("#addForm .species").val();
        let location = $("#addForm .location").val();
        let bait = $("#addForm .bait").val();
        let captureTime = +$("#addForm .captureTime").val();

        let catchObj = { angler, weight, species, location, bait, captureTime };

        $.ajax({
            method: "POST",
            url: baseUrl,
            data: JSON.stringify(catchObj),
            headers: {
                "Authorization": authHeaders,
                "Content-type": "application/json"
            },
            success: loadCatches
        });

        $("#addForm .angler").val("");
        $("#addForm .weight").val("");
        $("#addForm .species").val("");
        $("#addForm .location").val("");
        $("#addForm .bait").val("");
        $("#addForm .captureTime").val("");
    }
}
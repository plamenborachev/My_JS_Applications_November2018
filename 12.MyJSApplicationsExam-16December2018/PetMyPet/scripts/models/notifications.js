let notifications = (() => {
    let loadingBox = $("#loadingBox");
    let infoBox = $("#infoBox");
    let errorBox = $("#errorBox");

    $(document).on({
        ajaxStart: () => loadingBox.show(),
        ajaxStop: () => loadingBox.hide()
    });

    infoBox.on('click', function () {
        $(this).fadeOut();
    });

    errorBox.on('click', function () {
        $(this).fadeOut();
    });

    function showInfo(message) {
        infoBox.show();
        infoBox.find("span").text(message);
        setTimeout(function () {
            infoBox.fadeOut()
        }, 3000);
    }

    function showError(error) {
        errorBox.show();
        errorBox.find("span").text(error);
    }

    function handleError(response) {
        let errorMsg = JSON.stringify(response);
        if (response.readyState === 0){
            errorMsg = "Cannot connect due to network error.";
        }
        if (response.responseJSON && response.responseJSON.description){
            errorMsg = response.responseJSON.description;
        }
        showError(errorMsg);
    }

    return {
        showInfo,
        showError,
        handleError
    };
})();

chrome.storage.local.get("yourDataKey", function(result) {
    const dataToSend = result.yourDataKey; // Assuming this is your array of arrays
    window.postMessage({
        type: "FROM_EXTENSION",
        data: dataToSend
    }, "*");
});
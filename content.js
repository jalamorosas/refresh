chrome.storage.local.get(["visitedTabs", "summary"], function(result) {
    // Assuming both visitedTabs and summary are stored in the local storage
    const dataToSend = {
        visitedTabs: result.visitedTabs, // Your array of arrays
        summary: result.summary // Additional data
    };

    window.postMessage({
        type: "FROM_EXTENSION",
        data: dataToSend
    }, "*");
});

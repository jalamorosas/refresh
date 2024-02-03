// content.js
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.message === "getLocalStorage") {
        chrome.storage.local.get(["yourDataKey"], function(result) {
            sendResponse({data: result.yourDataKey});
        });
        return true; // Keep the message channel open for the sendResponse callback
    }
});

let isTracking = false;
let visitedTabs = [];

// Function to toggle tracking
function toggleTracking() {
    isTracking = !isTracking;
    chrome.storage.local.set({ isTracking }); // Save the tracking state

    if (isTracking) {
        chrome.tabs.onActivated.addListener(trackTab);
    } else {
        chrome.tabs.onActivated.removeListener(trackTab);
        console.log(visitedTabs);
        visitedTabs = []; // Reset after logging
    }
}

// Listen for a message from the popup script to toggle tracking
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.toggle === 'toggleTracking') {
        toggleTracking();
    }
});

// Function to track tab URL changes
function trackTab(activeInfo) {
    if (isTracking) {
        chrome.tabs.get(activeInfo.tabId, (tab) => {
            if (tab.url) {
                visitedTabs.push([tab.title, tab.url]);
            }
        });
    }
}

// Initialize tracking state from storage
chrome.storage.local.get(['isTracking'], function (result) {
    isTracking = !!result.isTracking;
    if (isTracking) {
        chrome.tabs.onUpdated.addListener(trackTab);
    }
});
let isTracking = false;
let visitedTabs = [];

// Ensure isTracking is set to false on startup or reload
chrome.runtime.onStartup.addListener(() => {
    chrome.storage.local.set({ isTracking: false });
    isTracking = false;
    // visitedTabs = [];
    // chrome.storage.local.set({ visitedTabs: visitedTabs }); 
});

// Function to toggle tracking
function toggleTracking() {
    isTracking = !isTracking;
    chrome.storage.local.set({ isTracking }); // Save the tracking state

    if (isTracking) {
        chrome.tabs.onActivated.addListener(trackTab);
    } else {
        chrome.tabs.onActivated.removeListener(trackTab);
        console.log(visitedTabs);
    }
}

function clearHistory() {
    visitedTabs = [];
    chrome.storage.local.set({ visitedTabs: visitedTabs });
}

function generateSummary(sendResponse) {
    console.log('Generate summary called');
    chrome.storage.local.get(['visitedTabs'], function(result) {
        if (result.visitedTabs) {
            const data = {tabs: result.visitedTabs}
            console.log(result.visitedTabs);
            sendVisitedTabsToServer(data)
            .then(data => {
                // Assuming sendVisitedTabsToServer is modified to return a promise that resolves when data is received
                chrome.storage.local.set({ summary: data }, function() {
                    console.log("Summary Stored");
                    sendResponse({ success: true }); // Send a response back indicating success
                });
            })
            .catch(error => {
                console.error('Error sending visited tabs to server:', error);
                sendResponse({ success: false, error: error }); // Send an error response
            });
        } else {
            console.log("ERROR GENERATING SUMMARY");
            sendResponse({ success: false, error: "No visited tabs data found." });
        }
    });
    return true; // Indicate that the response is asynchronous
}

// Modify message listener to call generateSummary with sendResponse
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.toggle === 'generateSummary') {
        generateSummary(sendResponse);
        return true; // Return true to indicate async sendResponse
    }
});


// Listen for a message from the popup script to toggle tracking
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.toggle === 'toggleTracking') {
        toggleTracking();
    }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.toggle === 'clearHistory') {
        clearHistory();
    }
});


// Function to track tab URL changes
function trackTab(activeInfo) {
    if (isTracking) {
        chrome.tabs.get(activeInfo.tabId, (tab) => {
            if (tab.url) {
                visitedTabs.push([tab.title, tab.url]);
                chrome.storage.local.set({ visitedTabs: visitedTabs });
            }
        });
    }
}

// // Initialize tracking state from storage
// chrome.storage.local.get(['isTracking'], function (result) {
//     isTracking = !!result.isTracking;
//     if (isTracking) {
//         chrome.tabs.onUpdated.addListener(trackTab);
//     }
// });

function sendVisitedTabsToServer(tabs) {
    const url = "http://localhost:3000/upload-tabs-history"; // Adjust the endpoint as necessary
    console.log("Sending visited tabs to server awaiting response...");

    // Return the fetch chain so that the calling function can use .then() or .catch() on sendVisitedTabsToServer
    return fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(tabs)
    })
    .then(response => {
        if (!response.ok) {
            // If the response is not 2xx, throw an error to be caught by the catch block
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        chrome.runtime.sendMessage({ action: "serverResponse", data: data });
        // Since chrome.storage.local.set is asynchronous and uses the callback pattern, 
        // we wrap it in a promise to ensure it's included in the chain.
        return new Promise((resolve, reject) => {
            chrome.storage.local.set({ summary: data }, () => {
                if (chrome.runtime.lastError) {
                    console.error("Error storing the summary:", chrome.runtime.lastError);
                    reject(chrome.runtime.lastError);
                } else {
                    console.log("Summary Stored");
                    resolve(data); // Resolve with the server response data
                }
            });
        });
    })
    .catch(error => {
        console.error('Error sending visited tabs to server:', error);
        // Rethrow the error so it can be caught by the caller of sendVisitedTabsToServer
        throw error;
    });
}


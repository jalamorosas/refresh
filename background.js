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
    chrome.storage.local.get(['visitedTabs', 'projectIntention'], function(result) {
        if (result.visitedTabs) {
            const data = {
                tabs: result.visitedTabs,
                intention: result.projectIntention || 'No intention set'
            };
            console.log(data);
            sendVisitedTabsToServer(data)
                .then(data => {
                    chrome.storage.local.set({ summary: data }, function() {
                        console.log("Summary Stored");
                        sendResponse({ success: true }); // Indicate success
                    });
                })
                .catch(error => {
                    console.error('Error sending visited tabs to server:', error);
                    sendResponse({ success: false, error: error }); // Indicate failure
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
                console.log(tab.url);
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

function sendVisitedTabsToServer(data) {
    const url = "http://localhost:3000/upload-tabs-history";
    console.log("Sending visited tabs and project intention to server awaiting response...");

    return fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        chrome.runtime.sendMessage({ action: "serverResponse", data: data });
        return data; // Return the response data for further processing
    })
    .catch(error => {
        console.error('Error sending visited tabs to server:', error);
        throw error; // Rethrow to be caught by the caller
    });
}



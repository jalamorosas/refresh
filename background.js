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

function generateSummary() {
    console.log('Generate summary called');
    chrome.storage.local.get(['visitedTabs'], function(result) {
        if (result.visitedTabs) {
            const data = {tabs: result.visitedTabs}
            console.log(result.visitedTabs);
            sendVisitedTabsToServer(data); 
        } else {
            console.log("ERROR GENERATING SUMMARY")
        }
    } )
}

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

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.toggle === 'generateSummary') {
        generateSummary();
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
    console.log("Sending visited tabs to server awaiting response...")

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(tabs)
    })
        .then(response => response.json())
        .then(data => {
            chrome.runtime.sendMessage({ action: "serverResponse", data: data });
            chrome.storage.local.set({ summary: data }).then(() => {
                console.log("Summary Stored");
              });
            console.log('Server response:', data);
        })
        .catch((error) => {
            console.error('Error sending visited tabs to server:', error);
        });
}

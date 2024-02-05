document.addEventListener('DOMContentLoaded', function () {
    const trackingButton = document.getElementById('toggleTracking');
    const clearHistoryButton = document.getElementById('clearHistory');
    const generateSummaryButton = document.getElementById('generateSummary');

    // Check the current tracking state and update button text
    chrome.storage.local.get(['isTracking'], function (result) {
        trackingButton.textContent = result.isTracking ? 'Stop Tracking' : 'Start Tracking';
    });

    trackingButton.addEventListener('click', function() {
        chrome.storage.local.get(['isTracking'], function (result) {
            if (!result.isTracking) { // If not currently tracking, then prompt for intention
                const projectIntention = prompt("What's your intention for this project?");
                if (projectIntention) { // Check if the user entered something
                    // Store the intention in chrome's local storage
                    chrome.storage.local.set({'projectIntention': projectIntention}, function() {
                        console.log('Project intention saved:', projectIntention);
                        // Optionally, send the intention to your server here or at a different point in your logic
                    });
                }
            }
            chrome.runtime.sendMessage({ toggle: 'toggleTracking' });
            // Toggle tracking state after potentially setting project intention
            toggleTrackingStateAndUpdateButtonText();
        });
    });

    clearHistoryButton.addEventListener('click', () => {
        console.log("Clearing visitedTabs History");
        chrome.runtime.sendMessage({ toggle: 'clearHistory' });
    });

    // Within your document.addEventListener('DOMContentLoaded', ...
    generateSummaryButton.addEventListener('click', () => {
        console.log("Generating Summary");
        generateSummaryButton.textContent = "Generating...";
        generateSummaryButton.disabled = true; // Optionally disable the button to prevent multiple clicks
        chrome.runtime.sendMessage({ toggle: 'generateSummary' }, function(response) {
            // Once the summary has been generated, change the text back
            generateSummaryButton.textContent = "Generate Summary";
            generateSummaryButton.disabled = false; // Re-enable the button
            // Optionally call showSummary() here if the summary is updated as a result of this operation
            showSummary();
        });
    });
    showSummary();
    
});

function toggleTrackingStateAndUpdateButtonText() {
    chrome.storage.local.get(['isTracking'], function(result) {
        const isCurrentlyTracking = result.isTracking;
        const newText = isCurrentlyTracking ? 'Start Tracking' : 'Stop Tracking';
        chrome.storage.local.set({isTracking: !isCurrentlyTracking}, () => {
            console.log("Tracking toggled to " + (!isCurrentlyTracking ? 'ON' : 'OFF'));
            document.getElementById('toggleTracking').textContent = newText;
        });
    });
}

function showSummary() {
    const summaryField = document.getElementById('summary');
    
    // Use the callback to ensure the code runs after the result is fetched
    chrome.storage.local.get(["summary"], function(result) {
        if (result.summary && result.summary.message && result.summary.message.content){
            // If summary exists and has the necessary structure, parse and display it
            let summaryObject = JSON.parse(result.summary.message.content);
            console.log("Value is " + summaryObject.summary);

            // Start with the summary text
            let summaryText = summaryObject.summary;

            // Add 'Next Steps:' followed by the steps, each on a new line
            summaryText += '\n\nNext Steps:\n';
            summaryObject.next_steps.forEach((step, index) => {
                summaryText += (index + 1) + '. ' + step + '\n';
            });

            // Update the text of the summary field
            summaryField.innerText = summaryText;
        } else {
            // If no summary is found, or the structure is not as expected, handle it appropriately
            summaryField.innerText = "No summary available.";
            console.log('No summary found or summary is in unexpected format.');
        }
    });
}

document.addEventListener('DOMContentLoaded', function () {
    const button = document.getElementById('toggleTracking');

    // Check the current tracking state and update button text
    chrome.storage.local.get(['isTracking'], function (result) {
        button.textContent = result.isTracking ? 'Stop Tracking' : 'Start Tracking';
    });

    button.addEventListener('click', () => {
        console.log("Tracking toggled");
        chrome.runtime.sendMessage({ toggle: 'toggleTracking' });
        // Toggle the button text
        const newText = button.textContent === 'Start Tracking' ? 'Stop Tracking' : 'Start Tracking';
        button.textContent = newText;
    });

    showSummary();
    
});

function showSummary() {
    const summaryField = document.getElementById('summary');
    
    // Use the callback to ensure the code runs after the result is fetched
    chrome.storage.local.get(["summary"], function(result) {
        if (result.summary && result.summary.message && result.summary.message.content){
            // If summary exists and has the necessary structure, parse and display it
            let summaryObject = JSON.parse(result.summary.message.content);
            
            console.log("Value is " + summaryObject.summary);
            summaryField.innerText = summaryObject.summary; // Update the text of the summary field
        } else {
            // If no summary is found, or the structure is not as expected, handle it appropriately
            summaryField.innerText = "No summary available.";
            console.log('No summary found or summary is in unexpected format.');
        }
    });
}
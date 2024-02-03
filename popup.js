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
});

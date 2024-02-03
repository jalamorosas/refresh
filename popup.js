document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('startTracking').addEventListener('click', () => {
        chrome.runtime.sendMessage({ action: "startTracking" });
    });

    chrome.runtime.onMessage.addListener((message) => {
        if (message.type === 'tabInfo') {
            displayTabInfo(message.tab);
        }
    });
});

function displayTabInfo() {
    const tabList = document.getElementById('tabList');
    const tabInfoElement = document.createElement('div');
    tabInfoElement.textContent = `Tab: ${tab.url}, Title: ${tab.title}`;
    tabList.appendChild(tabInfoElement);
}

let isTracking = false;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "startTracking") {
    isTracking = !isTracking;
    if (isTracking) {
      startTracking();
    } else {
      stopTracking();
    }
  }
});

// 
function startTracking() {
  chrome.tabs.onUpdated.addListener(handleTabUpdated);
  chrome.tabs.onActivated.addListener(handleTabActivated);
}

function stopTracking() {
  chrome.tabs.onUpdated.removeListener(handleTabUpdated);
  chrome.tabs.onActivated.removeListener(handleTabActivated);
}

function handleTabUpdated(tabId, changeInfo, tab) {
  if (isTracking && changeInfo.status === 'complete' && tab.url) {
    saveTabInfo(tab);
  }
}

function handleTabActivated(activeInfo) {
  if (isTracking) {
    chrome.tabs.get(activeInfo.tabId, (tab) => {
      if (tab.url) {
        saveTabInfo(tab);
      }
    });
  }
}

function saveTabInfo(tab) {
  // Use chrome.storage.local to save tab info
  console.log(`Tab: ${tab.url}, Title: ${tab.title}`);
  let tabData = {url: tab.url, title: tab.title};
  chrome.runtime.sendMessage({action: "tabInfo", data: tabData});
}

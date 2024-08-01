chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === chrome.runtime.OnInstalledReason.INSTALL) {
    chrome.tabs.create({ url: "https://gpt-image-generator.com/welcome/" });
  }
});

chrome.action.onClicked.addListener(() => {
  chrome.tabs.create({ url: "page/page.html" });
});

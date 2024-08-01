chrome.action.onClicked.addListener(() => {
  chrome.tabs.create({ url: "page/page.html" });
});

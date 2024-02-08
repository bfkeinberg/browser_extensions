browser.action.onClicked.addListener((tab) => {
    const pathParams = new URL(tab.url).pathname.split('/');
    if (tab.url.includes('ridewithgps.com/routes') && tab.url.match(".*[0-9]+$")) {
        chrome.tabs.create({ url: `https://www.randoplan.com?rwgpsRoute=${pathParams[2]}&stopAfterLoad=true` });
    } else if (tab.url.includes('strava.com/routes') && tab.url.match(".*[0-9]+$")) {
        chrome.tabs.create({ url: `https://www.randoplan.com?strava_route=${pathParams[2]}&stopAfterLoad=true` });
    } else {
        browser.action.disable(tabId)
    }
});

browser.runtime.onMessageExternal.addListener(
      function (request, sender, sendResponse) {
          if (request) {
              if (request.message) {
                  if (request.message == "version") {
                      sendResponse({ version: 1.4 });
                  }
              }
          } else {
              return true
          }
});

browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (tab.url.includes('ridewithgps.com/routes') && tab.url.match(".*[0-9]+$")) {
        return
    } else if (tab.url.includes('strava.com/routes') && tab.url.match(".*[0-9]+$")) {
        return
    } else {
        browser.action.disable(tabId)
    }
});

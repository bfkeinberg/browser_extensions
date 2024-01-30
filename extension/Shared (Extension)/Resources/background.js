browser.action.onClicked.addListener((tab) => {
    const pathParams = new URL(tab.url).pathname.split('/');
    if (tab.url.includes('ridewithgps.com/routes') && tab.url.match(".*[0-9]+$")) {
        chrome.tabs.create({ url: `https://www.randoplan.com?rwgpsRoute=${pathParams[2]}&stopAfterLoad=true` });
    } else if (tab.url.includes('strava.com/routes') && tab.url.match(".*[0-9]+$")) {
        chrome.tabs.create({ url: `https://www.randoplan.com?strava_route=${pathParams[2]}&stopAfterLoad=true` });
    }
});

//browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
//    if (request.command === "load") {
//        const pathParams = new URL(request.url).pathname.split('/');
//        if (request.url.includes('ridewithgps.com/routes')) {
//            browser.tabs.create({ url: `https://www.randoplan.com?rwgpsRoute=${pathParams[2]}&stopAfterLoad=true` });
//        } else if (request.url.includes('strava.com/routes')){
//            browser.tabs.create({ url: `https://www.randoplan.com?strava_route=${pathParams[2]}&stopAfterLoad=true` });
//        }
//        sendResponse({load:"success"})
//    }
//});

browser.runtime.onMessageExternal.addListener(
      function (request, sender, sendResponse) {
          if (request) {
              if (request.message) {
//                  console.log(`message from ${JSON.stringify(sender)}`)
                  if (request.message == "version") {
                      sendResponse({ version: 1.4 });
                  }
              }
          } else {
//              if (sendResponse)
//                  sendResponse({"Undefined request"})
//              else
                  return true
          }
});

//browser.runtime.onConnectExternal.addListener(function(port) {
//    console.log(`Connection request received! for port ${JSON.stringify(port)}`);
//    port.postMessage({content:"Hello from the extension"})
//});

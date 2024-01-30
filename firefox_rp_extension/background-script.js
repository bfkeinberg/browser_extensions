 const handleClick = (tab) => {
    const pathParams = new URL(tab.url).pathname.split('/');
    if (tab.url.includes('ridewithgps.com/routes') && tab.url.match(".*[0-9]+$")) {
        browser.tabs.create({url: `https://www.randoplan.com?rwgpsRoute=${pathParams[2]}&showProvider=true&stopAfterLoad=true`});
    } else if (tab.url.includes('strava.com/routes') && tab.url.match(".*[0-9]+$")) {
        browser.tabs.create({url: `https://www.randoplan.com?strava_route=${pathParams[2]}&showProvider=true&stopAfterLoad=true`});
    }
 };

 browser.pageAction.onClicked.addListener(handleClick);

 chrome.runtime.onMessageExternal.addListener(
    function (request, sender, sendResponse) {
        if (request) {
            if (request.message) {
                if (request.message == "version") {
                    sendResponse({ version: 1.4 });
                }
            }
        }
        return true;
    });

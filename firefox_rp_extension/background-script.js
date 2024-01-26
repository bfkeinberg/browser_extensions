 const handleClick = (tab) => {
    const pathParams = new URL(tab.url).pathname.split('/');
    if (tab.url.includes('ridewithgps.com')) {
        browser.tabs.create({url: `https://www.randoplan.com?rwgpsRoute=${pathParams[2]}&showProvider=true&stopAfterLoad=true`});
    } else {
        browser.tabs.create({url: `https://www.randoplan.com?strava_route=${pathParams[2]}&showProvider=true&stopAfterLoad=true`});
    }
 };

 browser.pageAction.onClicked.addListener(handleClick);

 chrome.runtime.onMessageExternal.addListener(
    function (request, sender, sendResponse) {
        if (request) {
            if (request.message) {
                if (request.message == "version") {
                    sendResponse({ version: 1.1 });
                }
            }
        }
        return true;
    });

 const handleClick = (tab) => {
    const pathParams = new URL(tab.url).pathname.split('/');
    browser.tabs.create({url: `https://www.randoplan.com?rwgpsRoute=${pathParams[2]}&stopAfterLoad=true`});
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

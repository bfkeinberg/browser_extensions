chrome.runtime.onInstalled.addListener(() => {
    // Page actions are disabled by default and enabled on select tabs
    chrome.action.disable();

    // Clear all rules to ensure only our expected rules are set
    chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
        // Declare a rule to enable the action on example.com pages
        let exampleRule = {
            conditions: [
                new chrome.declarativeContent.PageStateMatcher({
                    pageUrl: { hostEquals: 'ridewithgps.com', pathContains: 'routes', schemes: ['https'] },
                }),
                new chrome.declarativeContent.PageStateMatcher({
                    pageUrl: { hostSuffix: 'strava.com', pathContains: 'routes', schemes: ['https'] },
                })
            ],
            actions: [new chrome.declarativeContent.ShowAction()],
        };

        // Finally, apply our new array of rules
        let rules = [exampleRule];
        chrome.declarativeContent.onPageChanged.addRules(rules);
    });
});

chrome.action.onClicked.addListener((tab) => {
    const pathParams = new URL(tab.url).pathname.split('/');
    if (tab.url.includes('ridewithgps.com')) {
        chrome.tabs.create({ url: `https://www.randoplan.com?rwgpsRoute=${pathParams[2]}&stopAfterLoad=true` });
    } else {
        chrome.tabs.create({ url: `https://www.randoplan.com?strava_route=${pathParams[2]}&stopAfterLoad=true` });
    }
});

chrome.runtime.onMessageExternal.addListener(
    function (request, sender, sendResponse) {
        if (request) {
            if (request.message) {
                if (request.message == "version") {
                    sendResponse({ version: 1.3 });
                }
            }
        }
        return true;
    });

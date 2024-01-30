function getActiveTab() {
    return browser.tabs.query({active: true, currentWindow: true});
}

getActiveTab().then((tabs) => {
        browser.tabs.sendMessage(tabs[0].id, {
            command: "load",
            url: tabs[0].url
        });
    });


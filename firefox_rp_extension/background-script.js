 const handleClick = (tab) => {
    const pathParams = new URL(tab.url).pathname.split('/');
    browser.tabs.create({url: `https://www.randoplan.com?rwgpsRoute=${pathParams[2]}&stopAfterLoad=true`});
 };

 browser.pageAction.onClicked.addListener(handleClick);

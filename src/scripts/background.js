chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'restore-tabs') {
        (async () => {
            for (const sessionId of message.sessionIds) {
                    await chrome.sessions.restore(sessionId);
            }
            sendResponse({ restored: message.sessionIds.length });
        })();
    }
    if (message.action === 'restore-windows') {
        (async () => {
            for (const sessionId of message.sessionIds) {
                    await chrome.sessions.restore(sessionId);
            }
            sendResponse({ restored: message.sessionIds.length });
        })();
    }
    if(message.action === 'restore-tabs-state'){
         (async () => {
            for (const tab of message.savedTabs) {
                    await chrome.tabs.create({
                        url: tab.url,
                    });
                    console.log("tab restored");
            }
            //remove tabs not part of state
            await chrome.tabs.remove(message.tabIds);
            sendResponse({ restored: message.savedTabs.length });
        })();
    }
});
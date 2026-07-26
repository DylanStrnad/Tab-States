
async function saveState(state) {
    const tabs = await chrome.tabs.query({ currentWindow: true });
    await chrome.storage.local.set({[state]: tabs});
    console.log('state saved');
}

async function loadState(state) {
    const tabs = await chrome.storage.local.get({[state]: []});
    const savedTabs = tabs[state];

    const currentTabs = await chrome.tabs.query({ currentWindow: true });
    const tabIds = currentTabs.map(tab => tab.id);

    chrome.runtime.sendMessage({action: 'restore-tabs-state', savedTabs});
    console.log('loading state');

    // close currently open tabs not included in tab state
    await chrome.tabs.remove(tabIds);
}

// async function renameState(id) {
//     const element = document.getElementById('#[id]');
//     element.addEventListener('input', (e) => chrome.storage.local.set({[id] : e}))

//     element.appendChild()
// }

//save and load buttons
const saveState1Button = document.querySelector("#save-state-1");
saveState1Button.addEventListener('click', () => saveState('state1'));
const loadState1Button = document.querySelector('#load-state-1');
loadState1Button.addEventListener('click', () => loadState('state1'));

const saveState2Button = document.querySelector("#save-state-2");
saveState2Button.addEventListener('click', () => saveState('state2'));
const loadState2Button = document.querySelector('#load-state-2');
loadState2Button.addEventListener('click', () => loadState('state2'));

const saveState3Button = document.querySelector("#save-state-3");
saveState3Button.addEventListener('click', () => saveState('state3'));
const loadState3Button = document.querySelector('#load-state-3');
loadState3Button.addEventListener('click', () => loadState('state3'));

//rename state button
// const renameState1 = document.querySelector("#state-1");
// renameState1.addEventListener('click', () => renameState('state1'));


window.addEventListener('DOMContentLoaded', () => {
    const element = document.querySelector('#rename-state-1');
    element.addEventListener('input', (e) => chrome.storage.local.set({renameValueState1: e.target.value}))

    const savedName = chrome.storage.local.get({renameValueState1: []});
    console.log(savedName.renameValueState1);
    element.value = savedName.renameValueState1;
})


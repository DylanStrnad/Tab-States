
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

async function renameState(stateId, newStateName) {
    const stateName = document.querySelector(stateId);
    stateName.addEventListener('input', (e) => chrome.storage.local.set({[newStateName]: e.target.value}));

    const savedName = await chrome.storage.local.get({[newStateName]: []});
    console.log(savedName[newStateName]);
    stateName.value = savedName[newStateName];
}

async function addState(){
    const existingStates = document.querySelectorAll('.btn-group');
    const newState = existingStates.length;
    const html = `<div class="btn-group" role="group" aria-label="Basic outlined example" style="padding: 1em; ">
      <button id="state-${newState}"class="btn btn-primary btn-sm sort-btn" style="margin: 0.1em; padding-left: 2em; padding-right: 2em; background-color: #51585d; border-color: #75001d;"> <input type="text" id="rename-state-${newState}" placeholder="state 1" size="5"> </button>
      <button id="save-state-${newState}" class="btn btn-primary btn-sm sort-btn" style="margin: 0.1em; padding-left: 1.25em; padding-right: 1.25em; background-color: #51585d; border-color: #75001d;">Save</button>
      <button id="load-state-${newState}" class="btn btn-primary btn-sm sort-btn" style="margin: 0.1em; padding-left: 1.25em; padding-right: 1.25em; background-color: #51585d; border-color: #75001d;">Load</button>
    </div>`;

    const insertLocation = document.querySelector('#plus').closest('.btn-group');
    insertLocation.insertAdjacentHTML('beforebegin', html);
    
}

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

//plus button
const addStateButton = document.querySelector('#plus');
addStateButton.addEventListener('click', () => addState());

//rename state button
window.addEventListener('DOMContentLoaded', async () => {
    const existingStates = document.querySelectorAll('.btn-group');
    for(let i = 1; i < existingStates.length; ++i){
        renameState(`#rename-state-${i}`, `newStateName${i}`);
    }
})



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
    await new Promise((resolve) => {chrome.runtime.sendMessage({action: 'restore-tabs-state', savedTabs, tabIds}, resolve); });
    console.log('loading state');
}

//sets/retrieves state name from memory
async function renameState(stateId, newStateName) {
    const stateName = document.querySelector(stateId);
    stateName.addEventListener('input', (e) => chrome.storage.local.set({[newStateName]: e.target.value}));

    const savedName = await chrome.storage.local.get({[newStateName]: []});
    console.log(savedName[newStateName]);
    stateName.value = savedName[newStateName];
}

async function addState(){
    const { totalStates } = await chrome.storage.local.get({totalStates: 1});
    const newTotal = totalStates + 1;
    const html = `<div class="btn-group" role="group" aria-label="Basic outlined example" style="padding: 1em; ">
      <button id="state-${newTotal}"class="btn btn-primary btn-sm sort-btn" style="margin: 0.1em; padding-left: 2em; padding-right: 2em; background-color: #51585d; border-color: #75001d;"> <input type="text" id="rename-state-${newTotal}" placeholder="state ${newTotal}" size="5"> </button>
      <button id="save-state-${newTotal}" class="btn btn-primary btn-sm sort-btn" style="margin: 0.1em; padding-left: 1.25em; padding-right: 1.25em; background-color: #51585d; border-color: #75001d;">Save</button>
      <button id="load-state-${newTotal}" class="btn btn-primary btn-sm sort-btn" style="margin: 0.1em; padding-left: 1.25em; padding-right: 1.25em; background-color: #51585d; border-color: #75001d;">Load</button>
    </div>`;

    const insertLocation = document.querySelector('#plus').closest('.btn-group');
    insertLocation.insertAdjacentHTML('beforebegin', html);
    await chrome.storage.local.set({totalStates: newTotal});
    renameState(`#rename-state-${newTotal}`, `newStateName${newTotal}`);
}

async function removeState(){
    const {totalStates} = await chrome.storage.local.get({totalStates: 1});
    if (totalStates <= 1) return; //always have 1 state

    const newTotal = totalStates - 1;

    const stateGroups = document.querySelectorAll('.btn-group');
    const lastStateGroup = stateGroups[stateGroups.length - 3]; // find the DOM element of the state needed to remove
    lastStateGroup.remove(); //updates the page

    //remove state data from the storage
    await chrome.storage.local.remove([`state${totalStates}`, `newStateName${totalStates}`]);

    await chrome.storage.local.set({totalStates: newTotal});
}

//save and load buttons
const saveState1Button = document.querySelector("#save-state-1");
saveState1Button.addEventListener('click', () => saveState('state1'));
const loadState1Button = document.querySelector('#load-state-1');
loadState1Button.addEventListener('click', () => loadState('state1'));

//plus button
const addStateButton = document.querySelector('#plus');
addStateButton.addEventListener('click', () => addState());

//minus button
const removeStateButton = document.querySelector('#minus');
removeStateButton.addEventListener('click', () => removeState());

//reload DOM content when page is reloaded
window.addEventListener('DOMContentLoaded', async () => {
    let numberOfStates = await chrome.storage.local.get({totalStates: 1});
    numberOfStates = numberOfStates.totalStates;
    console.log(numberOfStates);
    for(let i = 2; i <= numberOfStates; ++i){
        const html = `<div class="btn-group" role="group" aria-label="Basic outlined example" style="padding: 1em; ">
                <button id="state-${i}"class="btn btn-primary btn-sm sort-btn" style="margin: 0.1em; padding-left: 2em; padding-right: 2em; background-color: #51585d; border-color: #75001d;"> <input type="text" id="rename-state-${i}" placeholder="state ${i}" size="5"> </button>
                <button id="save-state-${i}" class="btn btn-primary btn-sm sort-btn" style="margin: 0.1em; padding-left: 1.25em; padding-right: 1.25em; background-color: #51585d; border-color: #75001d;">Save</button>
                <button id="load-state-${i}" class="btn btn-primary btn-sm sort-btn" style="margin: 0.1em; padding-left: 1.25em; padding-right: 1.25em; background-color: #51585d; border-color: #75001d;">Load</button>
            </div>`;
        const insertLocation = document.querySelector('#plus').closest('.btn-group');
        insertLocation.insertAdjacentHTML('beforebegin', html);
        document.querySelector(`#save-state-${i}`).addEventListener('click', () => saveState(`state${i}`));
        document.querySelector(`#load-state-${i}`).addEventListener('click', () => loadState(`state${i}`));
    }
    const existingStates = document.querySelectorAll('.btn-group');
    for(let i = 1; i <= existingStates.length; ++i){
        renameState(`#rename-state-${i}`, `newStateName${i}`);
    }
})


let extensionState = {
    enabled: false
};

const extensionStateCheckbox = document.getElementById(`extension-state`);


function sendDataToScript(data) {
    browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
        browser.storage.local.set({extensionState});
        browser.tabs.sendMessage(tabs[0].id, { data });
    });
}

document.getElementById(`send-message`).addEventListener("click", () => {
    sendDataToScript({
        key: "Test message" 
    });
});
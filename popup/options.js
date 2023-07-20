function sendDataToScript(data) {
    browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
        browser.tabs.sendMessage(tabs[0].id, { data });
    });
}

document.getElementById(`send-message`).addEventListener("click", () => {
    sendDataToScript({
        key: "Test message" 
    });
});
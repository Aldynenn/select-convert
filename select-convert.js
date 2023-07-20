let mouseUp = true;
document.addEventListener("mouseup", () => {
    mouseUp = true;
});
document.addEventListener("mousedown", () => {
    mouseUp = false;
});


document.addEventListener("selectionchange", () => {
    if (isTextSelected() && mouseUp) {
        handleSelection();
    }
});
document.addEventListener("mouseup", () => {
    if (isTextSelected() && mouseUp) {
        handleSelection();
    }
});

browser.runtime.onMessage.addListener((message) => {
    const data = message.data;
    console.log("Data received in the background script:", data);
});


function isTextSelected() {
    const selection = window.getSelection();
    return selection && selection.type === "Range";
}

function getSelectionText() {
    let text = "";
    if (window.getSelection()) {
        text = window.getSelection().toString();
    } else if (document.selection && document.selection.type != "Control") {
        text = document.selection.createRange().text;
    }
    return text;
}

function handleSelection() {
    if (isTextSelected()) {
        const selectedText = getSelectionText();
        console.log(selectedText);
    }
}

function isTextConvertible(text) {
    const currencyRegex = /^(?:\p{Sc}.*\d|\d.*\p{Sc})$/u;
    const unitRegex = /^(\d{1,3}(?:[.,]\d{3})*)(?:\.\d+)?\s*(?:[a-zA-Z\u00C0-\u017F\u00B0]+)$/u;
    const containsCurrencySymbol = currencyRegex.test(text);
    const containsUnit = unitRegex.test(text);

    
}
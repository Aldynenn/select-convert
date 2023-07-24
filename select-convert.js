const popUpID = "select-convert-popup";

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

browser.runtime.onMessage.addListener(async (message) => {
    const data = message.data;
    let extensionEnabled = await browser.storage.local.get("extensionState");
    console.log(extensionEnabled);
    if (!extensionEnabled) {
        
    }
    console.log("Data received in the background script:", data);
});

function handleSelection() {
    if (!isTextSelected()) {
        console.log("Not selected"); //DEBUG
        return;
    }
    const selectedText = getSelectionText().trim();
    if (!isTextConvertible(selectedText)) {
        console.log("Not convertible"); //DEBUG
        return;
    }
    const selectionCoordinates = getSelectionCoords();
    createPopUp(selectionCoordinates.x, selectionCoordinates.y);
}

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

function isTextConvertible(text) {
    const currencyRegex = /^(?:\p{Sc}.*\d|\d.*\p{Sc})$/u;
    const unitRegex = /^(\d{1,3}(?:[., ]\d{3})*)(?:\.\d+)?\s*(?:[a-zA-Z\u00C0-\u017F\u00B0]+)$/u;
    const containsCurrencySymbol = currencyRegex.test(text);
    const containsUnit = unitRegex.test(text);
    return containsCurrencySymbol || containsUnit;
}

function getSelectionCoords() {
    let selection = document.selection
    let range;
    let rects;
    let rect;
    let x = 0;
    let y = 0;
    if (selection) {
        if (selection.type != "Control") {
            range = selection.createRange();
            range.collapse(true);
            x = range.boundingLeft;
            y = range.boundingTop;
        }
    } else if (window.getSelection) {
        selection = window.getSelection();
        if (selection.rangeCount) {
            range = selection.getRangeAt(0).cloneRange();
            if (range.getClientRects) {
                range.collapse(true);
                rects = range.getClientRects();
                if (rects.length > 0) {
                    rect = rects[0];
                }
                if (rect === undefined) {
                    x = 0;
                    y = 0;
                }
                else {
                    x = rect.left;
                    y = rect.top;
                }
            }
            if (x == 0 && y == 0) {
                let span = document.createElement("span");
                if (span.getClientRects) {
                    span.appendChild(document.createTextNode("\u200b"));
                    range.insertNode(span);
                    rect = span.getClientRects()[0];
                    x = rect.left;
                    y = rect.top;
                    let spanParent = span.parentNode;
                    spanParent.removeChild(span);
                    spanParent.normalize();
                }
            }
        }
    }
    return { x: x, y: y };
}

function createPopUp(x, y, content) {
    clearPopUp();
    const popUp = document.createElement("div");
    popUp.id = popUpID;
    popUp.innerText = "Select-Convert Popup!";

    if (!document.getElementById("select-convert-styles"))
    {
        let css = `
        #${popUpID} {
            font-size: 18px;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            padding: 0.5em;
            line-height: 1em;
            border: hidden;
            border-radius: 0.35em;
            color: #E9F1EC;
            background-color: #222227;
            position: fixed;
            z-index: 10000;
            top: ${y}px;
            left: ${x}px;
            translate: 0 calc(-100% - 0.5em);
            scale: 0;
            transition: 250ms ease scale;
        }
        #${popUpID}.show {
            scale: 1;
            transition: 250ms ease scale;
        }
        `;
        let selectConvertStyles = document.createElement("style");
        selectConvertStyles.setAttribute("type", "text/css");    
        selectConvertStyles.id = "select-convert-styles";    
        selectConvertStyles.appendChild(document.createTextNode(css));
        document.head.appendChild(selectConvertStyles);
    }

    document.body.appendChild(popUp);
    requestAnimationFrame(() => {
        popUp.classList.add("show");
    });
}

function clearPopUp() {    
    if (!!document.getElementById(popUpID)) {
        document.getElementById(popUpID).classList.remove("show");
        document.getElementById(popUpID).addEventListener("transitionend", () => {
            document.getElementById(popUpID).remove();
        });
    }
}
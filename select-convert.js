function isTextSelected() {
    let selection = window.getSelection();
    console.log(selection);
    return selection && selection.type === "Range";
}
function getSelectionText() {
    var text = "";
    if (window.getSelection) {
        text = window.getSelection().toString();
    } else if (document.selection && document.selection.type != "Control") {
        text = document.selection.createRange().text;
    }
    return text;
}

document.addEventListener("load", () => {
    isTextSelected();
});
document.addEventListener("selectionchange", () => {
    isTextSelected();
});
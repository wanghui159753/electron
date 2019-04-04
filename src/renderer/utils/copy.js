const { clipboard, ipcRenderer , nativeImage } = require("electron");
import { getBase64 } from "@/api/im/baseMethod";

export function inputPaste(el) {
    let clipboardContent = clipboard.readText() || clipboard.readImage()
    const selection = window.getSelection().toString();
    if (typeof clipboardContent !== "object") {
        var myEvent = new Event('input')
        if (!el.disabled) {
            if (selection) {
                el.value = el.value.replace(selection, clipboardContent)
            } else {
                el.value += clipboardContent;
            }
            el.focus();
            el.dispatchEvent(myEvent)
        }
    }

}
export function inputCopy(el) {
    const selection = window.getSelection().toString();
    if(el.nodeName == 'IMG'){
        getBase64(el.src, dataURL => {
            clipboard.writeImage(nativeImage.createFromDataURL(dataURL));
          });
    }else
    clipboard.writeText(selection ||el.innerText|| el.value);
}
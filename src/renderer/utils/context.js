import {inputPaste, inputCopy} from "@/utils/copy.js";
const { clipboard } = require("electron");
const {remote} = require("electron");
const {Menu, MenuItem} = remote;
const menu = new Menu();
let target = null;
window.oncontextmenu = (e) => {
    e.preventDefault();
    target = e.target;
    menu.popup({window: remote.getCurrentWindow()});
}
menu.append(
    new MenuItem({
        label: "复制",
        // enabled: window.getSelection().toString(),
        click(...args) {
            inputCopy(target);
        }
    })
);
menu.append(
    new MenuItem({
        label: "粘贴",
        click($event) {
            inputPaste(target);
        }
    })
);
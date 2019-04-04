const clipboard = require('electron').clipboard;
const { globalShortcut, app } = require('electron');
app.on('ready', () => {
    globalShortcut.register("ctrl+c", () => {
        console.log("ctrl+c触发了")
        clipboard.writeImage()
    })
    globalShortcut.register("ctrl+v", () => {
        clipboard.readImage()
    })
})
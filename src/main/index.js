import {app, BrowserWindow, ipcMain, Tray, Menu} from 'electron'

var exec = require('child_process').exec;
exec('node --no-deprecation', function (err, stdout, stderr) {
    console.log(err, stdout, stderr)
})
const path = require("path")
const pack = require('./../../package.json')
// const { useCapture } = require("../renderer/views/message/lib/capture-main")
/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
var Registry = require('winreg')
let regKey = new Registry({ // new operator is optional
    hive: Registry.HKCU, // open registry hive HKEY_CURRENT_USER
    key: '\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings\\Zones\\3' // key containing autostart programs
})
let arr = ['1001', '1004', '1201', '1200', '1405', '2201']

for (let key in arr) {
    regKey.set(arr[key], 'REG_DWORD', 0, function (err) {
        if (err) throw err;
    })
}
if (process.env.NODE_ENV !== 'development') {
    global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}
var webContents
var mainWindow
var tray = null
var isTwinkle = null
const winURL = process.env.NODE_ENV === 'development'
    ? `http://localhost:9080`
    : `file://${__dirname}/index.html`
var menu = Menu.buildFromTemplate([
    {
        label: "最大化",
        click: () => {
            mainWindow.maximize()
        }
    },
    {
        label: "最小化",
        click: () => {
            mainWindow.minimize()
        }
    },
    {
        label: "退出",
        click: () => {
            app.quit()
        }
    }

])

function createWindow() {
    mainWindow = new BrowserWindow({
        height: 820,
        useContentSize: false,
        frame: false,
        minWidth: 900,
        minHeight: 500,
        webPreferences: {webSecurity: false},
        width: 1200
    })
    mainWindow.loadURL(winURL)
    mainWindow.on('closed', () => {
        mainWindow = null
    })
    mainWindow.once('ready-to-show', () => {
        mainWindow && mainWindow.show()
    })

    webContents = mainWindow.webContents;

    newTray()
}

const gotTheLock = app.requestSingleInstanceLock()

app.on('second-instance', (commandLine, workingDirectory) => {
    // Someone tried to run a second instance, we should focus our window.
    if (mainWindow) {
        mainWindow.restore()
        mainWindow.show()
        mainWindow.focus()
    }
})

if (!gotTheLock) {
    app.quit()
}

function newTray() {
    tray = new Tray(path.join(__dirname, "../../dist/electron/static/icon/icon.ico"))
    tray.setToolTip("心动配讯")
    tray.setContextMenu(menu)
    tray.on("click", () => {
        clearInterval(timer)
        tray.setImage(path.join(__dirname, '../../dist/electron/static/icon/icon.ico'))
        //主窗口显示隐藏切换
        mainWindow && mainWindow.show()
    })
    tray.on('balloon-click', function (event) {
        mainWindow && mainWindow.show()
        mainWindow.webContents.send('ToThisUrl', '/message/index/session')
    })
}

//图片查看窗口
var PicWindow

function creatPicWindow() {
    PicWindow = new BrowserWindow({
        useContentSize: false,
        frame: false,
        transparent: true,
        show: false,
        alwaysOnTop: true,
        webPreferences: {webSecurity: false},
    })
    PicWindow.loadURL(winURL + '#/picLooker')
    PicWindow.on('closed', () => {
        PicWindow = null
    })
}

var UpdataWindow

function creatUpdataWindow() {

    const {screen} = require('electron')
    const winURL = process.env.NODE_ENV === 'development'
        ? `http://localhost:9080`
        : `file://${__dirname}/index.html`

    let displays = screen.getAllDisplays()
    UpdataWindow = new BrowserWindow({
        width: 600,
        height: 400,
        transparent: true,
        frame: false,
        // fullscreen: os.platform() === 'win32' || undefined,
        movable: false,
        resizable: false,
        enableLargerThanScreen: true,
        hasShadow: false,
        alwaysOnTop: true,
        webPreferences: {webSecurity: false},
    })
    console.log(winURL + '#/updata')
    UpdataWindow.loadURL(winURL + '#/updata')
    UpdataWindow.on('closed', () => {
        UpdataWindow = null
    })
}

ipcMain.on('openUpdataWindow', () => {
    if (!UpdataWindow) {
        creatUpdataWindow()
    }
})

ipcMain.on('getversion', (event) => {
    mainWindow.webContents.send('getversion', pack)
})
ipcMain.on('closeUpdataWindow', () => {
    UpdataWindow = null
})
app.on('ready', createWindow)
ipcMain.on('openPicWindow', () => {
    if (!PicWindow) {
        creatPicWindow()
    }
})
//创建图片查看器窗口
ipcMain.on('picLooker', (e, data) => {
    if (PicWindow) {
        PicWindow.webContents.send('newArr', data);
        PicWindow.show()
    } else {
        creatPicWindow(data);
    }
})


//订单窗口

var orderWindow

function creatOrderWindow(data) {
    orderWindow = new BrowserWindow({
        height: 600,
        useContentSize: false,
        width: 900,
        frame: false,
        transparent: true,
        minWidth: 780
    })
    orderWindow.loadURL(winURL + '#/order?user=' + data)
    orderWindow.on('closed', () => {
        orderWindow = null
    })
}

let id
//创建窗口，没有就创建
ipcMain.on('orderWindowCreated', (e, data) => {
    if (!orderWindow) {
        creatOrderWindow(data)
    } else {
        orderWindow.webContents.send('userId', data)
    }
})
//向渲染进程输出id
ipcMain.on('giveMeId', (e, id) => {
    orderWindow.webContents.send('newOrder', id)
})
//确认订单后主动关闭订单
ipcMain.on('orderFinish', () => {
    setTimeout(() => {
        orderWindow && orderWindow.close()
        orderWindow = null
    }, 3000)

})

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow()
    }
})

//最小化 最大化 关闭按钮接收的事件
ipcMain.on('minimize', e => mainWindow.minimize())
ipcMain.on('maximization', e => {
    if (mainWindow.isMaximized()) {
        mainWindow.restore();
    } else {
        mainWindow.maximize()
    }
});
ipcMain.on('close', e => mainWindow.hide());
let curShowMsg;
ipcMain.on('tipMsg', function (event, arg) {
    curShowMsg = arg;
    tray.displayBalloon({
        icon: path.join(__dirname, '../../dist/electron/static/image/xdpx.png'),
        title: arg.title,
        content: arg.content,
        appId: '心动配讯'
    })
})

// 收到消息触发此事件，进行图标闪烁
var timer = null
ipcMain.on("receiveMsg", (event) => {
    mainWindow.flashFrame(true);
    clearInterval(timer);
    var count = 0
    timer = setInterval(function () {
        count++;
        if (count % 2 == 0) {
            tray.setImage(path.join(__dirname, '../../dist/electron/static/icon/icon.ico'))
        } else {
            tray.setImage(path.join(__dirname, '../../dist/electron/static/icon/empty.ico'))
        }
    }, 700);
    event.sender.send("playAudio")
})
//取消闪烁
ipcMain.on('cancal', () => {
    setTimeout(() => {
        clearInterval(timer)
        tray.setImage(path.join(__dirname, '../../dist/electron/static/icon/icon.ico'))
    }, 500);
})

//查询当前窗口是否最小化
function isShow() {
    isTwinkle = mainWindow.isMinimized()
}

// 当收到消息时，渲染进程发消息给主进程，判断当前窗口是否是隐藏的
// 如果当前窗口是隐藏的 播放声音并且闪烁
// 当过当前窗口不是隐藏的，只播放声音 
ipcMain.on("isTwinkle", function (event) {
    isShow()
    event.sender.send("sendState", isTwinkle || event)
})
ipcMain.on("triggerAudio", function (event) {
    event.sender.send("playAudio")
})
ipcMain.on("closeAudio", function (event, boo) {
    mainWindow.webContents.setAudioMuted(boo)
})
ipcMain.on("getAudio", function (event) {
    let boo = mainWindow.webContents.isAudioMuted()
    mainWindow.webContents.send('returnAudio', boo)
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

import {autoUpdater} from 'electron-updater'

const fs = require('fs-extra')
const os = require('os')
const pathUpdata = os.homedir() + "/AppData/Roaming/xdpx/__update__"

function updateHandle() {
    const feedUrl = 'http://image.xindongpeixun.com/xdpx/pc/' + os.platform() + '/';
    let message = {
        error: '检查更新出错',
        checking: '正在检查更新……',
        updateAva: '检测到新版本，正在下载……',
        updateNotAva: '现在使用的就是最新版本，不用更新',
    };

    autoUpdater.setFeedURL(feedUrl);
    autoUpdater.on('error', function (error) {
        console.log(error, '----')
        if (UpdataWindow) {
            UpdataWindow.webContents.send('refresh')
        }

    });
    autoUpdater.on('checking-for-update', function () {
        sendUpdateMessage(message.checking)
    });
    // 发现一个更新包时自动下载
    autoUpdater.on('update-available', function (info) {
        sendUpdateMessage(message.updateAva)
    });
    //暂无更新时触发
    autoUpdater.on('update-not-available', function (info) {
        sendUpdateMessage(message.updateNotAva)
    });
    // 更新下载进度更新下载进度
    // 更新下载进度事件
    autoUpdater.on('download-progress', (progressObj) => {
        UpdataWindow.webContents.send('downloadProgress', progressObj)
    })
    // 下载完成事件
    autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName, releaseDate, updateUrl, quitAndUpdate) => {
        ipcMain.on('isUpdateNowTime', (e, arg) => {
            autoUpdater.quitAndInstall(false, false);
        });
        UpdataWindow && UpdataWindow.webContents.send('isUpdateNow')
    });

    // //执行自动更新检查
    autoUpdater.checkForUpdates();
    // //执行自动更新检查
}

ipcMain.on("checkForUpdate", () => {
    // autoUpdater.checkForUpdates();
    // fs.emptyDir(pathUpdata)
    //     .then(() => {
    updateHandle();
    mainWindow.hide()
    // })
})
ipcMain.on("showWindow", () => {
    mainWindow && mainWindow.show()
});

// 通过main进程发送事件给renderer进程，提示更新信息
function sendUpdateMessage(text) {
    function sendUpdateMessage(text) {
        UpdataWindow.webContents.send('message', text)
    }

    app.on('window-all-closed', () => app.quit());
}
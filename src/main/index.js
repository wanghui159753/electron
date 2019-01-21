import { app, BrowserWindow, ipcMain, Tray, Menu } from 'electron'


const path = require("path")
/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
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

function createWindow() {
  mainWindow = new BrowserWindow({
    height: 820,
    useContentSize: false,
    width: 1400,
    frame: false,
    minWidth:1400,
    minHeight:820,
    // webPreferences: { webSecurity: false },
    width: 1200,
    frame:false
    // titleBarStyle: 'hidden',
    // transparent: true
  })
  // webPreferences: { webSecurity: false },
  mainWindow.loadURL(winURL)
  mainWindow.webContents.openDevTools()
  mainWindow.on('closed', () => {
    mainWindow = null
  })

  webContents = mainWindow.webContents;
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
  tray = new Tray(path.join(__dirname, "../../dist/electron/static/icon/icon.ico"))
  tray.setToolTip("心动配讯")
  tray.setContextMenu(menu)
  tray.on("click", () => {
    clearInterval(timer)
    tray.setImage(path.join(__dirname, '../../dist/electron/static/icon/icon.ico'))
    //主窗口显示隐藏切换
    mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show()
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})



// 打包之后有问题
//最小化 最大化 关闭按钮接收的事件
ipcMain.on('minimize', e => mainWindow.minimize())
ipcMain.on('maximization', e => {
  if (mainWindow.isMaximized()) {
    mainWindow.restore();
  } else {
    mainWindow.maximize()
  }
});
ipcMain.on('close', e => mainWindow.close());



// 收到消息触发此事件，进行图标闪烁
var timer = null
ipcMain.on("receiveMsg", (event) => {
  console.log("update---shanshuo")
  clearInterval(timer)
  var count = 0
  timer = setInterval(function () {
    count++;
    if (count % 2 == 0) {
      // path.join(__dirname, '../../dist/electron/static/icon/icon.ico')
      tray.setImage(path.join(__dirname, '../../dist/electron/static/icon/icon.ico'))
    } else {
      tray.setImage(path.join(__dirname, '../../dist/electron/static/icon/empty.ico'))
    }
  }, 700);
  event.sender.send("playAudio")
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
  event.sender.send("sendState", isTwinkle)
})

ipcMain.on("triggerAudio", function (event) {
  event.sender.send("playAudio")
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */


// import { autoUpdater } from 'electron-updater'
// const feedUrl = 'http://www.mc51.xin/';
/*
let sendUpdateMessage = (message, data) => {
  webContents.send('message', { message, data });
};
let checkForUpdates = () => {
  autoUpdater.setFeedURL(feedUrl);
  autoUpdater.on('error', function (message) {
    sendUpdateMessage('error', message)
  });
  autoUpdater.on('checking-for-update', function (message) {
    sendUpdateMessage('checking-for-update', message)
  });
  autoUpdater.on('update-available', function (message) {
    sendUpdateMessage('update-available', message)
  });
  autoUpdater.on('update-not-available', function (message) {
    sendUpdateMessage('update-not-available', message)
  });

  // 更新下载进度事件
  autoUpdater.on('download-progress', function (progressObj) {
    sendUpdateMessage('downloadProgress', progressObj)
  })
  autoUpdater.on('update-downloaded', function (event, releaseNotes, releaseName, releaseDate, updateUrl, quitAndUpdate) {
    ipcMain.on('updateNow', (e, arg) => {
      //some code here to handle event
      autoUpdater.quitAndInstall();
    })
    sendUpdateMessage('isUpdateNow');
  });

  //执行自动更新检查
  autoUpdater.checkForUpdates();
};
*/
import { autoUpdater } from 'electron-updater'

function updateHandle() {
  const feedUrl = 'http://www.mc51.xin/';
  let message = {
    error: '检查更新出错',
    checking: '正在检查更新……',
    updateAva: '检测到新版本，正在下载……',
    updateNotAva: '现在使用的就是最新版本，不用更新',
  };
  const os = require('os');
  autoUpdater.setFeedURL(feedUrl);
  autoUpdater.on('error', function (error) {
    sendUpdateMessage(message.error)
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
  // 更新下载进度
  autoUpdater.on('download-progress', function (progressObj) {
    console.log(progressObj, "progressObj")
    mainWindow.webContents.send('downloadProgress', progressObj)
  })
  // 更新下载完成时触发
  autoUpdater.on('update-downloaded', function (event, releaseNotes, releaseName, releaseDate, updateUrl, quitAndUpdate) {
    console.log(releaseName, "releaseName")
    console.log(event, "event")
    console.log(releaseNotes, "releaseNotes")
    console.log(releaseDate, "releaseDate")
    console.log(updateUrl, "updateUrl")
    console.log(quitAndUpdate, "quitAndUpdate")
    ipcMain.on('isUpdateNow', (e, arg) => {
      console.log(arguments, "arguments");
      console.log("开始更新");
      autoUpdater.quitAndInstall();
    });
    mainWindow.webContents.send('isUpdateNow')
  })
  ipcMain.on("checkForUpdate", () => {
    //执行自动更新检查
    autoUpdater.checkForUpdates();
  })
}
// 通过main进程发送事件给renderer进程，提示更新信息
function sendUpdateMessage(text) {
  mainWindow.webContents.send('message', text)
}
app.on('ready', () => {
  // setTimeout(checkForUpdates, 2000);
  updateHandle()
});

app.on('window-all-closed', () => app.quit());
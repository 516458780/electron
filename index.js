const electron = require('electron')
// 控制应用生命周期的模块。
const {app} = electron
// 创建原生浏览器窗口的模块。
const {BrowserWindow} = electron
//进程通讯模块
var ipc = electron.ipcMain;
//全局快捷键模块
var globalShortcut = electron.globalShortcut

// 保持一个对于 window 对象的全局引用，如果你不这样做，
// 当 JavaScript 对象被垃圾回收， window 会被自动地关闭
let mainWindow;

function createWindow () {
    // 创建浏览器窗口。
    mainWindow = new BrowserWindow({
        width: 200,
        height: 200,
        frame: false,
        resizable: false,
        transparent: true,
        alwaysOnTop: true,
    })

    // 加载应用的 index.html。
    mainWindow.loadURL(`file://${__dirname}/clock.html`);
    // mainWindow.loadURL(`file://${__dirname}/index.html`);

    // 启用开发工具。
    // mainWindow.webContents.openDevTools()


    // 当 window 被关闭，这个事件会被触发。
    mainWindow.on('closed', () => {
        // 取消引用 window 对象，如果你的应用支持多窗口的话，
        // 通常会把多个 window 对象存放在一个数组里面，
        // 与此同时，你应该删除相应的元素。
        mainWindow = null
    })
}

// Electron 会在初始化后并准备
// 创建浏览器窗口时，调用这个函数。
// 部分 API 在 ready 事件触发后才能使用。
app.on('ready', function(){
    //通过 Tray 向系统的通知区添加一个带有右键菜单的图标
    const Tray = electron.Tray;
    //menu 类可以用来创建原生菜单
    const Menu = electron.Menu;
    let tray;
    tray = new Tray(__dirname + '/images/wx.png');//系统托盘图标
    tray.setToolTip('clock');//鼠标放到系统托盘图标上时的tips;
    const menu = Menu.buildFromTemplate([   // 定义右建菜单
        {label: "退出", click: function () {
            app.quit();
        }}
    ]);
    tray.setContextMenu(menu);//应用右建菜单
    tray.on('click', function () { // 左键单击时显示窗口
        mainWindow.show();
    });

    createWindow();
})



// 当全部窗口关闭时退出。
app.on('window-all-closed', () => {
    // 在 macOS 上，除非用户用 Cmd + Q 确定地退出，
    // 否则绝大部分应用及其菜单栏会保持激活。
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    // 在 macOS 上，当点击 dock 图标并且该应用没有打开的窗口时，
    // 绝大部分应用会重新创建一个窗口。
    if (mainWindow === null) {
        createWindow()
    }
})

// 在这文件，你可以续写应用剩下主进程代码。
// 也可以拆分成几个文件，然后用 require 导入。

var settingWindow;
ipc.on('open-setting-window', function () {
    if (settingWindow) {
        return;
    }
    settingWindow = new BrowserWindow({
        width: 500,
        height: 500,
        frame: false,
        resizable: false,
        // transparent: true,
    });

    settingWindow.loadURL(`file://${__dirname}/index.html`);

    globalShortcut.register('ctrl+1', function () {
        console.log('ctrl+1');
        settingWindow.webContents.send('testShortcut', 'ctrl+1');
    });

    settingWindow.on('close', function () {
        settingWindow = null;
    });
});
ipc.on('close-setting-window', function () {
    if (settingWindow) {
        settingWindow.close();
    }
});
ipc.on('close-main-window', function () {
    app.quit();
});


ipc.on('change-color', function () {
    mainWindow.webContents.send('change-color');
});






















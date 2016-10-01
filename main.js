'use strict';

// module of Electron
const {
    electron,
    app,
    BrowserWindow,
    Menu
} = require("electron");

// module of controll app
// const app = electron.app;

// module of create window
// const BrowserWindow = electron.BrowserWindow;

let mainWindow;
let aboutWindow;

// quit function
app.on('window-all-closed', function() {
    if (process.platform != 'darwin') {
        app.quit();
    }
});

// show icon on menu bar
// var Tray = require('tray');
// var appIcon = new Tray(__dirname + '/icons/pomoTODO_icon24x24black.png');

// setting app menu
function initApplicationMenu() {
    const menu = Menu.buildFromTemplate([{
        label: 'pomoTODO',
        submenu: [{
            label: 'About',
            click: function() {
                aboutWindow = new BrowserWindow({
                    width: 300,
                    height: 200,
                    resizable: false
                });
                aboutWindow.loadURL('file://' + __dirname + '/about.html');
            }
        }, {
            label: 'Quit',
            accelerator: 'Command+Q',
            click: function() {
                app.quit();
            }
        }]
    }, {
        label: 'View',
        submenu: [{
            label: 'Reload',
            accelerator: 'Command+R',
            click: function() {
                mainWindow.reload();
            }
        }]
    }]);
    Menu.setApplicationMenu(menu);
}

// Electron ready function
app.on('ready', function() {
    mainWindow = new BrowserWindow({
        width: 300,
        height: 600,
        resizable: false
    });
    mainWindow.loadURL('file://' + __dirname + '/index.html');

    initApplicationMenu();

    // when all window closed, quit app.
    mainWindow.on('closed', function() {
        mainWindow = null;
    });
});

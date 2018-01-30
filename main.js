const {app, Menu, Tray, BrowserWindow} = require('electron')
// Module to control application life.
// Module to create native browser window.
const path = require('path')
const url = require('url')

const db = require('./src/db.js')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
let tray = null

function createTray () {
  tray = new Tray(path.join(__dirname, 'tray.png'))
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show App',
      click: () => mainWindow.show()
    },
    {
      label: 'Quit',
      click: () => {
        app.isQuiting = true
        app.quit()
        db.writeEnd()
      }
    }
  ])
  tray.setToolTip('This is my application.')
  tray.setContextMenu(contextMenu)
  mainWindow.on('show', () => {
    tray.setHighlightMode('always')
  })
}

function createWindow () {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    'accept-first-mouse': true
  })
  createTray()

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  mainWindow.on('minimize',function(event){
      event.preventDefault();
      mainWindow.hide();
  })
  mainWindow.on('close', function (event) {
      if(!app.isQuiting){
          event.preventDefault();
          mainWindow.hide();
      }
      return false;
  });
}

app.on('ready', createWindow)
app.on('activate', function () {
  if (mainWindow === null) {
    createWindow()
  }
})

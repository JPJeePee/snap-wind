'use strict'

import { app, BrowserWindow, ipcMain, dialog } from 'electron'
import fs from 'fs'
import xlsx from 'node-xlsx';
import handler from './handler'
/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 563,
    useContentSize: true,
    width: 1000
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  const openDialog = (defaultpath = '/') => new Promise((resolve, reject) => {
    dialog.showOpenDialog({
      defaultPath: this.savePath,
      properties: [
        'openDirectory',
      ],
    }, (res = []) => {
      resolve(res[0]);
    });
  })

  ipcMain.on('open-folder', async (event) => {
    const path = await openDialog();
    event.returnValue = path;
  });

  ipcMain.on('start', function (e, data) {
    handler(data, mainWindow).then((d) => {
      const buffer = xlsx.build([{ name: "mySheetName", data: d }])
      const split = data.url.split('/');
      fs.writeFile(data.path + `/${split[split.length - 1]}_${Date.now()}.xlsx`, buffer, (res) => {
        console.log('writeFile success')
        mainWindow.webContents.send('success');
      })
    })
  });
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

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */

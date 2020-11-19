/**
 * This file is used specifically and only for development. It installs
 * `electron-debug` & `vue-devtools`. There shouldn't be any need to
 *  modify this file, but it can be used to extend your development
 *  environment.
 */

/* eslint-disable */

// Install `electron-debug` with `devtron`
// require('electron-debug')({ showDevTools: true })
require('electron-debug')()

// Install `vue-devtools`
require('electron').app.on('ready', () => {
  let installExtension = require('electron-devtools-installer')
  installExtension.default(installExtension.VUEJS_DEVTOOLS)
    .then(() => { })
    .catch(err => {
      console.log('Unable to install `vue-devtools`: \n', err)
    })
})

// const ipcMain = require('electron').ipcMain;
// console.log('sgtart -------------------')
// ipcMain.on('test1', function () {
//   console.log('----54545645---')
// });

// Require `main` process to boot app
require('./index')
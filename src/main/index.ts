import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { Sequelize } from 'sequelize'
import neo4j, { Driver } from 'neo4j-driver'
import getDatabase, { Database, Schema } from './utils/getSqlSchema'
import { exportDatabaseData } from './utils/exportSqlData'
import { createRelationships } from './utils/createRelationship'

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
let sequelize: Sequelize
let neo4jDriver: Driver
let database: Database

ipcMain.handle('connect-sql', async (_event, credentials) => {
  sequelize = new Sequelize(credentials.databaseName, credentials.username, credentials.password, {
    host: credentials.host,
    dialect: credentials.dialect
  })
  database = await getDatabase(sequelize)
})

ipcMain.handle('connect-neo4j', async (_event, credentials) => {
  neo4jDriver = neo4j.driver(
    credentials.uri,
    neo4j.auth.basic(credentials.username, credentials.password)
  )
})

ipcMain.handle('create-nodes', async (_event) => {
  if (database) await exportDatabaseData(sequelize, neo4jDriver, database)
})

ipcMain.handle('create-relationships', async (_event) => {
  if (database && neo4jDriver) await createRelationships(neo4jDriver, database)
})

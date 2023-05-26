import { BrowserWindow } from 'electron'

export const logToRenderer = (message: string) => {
  const { webContents } = BrowserWindow.getAllWindows()[0]

  webContents.send('log', message)
}

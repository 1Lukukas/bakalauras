import { ElectronAPI } from '@electron-toolkit/preload'
import { Sequelize } from 'sequelize'

declare global {
  interface Window {
    electron: ElectronAPI
    api: any
  }
}

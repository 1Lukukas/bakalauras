import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  connectToSql: (args) => ipcRenderer.invoke('connect-sql', args),
  connectToNeo4j: (args) => ipcRenderer.invoke('connect-neo4j', args),
  getSchema: () => ipcRenderer.invoke('get-schema'),
  createNodes: (args) => ipcRenderer.invoke('create-nodes', args),
  createRelationships: (args) => ipcRenderer.invoke('create-relationships', args),
  onLogReceived: (callback) =>
    ipcRenderer.on('log', (_event, data) => {
      callback(data)
    })
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}

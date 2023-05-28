import { ElectronAPI } from '@electron-toolkit/preload'
import { Sequelize } from 'sequelize'
import { Edge, Node } from 'src/types'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      connectToSql: (args: any) => Promise<any>
      connectToNeo4j: (args: any) => Promise<any>
      getSchema: () => Promise<any>
      createNodes: (nodes: Node[]) => Promise<any>
      createRelationships: (edges: Edge[]) => Promise<any>
      onLogReceived: (callback: (data: string) => void) => void
    }
  }
}

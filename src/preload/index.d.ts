import { ElectronAPI } from '@electron-toolkit/preload'
import { Sequelize } from 'sequelize'
import { Edge, Node } from 'src/types'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      connectToSql: (args: any) => Promise<any>
      connectToNeo4j: (args: any) => Promise<any>
      createNodes: () => Promise<any>
      createRelationships: () => Promise<any>
      onLogReceived: (callback: (data: string) => void) => void
      createNodes2: (nodes: Node[]) => Promise<any>
      createRelationships2: (edges: Edge[]) => Promise<any>
    }
  }
}

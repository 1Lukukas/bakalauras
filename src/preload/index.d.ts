import { ElectronAPI } from '@electron-toolkit/preload'
import { Sequelize } from 'sequelize'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      connectToSql: (args: any) => Promise<any>;
      connectToNeo4j: (args: any) => Promise<any>;
      createNodes: () => Promise<any>;
      createRelationships: () => Promise<any>;
      onLogReceived: (callback: (data: any) => void) => void;
    };
  }
}

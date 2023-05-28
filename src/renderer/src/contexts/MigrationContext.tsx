import React, { createContext, useState } from 'react'
import { Edge, Node, Table } from 'src/types'

interface MigrationContextValue {
  tableData: Table[]
  edgeData: Edge[]
  nodeData: Node[]
  setTableData: React.Dispatch<React.SetStateAction<Table[]>>
  setEdgeData: React.Dispatch<React.SetStateAction<Edge[]>>
  setNodeData: React.Dispatch<React.SetStateAction<Node[]>>
}

export const MigrationContext = createContext<MigrationContextValue>({} as MigrationContextValue)

interface MigrationContextProviderProps {
  children: React.ReactNode
}

export const MigrationContextProvider: React.FC<MigrationContextProviderProps> = ({ children }) => {
  const [tableData, setTableData] = useState<Table[]>([])
  const [edgeData, setEdgeData] = useState<Edge[]>([])
  const [nodeData, setNodeData] = useState<Node[]>([])

  const value: MigrationContextValue = {
    tableData,
    edgeData,
    nodeData,
    setTableData,
    setEdgeData,
    setNodeData
  }
  return <MigrationContext.Provider value={value}>{children}</MigrationContext.Provider>
}

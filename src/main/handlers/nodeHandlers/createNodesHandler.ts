import { Driver } from 'neo4j-driver'
import { Sequelize } from 'sequelize'
import { Database, Node } from '../../../types'
import { logToRenderer } from '../../utils/logToRenderer'
import { createNodesInBatches } from './createNodesInBatches'

const createNodesHandler = async (
  sequelize: Sequelize,
  driver: Driver,
  database: Database,
  nodes: Node[]
) => {
  const promises: Promise<void>[] = []
  const exportedNodes = nodes.filter((node) => node.shouldBeExported)

  for (const node of exportedNodes) {
    const schema = database.schemas.find((s) => s.tables.find((t) => t.name === node.data.id))
    const table = schema?.tables.find((t) => t.name === node.data.id)

    if (table && schema) {
      promises.push(createNodesInBatches(sequelize, driver, table, schema?.name, node.data.label, 4000))
    } else {
      console.log(`table or schema not found for node ${node.data.id}`)
    }
  }

  await Promise.all(promises)
  logToRenderer(`Node export complete`)
}

export default createNodesHandler

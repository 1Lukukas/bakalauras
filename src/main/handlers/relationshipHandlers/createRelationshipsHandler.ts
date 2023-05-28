import { Driver, int } from 'neo4j-driver'
import { Sequelize } from 'sequelize'
import { Database, Edge } from '../../../types'
import { logToRenderer } from '../../utils/logToRenderer'
import { createRelationshipsInBatches } from './createRelationshipsInBatches'
import { createRelationshipsFromSqlRows } from './createRelationshipsFromSqlRows'

export const createRelationshipsHandler = async (
  sequelize: Sequelize,
  driver: Driver,
  database: Database,
  edges: Edge[]
) => {
  // start transaction here?
  const edgesWithProperties = edges.filter((edge) => edge.hasProperties)
  const edgesWithoutProperties = edges.filter((edge) => !edge.hasProperties)

  for (const edge of edgesWithProperties) {
    const schema = database.schemas.find((s) => s.tables.find((t) => t.name === edge.tableName))
    const table = schema?.tables.find((t) => t.name === edge.tableName)
    if (table && schema) {
      await createRelationshipsFromSqlRows(sequelize, driver, table, schema?.name, 4000, edge)
    } else {
      console.log(`table or schema not found for edge ${edge.data.label}`)
    }
  }

  for (const edge of edgesWithoutProperties) {
    await createRelationshipsInBatches(
      driver,
      edge.data.source,
      edge.data.target,
      edge.FkSourceColumnName,
      edge.FkTargetColumnName!,
      edge.data.label,
      int(4000)
    )
  }

  logToRenderer(`Relationship export complete`)
}

import { QueryTypes, Sequelize } from 'sequelize'
import { Edge, Table } from '../../../types'
import { ConstraintType } from '../../../types/enums'
import { logToRenderer } from '../../utils/logToRenderer'
import { Driver } from 'neo4j-driver'
import { createRelationshipsWithProperties } from './createRelationshipsWithProperties'

export const createRelationshipsFromSqlRows = async (
  sequelize: Sequelize,
  driver: Driver,
  table: Table,
  schemaName: string,
  edge: Edge,
  batchSize: number
) => {
  const primaryKey = findPrimaryKeyColumn(table)
  const columns = table.columns.map((c) => `[${c.name}]`).join(',')

  let offset = 0
  let shouldExportBatch = true

  while (shouldExportBatch) {
    const query = `
      SELECT ${columns}
      FROM [${schemaName}].[${table.name}]
      ORDER BY [${primaryKey}]
      OFFSET ${offset} ROWS
      FETCH NEXT ${batchSize} ROWS ONLY
    `
    const result = await sequelize.query(query, { type: QueryTypes.SELECT, raw: true })

    await createRelationshipsWithProperties(
      driver,
      edge.sourceLabel,
      edge.targetLabel,
      edge.FkSourceColumnName,
      edge.FkTargetColumnName,
      edge.data.label,
      result
    )

    if (result.length < batchSize) {
      shouldExportBatch = false
    } else {
      offset += batchSize
    }
  }

  logToRenderer(`Relationship ${edge.data.label} with properties export complete.`)
}

const findPrimaryKeyColumn = (table: Table) => {
  return table.columns.find((column) =>
    column.constraints?.some((constraint) => constraint.type === ConstraintType.PrimaryKey)
  )!.name
}

import { Driver } from 'neo4j-driver'
import { Sequelize, QueryTypes } from 'sequelize'
import { logToRenderer } from '../../utils/logToRenderer'
import { Table } from '../../../types'
import { ConstraintType } from '../../../types/enums'
import { createNodesFromSQLRows } from './createNodesFromSqlRows'

const findPrimaryKeyColumn = (table: Table) => {
  return table.columns.find((column) =>
    column.constraints?.some((constraint) => constraint.type === ConstraintType.PrimaryKey)
  )!.name
}

export const createNodesInBatches = async (
  sequelize: Sequelize,
  driver: Driver,
  table: Table,
  schemaName: string,
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

    await createNodesFromSQLRows(driver, table.name, result)

    if (result.length < batchSize) {
      shouldExportBatch = false
    } else {
      offset += batchSize
    }
  }

  logToRenderer(`Table [${schemaName}].[${table.name}] export complete.`)
}

import { Driver, int } from 'neo4j-driver'
import { Database, Table } from '../../../types'
import { logToRenderer } from '../../utils/logToRenderer'
import { createRelationshipsInBatches } from './createRelationshipsInBatches'

export const createRelationships = async (driver: Driver, database: Database) => {
  const tables = database.schemas
    .flatMap((s) => s.tables)
    .map(removeColumnsWithoutForeignKey)
    .map(removeNonForeignKeyConstraints)

  for (const table of tables) {
    for (const column of table.columns) {
      const constraint = column.constraints?.[0]
      if (constraint && 'shouldExportFK' in constraint && constraint.shouldExportFK) {
        const { referencedTableName, referencedColumnName } = constraint
        const relationshipName = `${table.name}_${referencedTableName}`
        await createRelationshipsInBatches(
          driver,
          table.name,
          referencedTableName!,
          column.name,
          referencedColumnName!,
          relationshipName,
          int(1000)
        )
      }
    }
  }

  logToRenderer('Migration finished')
}

function removeNonForeignKeyConstraints(table: Table): Table {
  const columnsWithForeignKeyConstraints = table.columns.map((column) => {
    const foreignKeyConstraints = column.constraints?.filter(
      (constraint) => constraint.type === 'FOREIGN KEY'
    )
    return { ...column, constraints: foreignKeyConstraints }
  })
  return { ...table, columns: columnsWithForeignKeyConstraints }
}

function removeColumnsWithoutForeignKey(table: Table): Table {
  const columnsWithForeignKey = table.columns.filter((column) => {
    return column.constraints?.some((constraint) => constraint.type === 'FOREIGN KEY')
  })
  return {
    ...table,
    columns: columnsWithForeignKey
  }
}

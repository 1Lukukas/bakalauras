import { QueryTypes, Sequelize } from 'sequelize'
import { Database, Table } from './getSqlSchema'
import { Driver } from 'neo4j-driver'
import { createNodesFromSQLRows } from './createNode'

const findPrimaryKeyColumn = (table: Table) => {
  return table.columns.find((c) =>
    c.constraints?.some((constraint) => constraint.type === 'PRIMARY KEY')
  )?.name
}

export const exportTableData = async (
  sequelize: Sequelize,
  driver: Driver,
  table: Table,
  schemaName: string
) => {
  const batchSize = 10000
  let offset = 0
  const primaryKey = findPrimaryKeyColumn(table)

  const exportBatch = async () => {
    const query = `
      SELECT ${table.columns.map((c) => `[${c.name}]`).join(',')}
      FROM ${schemaName}.${table.name}
      ORDER BY ${primaryKey!}
      OFFSET ${offset} ROWS
      FETCH NEXT ${batchSize} ROWS ONLY
    `
    const result = await sequelize
      .query(query, { type: QueryTypes.SELECT, raw: true })
      .catch((e) => {
        console.log(e)
        return []
      })

    await createNodesFromSQLRows(driver, table.name, result)

    if (result.length === batchSize) {
      offset += batchSize
      await exportBatch()
    } else {
      console.log(`Table [${schemaName}][${table.name}] export complete`)
    }
  }

  await exportBatch()
}

export const exportDatabaseData = async (
  sequelize: Sequelize,
  driver: Driver,
  database: Database
) => {
  for (let i = 0, length = database.schemas.length; i < length; i++) {
    const schema = database.schemas[i]
    for (let j = 0, length = schema.tables.length; j < length; j++) {
      const table = schema.tables[j]
      await exportTableData(sequelize, driver, table, schema.name)
    }
  }

  console.log(`Database export complete`)
}

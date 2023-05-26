import { QueryTypes, Sequelize } from 'sequelize'
import { Driver } from 'neo4j-driver'
import { createNodesFromSQLRows } from './createNode'
import { Database, Table, Node, Edge } from '../../types'
import { ConstraintType } from '../../types/enums'
import { logToRenderer } from './logToRenderer'

const findPrimaryKeyColumn = (table: Table) => {
  return table.columns.find((column) =>
    column.constraints?.some((constraint) => constraint.type === ConstraintType.PrimaryKey)
  )!.name
}

export const exportTableData = async (
  sequelize: Sequelize,
  driver: Driver,
  table: Table,
  schemaName: string,
  batchSize: number
) => {
  const primaryKey = findPrimaryKeyColumn(table)

  let offset = 0
  let shouldExportBatch = true

  while (shouldExportBatch) {
    const columns = table.columns.map((c) => `[${c.name}]`).join(',')
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

const countForeignKeys = (table: Table) => {
  let count = 0
  for (const column of table.columns) {
    if (column.constraints) {
      for (const constraint of column.constraints) {
        if ('shouldExportFK' in constraint) {
          count++
        }
      }
    }
  }
  return count
}

export const exportDatabaseData = async (
  sequelize: Sequelize,
  driver: Driver,
  database: Database
) => {
  const promises: Promise<void>[] = []

  for (const schema of database.schemas) {
    for (const table of schema.tables) {
      // if (countForeignKeys(table) !== 2)
      promises.push(exportTableData(sequelize, driver, table, schema.name, 4000))
    }
  }

  await Promise.all(promises)
  logToRenderer(`Node export complete`)
}

// export const exportDatabaseData2 = async (nodes: Node[], edgesWithProps: Edge[], sequelize: Sequelize, driver: Driver) => {
//   const promises: Promise<void>[] = []

//   for (const node of nodes) {
//     promises.push(exportTableData(sequelize, driver, table, schema.name, 4000))
//   }

//   for (const edgeWithProps of edgesWithProps)
//   await Promise.all(promises)
//   logToRenderer(`Node export complete`)
// }

export const exportTableData2 = async (
  sequelize: Sequelize,
  driver: Driver,
  table: Table,
  node: Node,
  schemaName: string,
  batchSize: number
) => {
  const primaryKey = findPrimaryKeyColumn(table)

  let offset = 0
  let shouldExportBatch = true

  while (shouldExportBatch) {
    const columns = table.columns.map((c) => `[${c.name}]`).join(',')
    const query = `
      SELECT ${columns}
      FROM [${schemaName}].[${table.name}]
      ORDER BY [${primaryKey}]
      OFFSET ${offset} ROWS
      FETCH NEXT ${batchSize} ROWS ONLY
    `
    const result = await sequelize.query(query, { type: QueryTypes.SELECT, raw: true })

    await createNodesFromSQLRows(driver, node.data.label, result)

    if (result.length < batchSize) {
      shouldExportBatch = false
    } else {
      offset += batchSize
    }
  }

  offset = 0
  shouldExportBatch = true

  while (shouldExportBatch) {
    const columns = table.columns.map((c) => `[${c.name}]`).join(',')
    const query = `
      SELECT ${columns}
      FROM [${schemaName}].[${table.name}]
      ORDER BY [${primaryKey}]
      OFFSET ${offset} ROWS
      FETCH NEXT ${batchSize} ROWS ONLY
    `
    const result = await sequelize.query(query, { type: QueryTypes.SELECT, raw: true })

    await createNodesFromSQLRows(driver, node.data.label, result)

    if (result.length < batchSize) {
      shouldExportBatch = false
    } else {
      offset += batchSize
    }
  }

  logToRenderer(`Table [${schemaName}].[${table.name}] export complete.`)
}

// export const createRelationshipsWithProps = async (
//   driver: Driver,
//   fromNodeLabel: string,
//   toNodeLabel: string,
//   property1: string,
//   property2: string,
//   relationshipType: string,
//   props: Record<string, any>
// ) => {
//   const session = driver.session()

//   const query = `
//       MATCH (n1:${fromNodeLabel}), (n2:${toNodeLabel})
//       WHERE n1.${property1} = n2.${property2}
//       WITH n1, n2
//       ORDER BY ID(n1)
//       CREATE (n1)-[r:${relationshipType} ${props ? '$props' : ''}]->(n2)
//       RETURN count(*) as count, MAX(ID(n1)) as lastId`

//   const result = await session.run(query, { props })

//   console.log(
//     `Creating ${relationshipType} relationships between ${fromNodeLabel} and ${toNodeLabel}`
//   )

//   session.close()
// }

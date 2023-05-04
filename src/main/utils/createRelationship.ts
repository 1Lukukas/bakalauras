import { Driver, Integer, int } from 'neo4j-driver'
import { Database, Table } from './getSqlSchema'

async function countNodesByLabel(driver: Driver, nodeLabel: string) {
  const session = driver.session()

  const countQuery = `
    MATCH (n1:${nodeLabel})
    RETURN count(n1) as count`

  const countResult = await session.run(countQuery)
  const count = countResult.records[0].get('count').toNumber()

  session.close()

  return count
}

async function createRelationshipInBatches(
  driver: Driver,
  fromNodeLabel: string,
  toNodeLabel: string,
  property1: string,
  property2: string,
  relationshipType: string,
  batchSize: Integer
) {
  const session = driver.session()

  const count = await countNodesByLabel(driver, fromNodeLabel)

  console.log(
    `Creating ${relationshipType} relationships between ${fromNodeLabel} and ${toNodeLabel}`
  )

  let processedCount = 0
  let lastId: Integer = int(0)
  while (processedCount < count) {
    const query = `
      MATCH (n1:${fromNodeLabel}), (n2:${toNodeLabel})
      WHERE n1.${property1} = n2.${property2} AND ID(n1) > $lastId
      WITH n1, n2
      ORDER BY ID(n1)
      LIMIT ${batchSize}
      CREATE (n1)-[:${relationshipType}]->(n2)
      RETURN count(*) as count, MAX(ID(n1)) as lastId`

    const result = await session.run(query, { lastId })
    const batchCount = result.records[0].get('count').toNumber()
    lastId = result.records[0].get('lastId')

    processedCount += batchCount
  }

  console.log(`Finished creating ${processedCount} ${relationshipType} relationships`)

  session.close()
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

export const createRelationships = async (driver: Driver, database: Database) => {
  const tables = database.schemas
    .flatMap((s) => s.tables)
    .map((t) => removeColumnsWithoutForeignKey(t))
    .map((t) => removeNonForeignKeyConstraints(t))

  for (const table of tables) {
    for (const column of table.columns) {
      const constraint = column.constraints?.[0]
      if (constraint?.type === 'FOREIGN KEY') {
        const { referencedTableName, referencedColumnName } = constraint
        const relationshipName = `${table.name}_${referencedTableName}`
        await createRelationshipInBatches(
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
}
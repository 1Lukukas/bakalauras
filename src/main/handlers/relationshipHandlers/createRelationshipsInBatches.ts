import { Driver, Integer, int } from 'neo4j-driver'
import { logToRenderer } from '../../utils/logToRenderer'

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

export const createRelationshipsInBatches = async (
  driver: Driver,
  fromNodeLabel: string,
  toNodeLabel: string,
  property1: string,
  property2: string,
  relationshipType: string,
  batchSize: Integer
) => {
  const session = driver.session()

  const count = await countNodesByLabel(driver, fromNodeLabel)

  let processedCount = 0
  let lastId: Integer = int(0)
  while (processedCount < count) {
    const query = `
      MATCH (n1:${fromNodeLabel}), (n2:${toNodeLabel})
      WHERE n1.${property1} = n2.${property2} AND ID(n1) > $lastId
      WITH n1, n2
      ORDER BY ID(n1)
      LIMIT ${batchSize}
      CREATE (n1)-[r:${relationshipType}]->(n2)
      RETURN count(*) as count, MAX(ID(n1)) as lastId`

    const result = await session.run(query, { lastId })
    const batchCount = result.records[0].get('count').toNumber()

    lastId = result.records[0].get('lastId')

    processedCount += batchCount
    if (batchCount === 0) break
  }

  logToRenderer(`Created ${processedCount} ${relationshipType} relationships`)

  session.close()
}

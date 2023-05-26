import { Driver } from 'neo4j-driver'

const getNodeProperties = async (driver: Driver) => {
  const session = driver.session()
  const { records } = await session
    .run(
      `CALL db.schema.nodeTypeProperties()
      YIELD nodeType, propertyName, propertyTypes
      RETURN nodeType, propertyName, propertyTypes`
    )
    .finally(() => session.close())

  const nodes = {}

  records.forEach((record) => {
    const nodeType = record.get('nodeType')
    const propertyName = record.get('propertyName')
    const propertyTypes = record.get('propertyTypes')

    if (!nodes[nodeType]) {
      nodes[nodeType] = {}
    }

    nodes[nodeType][propertyName] = propertyTypes?.[0]
  })

  return nodes
}

const getRelationshipProperties = async (driver: Driver) => {
  const session = driver.session()
  const { records } = await session
    .run(
      `CALL db.schema.relTypeProperties()
      YIELD relType, propertyName, propertyTypes
      RETURN relType, propertyName, propertyTypes`
    )
    .finally(() => session.close())

  const relationships = {}

  records.forEach((record) => {
    const relType = record.get('relType')
    const propertyName = record.get('propertyName')
    const propertyTypes = record.get('propertyTypes')

    if (!relationships[relType]) {
      relationships[relType] = {}
    }

    relationships[relType][propertyName] = propertyTypes?.[0]
  })

  return relationships
}

const getNeo4jSchema = async (driver: Driver) => {
  Promise.all([getNodeProperties(driver), getRelationshipProperties(driver)])
    .then(([nodes, relationships]) => {
      const schema = {
        nodes,
        relationships
      }

      console.log(schema)
    })
    .catch((error) => {
      console.error('An error occurred:', error)
    })
}

export default getNeo4jSchema

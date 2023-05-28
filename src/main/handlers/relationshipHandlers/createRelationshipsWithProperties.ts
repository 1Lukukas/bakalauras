import { DateTime, Driver } from 'neo4j-driver'

export const createRelationshipsWithProperties = async (
  driver: Driver,
  fromNodeLabel: string,
  toNodeLabel: string,
  property1: string,
  property2: string,
  relationshipType: string,
  props: Record<string, any>[]
) => {
  const session = driver.session()
  const tx = session.beginTransaction()

  props = props.map((prop) =>
    Object.entries(prop).reduce((acc, [key, value]) => {
      if (value instanceof Date) {
        acc[key] = DateTime.fromStandardDate(value)
      } else if (value instanceof Buffer) {
        acc[key] = value.toString()
      } else {
        acc[key] = value
      }
      return acc
    }, {})
  )

  const query = `
    UNWIND $props AS prop
    MATCH (n1:${fromNodeLabel}), (n2:${toNodeLabel})
    WHERE n1.${property1} = prop.${property1} AND n2.${property2} = prop.${property2}
    WITH n1, n2, prop
    CREATE (n1)-[r:${relationshipType}]->(n2)
    SET r = prop
  `

  await tx.run(query, { props }).catch((error) => {
    console.log(error)
  })

  await tx.commit()
  session.close()
}

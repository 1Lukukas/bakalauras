import { Driver, Transaction } from 'neo4j-driver'

export const createNode = (
  transaction: Transaction,
  label: string,
  columns: Record<string, any>
) => {
  const props = Object.entries(columns).reduce((acc, [key, value]) => {
    if (value instanceof Date) {
      acc[key] = value.toISOString()
    } else {
      acc[key] = value
    }
    return acc
  }, {})

  const resultPromise = transaction.run(`CREATE (n:${label} $props)`, { props })

  return resultPromise
}

export const createNodesFromSQLRows = async (
  driver: Driver,
  label: string,
  sqlRows: Record<string, any>[]
) => {
  const session = driver.session()
  const transaction = session.beginTransaction()
  try {
    sqlRows.forEach((row) => {
      createNode(transaction, label, row)
    })
    await transaction.commit()
  } catch (error) {
    await transaction.rollback()
    console.log(`Error: ${error}`)
  } finally {
    session.close()
  }
}

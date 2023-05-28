import { DateTime, Transaction } from 'neo4j-driver'

export const createNode = (
  transaction: Transaction,
  label: string,
  columns: Record<string, any>
) => {
  const props = Object.entries(columns).reduce((acc, [key, value]) => {
    if (value instanceof Date) {
      acc[key] = DateTime.fromStandardDate(value)
    } else {
      acc[key] = value
    }
    return acc
  }, {})

  const resultPromise = transaction.run(`CREATE (n:${label} $props)`, { props })

  return resultPromise
}

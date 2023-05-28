import { Driver } from 'neo4j-driver'
import { createNode } from './createNode'

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

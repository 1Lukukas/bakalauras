import { ipcMain } from 'electron'
import { Driver, Neo4jError, auth, driver } from 'neo4j-driver'
import { Sequelize } from 'sequelize'
import { Database } from '../../types'
import getSqlDatabaseSchema from '../handlers/schemaHandlers/getSqlDatabaseSchema'
import createNodesHandler from '../handlers/nodeHandlers/createNodesHandler'
import { createRelationshipsHandler } from '../handlers/relationshipHandlers/createRelationshipsHandler'
import getNodesAndEdgesFromSchema from '../handlers/schemaHandlers/getNodesAndEdgesFromSchema'

let sequelize: Sequelize
let neo4jDriver: Driver
let database: Database

ipcMain.handle('connect-sql', async (_event, credentials) => {
  const { databaseName, username, password, host } = credentials
  sequelize = new Sequelize(databaseName, username, password, {
    host: host,
    dialect: 'mssql'
  })
  try {
    await sequelize.databaseVersion()
  } catch (error) {
    throw error
  }
})

ipcMain.handle('get-schema', async (_event) => {
  database = await getSqlDatabaseSchema(sequelize)
  return getNodesAndEdgesFromSchema(database.schemas.flatMap((s) => s.tables))
})

ipcMain.handle('connect-neo4j', async (_event, credentials) => {
  try {
    neo4jDriver = driver(credentials.uri, auth.basic(credentials.username, credentials.password))
    await neo4jDriver.getServerInfo()
  } catch (error) {
    if (error instanceof Neo4jError) throw new Error(error.message)
  }
})

ipcMain.handle('create-nodes', async (_event, nodes) => {
  if (database) {
    return await createNodesHandler(sequelize, neo4jDriver, database, nodes)
  }
})

ipcMain.handle('create-relationships', async (_event, edges) => {
  if (database && neo4jDriver)
    await createRelationshipsHandler(sequelize, neo4jDriver, database, edges)
})

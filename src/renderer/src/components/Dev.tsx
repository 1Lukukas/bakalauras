import { ConstraintType } from '@enums'
import { Paper } from '@mui/material'
import { MigrationContext } from '@renderer/contexts/context'
import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { Database, Table } from 'src/types'

const Dev = () => {
  const { tableData, setTableData } = useContext(MigrationContext)
  const navigate = useNavigate()

  function getTablesByForeignKeyCount(database: Database): [Table[], Table[]] {
    const tablesWithTwoForeignKeys: Table[] = []
    const tablesWithoutTwoForeignKeys: Table[] = []

    for (const schema of database.schemas) {
      for (const table of schema.tables) {
        const foreignKeyCount = table.columns.reduce((count, column) => {
          if (column.constraints) {
            for (const constraint of column.constraints) {
              if (constraint.type === ConstraintType.ForeignKey) {
                count++
              }
            }
          }
          return count
        }, 0)

        if (foreignKeyCount === 2) {
          tablesWithTwoForeignKeys.push(table)
        } else {
          tablesWithoutTwoForeignKeys.push(table)
        }
      }
    }

    return [tablesWithTwoForeignKeys, tablesWithoutTwoForeignKeys]
  }

  const handleConnectToSql = async () => {
    const config = {
      host: 'localhost',
      databaseName: 'AdventureWorks',
      username: 'sa',
      password: 'password1!'
    }

    try {
      const database: Database = await window.api.connectToSql(config)
      setTableData(database?.schemas.flatMap((s) => s.tables))
    } catch (error) {
      console.error('Error connecting to SQL server:', error)
    }
  }

  const handleConnectToNeo4j = async () => {
    await window.api.connectToNeo4j({
      uri: 'neo4j://localhost:7687',
      username: 'neo4j',
      password: 'password1!'
    })
  }

  const handleCreateNodes = async () => {
    await window.api.createNodes()
  }

  const handleCreateRelationships = async () => {
    await window.api.createRelationships()
  }

  return (
    <Paper sx={{ zIndex: 12, m: 2 }}>
      <button onClick={handleConnectToSql}>Connect Sql</button>
      <button onClick={handleConnectToNeo4j}>Connect Neo4j</button>
      <button onClick={handleCreateNodes}>Create Nodes</button>
      <button onClick={handleCreateRelationships}>Create Relationships</button>
      <button onClick={() => navigate('/')}>ConnectionPage</button>
      <button onClick={() => navigate('/transformation')}>TransformationPage</button>
      <button onClick={() => navigate('/migration')}>MigrationPage</button>
    </Paper>
  )
}

export default Dev

import { Sequelize, QueryTypes } from 'sequelize'
import { Database, Constraint, ForeignKeyConstraint } from '../../../types'
import { ConstraintType } from '../../../types/enums'
import { logToRenderer } from '../../utils/logToRenderer'

interface getSqlDatabaseSchemaQueryResult {
  TABLE_SCHEMA: string
  TABLE_NAME: string
  COLUMN_NAME: string
  DATA_TYPE: string
  IS_NULLABLE: string
  CONSTRAINT_TYPE: ConstraintType
  REFERENCED_SCHEMA_NAME: string
  REFERENCED_TABLE_NAME: string
  REFERENCED_COLUMN_NAME: string
}

const getSqlDatabaseSchemaQuery = `
  SELECT
    C.TABLE_SCHEMA,
    C.TABLE_NAME,
    C.COLUMN_NAME,
    C.DATA_TYPE,
    C.IS_NULLABLE,
    TC.CONSTRAINT_TYPE,
    KCU2.TABLE_SCHEMA AS REFERENCED_SCHEMA_NAME,
    KCU2.TABLE_NAME AS REFERENCED_TABLE_NAME,
    KCU2.COLUMN_NAME AS REFERENCED_COLUMN_NAME
  FROM
    INFORMATION_SCHEMA.COLUMNS C
    LEFT JOIN INFORMATION_SCHEMA.KEY_COLUMN_USAGE KCU
      ON C.TABLE_SCHEMA = KCU.TABLE_SCHEMA
      AND C.TABLE_NAME = KCU.TABLE_NAME
      AND C.COLUMN_NAME = KCU.COLUMN_NAME
    LEFT JOIN INFORMATION_SCHEMA.TABLE_CONSTRAINTS TC
      ON KCU.CONSTRAINT_NAME = TC.CONSTRAINT_NAME
    LEFT JOIN INFORMATION_SCHEMA.REFERENTIAL_CONSTRAINTS RC
      ON KCU.CONSTRAINT_NAME = RC.CONSTRAINT_NAME
    LEFT JOIN INFORMATION_SCHEMA.KEY_COLUMN_USAGE KCU2
      ON RC.UNIQUE_CONSTRAINT_NAME = KCU2.CONSTRAINT_NAME
      AND KCU.ORDINAL_POSITION = KCU2.ORDINAL_POSITION
  WHERE
    (TC.CONSTRAINT_TYPE IN ('PRIMARY KEY', 'UNIQUE') OR
    C.IS_NULLABLE = 'NO' OR C.IS_NULLABLE = 'YES') AND
    C.TABLE_NAME NOT IN (
      SELECT TABLE_NAME
      FROM INFORMATION_SCHEMA.VIEWS
      WHERE TABLE_SCHEMA = C.TABLE_SCHEMA
    )
  ORDER BY
    C.TABLE_SCHEMA,
    C.TABLE_NAME,
    C.ORDINAL_POSITION;
`

async function getSqlDatabaseSchema(sequelize: Sequelize) {
  const results = await sequelize.query<getSqlDatabaseSchemaQueryResult>(
    getSqlDatabaseSchemaQuery,
    {
      type: QueryTypes.SELECT
    }
  )

  const database: Database = { schemas: [] }

  results.forEach((row) => {
    const {
      TABLE_SCHEMA,
      TABLE_NAME,
      COLUMN_NAME,
      DATA_TYPE,
      IS_NULLABLE,
      CONSTRAINT_TYPE,
      REFERENCED_SCHEMA_NAME,
      REFERENCED_TABLE_NAME,
      REFERENCED_COLUMN_NAME
    } = row

    let schema = database.schemas.find((s) => s.name === TABLE_SCHEMA)
    if (!schema) {
      schema = { name: TABLE_SCHEMA, tables: [] }
      database.schemas.push(schema)
    }

    let table = schema.tables.find((t) => t.name === TABLE_NAME)
    if (!table) {
      table = { name: TABLE_NAME, columns: [], shouldExport: true }
      schema.tables.push(table)
    }

    let column = table.columns.find((c) => c.name === COLUMN_NAME)
    if (!column) {
      column = {
        name: COLUMN_NAME,
        dataType: DATA_TYPE,
        isNullable: IS_NULLABLE === 'YES'
      }
      table.columns.push(column)
    }

    if (CONSTRAINT_TYPE) {
      const constraint: Constraint | ForeignKeyConstraint = {
        type: CONSTRAINT_TYPE,
        referencedSchemaName: REFERENCED_SCHEMA_NAME || undefined,
        referencedTableName: REFERENCED_TABLE_NAME || undefined,
        referencedColumnName: REFERENCED_COLUMN_NAME || undefined,
        shouldExportFK: CONSTRAINT_TYPE === ConstraintType.ForeignKey ? true : undefined,
        modifiedReferencedTableName:
          CONSTRAINT_TYPE === ConstraintType.ForeignKey ? REFERENCED_TABLE_NAME : undefined
      }
      column.constraints = column.constraints || []
      column.constraints.push(constraint)
    }
  })

  logToRenderer('SQL Server database schema import complete')
  return database
}

export default getSqlDatabaseSchema

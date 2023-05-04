import { QueryTypes, Sequelize } from 'sequelize'

export interface Constraint {
  type: 'FOREIGN KEY' | 'PRIMARY KEY' | 'UNIQUE'
  referencedSchemaName?: string
  referencedTableName?: string
  referencedColumnName?: string
}

export interface Column {
  name: string
  dataType: string
  isNullable: boolean
  constraints?: Constraint[]
}

export interface Table {
  name: string
  columns: Column[]
}

export interface Schema {
  name: string
  tables: Table[]
}

export interface Database {
  schemas: Schema[]
}

interface getDatabaseQueryResult {
  TABLE_SCHEMA: string
  TABLE_NAME: string
  COLUMN_NAME: string
  DATA_TYPE: string
  IS_NULLABLE: string
  CONSTRAINT_TYPE?: 'FOREIGN KEY' | 'PRIMARY KEY' | 'UNIQUE'
  REFERENCED_SCHEMA_NAME?: string
  REFERENCED_TABLE_NAME?: string
  REFERENCED_COLUMN_NAME?: string
}

const getDatabaseQuery = `
  SELECT
    C.TABLE_SCHEMA,
    C.TABLE_NAME,
    C.COLUMN_NAME,
    C.DATA_TYPE,
    C.IS_NULLABLE,
    TC.CONSTRAINT_TYPE,
    KCU2.TABLE_SCHEMA AS REFERENCED_TABLE_SCHEMA,
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
    C.IS_NULLABLE = 'NO') AND
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

async function getDatabase(sequelize: Sequelize) {
  const results = await sequelize.query(getDatabaseQuery, { type: QueryTypes.SELECT })

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
    } = row as getDatabaseQueryResult

    let schemaIndex = database.schemas.findIndex((s) => s.name === TABLE_SCHEMA)
    if (schemaIndex === -1) {
      const schema = { name: TABLE_SCHEMA, tables: [] }
      database.schemas.push(schema)
      schemaIndex = database.schemas.length - 1
    }
    let schema = database.schemas[schemaIndex]

    let tableIndex = schema.tables.findIndex((t) => t.name === TABLE_NAME)
    if (tableIndex === -1) {
      const table = { name: TABLE_NAME, columns: [] }
      schema.tables.push(table)
      tableIndex = schema.tables.length - 1
    }
    let table = schema.tables[tableIndex]

    let columnIndex = table.columns.findIndex((c) => c.name === COLUMN_NAME)
    if (columnIndex === -1) {
      const column = {
        name: COLUMN_NAME,
        dataType: DATA_TYPE === 'xml' ? 'nvarchar(max)' : DATA_TYPE,
        isNullable: IS_NULLABLE === 'YES',
        constraints: []
      }
      table.columns.push(column)
      columnIndex = table.columns.length - 1
    }
    let column = table.columns[columnIndex]

    if (CONSTRAINT_TYPE) {
      column.constraints?.push({
        type: CONSTRAINT_TYPE,
        referencedSchemaName: REFERENCED_SCHEMA_NAME || undefined,
        referencedTableName: REFERENCED_TABLE_NAME || undefined,
        referencedColumnName: REFERENCED_COLUMN_NAME || undefined
      })
    }
  })

  console.log('Databse schema import complete')
  return database
}

export default getDatabase

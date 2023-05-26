import { ConstraintType } from '@enums'

export interface Constraint {
  type: ConstraintType
}

export interface ForeignKeyConstraint extends Constraint {
  referencedSchemaName: string
  referencedTableName: string
  referencedColumnName: string
  shouldExportFK: boolean
  modifiedReferencedTableName: string
}

export interface Column {
  name: string
  dataType: string
  isNullable: boolean
  constraints?: (Constraint | ForeignKeyConstraint)[]
}

export interface Table {
  name: string
  columns: Column[]
  shouldExport: boolean
}

export interface Schema {
  name: string
  tables: Table[]
}

export interface Database {
  schemas: Schema[]
}

export interface Node {
  data: {
    id: string
    label: string
  }
  shouldBeExported: boolean
}

export interface Edge {
  data: {
    source: string
    target: string
    label: string
  }
  shouldBeExported: boolean
  hasProperties: boolean
}

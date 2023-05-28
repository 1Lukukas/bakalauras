import { Edge, ForeignKeyConstraint, Table, Node } from '../../../types'
import { ConstraintType } from '../../../types/enums'

function isReferencedByForeignKey(table: Table, tables: Table[]): boolean {
  return tables.some((otherTable) =>
    otherTable.columns.some((column) =>
      column.constraints?.some(
        (constraint) =>
          constraint.type === ConstraintType.ForeignKey &&
          'referencedTableName' in constraint &&
          constraint.referencedTableName === table.name
      )
    )
  )
}

const separateNodesFromEdges = (tables: Table[]) => {
  const edgeTables: Table[] = []
  const nodeTables: Table[] = []

  for (const table of tables) {
    if (isReferencedByForeignKey(table, tables)) {
      nodeTables.push(table)
    } else if (
      table.columns.filter((column) =>
        column.constraints?.some((constraint) => constraint.type === ConstraintType.ForeignKey)
      )?.length === 2
    ) {
      edgeTables.push(table)
    } else {
      nodeTables.push(table)
    }
  }

  return [edgeTables, nodeTables]
}

const getNodesAndEdgesFromSchema = (tables: Table[]) => {
  const [edgeTables, nodeTables] = separateNodesFromEdges(tables)

  const exportableTables = nodeTables.filter((table) => table.shouldExport)

  const nodes: Node[] = exportableTables.map((table) => ({
    data: { id: table.name, label: table.name },
    shouldBeExported: true
  }))

  const edgesWithoutProps = exportableTables.flatMap((table) => {
    const tableEdges: Edge[] = []
    table.columns.forEach((column) => {
      const { constraints } = column
      const foreignKeyConstraint = constraints?.find((c) => c.type === ConstraintType.ForeignKey)
      if (
        foreignKeyConstraint &&
        'shouldExportFK' in foreignKeyConstraint &&
        foreignKeyConstraint.shouldExportFK
      ) {
        const targetTable = nodeTables.find(
          (table) => table.name === foreignKeyConstraint.referencedTableName
        )

        if (targetTable) {
          const edge: Edge = {
            data: {
              source: table.name,
              target: foreignKeyConstraint.referencedTableName,
              label: `${table.name}_${foreignKeyConstraint.referencedTableName}`
            },
            FkSourceColumnName: column.name,
            FkTargetColumnName: foreignKeyConstraint.referencedColumnName,
            shouldBeExported: true,
            hasProperties: false
          }
          tableEdges.push(edge)
        }
      }
    })
    return tableEdges
  })

  const edgesWithProps: Edge[] = edgeTables
    .map(({ columns, ...table }) => ({
      ...table,
      columns: columns.filter(({ constraints }) =>
        constraints?.some(({ type }) => type === ConstraintType.ForeignKey)
      )
    }))
    .flatMap(({ columns, name }) => {
      const foreignKeyConstraints = columns
        .map(({ constraints }) =>
          constraints?.find(({ type }) => type === ConstraintType.ForeignKey)
        )
        .filter((constraint): constraint is ForeignKeyConstraint => constraint !== undefined)

      const [fk1, fk2] = foreignKeyConstraints
      return [
        {
          data: {
            source: fk1.referencedTableName,
            target: fk2.referencedTableName,
            label: name
          },
          FkSourceColumnName: fk1.referencedColumnName,
          FkTargetColumnName: fk2.referencedColumnName,

          shouldBeExported: true,
          hasProperties: true,
          tableName: name
        }
      ]
    })

  const edges: Edge[] = [...edgesWithProps, ...edgesWithoutProps]

  return { nodes, edges }
}

export default getNodesAndEdgesFromSchema

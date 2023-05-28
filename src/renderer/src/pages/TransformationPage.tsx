import { Button, Grid, Paper } from '@mui/material'
import Graph from '@renderer/components/Graph'
import Menu from '@renderer/components/Menu'
import { MigrationContext } from '@renderer/contexts/MigrationContext'
import { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

// function isReferencedByForeignKey(table: Table, tables: Table[]): boolean {
//   return tables.some((otherTable) =>
//     otherTable.columns.some((column) =>
//       column.constraints?.some(
//         (constraint) =>
//           constraint.type === ConstraintType.ForeignKey &&
//           'referencedTableName' in constraint &&
//           constraint.referencedTableName === table.name
//       )
//     )
//   )
// }

// const separateNodesFromEdges = (tables: Table[]) => {
//   const edgeTables: Table[] = []
//   const nodeTables: Table[] = []

//   for (const table of tables) {
//     if (isReferencedByForeignKey(table, tables)) {
//       nodeTables.push(table)
//     } else if (
//       table.columns.filter((column) =>
//         column.constraints?.some((constraint) => constraint.type === ConstraintType.ForeignKey)
//       )?.length === 2
//     ) {
//       edgeTables.push(table)
//     } else {
//       nodeTables.push(table)
//     }
//   }

//   return [edgeTables, nodeTables]
// }

// const createNodesAndEdges = (tables: Table[]): [Node[], Edge[]] => {
//   const [edgeTables, nodeTables] = separateNodesFromEdges(tables)

//   const exportableTables = nodeTables.filter((table) => table.shouldExport)

//   const nodes: Node[] = exportableTables.map((table) => ({
//     data: { id: table.name, label: table.name },
//     shouldBeExported: true
//   }))

//   const edgesWithoutProps = exportableTables.flatMap((table) => {
//     const tableEdges: Edge[] = []
//     table.columns.forEach((column) => {
//       const { constraints } = column
//       const foreignKeyConstraint = constraints?.find((c) => c.type === ConstraintType.ForeignKey)
//       if (
//         foreignKeyConstraint &&
//         'shouldExportFK' in foreignKeyConstraint &&
//         foreignKeyConstraint.shouldExportFK
//       ) {
//         const targetTable = nodeTables.find(
//           (table) => table.name === foreignKeyConstraint.referencedTableName
//         )

//         if (targetTable) {
//           const edge: Edge = {
//             data: {
//               source: table.name,
//               target: foreignKeyConstraint.referencedTableName,
//               label: `${table.name}_${foreignKeyConstraint.referencedTableName}`
//             },
//             FkSourceColumnName: column.name,
//             FkTargetColumnName: foreignKeyConstraint.referencedColumnName,
//             shouldBeExported: true,
//             hasProperties: false
//           }
//           tableEdges.push(edge)
//         }
//       }
//     })
//     return tableEdges
//   })

//   const edgesWithProps: Edge[] = edgeTables
//     .map(({ columns, ...table }) => ({
//       ...table,
//       columns: columns.filter(({ constraints }) =>
//         constraints?.some(({ type }) => type === ConstraintType.ForeignKey)
//       )
//     }))
//     .flatMap(({ columns, name }) => {
//       const foreignKeyConstraints = columns
//         .map(({ constraints }) =>
//           constraints?.find(({ type }) => type === ConstraintType.ForeignKey)
//         )
//         .filter((constraint): constraint is ForeignKeyConstraint => constraint !== undefined)

//       const [fk1, fk2] = foreignKeyConstraints
//       return [
//         {
//           data: {
//             source: fk1.referencedTableName,
//             target: fk2.referencedTableName,
//             label: name
//           },
//           FkSourceColumnName: fk1.referencedColumnName,
//           FkTargetColumnName: fk2.referencedColumnName,

//           shouldBeExported: true,
//           hasProperties: true,
//           tableName: name
//         }
//       ]
//     })

//   const edges: Edge[] = [...edgesWithProps, ...edgesWithoutProps]

//   return [nodes, edges]
// }

const TransformationPage = () => {
  const navigate = useNavigate()
  const { nodeData } = useContext(MigrationContext)

  const handleStartMigration = () => {
    navigate('/migration')
  }

  return (
    <>
      {nodeData.length > 0 && (
        <Grid container spacing={3}>
          <Grid item xs={5}>
            <Menu />
          </Grid>
          <Grid item xs={7}>
            <Graph />
          </Grid>
          <Grid item container xs={12}>
            <Paper
              sx={{
                p: 2,
                mx: 2,
                justifyContent: 'right',
                display: 'flex',
                height: 'fit-content',
                width: '100vw',
                alignSelf: 'flex-end'
              }}
            >
              <Button variant="contained" onClick={handleStartMigration}>
                Start Migration
              </Button>
            </Paper>
          </Grid>
        </Grid>
      )}
    </>
  )
}

export default TransformationPage

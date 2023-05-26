import { Checkbox } from '@mui/material'
import { MigrationContext } from '@renderer/contexts/context'
import { set } from 'lodash'
import MaterialReactTable from 'material-react-table'
import { ChangeEvent, useContext } from 'react'

// function removeNonForeignKeyConstraints(table: Table) {
//   const columnsWithForeignKeyConstraints = table.columns.map((column) => {
//     const foreignKeyConstraints = column.constraints?.filter(
//       (constraint) => constraint.type === 'FOREIGN KEY'
//     )
//     return { ...column, constraints: foreignKeyConstraints }
//   })
//   return { ...table, columns: columnsWithForeignKeyConstraints }
// }

// function removeColumnsWithoutForeignKey(table: Table) {
//   const columnsWithForeignKey = table.columns.filter((column) => {
//     return column.constraints?.some((constraint) => constraint.type === 'FOREIGN KEY')
//   })
//   return {
//     ...table,
//     columns: columnsWithForeignKey
//   }
// }

const RelationshipsTable = () => {
  const { edgeData, setEdgeData } = useContext(MigrationContext)

  const handleSaveCell = (cell, value: any) => {
    const { index } = cell.row
    const updatedNodeData = [...edgeData]

    set(updatedNodeData[index], cell.column.id, value)

    setEdgeData([...updatedNodeData])
  }

  const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>, cell) => {
    const { index } = cell.row
    const newData = [...edgeData]
    newData[index] = { ...newData[index], shouldBeExported: event.target.checked }
    setEdgeData(newData)
  }

  return (
    <MaterialReactTable
      enableEditing
      data={edgeData}
      editingMode="table"
      enablePagination={false}
      layoutMode="grid"
      muiTableContainerProps={{
        sx: { maxHeight: '60vh' }
      }}
      muiTableBodyCellEditTextFieldProps={({ cell }) => ({
        onBlur: (event) => {
          handleSaveCell(cell, event.target.value)
        },
        variant: 'outlined'
      })}
      columns={[
        {
          header: 'Relationship Type',
          accessorKey: 'data.label'
        },
        {
          header: 'Export',
          accessorKey: 'shouldBeExported',
          minSize: 60,
          maxSize: 60,
          Cell: ({ cell }) => (
            <Checkbox
              checked={!!cell.getValue()}
              onChange={(event) => {
                handleCheckboxChange(event, cell)
              }}
            />
          ),
          enableEditing: false,
          enableColumnActions: false,
          enableColumnOrdering: false,
          muiTableHeadCellProps: {
            align: 'center',
            padding: 'none'
          },
          muiTableBodyCellProps: {
            align: 'center'
          }
        }
      ]}
    />
  )
}

export default RelationshipsTable

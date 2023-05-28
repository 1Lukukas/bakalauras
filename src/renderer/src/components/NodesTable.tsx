import { Checkbox } from '@mui/material'
import { MigrationContext } from '@renderer/contexts/MigrationContext'
import MaterialReactTable from 'material-react-table'
import { ChangeEvent, useContext } from 'react'
import { set } from 'lodash'

const NodesTable = () => {
  const { nodeData, edgeData, setNodeData, setEdgeData } = useContext(MigrationContext)

  const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>, cell) => {
    const { index } = cell.row
    const updatedNodeData = [...nodeData]
    const updatedEdgeData = [...edgeData]

    const updatedNode = { ...updatedNodeData[index], shouldBeExported: event.target.checked }
    updatedNodeData[index] = updatedNode

    updatedEdgeData.forEach((edge) => {
      if (edge.data.source === updatedNode.data.id || edge.data.target === updatedNode.data.id) {
        edge.shouldBeExported = event.target.checked
      }
    })

    setEdgeData(updatedEdgeData)
    setNodeData(updatedNodeData)
  }

  const handleSaveCell = (cell, value: string) => {
    const { index } = cell.row
    const updatedNodeData = [...nodeData]
    const updatedEdgeData = [...edgeData]

    updatedEdgeData.forEach((edge) => {
      if (edge.data.source === updatedNodeData[index].data.label) {
        edge.sourceLabel = value
      }
      if (edge.data.target === updatedNodeData[index].data.label) {
        edge.targetLabel = value
        console.log(value)
      }
    })

    set(updatedNodeData[index], cell.column.id, value)

    setEdgeData(updatedEdgeData)
    setNodeData([...updatedNodeData])
  }

  // const handleEdit = (event, cell) => {}
  return (
    <MaterialReactTable
      enableEditing
      data={nodeData}
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
          header: 'Node Label',
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
        // {
        //   header: 'Edit',
        //   minSize: 50,
        //   maxSize: 50,
        //   size: 50,
        //   Cell: ({ cell }) => (
        //     <IconButton
        //       onChange={(event) => {
        //         handleEdit(event, cell)
        //       }}
        //     >
        //       <Edit />
        //     </IconButton>
        //   ),
        //   enableEditing: false,
        //   enableColumnActions: false,
        //   enableColumnOrdering: false,
        //   muiTableHeadCellProps: {
        //     align: 'center',
        //     padding: 'none'
        //   },
        //   muiTableBodyCellProps: {
        //     align: 'center'
        //   }
        // }
      ]}
    />
  )
}

export default NodesTable

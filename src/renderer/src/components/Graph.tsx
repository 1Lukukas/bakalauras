import cytoscape from 'cytoscape'
import CytoscapeComponent from 'react-cytoscapejs'
import fcose, { FcoseLayoutOptions } from 'cytoscape-fcose'
import { useContext, useEffect, useState } from 'react'
import { Edge, Node } from 'src/types'
import { MigrationContext } from '@renderer/contexts/MigrationContext'

cytoscape.use(fcose)

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

const fcoseLayoutOptions: FcoseLayoutOptions = {
  name: 'fcose',
  nodeDimensionsIncludeLabels: true,
  quality: 'proof',
  fit: true
}

const Graph = () => {
  const { nodeData, edgeData } = useContext(MigrationContext)
  const [graph, setGraph] = useState<(Node | Edge)[]>([])

  useEffect(() => {
    setGraph([...nodeData, ...edgeData].filter((x) => x.shouldBeExported))
  }, [nodeData, edgeData])

  return (
    <>
      {graph.length > 0 && (
        <CytoscapeComponent
          elements={graph}
          layout={fcoseLayoutOptions}
          style={{ width: '100%', height: '85vh' }}
          cy={(cy) => {
            cy.on('add', 'node', (_evt) => {
              cy.layout(fcoseLayoutOptions).run()
            })
          }}
          stylesheet={[
            {
              selector: 'node',
              style: {
                label: 'data(label)',
                'text-valign': 'center',
                'text-halign': 'center'
                // width: 'data(width)', maybe
              }
            },
            {
              selector: 'edge',
              style: {
                'line-color': '#ccc',
                'target-arrow-color': '#ccc',
                'target-arrow-shape': 'triangle',
                'curve-style': 'bezier'
              }
            }
          ]}
        />
      )}
    </>
  )
}

export default Graph

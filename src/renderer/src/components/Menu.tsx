import { Tab, Tabs } from '@mui/material'
import TabPanel from './TabPanel'
import { useState } from 'react'
import RelationshipsTable from './RelationshipsTable'
import NodesTable from './NodesTable'

function Menu() {
  const [value, setValue] = useState(0)

  const handleChange = (_event, newValue) => {
    setValue(newValue)
  }

  return (
    <>
      <Tabs style={{ width: '100%' }} value={value} onChange={handleChange}>
        <Tab label="Nodes" style={{ width: '50%' }} />
        <Tab label="Relationships" style={{ width: '50%' }} />
      </Tabs>
      <TabPanel index={0} value={value}>
        <NodesTable />
      </TabPanel>
      <TabPanel index={1} value={value}>
        <RelationshipsTable />
      </TabPanel>
    </>
  )
}

export default Menu

import { List, ListItem, ListItemText } from '@mui/material'

const Log = ({ items }) => {
  return (
    <List>
      {items.map((item, index) => (
        <ListItem key={index}>
          <ListItemText primary={item} />
        </ListItem>
      ))}
    </List>
  )
}

export default Log

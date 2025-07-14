import { List, ListItem, ListItemText, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

export function EtkinlikList<T extends { id: number }>({
  items,
  renderItem,
  onDelete,
}: {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  onDelete: (id: number) => void;
}) {
  return (
    <List>
      {items.map((item) => (
        <ListItem
          key={item.id}
          secondaryAction={
            <IconButton edge="end" onClick={() => onDelete(item.id)}>
              <DeleteIcon />
            </IconButton>
          }
        >
          <ListItemText primary={renderItem(item)} />
        </ListItem>
      ))}
    </List>
  );
}

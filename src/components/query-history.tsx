import { Query } from "../types";
import {
  List,
  ListItem,
  ListItemText,
  Typography,
  Divider,
  Box,
} from "@mui/material";

interface QueryHistoryProps {
  history: Query[];
  onSelect: (queryId: number) => void;
}

const QueryHistory = ({ history, onSelect }: QueryHistoryProps) => {
  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
        Query History
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <List>
        {history.length > 0 ? (
          history.map((q, index) => (
            <ListItem
              key={index}
              onClick={() => onSelect(q.id)}
              sx={{
                bgcolor: "background.default",
                cursor: "pointer",
                "&:hover": {
                  bgcolor: (theme) =>
                    theme.palette.mode === "light" ? "grey.100" : "grey.800",
                },
                borderRadius: 1,
                mb: 0.5,
              }}
            >
              <ListItemText
                primary={
                  q.query.substring(0, 50) +
                  `${q.query.length > 50 ? "..." : ""}`
                }
                primaryTypographyProps={{
                  fontSize: "14px",
                  fontFamily: "monospace",
                  color: "text.primary",
                }}
              />
            </ListItem>
          ))
        ) : (
          <Typography sx={{ color: "text.secondary" }}>
            No queries found in history
          </Typography>
        )}
      </List>
    </Box>
  );
};

export default QueryHistory;

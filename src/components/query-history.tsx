import {
  List,
  ListItem,
  ListItemText,
  Typography,
  Divider,
  Box,
  TextField,
  InputAdornment,
} from "@mui/material";
import { Query } from "../types";
import { useState, useEffect } from "react";
import SearchIcon from "@mui/icons-material/Search";

interface QueryHistoryProps {
  history: Query[];
  onSelect: (queryId: number, type: string) => void;
}

const QueryHistory = ({ history, onSelect }: QueryHistoryProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredHistory, setFilteredHistory] = useState<Query[]>(history);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredHistory(history);
    } else {
      const filtered = history.filter((query) =>
        query.query.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredHistory(filtered);
    }
  }, [searchTerm, history]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
        Query History
      </Typography>
      <TextField
        fullWidth
        size="small"
        placeholder="Search queries..."
        value={searchTerm}
        onChange={handleSearchChange}
        sx={{ mb: 2 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon fontSize="small" />
            </InputAdornment>
          ),
        }}
      />

      <Divider sx={{ mb: 2 }} />

      <List>
        {filteredHistory.length > 0 ? (
          filteredHistory.map((q, index) => (
            <ListItem
              key={index}
              onClick={() => onSelect(q.id, "HISTORY")}
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
            {searchTerm
              ? "No matching queries found"
              : "No queries found in history"}
          </Typography>
        )}
      </List>
    </Box>
  );
};

export default QueryHistory;

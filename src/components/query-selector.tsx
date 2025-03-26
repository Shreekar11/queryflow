import { Query } from "../types";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";

interface QuerySelectorProps {
  queries: Query[];
  selectedQueryId: number;
  onSelect: (queryId: number) => void;
}

const QuerySelector = ({
  queries,
  selectedQueryId,
  onSelect,
}: QuerySelectorProps) => {
  return (
    <FormControl fullWidth sx={{ mb: 2 }}>
      <InputLabel>Select Query</InputLabel>
      <Select
        value={selectedQueryId}
        onChange={(e) => onSelect(Number(e.target.value))}
        label="Select Query"
      >
        {queries.map((q) => (
          <MenuItem key={q.id} value={q.id}>
            Query {q.id}: {q.query.substring(0, 20)}...
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default QuerySelector;

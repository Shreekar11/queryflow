import { Query } from "../types";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";

interface QuerySelectorProps {
  queries: Query[];
  selectedQueryId: number;
  onSelect: (queryId: number, type: string) => void;
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
        onChange={(e) => onSelect(Number(e.target.value), "LIST")}
        label="Select Query"
      >
        {queries.map((q, index) => (
          <MenuItem key={index} value={q.id}>
            {q.query}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default QuerySelector;

import { TextField } from "@mui/material";

interface QueryInputProps {
  query: string;
  onChange: (query: string) => void;
}

function QueryInput({ query, onChange }: QueryInputProps) {
  return (
    <TextField
      label="SQL Query"
      multiline
      rows={6}
      value={query}
      onChange={(e) => onChange(e.target.value)}
      fullWidth
      variant="outlined"
      placeholder="Type your SQL query here..."
      InputProps={{ style: { fontFamily: "monospace", fontSize: "14px" } }}
      sx={{ bgcolor: "background.paper" }}
    />
  );
}

export default QueryInput;

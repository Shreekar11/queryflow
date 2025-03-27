import { TextField, Typography } from "@mui/material";

interface QueryInputProps {
  query: string;
  queryError: string | null;
  onChange: (query: string) => void;
}

const QueryInput = ({ query, queryError, onChange }: QueryInputProps) => {
  return (
    <div className="">
      {queryError && (
        <Typography
          variant="subtitle1"
          sx={{ mb: 2, fontWeight: 500, color: "error.main" }}
        >
          {queryError}
        </Typography>
      )}
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
    </div>
  );
}

export default QueryInput;

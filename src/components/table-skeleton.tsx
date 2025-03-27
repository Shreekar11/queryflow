// material-ui components
import {
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";

const SkeletonTable = () => {
  const rowCount = 5; // Number of skeleton rows to display
  return (
    <Table sx={{ tableLayout: "fixed", width: "100%" }}>
      <TableHead>
        <TableRow sx={{ display: "flex", width: "100%" }}>
          {Array.from({ length: 5 }).map((_, index) => (
            <TableCell
              key={index}
              sx={{
                flex: "0 0 auto",
                width: index === 0 ? 100 : 200,
                minWidth: index === 0 ? 100 : 200,
                maxWidth: index === 0 ? 100 : 200,
                display: "flex",
                alignItems: "center",
              }}
            >
              <Skeleton variant="text" width="80%" />
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {Array.from({ length: rowCount }).map((_, rowIndex) => (
          <TableRow key={rowIndex} sx={{ display: "flex", width: "100%" }}>
            {Array.from({ length: 5 }).map((_, colIndex) => (
              <TableCell
                key={colIndex}
                sx={{
                  flex: "0 0 auto",
                  width: colIndex === 0 ? 100 : 200,
                  minWidth: colIndex === 0 ? 100 : 200,
                  maxWidth: colIndex === 0 ? 100 : 200,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Skeleton variant="text" width="60%" />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default SkeletonTable;

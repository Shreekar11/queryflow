import { toast } from "sonner";
import { useTable } from "react-table";
import { useMemo, useRef } from "react";

import Papa from "papaparse";
import DownloadIcon from "@mui/icons-material/Download";

// material-ui components
import {
  Alert,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";

interface DataTableProps {
  data: {
    id: number;
    query: string;
    data: Record<string, any>[];
  };
}

const DataTable = ({ data }: DataTableProps) => {
  const tableRef = useRef<HTMLDivElement>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleExportCSV = () => {
    const csv = Papa.unparse(data.data);
    const tableMatch = data.query.match(/^select\s+\*\s+from\s+(\w+)/i);
    if (tableMatch) {
      const tableName = tableMatch[1].toLowerCase();
      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${tableName}.csv`;
      a.click();
      URL.revokeObjectURL(url);

      toast.success("CSV file downloaded successfully.");
    } else {
      toast.error("Failed to download CSV file.");
    }
  };

  const columns = useMemo(() => {
    if (data.data.length === 0) return [];
    return Object.keys(data.data[0]).map((key) => ({
      Header: key.charAt(0).toUpperCase() + key.slice(1),
      accessor: key,
    }));
  }, [data]);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data: data.data });

  const tableWidth = useMemo(() => {
    if (isMobile) return "100%";
    return columns.reduce((total, _, index) => {
      return total + (index === 0 ? 100 : 200);
    }, 0);
  }, [columns, isMobile]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "start",
        justifyContent: "center",
        width: "100%",
      }}
    >
      {data.data.length !== 0 && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "start",
            width: "100%",
            gap: 2,
            mb: 2,
          }}
        >
          <Tooltip title="Download the table data as a CSV file">
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={handleExportCSV}
            >
              Export as CSV
            </Button>
          </Tooltip>
          <Alert severity="info" sx={{ border: 0, borderRadius: 2 }}>
            {`Showing ${rows.length} rows of ${data.data.length} rows`}
          </Alert>
        </Box>
      )}
      <Box
        sx={{
          width: "100%",
          maxWidth: "100%",
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        <TableContainer
          sx={{
            maxHeight: isMobile ? "none" : 400,
            overflowY: isMobile ? "visible" : "auto",
            overflowX: "auto",
          }}
          ref={tableRef}
        >
          {!isMobile && (
            <div className="">
              {data.data.length !== 0 ? (
                <Table
                  {...getTableProps()}
                  stickyHeader
                  sx={{
                    tableLayout: "fixed",
                    width: tableWidth,
                    minWidth: "100%",
                  }}
                >
                  <TableHead>
                    {headerGroups.map((headerGroup, index) => (
                      <TableRow
                        {...headerGroup.getHeaderGroupProps()}
                        sx={{ display: "flex", width: "100%" }}
                        key={index}
                      >
                        {headerGroup.headers.map((column, columnIndex) => (
                          <TableCell
                            {...column.getHeaderProps()}
                            sx={{
                              flex: "0 0 auto",
                              width: columnIndex === 0 ? 100 : 200,
                              minWidth: columnIndex === 0 ? 100 : 200,
                              maxWidth: columnIndex === 0 ? 100 : 200,
                              display: "flex",
                              alignItems: "center",
                              bgcolor: (theme) =>
                                theme.palette.mode === "light"
                                  ? "grey.100"
                                  : "grey.800",
                              color: (theme) => theme.palette.text.primary,
                              fontWeight: 600,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                            key={columnIndex}
                          >
                            {column.render("Header")}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableHead>
                  <TableBody {...getTableBodyProps()}>
                    {rows.map((row, index) => {
                      prepareRow(row);
                      return (
                        <TableRow
                          {...row.getRowProps()}
                          sx={{
                            display: "flex",
                            width: "100%",
                            "&:hover": {
                              bgcolor: (theme) =>
                                theme.palette.mode === "light"
                                  ? "grey.100"
                                  : "grey.800",
                            },
                            bgcolor: (theme) => theme.palette.background.paper,
                          }}
                          key={index}
                        >
                          {row.cells.map((cell, cellIndex) => (
                            <TableCell
                              {...cell.getCellProps()}
                              sx={{
                                flex: "0 0 auto",
                                width: cellIndex === 0 ? 100 : 200,
                                minWidth: cellIndex === 0 ? 100 : 200,
                                maxWidth: cellIndex === 0 ? 100 : 200,
                                display: "flex",
                                alignItems: "center",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                                color: (theme) => theme.palette.text.primary,
                              }}
                              key={cellIndex}
                            >
                              {cell.render("Cell")}
                            </TableCell>
                          ))}
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              ) : (
                <Typography sx={{ p: 2, font: "2rem", color: "red" }}>
                  No data available.
                </Typography>
              )}
            </div>
          )}

          {/* table for mobile view */}
          {isMobile && (
            <div className="">
              {data.data.length !== 0 ? (
                <Box sx={{ width: "100%" }}>
                  {rows.map((row, index) => {
                    prepareRow(row);
                    return (
                      <Box
                        key={index}
                        sx={{
                          border: "1px solid",
                          borderColor: "divider",
                          borderRadius: 2,
                          mb: 2,
                          p: 2,
                          bgcolor: (theme) =>
                            theme.palette.mode === "light"
                              ? "background.paper"
                              : "grey.900",
                        }}
                      >
                        {row.cells.map((cell, cellIndex) => (
                          <Box
                            key={cellIndex}
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              py: 1,
                              borderBottom:
                                cellIndex < row.cells.length - 1
                                  ? "1px solid rgba(224, 224, 224, 1)"
                                  : "none",
                              color: (theme) => theme.palette.text.primary,
                            }}
                          >
                            <Box
                              component="span"
                              sx={{
                                fontWeight: 600,
                                marginRight: "8px",
                                minWidth: "100px",
                              }}
                            >
                              {columns[cellIndex].Header}:
                            </Box>
                            {cell.render("Cell")}
                          </Box>
                        ))}
                      </Box>
                    );
                  })}
                </Box>
              ) : (
                <Typography sx={{ p: 2, font: "2rem", color: "red" }}>
                  No data available.
                </Typography>
              )}
            </div>
          )}
        </TableContainer>
      </Box>
    </div>
  );
};

export default DataTable;

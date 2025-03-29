import { toast } from "sonner";
import { useMemo } from "react";
import { useTable, useSortBy, Column } from "react-table";
import { FixedSizeList } from "react-window";

import Papa from "papaparse";
import NorthIcon from "@mui/icons-material/North";
import SouthIcon from "@mui/icons-material/South";
import DownloadIcon from "@mui/icons-material/Download";
import ImportExportIcon from "@mui/icons-material/ImportExport";

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
  useMediaQuery,
  useTheme,
} from "@mui/material";

interface VirtualTableProps {
  data: {
    id: number;
    query: string;
    data: Record<string, any>[];
  };
}

const VirtualTable = ({ data }: VirtualTableProps) => {
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

  const columns: Column<Record<string, any>>[] = useMemo(() => {
    if (data.data.length === 0) return [];
    return Object.keys(data.data[0]).map((key) => ({
      Header: key.charAt(0).toUpperCase() + key.slice(1),
      accessor: key,
    }));
  }, [data]);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data: data.data }, useSortBy);

  const tableWidth = useMemo(() => {
    if (isMobile) return "100%";
    return columns.reduce((total, _, index) => {
      return total + (index === 0 ? 100 : 200);
    }, 0);
  }, [columns, isMobile]);

  const RenderRow = ({
    index,
    style,
  }: {
    index: number;
    style: React.CSSProperties;
  }) => {
    const row = rows[index];
    prepareRow(row);
    return (
      <TableRow
        {...row.getRowProps({
          style: {
            ...style,
            display: "flex",
            width: `${tableWidth}px`,
          },
        })}
        sx={{
          "&:hover": {
            bgcolor: (theme) =>
              theme.palette.mode === "light" ? "grey.100" : "grey.800",
          },
          bgcolor: (theme) => theme.palette.background.paper,
        }}
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
              borderBottom: "1px solid rgba(224, 224, 224, 1)",
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
  };

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

      <Box
        sx={{
          width: "100%",
          maxWidth: "100%",
          margin: "0 auto",
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
        >
          {!isMobile && (
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
                        {...column.getHeaderProps(
                          (column as any).getSortByToggleProps()
                        )}
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
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          cursor: "pointer",
                        }}
                        key={columnIndex}
                      >
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          {column.render("Header")}
                          {(column as any).isSorted ? (
                            (column as any).isSortedDesc ? (
                              <SouthIcon fontSize="small" sx={{ ml: 1 }} />
                            ) : (
                              <NorthIcon fontSize="small" sx={{ ml: 1 }} />
                            )
                          ) : (
                            <ImportExportIcon fontSize="small" sx={{ ml: 1 }} />
                          )}
                        </Box>
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableHead>
              <TableBody {...getTableBodyProps()}>
                <FixedSizeList
                  height={400}
                  itemCount={rows.length}
                  itemSize={48}
                  width={"100%"}
                >
                  {RenderRow}
                </FixedSizeList>
              </TableBody>
            </Table>
          )}

          {/* table for mobile view */}
          {isMobile && (
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
                          {(columns as any)[cellIndex].Header}:
                        </Box>
                        {cell.render("Cell")}
                      </Box>
                    ))}
                  </Box>
                );
              })}
            </Box>
          )}
        </TableContainer>
      </Box>
    </div>
  );
};

export default VirtualTable;

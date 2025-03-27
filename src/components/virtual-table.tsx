import { toast } from "sonner";
import { useMemo } from "react";
import { useTable } from "react-table";
import { FixedSizeList } from "react-window";

import Papa from "papaparse";
import DownloadIcon from "@mui/icons-material/Download";

// material-ui components
import {
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
          "&:hover": { bgcolor: "grey.100" },
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
    <div className="">
      <Tooltip title="Download the table data as a CSV file">
        <Button
          variant="outlined"
          startIcon={<DownloadIcon />}
          onClick={handleExportCSV}
          sx={{ mb: 2 }}
        >
          Export as CSV
        </Button>
      </Tooltip>
      <Box
        sx={{
          width: "100%",
          maxWidth: isMobile ? "100%" : 1080,
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
                        {...column.getHeaderProps()}
                        sx={{
                          flex: "0 0 auto",
                          width: columnIndex === 0 ? 100 : 200,
                          minWidth: columnIndex === 0 ? 100 : 200,
                          maxWidth: columnIndex === 0 ? 100 : 200,
                          display: "flex",
                          alignItems: "center",
                          bgcolor: "grey.100",
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
          )}
        </TableContainer>
      </Box>
    </div>
  );
};

export default VirtualTable;

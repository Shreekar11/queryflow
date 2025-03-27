import { useTable } from "react-table";
import { useMemo, useRef } from "react";
import { FixedSizeList } from "react-window";

import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useMediaQuery,
  useTheme,
} from "@mui/material";

interface DataTableProps {
  data: Record<string, any>[];
}

const DataTable = ({ data }: DataTableProps) => {
  const tableRef = useRef<HTMLDivElement>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const columns = useMemo(() => {
    if (data.length === 0) return [];
    return Object.keys(data[0]).map((key) => ({
      Header: key.charAt(0).toUpperCase() + key.slice(1),
      accessor: key,
    }));
  }, [data]);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data });

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
            display: isMobile ? "block" : "flex",
            width: "100%",
          },
        })}
        sx={{
          "&:hover": { bgcolor: "grey.100" },
          flexDirection: isMobile ? "column" : "row",
        }}
      >
        {row.cells.map((cell, cellIndex) => (
          <TableCell
            {...cell.getCellProps()}
            sx={{
              flex: isMobile ? "none" : 1,
              display: "flex",
              alignItems: "center",
              borderBottom: "1px solid rgba(224, 224, 224, 1)",
              minWidth: isMobile ? "100%" : cellIndex === 0 ? 50 : 150,
              maxWidth: isMobile ? "100%" : cellIndex === 0 ? 50 : 150,
              width: isMobile ? "100%" : "auto",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              padding: isMobile ? "8px 16px" : "inherit",
              ...(isMobile &&
                cellIndex > 0 && {
                  borderTop: "1px solid rgba(224, 224, 224, 1)",
                  paddingTop: "12px",
                }),
            }}
            key={cellIndex}
          >
            {isMobile && cellIndex > 0 && (
              <Box
                component="span"
                sx={{
                  fontWeight: 600,
                  marginRight: "8px",
                  minWidth: "100px",
                  display: "inline-block",
                }}
              >
                {columns[cellIndex].Header}:
              </Box>
            )}
            {cell.render("Cell")}
          </TableCell>
        ))}
      </TableRow>
    );
  };

  const tableWidth = tableRef.current?.getBoundingClientRect().width || "100%";

  return (
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
        ref={tableRef}
      >
        {!isMobile && (
          <Table
            {...getTableProps()}
            stickyHeader
            sx={{
              minWidth: 600,
              width: "100%",
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
                        flex: 1,
                        display: "flex",
                        alignItems: "center",
                        minWidth: columnIndex === 0 ? 50 : 150,
                        maxWidth: columnIndex === 0 ? 50 : 150,
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
              {rows.length <= 100 ? (
                rows.map((row, index) => {
                  prepareRow(row);
                  return (
                    <TableRow
                      {...row.getRowProps()}
                      sx={{
                        display: "flex",
                        width: "100%",
                        "&:hover": { bgcolor: "grey.100" },
                      }}
                      key={index}
                    >
                      {row.cells.map((cell, cellIndex) => (
                        <TableCell
                          {...cell.getCellProps()}
                          sx={{
                            flex: 1,
                            display: "flex",
                            alignItems: "center",
                            minWidth: cellIndex === 0 ? 50 : 150,
                            maxWidth: cellIndex === 0 ? 50 : 150,
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
                })
              ) : (
                <FixedSizeList
                  height={400}
                  itemCount={rows.length}
                  itemSize={48}
                  width={tableWidth}
                >
                  {RenderRow}
                </FixedSizeList>
              )}
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
  );
};

export default DataTable;
